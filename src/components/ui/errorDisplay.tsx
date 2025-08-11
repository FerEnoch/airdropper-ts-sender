interface ErrorDisplayProps {
	error: string | null;
	onDismiss: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
	if (!error) return null;

	return (
		<div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
			<div className="flex items-start justify-between">
				<div className="flex items-start space-x-3">
					<svg
						className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div>
						<h3 className="text-sm font-semibold text-red-400 mb-1">Error</h3>
						<p className="text-xs text-red-300">{error}</p>
					</div>
				</div>
				<button
					onClick={onDismiss}
					className="text-red-400 hover:text-red-300 transition-colors"
					title="Dismiss error"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
