export function splitRecipients(recipients: string): string[] {
	const addressesArr = recipients.split(",").map((r) => r.trim());

	if (
		addressesArr.some((addr) => !addr || !addr.match(/^0x[a-fA-F0-9]{40}$/))
	) {
		return [];
	}
	return addressesArr;
}
