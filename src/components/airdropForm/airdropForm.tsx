"use client";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { useMemo, useState } from "react";
import { InputField } from "@/components/ui/inputField";
import { TxHashDisplay } from "@/components/ui/txHashDisplay";
import { SubmitButton } from "@/components/ui/submitButton";
import { TransactionDetails } from "@/components/ui/transactionDetails";
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
	// const [txHash, setTxHash] = useState<string | null>(null);
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

	const update = (
		key: keyof AirdropFormState,
		value: AirdropFormState[typeof key]
	) => {
		setForm((f) => ({ ...f, [key]: value }));
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
		} catch (error: unknown) {
			// TODO: handle error
			console.error("Error getting approved amount:", error);
			return null;
		}
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (totalAmountInWei.toString() === "0") {
			// TODO: Handle zero total amount (a.k.a. not-valid amount)
			alert(
				"Total amount is not valid. Review quantities and make sure none of them is zero or negative"
			);
			return;
		}

		setSubmitting(true);
		// setTxHash(null);
		setTransactionData(null);
		try {
			console.log("Submitting...");

			const tSenderAddress = chainsToTSender[chainId]?.tsender;
			const approvedAmountInWei = await getApprovedAmount(tSenderAddress);

			console.log({
				approvedAmountInWei,
			});

			if (approvedAmountInWei === null) {
				alert("Error fetching approved amount. Please try again.");
				return;
			}

			if (approvedAmountInWei < totalAmountInWei) {
				try {
					const approvalHash = await writeContractAsync({
						abi: erc20Abi,
						address: tokenAddressInputValue as `0x${string}`,
						functionName: "approve",
						args: [tSenderAddress, BigInt(totalAmountInWei)],
					});

					const approvalReceipt = await waitForTransactionReceipt(config, {
						hash: approvalHash,
					});

					console.log("Approval confirmed:", approvalReceipt);
				} catch (error) {
					console.error("Error approving tokens:", error);
					// TODO: handle error
					return;
				}
			}

			try {
				const transferTxHash = await writeContractAsync({
					abi: tsenderAbi,
					address: tSenderAddress as `0x${string}`,
					functionName: "airdropERC20",
					args: [
						tokenAddressInputValue,
						splitRecipients(recipientsInputValue),
						splitAmounts(amountsInputValue).map((v) => parseEther(v)),
						totalAmountInWei,
					],
				});

				const transferReceipt = await waitForTransactionReceipt(config, {
					hash: transferTxHash,
				});

				if (transferReceipt.status === "success") {
					console.log("Transfer confirmed:", transferReceipt);
				} else {
					console.log("Transfer failed:", transferReceipt);
				}

				if (tokenData.isError) {
					throw new Error(
						String(tokenData.failureReason) || "Failed to fetch token data"
					);
				}

				// Create transaction data with proper arrays for multiple recipients/amounts
				const recipients = splitRecipients(recipientsInputValue);
				const amounts = splitAmounts(amountsInputValue);

				const txData: TransactionData = {
					tokenAddress: tokenAddressInputValue,
					recipient:
						recipients.length > 1 ? recipients : recipients[0] || "unknown",
					amountWei:
						amounts.length > 1
							? amounts.map((a) => parseEther(a).toString())
							: parseEther(amounts[0] || "0").toString(),
					amountTokens: amounts.length > 1 ? amounts : amounts[0],
					tokenName: (tokenData.data?.[0]?.result as string) || "Unknown",
					tokenSymbol: (tokenData.data?.[1]?.result as string) || "Unknown",
				};

				setTransactionData(txData);
			} catch (error) {
				console.error("Error transferring tokens:", error);
				// TODO: handle error, specially when insufficient funds
			}

			// Clear form on success
			// setForm({
			// 	recipient: "",
			// 	tokenAddress: "",
			// 	amount: "",
			// });
		} catch (err) {
			console.error(err);
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
