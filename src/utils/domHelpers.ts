/**
 * Generate a unique ID from a label string by converting to lowercase and replacing spaces/special chars with hyphens
 * @param label - The label to convert
 * @returns Sanitized ID string
 */
export function generateIdFromLabel(label: string): string {
	return label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}
