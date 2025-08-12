import { CopyButton } from "./copyButton";
import { ExternalLinkButton } from "./externalLinkButton";
import { type TxHashDisplayProps } from "@/types";
import { defaultBlockExplorerUrl } from "@/utils/blockExplorer";

export type { TxHashDisplayProps } from "@/types";

export function TxHashDisplay({
	txHash,
	blockExplorerUrl,
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
				href={blockExplorerUrl || defaultBlockExplorerUrl(txHash)}
				title="View on block explorer"
			/>
		</div>
	);
}
