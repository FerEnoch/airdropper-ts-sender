import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Instructs Next.js to output static HTML/CSS/JS files
	output: "export",

	// Specifies the directory for the static output (Fleek often expects 'out')
	distDir: "out",
	images: {
		unoptimized: true,
	},

	// DON'T "/"!!
	basePath: "",

	// Ensures assets are referenced correctly in static exports, especially for IPFS
	// assetPrefix: "./",

	// Adds trailing slashes to URLs (e.g., /about/), often expected by static hosts like Fleek
	trailingSlash: true,
};

export default nextConfig;
