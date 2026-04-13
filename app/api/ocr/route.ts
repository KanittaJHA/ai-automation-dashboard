function parseMarkdownResponse(text: string): Record<string, unknown> | null {
  try {
    const get = (label: string) => {
      const m = text.match(new RegExp(`\\*\\*${label}\\*\\*[:\\s]*(.+)`, "i"));
      return m ? m[1].trim() : null;
    };
    const num = (v: string | null) => {
      if (!v || v === "null") return null;
      const n = parseFloat(v.replace(/,/g, ""));
      return Number.isNaN(n) ? null : n;
    };

    // Parse items
    const items: { description: string; quantity: number; unit_price: number; amount: number }[] = [];
    const itemBlocks = text.split(/- \*\*Description\*\*/i).slice(1);
    for (const block of itemBlocks) {
      const desc = block.match(/^[:\s]*(.+)/)?.[1]?.trim() || "";
      const qty = num(block.match(/\*\*Quantity\*\*[:\s]*(.+)/i)?.[1] ?? null);
      const price = num(block.match(/\*\*Unit Price\*\*[:\s]*(.+)/i)?.[1] ?? null);
      const amt = num(block.match(/\*\*Amount\*\*[:\s]*(.+)/i)?.[1] ?? null);
      if (desc) {
        items.push({
          description: desc,
          quantity: qty ?? 1,
          unit_price: price ?? 0,
          amount: amt ?? 0,
        });
      }
    }

    return {
      document_type: get("Document Type")?.toLowerCase() ?? null,
      document_number: get("Document Number"),
      date: get("Date"),
      vendor_name: get("Vendor Name"),
      vendor_tax_id: get("Vendor Tax ID") === "null" ? null : get("Vendor Tax ID"),
      buyer_name: get("Buyer Name") === "null" ? null : get("Buyer Name"),
      buyer_tax_id: get("Buyer Tax ID") === "null" ? null : get("Buyer Tax ID"),
      items,
      subtotal: num(get("Subtotal")),
      discount: num(get("Discount")) ?? 0,
      vat_rate: num(get("VAT Rate")),
      vat_amount: num(get("VAT Amount")),
      grand_total: num(get("Grand Total")),
      currency: get("Currency"),
    };
  } catch {
    return null;
  }
}

function fixExtractionErrors(data: Record<string, unknown>): Record<string, unknown> {
  const subtotal = Number(data.subtotal) || 0;
  const discount = Number(data.discount) || 0;
  const vatRate = Number(data.vat_rate) || 0;
  const vatAmount = Number(data.vat_amount) || 0;
  const grandTotal = Number(data.grand_total) || 0;

  const fixed = { ...data };

  // Fix: VAT amount is impossibly high (e.g. > 15% of subtotal for Thailand's 7% VAT)
  // Recalculate from the rate instead
  if (vatAmount > 0 && subtotal > 0) {
    const vatPercent = (vatAmount / subtotal) * 100;
    if (vatPercent > 15) {
      const rate = vatRate > 0 ? vatRate : 7;
      const baseAmount = subtotal - discount;
      // Thai receipts are usually VAT-inclusive: base = price / 1.07, vat = base * 0.07
      const correctVat = Math.round((baseAmount * rate) / (100 + rate) * 100) / 100;
      fixed.vat_amount = correctVat;
      fixed.vat_rate = rate;
    }
  }

  // Fix: discount == vat_rate → model confused VAT rate with discount
  // Recalculate discount from subtotal and grand_total
  if (discount === vatRate && discount > 0 && grandTotal > 0 && subtotal > 0) {
    const realDiscount = subtotal - grandTotal;
    if (realDiscount > 0 && realDiscount < subtotal) {
      fixed.discount = realDiscount;
    }
  }

  // Fix: if subtotal - discount + vatAmount ≠ grandTotal, try recalculating discount
  const fixedDiscount = Number(fixed.discount) || 0;
  const fixedVat = Number(fixed.vat_amount) || 0;
  const expectedExcl = subtotal - fixedDiscount + fixedVat;
  const expectedIncl = subtotal - fixedDiscount;

  if (Math.abs(expectedExcl - grandTotal) > 0.5 && Math.abs(expectedIncl - grandTotal) > 0.5) {
    // Neither formula works — try to derive discount
    const derivedDiscount = subtotal - grandTotal;
    if (derivedDiscount >= 0 && derivedDiscount < subtotal) {
      fixed.discount = Math.round(derivedDiscount * 100) / 100;
    }
  }

  // Fix: items sum ≠ subtotal — recalculate subtotal from items if available
  const items = Array.isArray(fixed.items) ? fixed.items : [];
  if (items.length > 0) {
    const itemsSum = items.reduce((sum: number, item: Record<string, unknown>) =>
      sum + (Number(item.amount) || 0), 0);
    if (itemsSum > 0 && Math.abs(itemsSum - subtotal) > 0.5) {
      // Items sum doesn't match — keep the larger value (subtotal likely includes items OCR missed)
      // but flag it so validation can catch it
      fixed._items_sum = itemsSum;
      fixed._items_mismatch = true;
    }
  }

  return fixed;
}

