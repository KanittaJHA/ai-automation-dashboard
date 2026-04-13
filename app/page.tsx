"use client";

import FeatureCard from "@/components/landing/FeatureCard";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";

export default function LandingPage() {
	return (
		<div
			style={{
				minHeight: "100vh",
				backgroundColor: "#080B1C",
				backgroundImage:
					"linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px)," +
					"linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)",
				backgroundSize: "3rem 3rem",
				color: "white",
				fontFamily:
					"system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Ambient glows */}
			<div
				style={{
					position: "absolute",
					top: -120,
					left: "50%",
					transform: "translateX(-50%)",
					width: 900,
					height: 500,
					background:
						"radial-gradient(ellipse,rgba(56,130,248,0.2) 0%,rgba(100,60,200,0.1) 40%,transparent 70%)",
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: -100,
					left: -60,
					width: 500,
					height: 500,
					borderRadius: "50%",
					background:
						"radial-gradient(circle,rgba(168,85,247,0.1) 0%,transparent 70%)",
					pointerEvents: "none",
				}}
			/>

			<div
				style={{
					position: "relative",
					margin: "0",
					padding: "0 60px 48px",
				}}
			>
				<Header />
				<HeroSection />
			</div>

			<FeatureCard />
		</div>
	);
}
