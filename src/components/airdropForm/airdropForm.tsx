"use client";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { useMemo, useState, useEffect } from "react";
import { InputField } from "@/components/ui/inputField";
import { TxHashDisplay } from "@/components/ui/txHashDisplay";
import { SubmitButton } from "@/components/ui/submitButton";
import { TransactionDetails } from "@/components/ui/transactionDetails";
import { ErrorDisplay } from "@/components/ui/errorDisplay";
import {
	useChainId,
	useConfig,
	useAccount,
	useWriteContract,
	useReadContracts,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseEther } from "viem";
import { calculateTotal } from "@/utils/calculateTotal";
import { splitRecipients } from "@/utils/splitRecipients";
import { splitAmounts } from "@/utils/splitAmounts";

interface AirdropFormState {
	tokenAddressInputValue: string;
	recipientsInputValue: string;
	amountsInputValue: string;
}

interface TransactionData {
	tokenAddress: string;
	recipient: string | string[];
	amountWei: string | string[];
	amountTokens: string | string[];
	tokenName: string;
	tokenSymbol: string;
}

export function AirdropForm() {
	const [
		{ tokenAddressInputValue, recipientsInputValue, amountsInputValue },
		setForm,
	] = useState<AirdropFormState>({
		recipientsInputValue: "",
		tokenAddressInputValue: "", // Mock-token address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
		amountsInputValue: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [transactionData, setTransactionData] =
		useState<TransactionData | null>(null);
	const chainId = useChainId();
	const config = useConfig();
	const tokenData = useReadContracts({
		contracts: [
			{
				abi: erc20Abi,
				address: tokenAddressInputValue as `0x${string}`,
				functionName: "name",
			},
			{
				abi: erc20Abi,
				address: tokenAddressInputValue as `0x${string}`,
				functionName: "symbol",
			},
		],
	});
	const userAccount = useAccount();
	const {
		data: txHash,
		isPending,
		error: txError,
		writeContractAsync,
	} = useWriteContract();

	const totalAmountInWei = useMemo(() => {
		return parseEther(String(calculateTotal(amountsInputValue)));
	}, [amountsInputValue]);

	// Handle wagmi transaction errors
	useEffect(() => {
		if (txError) {
			console.error("Wagmi transaction error:", txError);
			if (txError.message?.includes("User rejected")) {
				setError("Transaction was rejected by user.");
			} else if (txError.message?.includes("insufficient funds")) {
				setError(
					"Insufficient funds for gas fees. Please add more ETH to your wallet."
				);
			} else {
				setError(`Transaction error: ${txError.message || "Unknown error"}`);
			}
		}
	}, [txError]);

	const update = (
		key: keyof AirdropFormState,
		value: AirdropFormState[typeof key]
	) => {
		setForm((f) => ({ ...f, [key]: value }));
		// Clear errors when user starts typing
		if (error) setError(null);
	};

	async function getApprovedAmount(
		tSenderAddress: string
	): Promise<bigint | null> {
		if (!tSenderAddress) return null;

		try {
			const approvedAmount = (await readContract(config, {
				abi: erc20Abi,
				address: tokenAddressInputValue as `0x${string}`,
				functionName: "allowance",
				args: [userAccount.address, tSenderAddress],
			})) as bigint;

			return approvedAmount;
		} catch (error: any) {
			console.error("Error getting approved amount:", error);
			// Don't throw here, return null and handle in caller
			return null;
		}
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null); // Clear previous errors

		// Validation checks
		try {
			// Check if wallet is connected
			if (!userAccount.address) {
				setError("Please connect your wallet to continue.");
				return;
			}

			// Check if chain is supported
			const tSenderAddress = chainsToTSender[chainId]?.tsender;
			if (!tSenderAddress) {
				setError(
					`TSender contract not available on this network (Chain ID: ${chainId}). Please switch to a supported network.`
				);
				return;
			}

			// Validate token address
			if (
				!tokenAddressInputValue ||
				!tokenAddressInputValue.match(/^0x[a-fA-F0-9]{40}$/)
			) {
				setError(
					"Please enter a valid token contract address (42 characters starting with 0x)."
				);
				return;
			}

			// Validate recipients
			const recipients = splitRecipients(recipientsInputValue);
			if (recipients.length === 0) {
				setError(
					"Please enter valid recipient addresses. Use comma-separated format for multiple recipients."
				);
				return;
			}

			// Validate amounts
			const amounts = splitAmounts(amountsInputValue);
			if (amounts.length === 0) {
				setError(
					"Please enter valid amounts. Use comma-separated format for multiple amounts."
				);
				return;
			}

			// Check if recipients and amounts match
			if (recipients.length !== amounts.length && amounts.length !== 1) {
				setError(
					`Number of recipients (${recipients.length}) must match number of amounts (${amounts.length}), or provide a single amount for all recipients.`
				);
				return;
			}

			// Check for zero or negative amounts
			if (totalAmountInWei.toString() === "0") {
				setError(
					"Total amount cannot be zero. Please check your amounts and ensure none are zero or negative."
				);
				return;
			}

			setSubmitting(true);
			setTransactionData(null);

			console.log("Submitting airdrop transaction...");

			// Check token allowance
			const approvedAmountInWei = await getApprovedAmount(tSenderAddress);

			if (approvedAmountInWei === null) {
				setError(
					"Failed to check token allowance. Please ensure the token contract is valid and try again."
				);
				return;
			}

			// Handle token approval if needed
			if (approvedAmountInWei < totalAmountInWei) {
				try {
					console.log("Requesting token approval...");
					const approvalHash = await writeContractAsync({
						abi: erc20Abi,
						address: tokenAddressInputValue as `0x${string}`,
						functionName: "approve",
						args: [tSenderAddress, BigInt(totalAmountInWei)],
					});

					const approvalReceipt = await waitForTransactionReceipt(config, {
						hash: approvalHash,
					});

					if (approvalReceipt.status !== "success") {
						setError("Token approval failed. Please try again.");
						return;
					}

					console.log("Token approval confirmed:", approvalReceipt);
				} catch (error: any) {
					console.error("Error approving tokens:", error);

					if (error.cause?.reason === "insufficient funds") {
						setError(
							"Insufficient funds for gas fees. Please add more ETH to your wallet."
						);
					} else if (error.message?.includes("User rejected")) {
						setError("Transaction was rejected by user.");
					} else if (error.message?.includes("insufficient allowance")) {
						setError(
							"Insufficient token allowance. Please approve more tokens."
						);
					} else {
						setError(
							`Token approval failed: ${
								error.shortMessage || error.message || "Unknown error"
							}`
						);
					}
					return;
				}
			}

			// Execute the airdrop transaction
			try {
				console.log("Executing airdrop transaction...");
				const recipients = splitRecipients(recipientsInputValue);
				const amounts = splitAmounts(amountsInputValue);

				const transferTxHash = await writeContractAsync({
					abi: tsenderAbi,
					address: tSenderAddress as `0x${string}`,
					functionName: "airdropERC20",
					args: [
						tokenAddressInputValue,
						recipients,
						amounts.map((v) => parseEther(v)),
						totalAmountInWei,
					],
				});

				const transferReceipt = await waitForTransactionReceipt(config, {
					hash: transferTxHash,
				});

				if (transferReceipt.status !== "success") {
					setError(
						"Airdrop transaction failed. Please check the transaction details and try again."
					);
					return;
				}

				console.log("Airdrop transaction confirmed:", transferReceipt);

				// Check for token data errors (non-blocking)
				if (tokenData.isError) {
					console.warn(
						"Failed to fetch token metadata:",
						tokenData.failureReason
					);
				}

				// Create transaction data with proper arrays for multiple recipients/amounts
				const txData: TransactionData = {
					tokenAddress: tokenAddressInputValue,
					recipient:
						recipients.length > 1 ? recipients : recipients[0] || "unknown",
					amountWei:
						amounts.length > 1
							? amounts.map((a) => parseEther(a).toString())
							: parseEther(amounts[0] || "0").toString(),
					amountTokens: amounts.length > 1 ? amounts : amounts[0],
					tokenName: (tokenData.data?.[0]?.result as string) || "Unknown Token",
					tokenSymbol: (tokenData.data?.[1]?.result as string) || "UNK",
				};

				setTransactionData(txData);

				// Clear form on success
				setForm({
					recipientsInputValue: "",
					tokenAddressInputValue: "",
					amountsInputValue: "",
				});
			} catch (error: any) {
				console.error("Error executing airdrop:", error);

				if (error.cause?.reason === "insufficient funds") {
					setError(
						"Insufficient funds for gas fees. Please add more ETH to your wallet."
					);
				} else if (error.message?.includes("User rejected")) {
					setError("Transaction was rejected by user.");
				} else if (error.message?.includes("insufficient balance")) {
					setError(
						"Insufficient token balance. Please ensure you have enough tokens for the airdrop."
					);
				} else if (
					error.message?.includes("transfer amount exceeds allowance")
				) {
					setError(
						"Transfer amount exceeds allowance. Please approve more tokens."
					);
				} else {
					setError(
						`Airdrop transaction failed: ${
							error.shortMessage || error.message || "Unknown error"
						}`
					);
				}
			}
		} catch (error: any) {
			console.error("Unexpected error during submission:", error);
			setError(
				`An unexpected error occurred: ${error.message || "Please try again."}`
			);
		} finally {
			setSubmitting(false);
		}
	}

	const isValid = recipientsInputValue && amountsInputValue;

	return (
		<form
			onSubmit={onSubmit}
			className="w-full max-w-xl space-y-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6 backdrop-blur-md shadow-lg"
		>
			{error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}

			<div className="space-y-4">
				<InputField
					label="Token Address"
					name="tokenAddress"
					placeholder="0x..."
					value={tokenAddressInputValue}
					onChange={(v) => update("tokenAddressInputValue", v)}
					onChain
					required
					className=""
				/>
				<InputField
					label="Recipient Address (optional CSV addresses)"
					name="recipient"
					placeholder="0x..."
					value={recipientsInputValue}
					onChange={(v) => update("recipientsInputValue", v)}
					onChain
					required
					className=""
				/>
				<InputField
					label="Amount (tokens; optional CSV amounts)"
					name="amount"
					type="text"
					placeholder="e.g. 10"
					value={amountsInputValue}
					onChange={(v) => update("amountsInputValue", v)}
					required
					onChain
				/>
			</div>
			<div className="flex items-center justify-between gap-4 pt-2">
				<TxHashDisplay txHash={txHash} />
				<SubmitButton
					disabled={!isValid}
					loading={submitting || isPending}
					loadingText="Sending..."
				>
					Send Airdrop
				</SubmitButton>
			</div>
			{transactionData && (
				<TransactionDetails
					tokenAddress={transactionData.tokenAddress}
					recipient={transactionData.recipient}
					amountWei={transactionData.amountWei}
					amountTokens={transactionData.amountTokens}
					tokenName={transactionData.tokenName}
					tokenSymbol={transactionData.tokenSymbol}
				/>
			)}
		</form>
	);
}
