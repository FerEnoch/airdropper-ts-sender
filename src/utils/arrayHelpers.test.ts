import { describe, it, expect } from "vitest";
import {
	normalizeRecipients,
	normalizeAmounts,
	calculateTotalFromAmounts,
} from "./arrayHelpers";

describe("arrayHelpers", () => {
	describe("normalizeRecipients", () => {
		it("should return array as is when input is already an array", () => {
			const recipients = ["0x123", "0x456", "0x789"];
			expect(normalizeRecipients(recipients)).toEqual(recipients);
			expect(normalizeRecipients(recipients)).not.toBe(recipients); // Should be a new array
		});

		it("should convert single string to array", () => {
			expect(normalizeRecipients("0x123")).toEqual(["0x123"]);
		});

		it("should handle empty string", () => {
			expect(normalizeRecipients("")).toEqual([""]);
		});
	});

	describe("normalizeAmounts", () => {
		it("should return array as is when input is already an array", () => {
			const amounts = ["10", "20", "30"];
			expect(normalizeAmounts(amounts)).toEqual(amounts);
			expect(normalizeAmounts(amounts)).not.toBe(amounts); // Should be a new array
		});

		it("should convert single string to array", () => {
			expect(normalizeAmounts("100")).toEqual(["100"]);
		});

		it("should handle empty string", () => {
			expect(normalizeAmounts("")).toEqual([""]);
		});
	});

	describe("calculateTotalFromAmounts", () => {
		it("should calculate total from array of valid amounts", () => {
			expect(calculateTotalFromAmounts(["10", "20", "30"])).toBe(60);
			expect(calculateTotalFromAmounts(["5.5", "4.5"])).toBe(10);
			expect(calculateTotalFromAmounts(["100"])).toBe(100);
		});

		it("should handle empty array", () => {
			expect(calculateTotalFromAmounts([])).toBe(0);
		});

		it("should handle zero amounts", () => {
			expect(calculateTotalFromAmounts(["0", "0", "0"])).toBe(0);
			expect(calculateTotalFromAmounts(["10", "0", "5"])).toBe(15);
		});

		it("should handle decimal amounts", () => {
			expect(calculateTotalFromAmounts(["1.5", "2.5", "3.0"])).toBe(7);
			expect(calculateTotalFromAmounts(["0.1", "0.2", "0.3"])).toBeCloseTo(
				0.6,
				5
			);
		});

		it("should handle invalid amounts by treating them as NaN (which becomes 0 in sum)", () => {
			expect(calculateTotalFromAmounts(["10", "invalid", "20"])).toBe(30); // NaN treated as 0: 10 + 0 + 20 = 30
			expect(calculateTotalFromAmounts(["invalid", "invalid"])).toBe(0); // NaN + NaN = 0
		});
	});
});
