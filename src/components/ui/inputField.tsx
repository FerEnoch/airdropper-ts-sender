"use client";

import { memo } from "react";

export interface InputFieldProps {
	label: string;
	placeholder?: string;
	type?: React.HTMLInputTypeAttribute;
	value: string;
	large?: boolean; // if true render textarea
	onChain?: boolean; // display on-chain badge
	onChange: (value: string) => void; // parent state handler
	name?: string; // optional name/id hook up
	disabled?: boolean;
	required?: boolean;
	className?: string;
}

export function InputField({
	label,
	placeholder,
	type = "text",
	value,
	large = false,
	onChain = false,
	onChange,
	name,
	disabled,
	required,
	className = "",
}: InputFieldProps) {
	const id = name || label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

	const baseStyles =
		"w-full rounded-md border border-zinc-300 bg-white/5 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition";

	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			<label
				htmlFor={id}
				className="flex items-center gap-2 text-sm font-medium text-zinc-200"
			>
				<span>{label}</span>
				{onChain && (
					<span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-inset ring-emerald-500/40">
						on-chain
					</span>
				)}
				{required && <span className="text-rose-400">*</span>}
			</label>
			{large ? (
				<textarea
					id={id}
					name={name}
					placeholder={placeholder}
					value={value}
					disabled={disabled}
					required={required}
					onChange={(e) => onChange(e.target.value)}
					rows={4}
					className={`${baseStyles} resize-y min-h-[120px] font-mono`}
				/>
			) : (
				<input
					id={id}
					name={name}
					type={type}
					placeholder={placeholder}
					value={value}
					disabled={disabled}
					required={required}
					onChange={(e) => onChange(e.target.value)}
					className={baseStyles}
				/>
			)}
		</div>
	);
}
