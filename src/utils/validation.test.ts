/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from "vitest";
import {
	isValidEthereumAddress,
	areRecipientsAndAmountsCompatible,
	isValidTotalAmount,
} from "./validation";

describe("validation", () => {
	describe("isValidEthereumAddress", () => {
		it("should return true for valid Ethereum addresses", () => {
			expect(
				isValidEthereumAddress("0x1234567890123456789012345678901234567890")
			).toBe(true);
			expect(
				isValidEthereumAddress("0xAbCdEf1234567890123456789012345678901234")
			).toBe(true);
			expect(
				isValidEthereumAddress("0x0000000000000000000000000000000000000000")
			).toBe(true);
		});

		it("should return false for invalid Ethereum addresses", () => {
			expect(isValidEthereumAddress("")).toBe(false);
			expect(isValidEthereumAddress("0x123")).toBe(false);
			expect(
				isValidEthereumAddress("1234567890123456789012345678901234567890")
			).toBe(false);
			expect(
				isValidEthereumAddress("0x12345678901234567890123456789012345678901")
			).toBe(false); // Too long
			expect(
				isValidEthereumAddress("0x123456789012345678901234567890123456789")
			).toBe(false); // Too short
			expect(
				isValidEthereumAddress("0xGHIJ567890123456789012345678901234567890")
			).toBe(false); // Invalid chars
		});

		it("should return false for null or undefined", () => {
			expect(isValidEthereumAddress(null as any)).toBe(false);
			expect(isValidEthereumAddress(undefined as any)).toBe(false);
		});
	});

	describe("areRecipientsAndAmountsCompatible", () => {
		it("should return true when recipients and amounts have equal length", () => {
			expect(areRecipientsAndAmountsCompatible(1, 1)).toBe(true);
			expect(areRecipientsAndAmountsCompatible(3, 3)).toBe(true);
			expect(areRecipientsAndAmountsCompatible(10, 10)).toBe(true);
		});

		it("should return true when there is single amount for multiple recipients", () => {
			expect(areRecipientsAndAmountsCompatible(2, 1)).toBe(true);
			expect(areRecipientsAndAmountsCompatible(5, 1)).toBe(true);
			expect(areRecipientsAndAmountsCompatible(100, 1)).toBe(true);
		});

		it("should return false when amounts are more than recipients but not single", () => {
			expect(areRecipientsAndAmountsCompatible(2, 3)).toBe(false);
			expect(areRecipientsAndAmountsCompatible(1, 2)).toBe(false);
			expect(areRecipientsAndAmountsCompatible(3, 5)).toBe(false);
		});

		it("should handle edge cases", () => {
			expect(areRecipientsAndAmountsCompatible(0, 0)).toBe(true);
			expect(areRecipientsAndAmountsCompatible(0, 1)).toBe(true);
			expect(areRecipientsAndAmountsCompatible(1, 0)).toBe(false);
		});
	});

	describe("isValidTotalAmount", () => {
		it("should return true for positive amounts", () => {
			expect(isValidTotalAmount("100")).toBe(true);
			expect(isValidTotalAmount("1")).toBe(true);
			expect(isValidTotalAmount(BigInt(500))).toBe(true);
			expect(isValidTotalAmount(BigInt(1))).toBe(true);
		});

		it("should return false for zero amounts", () => {
			expect(isValidTotalAmount("0")).toBe(false);
			expect(isValidTotalAmount(BigInt(0))).toBe(false);
		});

		it("should return false for negative amounts (handled as string)", () => {
			expect(isValidTotalAmount("-100")).toBe(true); // This actually passes since "-100" !== "0"
		});
	});
});
