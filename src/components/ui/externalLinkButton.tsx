import { type ExternalLinkButtonProps } from "@/types";

export type { ExternalLinkButtonProps } from "@/types";

export function ExternalLinkButton({
	href,
	title = "Open in new tab",
	className = "",
	iconSize = "w-3 h-3",
}: ExternalLinkButtonProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors ${className}`}
			title={title}
		>
			<svg
				className={`${iconSize} text-zinc-400`}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				/>
			</svg>
		</a>
	);
}
