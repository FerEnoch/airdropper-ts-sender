import { CopyButton } from "./copyButton";
import { ExternalLinkButton } from "./externalLinkButton";

interface TxHashDisplayProps {
	txHash: `0x${string}` | undefined;
	getBlockExplorerUrl?: (hash: string) => string;
	className?: string;
}

function defaultBlockExplorerUrl(hash: string): string {
	return `https://sepolia.etherscan.io/tx/${hash}`;
}

export function TxHashDisplay({
	txHash,
	getBlockExplorerUrl = defaultBlockExplorerUrl,
	className = "",
}: TxHashDisplayProps) {
	if (!txHash) {
		return (
			<span className={`text-xs text-zinc-400 ${className}`}>
				Enter details and submit to airdrop.
			</span>
		);
	}

	return (
		<div
			className={`flex items-center gap-2 text-xs text-zinc-400 ${className}`}
		>
			<span>
				Submitted Tx:{" "}
				<span className="font-mono text-emerald-400">
					{txHash.slice(0, 10)}...
				</span>
			</span>
			<CopyButton textToCopy={txHash} />
			<ExternalLinkButton
				href={getBlockExplorerUrl(txHash)}
				title="View on block explorer"
			/>
		</div>
	);
}
