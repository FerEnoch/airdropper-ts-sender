interface SubmitButtonProps {
	disabled?: boolean;
	loading?: boolean;
	loadingText?: string;
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
}

export function SubmitButton({
	disabled = false,
	loading = false,
	loadingText = "Loading...",
	children,
	className = "",
	onClick,
	type = "submit",
}: SubmitButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled || loading}
			onClick={onClick}
			className={`inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
		>
			{loading && (
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
			)}
			<span>{loading ? loadingText : children}</span>
		</button>
	);
}
