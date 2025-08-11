export function calculateTotal(amount: string): number {
	const values = amount.split(",").map((v) => v.trim());

	if (values.some((v) => Number.isNaN(parseFloat(v)) || parseFloat(v) <= 0))
		return 0;

	const total = values.reduce((acc, v) => acc + (parseFloat(v) || 0), 0);

	return total >= 0 ? total : 0;
}
