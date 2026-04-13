import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ValidationPanelProps {
  result: Record<string, unknown> | null;
}

interface ValidationResult {
  label: string;
  status: "pass" | "fail" | "pending";
  detail: string;
}

function validateInvoice(data: Record<string, unknown>): ValidationResult[] {
  const subtotal = Number(data.subtotal ?? data.Subtotal ?? 0);
  const discount = Number(data.discount ?? 0);
  const vat = Number(data.vat_amount ?? data.vat ?? data.VAT ?? data.tax ?? data.Tax ?? 0);
  const grandTotal = Number(
    data.grand_total ?? data.GrandTotal ?? data.grandTotal ?? data.total ?? data.Total ?? 0
  );

  // Check both: VAT-exclusive (subtotal + vat = grand) and VAT-inclusive (subtotal = grand, vat is part of it)
  const vatExclusive = Math.abs(subtotal - discount + vat - grandTotal) < 0.5;
  const vatInclusive = Math.abs(subtotal - discount - grandTotal) < 0.5 && vat > 0;
  const totalMatch = vatExclusive || vatInclusive;

  let totalDetail: string;
  if (vatExclusive) {
    totalDetail = `${subtotal}${discount ? ` - ${discount}` : ""} + ${vat} = ${grandTotal}`;
  } else if (vatInclusive) {
    totalDetail = `${subtotal} = ${grandTotal} (VAT ${vat} included)`;
  } else {
    totalDetail = `${subtotal}${discount ? ` - ${discount}` : ""} + ${vat} = ${subtotal - discount + vat} (expected ${grandTotal})`;
  }

  // Check items sum
  const items = data.items as { amount?: number }[] | undefined;
  const itemsSum = items?.reduce((sum, item) => sum + Number(item.amount ?? 0), 0) ?? 0;
  const itemsMatch = !items?.length || Math.abs(itemsSum - subtotal) < 0.5;

  return [
    {
      label: "Total Calculation",
      status: totalMatch ? "pass" : "fail",
      detail: totalDetail,
    },
    {
      label: "Subtotal Present",
      status: subtotal > 0 ? "pass" : "fail",
      detail: subtotal > 0 ? `${subtotal}` : "Missing or zero",
    },
    {
      label: "Grand Total Present",
      status: grandTotal > 0 ? "pass" : "fail",
      detail: grandTotal > 0 ? `${grandTotal}` : "Missing or zero",
    },
    {
      label: "Items Sum = Subtotal",
      status: itemsMatch ? "pass" : "fail",
      detail: items?.length ? `${itemsSum} ${itemsMatch ? "=" : "≠"} ${subtotal}` : "No items",
    },
  ];
}

export default function ValidationPanel({ result }: ValidationPanelProps) {
  if (!result) {
    return (
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-sm font-semibold text-white mb-4">
          Validation
        </h3>
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2 text-gray-300">
            <AlertCircle size={18} />
            <p className="text-sm">Waiting for OCR results</p>
          </div>
        </div>
      </div>
    );
  }

  const validations = validateInvoice(result);
  const allPassed = validations.every((v) => v.status === "pass");

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Validation</h3>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            allPassed
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {allPassed ? "All Passed" : "Issues Found"}
        </span>
      </div>
      <div className="space-y-3">
        {validations.map((v) => (
          <div
            key={v.label}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              v.status === "pass" ? "bg-green-500/5" : "bg-red-500/5"
            }`}
          >
            {v.status === "pass" ? (
              <CheckCircle size={18} className="text-green-500 shrink-0" />
            ) : (
              <XCircle size={18} className="text-red-500 shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium text-white">{v.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{v.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
