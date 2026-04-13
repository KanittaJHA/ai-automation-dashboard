"use client";

import Link from "next/link";

interface NavItem {
	label: string;
	href: string;
	active?: boolean;
	hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
	{ label: "Dashboard", href: "/", active: true },
	{ label: "OCR (Task 2)", href: "/ocr" },
	{ label: "Scraper (Task 3)", href: "/scraper" },
	{ label: "n8n Logs", href: "/logs" },
];

export default function Header() {
	return (
		<header
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				marginBottom: 72,
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

			<button
				type="button"
				style={{
					padding: "8px 22px",
					fontSize: 13,
					fontWeight: 600,
					background: "transparent",
					color: "white",
					borderRadius: 20,
					border: "1px solid rgba(255,255,255,0.2)",
					cursor: "pointer",
				}}
			>
				Connect n8n
			</button>
		</header>
	);
}