const N8N_WEBHOOK_URL = process.env.N8N_OCR_WEBHOOK_URL || "";
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || "";
const CF_API_TOKEN = process.env.CF_API_TOKEN || "";

const EXTRACT_PROMPT = `You are an invoice data extractor. Look at this invoice/receipt image and return ONLY a JSON object with these exact fields:

{"document_type":"<invoice|receipt|tax_invoice>","document_number":"<string>","date":"<YYYY-MM-DD>","vendor_name":"<string>","vendor_tax_id":"<string or null>","buyer_name":"<string or null>","buyer_tax_id":"<string or null>","items":[{"description":"<string>","quantity":"<number>","unit_price":"<number>","amount":"<number>"}],"subtotal":"<number>","discount":"<number>","vat_rate":"<number>","vat_amount":"<number>","grand_total":"<number>","currency":"<THB|USD>"}

Rules:
- Extract REAL values from the image, do NOT use placeholder values
- Convert Thai Buddhist year (พ.ศ.) to AD by subtracting 543
- Convert dates to YYYY-MM-DD
- All money values must be numbers
- IMPORTANT: grand_total must be the FINAL amount to pay (ยอดชำระ/ยอดรวมสุทธิ) AFTER all discounts
- subtotal is the sum of all items BEFORE discount and tax
- discount is any discount/ส่วนลด/ส่วนลดพิเศษ amount
- Look carefully for discount lines (ส่วนลด, ส่วนลดพิเศษ, coupon, coin) and include them
- Include ALL line items from the document
- If a field is unknown, use null
- Return ONLY the JSON object, nothing else`;

export async function POST(request: Request) {
  const body = await request.json();
  const { filename, base64 } = body;

  if (!base64) {
    return Response.json({ result: null, error: "No file data provided" });
  }

  try {
    // Step 1: Cloudflare Vision — OCR + extract JSON directly
    const binaryString = atob(base64);
    const imageBytes: number[] = [];
    for (let i = 0; i < binaryString.length; i++) {
      imageBytes.push(binaryString.charCodeAt(i));
    }

    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: EXTRACT_PROMPT,
          image: imageBytes,
          max_tokens: 4096,
        }),
      }
    );

    const cfData = (await cfResponse.json()) as Record<string, unknown>;

    if (!cfResponse.ok) {
      return Response.json({
        result: { error: `Cloudflare error: ${cfResponse.status}`, detail: cfData },
      });
    }

    const cfResult = cfData.result as Record<string, unknown> | undefined;
    const rawText = (cfResult?.response as string) || "";

    // Parse response — handle both JSON and markdown formats
    let extracted: Record<string, unknown> | null = null;
    try {
      extracted = JSON.parse(rawText.trim());
    } catch {
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) ||
        rawText.match(/```\s*([\s\S]*?)\s*```/) ||
        rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[1] ?? jsonMatch[0];
          extracted = JSON.parse(jsonStr.trim());
        } catch {
          // fallback to markdown parser
        }
      }
    }

    // Fallback: parse markdown/text format from Cloudflare
    if (!extracted && rawText.includes("**")) {
      extracted = parseMarkdownResponse(rawText);
    }

    if (!extracted) {
      return Response.json({
        result: { error: "Could not parse AI response", _rawText: rawText },
      });
    }

    // Post-processing: fix common AI extraction mistakes
    extracted = fixExtractionErrors(extracted);

    // Step 2: Send to n8n for validation
    let validation: unknown = null;
    try {
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: filename || "document",
          extractedData: extracted,
          ocrText: rawText,
        }),
      });
      const n8nData = (await n8nResponse.json()) as Record<string, unknown>;
      validation = n8nData.validation ?? null;

      // Use AI Agent enriched data if available and valid
      if (n8nData.data && typeof n8nData.data === "object") {
        const enriched = n8nData.data as Record<string, unknown>;
        if (enriched.grand_total !== null && enriched.grand_total !== undefined) {
          extracted = enriched;
        }
      }
    } catch {
      // n8n unavailable — continue without server validation
    }

    return Response.json({ result: extracted, validation });
  } catch (error) {
    return Response.json({
      result: { error: "Server error", message: String(error) },
    });
  }
}
