/**
 * Convert arrays to consistent format for transaction data
 * Handles both single values and arrays uniformly
 */

/**
 * Ensure recipients are in array format
 * @param recipient - Single recipient or array of recipients
 * @returns Array of recipients
 */
export function normalizeRecipients(recipient: string | string[]): string[] {
	return Array.isArray(recipient) ? [...recipient] : [recipient];
}

/**
 * Ensure amounts are in array format
 * @param amounts - Single amount or array of amounts
 * @returns Array of amounts
 */
export function normalizeAmounts(amounts: string | string[]): string[] {
	return Array.isArray(amounts) ? [...amounts] : [amounts];
}

/**
 * Calculate total from array of amount strings
 * @param amounts - Array of amount strings
 * @returns Total as number
 */
export function calculateTotalFromAmounts(amounts: string[]): number {
	return amounts.reduce((sum, amount) => {
		const num = parseFloat(amount);
		return sum + (isNaN(num) ? 0 : num);
	}, 0);
}
