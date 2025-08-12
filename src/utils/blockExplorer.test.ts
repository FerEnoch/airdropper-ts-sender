import { describe, it, expect } from "vitest";
import { defaultBlockExplorerUrl } from "./blockExplorer";

describe("blockExplorer", () => {
	describe("defaultBlockExplorerUrl", () => {
		it("should generate correct etherscan URL for transaction hash", () => {
			const hash =
				"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
			expect(defaultBlockExplorerUrl(hash)).toBe(
				`https://etherscan.io/tx/${hash}`
			);
		});

		it("should handle different hash formats", () => {
			expect(defaultBlockExplorerUrl("0x123")).toBe(
				"https://etherscan.io/tx/0x123"
			);
			expect(defaultBlockExplorerUrl("abc123")).toBe(
				"https://etherscan.io/tx/abc123"
			);
		});

		it("should handle empty string", () => {
			expect(defaultBlockExplorerUrl("")).toBe("https://etherscan.io/tx/");
		});
	});
});
