"use client";

import { AirdropForm } from "@/components/airdropForm/airdropForm";
import { NoWalletConnect } from "@/components/noWalletConnect/noWalletConnect";
import { useAccount } from "wagmi";

export default function Home() {
	const { isConnected } = useAccount();

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			{isConnected ? <AirdropForm /> : <NoWalletConnect />}
		</main>
	);
}
