interface TransactionDetailsProps {
	tokenAddress: string;
	recipient: string;
	amountWei: string;
	amountTokens?: string;
	tokenName?: string;
	tokenSymbol?: string;
	className?: string;
}

export function TransactionDetails({
	tokenAddress,
	recipient,
	amountWei,
	amountTokens,
	tokenName = "Unknown Token",
	tokenSymbol = "UNK",
	className = "",
}: TransactionDetailsProps) {
	return (
		<div
			className={`rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 ${className}`}
		>
			<h3 className="text-sm font-semibold text-emerald-400 mb-3">
				Transaction Details
			</h3>
			<div className="space-y-2 text-xs">
				<div className="flex justify-between">
					<span className="text-zinc-400">Token:</span>
					<span className="font-mono text-emerald-300">
						{tokenName} ({tokenSymbol})
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-zinc-400">Token Address:</span>
					<span className="font-mono text-emerald-300">
						{tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-zinc-400">Recipient:</span>
					<span className="font-mono text-emerald-300">
						{recipient.slice(0, 6)}...{recipient.slice(-4)}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-zinc-400">Amount (wei):</span>
					<span className="font-mono text-emerald-300">{amountWei}</span>
				</div>
				{amountTokens && (
					<div className="flex justify-between">
						<span className="text-zinc-400">Amount (tokens):</span>
						<span className="font-mono text-emerald-300">
							{amountTokens} {tokenSymbol}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
