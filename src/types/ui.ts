export interface InputFieldProps {
	label: string;
	name?: string;
	type?: React.HTMLInputTypeAttribute;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	required?: boolean;
	large?: boolean; // if true render textarea
	onChain?: boolean; // display on-chain badge
	disabled?: boolean;
	className?: string;
}

export interface TxHashDisplayProps {
	txHash?: string;
	blockExplorerUrl?: string;
	className?: string;
}

export interface ErrorDisplayProps {
	error: string;
	onDismiss: () => void;
}

export interface TransactionDetailsProps {
	tokenAddress: string;
	recipient: string | string[];
	amountWei: string | string[];
	amountTokens?: string | string[];
	tokenName?: string;
	tokenSymbol?: string;
	className?: string;
}

export interface SubmitButtonProps {
	children: React.ReactNode;
	disabled?: boolean;
	loading?: boolean;
	loadingText?: string;
	className?: string;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
}

export interface ExternalLinkButtonProps {
	href: string;
	children?: React.ReactNode;
	title?: string;
	className?: string;
	iconSize?: string;
}
