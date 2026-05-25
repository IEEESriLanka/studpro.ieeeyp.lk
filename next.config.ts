import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "mega.nz",
			},
			{
				protocol: "https",
				hostname: "**.mega.nz",
			},
		],
	},
};

export default nextConfig;
