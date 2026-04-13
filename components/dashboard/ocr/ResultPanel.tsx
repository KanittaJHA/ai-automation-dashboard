"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ResultPanelProps {
	result: Record<string, unknown> | null;
	isLoading: boolean;
}

export default function ResultPanel({ result, isLoading }: ResultPanelProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		if (result) {
			navigator.clipboard.writeText(JSON.stringify(result, null, 2));
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="bg-white/5 rounded-2xl border border-white/10 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-sm font-semibold text-white">Extracted JSON</h3>
				{result && (
					<button
						type="button"
						onClick={handleCopy}
						className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#A965FF] transition-colors"
					>
						{copied ? <Check size={14} /> : <Copy size={14} />}
						{copied ? "Copied" : "Copy"}
					</button>
				)}
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-16">
					<div className="flex flex-col items-center gap-3">
						<div className="w-8 h-8 border-2 border-[#A965FF]/20 border-t-[#A965FF] rounded-full animate-spin" />
						<p className="text-sm text-gray-400">Processing OCR...</p>
					</div>
				</div>
			) : result ? (
				<pre className="bg-black/30 rounded-xl p-4 text-xs text-gray-300 overflow-auto max-h-80 font-mono">
					{JSON.stringify(result, null, 2)}
				</pre>
			) : (
				<div className="flex items-center justify-center py-16">
					<p className="text-sm text-gray-300">
						Upload a document and process it to see results
					</p>
				</div>
			)}
		</div>
	);
}
