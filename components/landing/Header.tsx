"use client";

import Link from "next/link";

interface NavItem {
	label: string;
	href: string;
	active?: boolean;
	hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
	{ label: "Home", href: "/", active: true },
	{ label: "OCR (Task 2)", href: "/ocr" },
	{ label: "Workflows", href: "#" },
	{ label: "Docs", href: "#" },
];

export default function Header() {
	return (
		<header
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				marginTop: 32,
				marginBottom: 42,
			}}
		>
			<span
				style={{
					fontSize: 18,
					fontWeight: 700,
					letterSpacing: "-0.5px",
				}}
			>
				AutoX
			</span>

			<nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
				{NAV_ITEMS.map((item) => (
					<Link
						key={item.label}
						href={item.href}
						style={{
							fontSize: 13,
							textDecoration: "none",
							padding: "6px 14px",
							borderRadius: 20,
							color: item.active ? "white" : "rgba(255,255,255,0.45)",
							background: item.active
								? "rgba(255,255,255,0.08)"
								: "transparent",
							border: item.active
								? "1px solid rgba(255,255,255,0.12)"
								: "1px solid transparent",
							transition: "color 0.2s",
						}}
					>
						{item.label}
						{item.hasDropdown ? " ▾" : ""}
					</Link>
				))}
			</nav>

			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<a
					href="https://github.com/KanittaJHA/ai-automation-dashboard"
					target="_blank"
					rel="noopener noreferrer"
					style={{
						display: "flex",
						alignItems: "center",
						gap: 6,
						padding: "8px 18px",
						fontSize: 13,
						fontWeight: 600,
						background: "transparent",
						color: "rgba(255,255,255,0.6)",
						borderRadius: 20,
						border: "1px solid rgba(255,255,255,0.12)",
						textDecoration: "none",
						transition: "color 0.2s, border-color 0.2s",
					}}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<title>GitHub</title>
						<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
					</svg>
					GitHub
				</a>
				<Link
					href="/ocr"
					style={{
						padding: "8px 22px",
						fontSize: 13,
						fontWeight: 600,
						background: "white",
						color: "#080B1C",
						borderRadius: 20,
						border: "none",
						textDecoration: "none",
					}}
				>
					Try OCR
				</Link>
			</div>
		</header>
	);
}
