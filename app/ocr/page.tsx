"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import UploadArea from "@/components/dashboard/ocr/UploadArea";
import ResultPanel from "@/components/dashboard/ocr/ResultPanel";
import ValidationPanel from "@/components/dashboard/ocr/ValidationPanel";
import HistoryTable from "@/components/dashboard/ocr/HistoryTable";
import type { OcrHistoryItem } from "@/components/dashboard/ocr/HistoryTable";
import { FileCheck, TrendingUp, Clock, Zap } from "lucide-react";

export default function OCRPage() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [result, setResult] = useState<Record<string, unknown> | null>(null);
	const [history, setHistory] = useState<OcrHistoryItem[]>([]);

	const handleFileSelect = useCallback((file: File) => {
		setSelectedFile(file);
		setResult(null);
		if (file.type.startsWith("image/")) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		} else {
			setPreviewUrl(null);
		}
	}, []);

	const handleClear = useCallback(() => {
		setSelectedFile(null);
		setPreviewUrl(null);
		setResult(null);
	}, []);

	const handleProcess = useCallback(async () => {
		if (!selectedFile) return;
		setIsProcessing(true);

		try {
			let base64: string;

			if (selectedFile.type === "application/pdf") {
				// PDF → convert first page to image via pdf.js
				const pdfjsLib = await import("pdfjs-dist");
				pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
				const ab = await selectedFile.arrayBuffer();
				const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
				const page = await pdf.getPage(1);
				const viewport = page.getViewport({ scale: 2 });
				const canvas = document.createElement("canvas");
				canvas.width = viewport.width;
				canvas.height = viewport.height;
				const ctx = canvas.getContext("2d");
				if (!ctx) throw new Error("Canvas not supported");
				// pdfjs-dist v5 types require `canvas` but runtime works without it
				// biome-ignore lint/suspicious/noExplicitAny: pdfjs v5 type mismatch
				await (page as any).render({ canvasContext: ctx, viewport }).promise;
				base64 = canvas.toDataURL("image/png").split(",")[1];
			} else {
				// Image → direct base64
				const arrayBuffer = await selectedFile.arrayBuffer();
				base64 = btoa(
					new Uint8Array(arrayBuffer).reduce(
						(data, byte) => data + String.fromCharCode(byte),
						"",
					),
				);
			}

			const res = await fetch("/api/ocr", {
				method: "POST",
				body: JSON.stringify({
					filename: selectedFile.name,
					mimeType: selectedFile.type,
					base64,
				}),
				headers: { "Content-Type": "application/json" },
			});

			const data = await res.json();

			if (!data.result) {
				setResult({ error: data.error || "No result from OCR" });
				return;
			}

			const ocrResult = data.result;
			setResult(ocrResult);

			const newItem: OcrHistoryItem = {
				id: Date.now().toString(),
				filename: selectedFile.name,
				date: new Date().toISOString().slice(0, 16).replace("T", " "),
				status: "success",
				subtotal: Number(ocrResult.subtotal ?? 0),
				vat: Number(
					ocrResult.vat_amount ?? ocrResult.vat ?? ocrResult.VAT ?? 0,
				),
				grandTotal: Number(ocrResult.grand_total ?? ocrResult.grandTotal ?? 0),
				valid: (() => {
					const s = Number(ocrResult.subtotal ?? ocrResult.Subtotal ?? 0);
					const d = Number(ocrResult.discount ?? 0);
					const v = Number(ocrResult.vat_amount ?? ocrResult.vat ?? ocrResult.VAT ?? ocrResult.tax ?? ocrResult.Tax ?? 0);
					const g = Number(ocrResult.grand_total ?? ocrResult.GrandTotal ?? ocrResult.grandTotal ?? ocrResult.total ?? ocrResult.Total ?? 0);
					const vatExclusive = Math.abs(s - d + v - g) < 0.5;
					const vatInclusive = Math.abs(s - d - g) < 0.5 && v > 0;
					return vatExclusive || vatInclusive;
				})(),
			};

			setHistory((prev) => [newItem, ...prev]);
		} catch (err) {
			setResult({ error: `Failed to process OCR: ${err instanceof Error ? err.message : String(err)}` });
		} finally {
			setIsProcessing(false);
		}
	}, [selectedFile]);

	const totalProcessed = history.length;
	const successCount = history.filter((h) => h.status === "success").length;
	const successRate =
		totalProcessed > 0 ? Math.round((successCount / totalProcessed) * 100) : 0;
	const lastProcessed = history[0]?.date ?? "N/A";

	return (
		<DashboardLayout>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white">OCR Dashboard</h1>
				<p className="text-sm text-gray-400 mt-1">
					Extract structured data from invoices and receipts
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<StatsCard
					title="Total Processed"
					value={totalProcessed}
					icon={FileCheck}
					iconColor="text-[#7c3aed]"
					iconBg="bg-[#7c3aed]/10"
				/>
				<StatsCard
					title="Success Rate"
					value={`${successRate}%`}
					icon={TrendingUp}
					iconColor="text-[#7c3aed]"
					iconBg="bg-[#7c3aed]/10"
				/>
				<StatsCard
					title="Last Processed"
					value={lastProcessed.split(" ")[1] ?? "N/A"}
					subtitle={lastProcessed.split(" ")[0]}
					icon={Clock}
					iconColor="text-[#7c3aed]"
					iconBg="bg-[#7c3aed]/10"
				/>
				<StatsCard
					title="Avg. Processing"
					value="1.2s"
					subtitle="Per document"
					icon={Zap}
					iconColor="text-[#7c3aed]"
					iconBg="bg-[#7c3aed]/10"
				/>
			</div>

			{/* Upload + Results */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
				<div className="space-y-6">
					<UploadArea
						onFileSelect={handleFileSelect}
						selectedFile={selectedFile}
						onClear={handleClear}
						previewUrl={previewUrl}
					/>
					{/* Buttons */}
					<div className="flex gap-3">
						<button
							type="button"
							onClick={handleProcess}
							disabled={!selectedFile || isProcessing}
							className={`flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
								selectedFile && !isProcessing
									? "bg-linear-to-r from-[#7c3aed] to-[#2563eb] hover:from-[#6d28d9] hover:to-[#1d4ed8] text-white shadow-lg shadow-[#7c3aed]/25"
									: "bg-white/10 text-gray-500 cursor-not-allowed"
							}`}
						>
							{isProcessing ? "Processing..." : "Process OCR"}
						</button>
						{result && (
							<button
								type="button"
								onClick={handleClear}
								className="px-5 py-3.5 rounded-xl text-sm font-semibold border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all duration-200"
							>
								Reset
							</button>
						)}
					</div>
					<ValidationPanel result={result} />
				</div>
				<ResultPanel result={result} isLoading={isProcessing} />
			</div>

			{/* History */}
			<HistoryTable items={history} />
		</DashboardLayout>
	);
}
