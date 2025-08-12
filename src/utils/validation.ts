/**
 * Validate an Ethereum address format
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
	return Boolean(address?.match(/^0x[a-fA-F0-9]{40}$/));
}

/**
 * Validate that recipients and amounts arrays have compatible lengths
 * @param recipientsLength - Number of recipients
 * @param amountsLength - Number of amounts
 * @returns True if lengths are compatible (equal or single amount for multiple recipients)
 */
export function areRecipientsAndAmountsCompatible(
	recipientsLength: number,
	amountsLength: number
): boolean {
	return recipientsLength === amountsLength || amountsLength === 1;
}

/**
 * Check if total amount is valid (greater than zero)
 * @param totalAmountWei - Total amount in wei as bigint or string
 * @returns True if amount is greater than zero
 */
export function isValidTotalAmount(totalAmountWei: bigint | string): boolean {
	return totalAmountWei.toString() !== "0";
}
