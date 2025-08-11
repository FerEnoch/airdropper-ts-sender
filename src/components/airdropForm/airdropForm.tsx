"use client";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { useMemo, useState } from "react";
import { InputField } from "@/components/ui/inputField";
import { TxHashDisplay } from "@/components/ui/txHashDisplay";
import { SubmitButton } from "@/components/ui/submitButton";
import { TransactionDetails } from "@/components/ui/transactionDetails";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { formatEther } from "viem";
import { calculateTotal } from "@/utils/calculateTotal";
import { splitRecipients } from "@/utils/splitRecipients";
import { splitAmounts } from "@/utils/splitAmounts";

interface AirdropFormState {
	recipients: string;
	tokenAddress: string;
	amounts: string;
}

interface TransactionData {
	tokenAddress: string;
	recipient: string;
	amountWei: string;
	amountTokens: string;
	tokenName: string;
	tokenSymbol: string;
}

export function AirdropForm() {
	const [{ recipients, tokenAddress, amounts }, setForm] =
		useState<AirdropFormState>({
			recipients: "",
			tokenAddress: "", // Mock-token address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
			amounts: "",
		});
	const [submitting, setSubmitting] = useState(false);
	// const [txHash, setTxHash] = useState<string | null>(null);
	const [transactionData, setTransactionData] =
		useState<TransactionData | null>(null);
	const chainId = useChainId();
	const config = useConfig();
	const userAccount = useAccount();
	const {
		data: txHash,
		isPending,
		error: txError,
		writeContractAsync,
	} = useWriteContract();

	const totalAmount = useMemo(() => {
		return calculateTotal(amounts);
	}, [amounts]);

	function update<K extends keyof AirdropFormState>(
		key: K,
		value: AirdropFormState[K]
	) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function getApprovedAmount(tSenderAddress: string): Promise<number> {
		if (!tSenderAddress) return 0;

		try {
			const approvedAmount = (await readContract(config, {
				abi: erc20Abi,
				address: tokenAddress as `0x${string}`,
				functionName: "allowance",
				args: [userAccount.address, tSenderAddress],
			})) as bigint;

			return parseFloat(formatEther(approvedAmount));
		} catch (error: unknown) {
			// TODO: handle error
			console.error("Error getting approved amount:", error);
			return 0;
		}
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (totalAmount === 0) {
			// TODO: Handle zero total amount (aka not-valid amount)
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

			if (approvedAmountInWei * 1e18 < totalAmount) {
				try {
					const approvalHash = await writeContractAsync({
						abi: erc20Abi,
						address: tokenAddress as `0x${string}`,
						functionName: "approve",
						args: [tSenderAddress, BigInt(totalAmount)],
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
						tokenAddress,
						splitRecipients(recipients),
						splitAmounts(amounts),
						BigInt(totalAmount),
					],
				});

				const transferReceipt = await waitForTransactionReceipt(config, {
					hash: transferTxHash,
				});

				console.log("Transfer confirmed:", transferReceipt);

				// TODO: split accordingly for every address
				const txData: TransactionData = {
					tokenAddress,
					recipient: recipients,
					amountWei: amounts,
					amountTokens: (parseFloat(amounts) / 1e18).toFixed(6), // Convert wei to tokens (assuming 18 decimals)
					tokenName: "Sample Token", // This would come from contract call
					tokenSymbol: "SMPL", // This would come from contract call
				};

				// setTxHash(transferReceipt.transactionHash);
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

	const isValid = recipients && amounts;

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
					value={tokenAddress}
					onChange={(v) => update("tokenAddress", v)}
					onChain
					required
					className=""
				/>
				<InputField
					label="Recipient Address (optional CSV addresses)"
					name="recipient"
					placeholder="0x..."
					value={recipients}
					onChange={(v) => update("recipients", v)}
					onChain
					required
					className=""
				/>
				<InputField
					label="Amount (wei; optional CSV amounts)"
					name="amount"
					type="text"
					placeholder="e.g. 10"
					value={amounts}
					onChange={(v) => update("amounts", v)}
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
