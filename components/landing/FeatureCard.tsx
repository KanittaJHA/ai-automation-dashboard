"use client";

import type { CSSProperties } from "react";

interface FaceAvatar {
	init: string;
	bg: string;
}

const FACE_AVATARS: FaceAvatar[] = [
	{ init: "A", bg: "linear-gradient(135deg,#7c3aed,#2563eb)" },
	{ init: "B", bg: "#0369a1" },
	{ init: "C", bg: "#b45309" },
];

const glassCard: CSSProperties = {
	background: "rgba(255,255,255,0.04)",
	border: "1px solid rgba(255,255,255,0.1)",
	borderRadius: 20,
	padding: 28,
	boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
	backdropFilter: "blur(20px)",
};

export default function FeatureCard() {
	return (
		<div
			style={{
				position: "relative",
				display: "flex",
				justifyContent: "center",
				padding: "0 60px 32px",
			}}
		>
			<div style={{ width: "100%", maxWidth: 860 }}>
				{/* Bolt icon */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginBottom: 16,
					}}
				>
					<div
						style={{
							width: 48,
							height: 48,
							borderRadius: "50%",
							background: "rgba(255,255,255,0.06)",
							border: "1px solid rgba(255,255,255,0.12)",
							boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<svg
							aria-hidden="true"
							width="20"
							height="20"
							fill="none"
							stroke="rgba(255,255,255,0.7)"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
				</div>

				<div style={glassCard}>
					{/* Priority badge */}
					<div style={{ marginBottom: 16 }}>
						<span
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 6,
								fontSize: 12,
								fontWeight: 600,
								color: "#4ade80",
								background: "rgba(74,222,128,0.1)",
								border: "1px solid rgba(74,222,128,0.25)",
								padding: "4px 12px",
								borderRadius: 20,
							}}
						>
							<span
								style={{
									width: 7,
									height: 7,
									borderRadius: "50%",
									background: "#4ade80",
									display: "inline-block",
								}}
							/>
							Active Pipeline
						</span>
					</div>

					<h3
						style={{
							fontSize: 20,
							fontWeight: 700,
							lineHeight: 1.35,
							marginBottom: 10,
						}}
					>
						Task 2: Smart OCR Validation & Data Extraction
					</h3>
					<p
						style={{
							fontSize: 13,
							color: "rgba(255,255,255,0.4)",
							lineHeight: 1.6,
							marginBottom: 24,
						}}
					>
						Transform unstructured PDF invoices into validated JSON (checking
						Subtotal + VAT). AI Agent reviews, enriches, and categorizes
						extracted data automatically.
					</p>

					{/* Meta row */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: 20,
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
							<div
								style={{
									width: 36,
									height: 36,
									borderRadius: "50%",
									background: "linear-gradient(135deg,#7c3aed,#2563eb)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 11,
									fontWeight: 600,
								}}
							>
								AI
							</div>
							<div>
								<div style={{ fontSize: 14, fontWeight: 500 }}>AI Agent</div>
								<div
									style={{
										fontSize: 12,
										color: "rgba(255,255,255,0.35)",
									}}
								>
									Just now
								</div>
							</div>
						</div>

						<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 5,
									fontSize: 12,
									color: "rgba(255,255,255,0.4)",
								}}
							>
								<svg
									aria-hidden="true"
									width="14"
									height="14"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
								15
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 4,
								}}
							>
								<button
									type="button"
									aria-label="Upvote"
									style={{
										width: 32,
										height: 32,
										borderRadius: "50%",
										background: "rgba(255,255,255,0.06)",
										border: "1px solid rgba(255,255,255,0.1)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
									}}
								>
									<svg
										aria-hidden="true"
										width="12"
										height="12"
										fill="none"
										stroke="rgba(255,255,255,0.7)"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2.5}
											d="M5 15l7-7 7 7"
										/>
									</svg>
								</button>
								<span style={{ fontSize: 20, fontWeight: 700 }}>64</span>
							</div>
						</div>
					</div>

					{/* Input bar */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							background: "rgba(255,255,255,0.05)",
							border: "1px solid rgba(255,255,255,0.1)",
							borderRadius: 50,
							padding: "10px 16px",
						}}
					>
						<div
							style={{
								width: 26,
								height: 26,
								borderRadius: "50%",
								border: "1px solid rgba(255,255,255,0.2)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 16,
								color: "rgba(255,255,255,0.5)",
								flexShrink: 0,
							}}
						>
							+
						</div>
						<div
							style={{
								flex: 1,
								fontSize: 13,
								color: "rgba(255,255,255,0.6)",
							}}
						>
							Extract <span style={{ color: "#38bdf8" }}>Subtotal & VAT</span>{" "}
							from <span style={{ color: "#a78bfa" }}>invoice.pdf</span> and
							validate <span style={{ color: "#38bdf8" }}>Grand Total</span>
						</div>
						<div style={{ display: "flex", flexShrink: 0 }}>
							{FACE_AVATARS.map((f, i) => (
								<div
									key={f.init}
									role="img"
									aria-label={`Avatar ${f.init}`}
									style={{
										width: 28,
										height: 28,
										borderRadius: "50%",
										background: f.bg,
										border: "2px solid #080B1C",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: 11,
										fontWeight: 600,
										marginLeft: i > 0 ? -8 : 0,
									}}
								>
									{f.init}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
