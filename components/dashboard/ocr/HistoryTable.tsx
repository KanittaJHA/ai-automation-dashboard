import { CheckCircle, XCircle } from "lucide-react";

export interface OcrHistoryItem {
  id: string;
  filename: string;
  date: string;
  status: "success" | "failed";
  subtotal: number;
  vat: number;
  grandTotal: number;
  valid: boolean;
}

interface HistoryTableProps {
  items: OcrHistoryItem[];
}

export default function HistoryTable({ items }: HistoryTableProps) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white mb-4">
        Recent OCR Results
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                File
              </th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                Subtotal
              </th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                VAT
              </th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                Grand Total
              </th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Valid
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="py-3 text-sm text-white font-medium">
                  {item.filename}
                </td>
                <td className="py-3 text-sm text-gray-500">{item.date}</td>
                <td className="py-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      item.status === "success"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-500 text-right">
                  {item.subtotal.toLocaleString()}
                </td>
                <td className="py-3 text-sm text-gray-500 text-right">
                  {item.vat.toLocaleString()}
                </td>
                <td className="py-3 text-sm font-medium text-white text-right">
                  {item.grandTotal.toLocaleString()}
                </td>
                <td className="py-3 text-center">
                  {item.valid ? (
                    <CheckCircle
                      size={18}
                      className="text-green-500 inline-block"
                    />
                  ) : (
                    <XCircle
                      size={18}
                      className="text-red-500 inline-block"
                    />
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-sm text-gray-300"
                >
                  No OCR results yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
