/**
 * Generate a default block explorer URL for a given transaction hash
 * @param hash - Transaction hash
 * @returns Block explorer URL
 */
export function defaultBlockExplorerUrl(hash: string): string {
	return `https://etherscan.io/tx/${hash}`;
}
