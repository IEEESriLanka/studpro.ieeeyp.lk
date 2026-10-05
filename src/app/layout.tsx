import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "StudPro",
	description:
		"Explore the evolution of StudPro program through comprehensive event series",
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
			<body className={`${inter.variable} antialiased`}>
				<main>
					<Header />
					{children}
					<Footer />
				</main>
			</body>
		</html>
	);
}
