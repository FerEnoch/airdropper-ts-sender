interface TransactionDetailsProps {
	tokenAddress: string;
	recipient: string | string[];
	amountWei: string | string[];
	amountTokens?: string | string[];
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
	// Convert to arrays for consistent handling
	const recipients = Array.isArray(recipient) ? recipient : [recipient];
	const amountsWei = Array.isArray(amountWei) ? amountWei : [amountWei];
	const amountsTokens = Array.isArray(amountTokens)
		? amountTokens
		: amountTokens
		? [amountTokens]
		: [];

	// Calculate total if multiple amounts
	const totalWei = amountsWei.reduce(
		(sum, amount) => sum + parseFloat(amount),
		0
	);
	const totalTokens = amountsTokens.reduce(
		(sum, amount) => sum + parseFloat(amount),
		0
	);
	const isMultiple = recipients.length > 1;

	return (
		<div
			className={`rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 ${className}`}
		>
			<h3 className="text-sm font-semibold text-emerald-400 mb-3">
				Transaction Details {isMultiple && `(${recipients.length} recipients)`}
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

				{/* Recipients section */}
				<div className={isMultiple ? "" : "flex justify-between"}>
					<span className="text-zinc-400">
						{isMultiple ? "Recipients:" : "Recipient:"}
					</span>
					{isMultiple ? (
						<div className="mt-1 max-h-32 overflow-y-auto space-y-1">
							{recipients.map((addr, index) => (
								<div
									key={index}
									className="flex justify-between items-center text-xs bg-emerald-500/10 rounded px-2 py-1"
								>
									<span className="font-mono text-emerald-300">
										{addr.slice(0, 6)}...{addr.slice(-4)}
									</span>
									{amountsTokens[index] && (
										<span className="text-emerald-300">
											{amountsTokens[index]} {tokenSymbol}
										</span>
									)}
								</div>
							))}
						</div>
					) : (
						<span className="font-mono text-emerald-300 ml-2">
							{recipients[0].slice(0, 6)}...{recipients[0].slice(-4)}
						</span>
					)}
				</div>

				{/* Amount section */}
				<div className="flex justify-between">
					<span className="text-zinc-400">
						{isMultiple ? "Total Amount (wei):" : "Amount (wei):"}
					</span>
					<span className="font-mono text-emerald-300">
						{isMultiple ? totalWei.toString() : amountsWei[0]}
					</span>
				</div>

				{amountsTokens.length > 0 && (
					<div className="flex justify-between">
						<span className="text-zinc-400">
							{isMultiple ? "Total Amount (tokens):" : "Amount (tokens):"}
						</span>
						<span className="font-mono text-emerald-300">
							{isMultiple
								? `${totalTokens} ${tokenSymbol}`
								: `${amountsTokens[0]} ${tokenSymbol}`}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
