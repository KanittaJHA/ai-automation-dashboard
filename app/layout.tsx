import type { Metadata } from "next";
import { Noto_Sans_Thai, Poppins, Urbanist } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-poppins",
});

const urbanist = Urbanist({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800"],
	variable: "--font-urbanist",
});

const notoSansThai = Noto_Sans_Thai({
	subsets: ["thai"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-noto-sans-thai",
});

export const metadata: Metadata = {
	title: "AI Automation Dashboard",
	description: "Dashboard for AI automation tasks",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} ${urbanist.variable} ${notoSansThai.variable}`}>{children}</body>
		</html>
	);
}
