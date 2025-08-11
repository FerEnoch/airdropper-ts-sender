export function splitAmounts(amounts: string): string[] {
	const amountsArr = amounts.split(",").map((a) => a.trim());

	if (amountsArr.some((amt) => !amt.match(/^\d+$/))) {
		return [];
	}
	return amountsArr;
}
