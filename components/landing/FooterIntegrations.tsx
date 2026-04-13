import Image from "next/image";

const INTEGRATIONS = ["n8n", "openai", "googlesheets", "line"];

export default function FooterIntegrations() {
	return (
		<footer
			style={{
				marginTop: 40,
				textAlign: "center",
				color: "rgba(255,255,255,0.25)",
				fontSize: 13,
				padding: "0 60px 48px",
			}}
		>
			Integrations powering this dashboard
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 40,
					marginTop: 20,
					opacity: 0.5,
				}}
			>
				{INTEGRATIONS.map((name) => (
					<Image
						key={name}
						src={`https://simpleicons.org/icons/${name}.svg`}
						alt={name}
						width={32}
						height={32}
						unoptimized
						style={{ filter: "brightness(0) invert(1)" }}
					/>
				))}
			</div>
		</footer>
	);
}
