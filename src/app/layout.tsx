import type { Metadata } from "next";
import { Inter, Bebas_Neue, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const bebasNeue = Bebas_Neue({
	variable: "--font-bebas",
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	display: "swap",
	axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
	title: "StudPro — IEEE Young Professionals Sri Lanka",
	description:
		"A student development program by IEEE Young Professionals Sri Lanka — building the next generation of engineers.",
	icons: {
		icon: "/studpro-logo.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${bebasNeue.variable} ${fraunces.variable} antialiased bg-background text-foreground`}
			>
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
