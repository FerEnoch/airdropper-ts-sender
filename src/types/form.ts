export interface AirdropFormState {
	tokenAddressInputValue: string;
	recipientsInputValue: string;
	amountsInputValue: string;
}

export interface TransactionData {
	tokenAddress: string;
	recipient: string | string[];
	amountWei: string | string[];
	amountTokens: string | string[];
	tokenName: string;
	tokenSymbol: string;
}
