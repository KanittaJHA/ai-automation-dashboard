"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
	const router = useRouter();

	return (
		<section
			style={{
				textAlign: "center",
				marginBottom: 10,
				position: "relative",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: -80,
					left: "50%",
					transform: "translateX(-50%)",
					width: 700,
					height: 280,
					background:
						"radial-gradient(ellipse,rgba(56,189,248,0.18) 0%,transparent 65%)",
					pointerEvents: "none",
				}}
			/>

			<h2
				style={{
					fontSize: 58,
					fontWeight: 500,
					lineHeight: 1.1,
					letterSpacing: "-2px",
					marginBottom: 20,
					position: "relative",
				}}
			>
				Let AI Agents Handle the Busywork
				<br />
				Automate OCR & Data Extraction
			</h2>
			<p
				style={{
					color: "rgba(255,255,255,0.45)",
					fontSize: 15,
					lineHeight: 1.7,
					maxWidth: 500,
					margin: "0 auto 36px",
				}}
			>
				Build powerful n8n workflows. Automatically extract data from
				receipts with AI Vision, validate invoice totals, and trigger
				real-time LINE alerts.
			</p>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 14,
				}}
			>
				<button
					type="button"
					onClick={() => router.push("/ocr")}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						padding: "12px 28px",
						fontSize: 14,
						fontWeight: 600,
						background: "white",
						color: "#080B1C",
						borderRadius: 50,
						border: "none",
						cursor: "pointer",
						transition: "opacity 0.2s",
					}}
				>
					<svg
						aria-hidden="true"
						width="16"
						height="16"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					Try OCR Now
				</button>
				<button
					type="button"
					onClick={() => router.push("/ocr")}
					style={{
						padding: "12px 28px",
						fontSize: 14,
						fontWeight: 600,
						color: "#7dd3fc",
						border: "1px solid #1e3a5f",
						background: "rgba(14,42,71,0.4)",
						borderRadius: 50,
						cursor: "pointer",
					}}
				>
					View JSON Output
				</button>
			</div>
		</section>
	);
}
