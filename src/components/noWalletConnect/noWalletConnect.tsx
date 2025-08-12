"use client";

import { ConnectButton } from "@/components/ui/connectButton";

export function NoWalletConnect() {
	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-8 backdrop-blur-md shadow-lg text-center">
				<div className="mb-6">
					<div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
						<svg
							className="w-8 h-8 text-indigo-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-white mb-2">
						Connect Your Wallet
					</h2>
					<p className="text-zinc-400 text-sm leading-relaxed">
						To use the airdrop functionality, please connect your Web3 wallet.
						<br />
						This allows you to send tokens to multiple recipients securely.
					</p>
				</div>

				<div className="space-y-6">
					<div className="flex justify-center">
						<ConnectButton />
					</div>
					<div className="text-xs text-zinc-500">
						Supported wallets: MetaMask, WalletConnect, and more
					</div>
				</div>
			</div>
		</div>
	);
}
