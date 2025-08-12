import { describe, it, expect } from "vitest";
import { generateIdFromLabel } from "./domHelpers";

describe("domHelpers", () => {
	describe("generateIdFromLabel", () => {
		it("should convert basic labels to lowercase with hyphens", () => {
			expect(generateIdFromLabel("Token Address")).toBe("token-address");
			expect(generateIdFromLabel("Recipient Email")).toBe("recipient-email");
			expect(generateIdFromLabel("Amount")).toBe("amount");
		});

		it("should handle multiple spaces and special characters", () => {
			expect(generateIdFromLabel("Token  Address  Input")).toBe(
				"token-address-input"
			);
			expect(generateIdFromLabel("Email@Domain.com")).toBe("email-domain-com");
			expect(generateIdFromLabel("Amount (in ETH)")).toBe("amount-in-eth");
		});

		it("should handle numbers", () => {
			expect(generateIdFromLabel("Input123Field")).toBe("input123field");
			expect(generateIdFromLabel("Field 1 Name")).toBe("field-1-name");
		});

		it("should handle edge cases", () => {
			expect(generateIdFromLabel("")).toBe("");
			expect(generateIdFromLabel("   ")).toBe("");
			expect(generateIdFromLabel("123")).toBe("123");
			expect(generateIdFromLabel("!@#$%^&*()")).toBe("");
		});

		it("should remove leading and trailing hyphens from consecutive special chars", () => {
			expect(generateIdFromLabel("@Token Address!")).toBe("token-address");
			expect(generateIdFromLabel("***Label***")).toBe("label");
		});
	});
});
