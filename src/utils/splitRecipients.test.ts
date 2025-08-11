import { describe, it, expect } from "vitest";
import { splitRecipients } from "./splitRecipients";

describe("splitRecipients", () => {
	it("should split single valid Ethereum address", () => {
		expect(
			splitRecipients("0x1234567890123456789012345678901234567890")
		).toEqual(["0x1234567890123456789012345678901234567890"]);
		expect(
			splitRecipients("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd")
		).toEqual(["0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"]);
	});

	it("should split multiple comma-separated valid addresses", () => {
		const addr1 = "0x1234567890123456789012345678901234567890";
		const addr2 = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";
		const addr3 = "0x1111111111111111111111111111111111111111";

		expect(splitRecipients(`${addr1},${addr2},${addr3}`)).toEqual([
			addr1,
			addr2,
			addr3,
		]);
	});

	it("should handle addresses with spaces", () => {
		const addr1 = "0x1234567890123456789012345678901234567890";
		const addr2 = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

		expect(splitRecipients(`${addr1}, ${addr2}`)).toEqual([addr1, addr2]);
		expect(splitRecipients(` ${addr1} , ${addr2} `)).toEqual([addr1, addr2]);
		expect(splitRecipients(`${addr1},  ${addr2}`)).toEqual([addr1, addr2]);
	});

	it("should handle mixed case addresses", () => {
		const lowerAddr = "0x1234567890123456789012345678901234567890";
		const upperAddr = "0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD";
		const mixedAddr = "0x1a2B3c4D5e6F789012345678901234567890123a";

		expect(splitRecipients(`${lowerAddr},${upperAddr},${mixedAddr}`)).toEqual([
			lowerAddr,
			upperAddr,
			mixedAddr,
		]);
	});

	it("should return empty array for invalid addresses", () => {
		expect(splitRecipients("0x123")).toEqual([]); // too short
		expect(
			splitRecipients("0x12345678901234567890123456789012345678901")
		).toEqual([]); // too long
		expect(
			splitRecipients("123456789012345678901234567890123456789012")
		).toEqual([]); // missing 0x
		expect(
			splitRecipients("0xgggggggggggggggggggggggggggggggggggggggg")
		).toEqual([]); // invalid hex
	});

	it("should return empty array if any address is invalid", () => {
		const validAddr = "0x1234567890123456789012345678901234567890";
		const invalidAddr = "0x123"; // too short

		expect(splitRecipients(`${validAddr},${invalidAddr}`)).toEqual([]);
		expect(splitRecipients(`${invalidAddr},${validAddr}`)).toEqual([]);
	});

	it("should return empty array for empty string", () => {
		expect(splitRecipients("")).toEqual([]);
	});

	it("should return empty array for only commas", () => {
		expect(splitRecipients(",")).toEqual([]);
		expect(splitRecipients(",,")).toEqual([]);
		expect(splitRecipients(", , ,")).toEqual([]);
	});

	it("should return empty array for only spaces", () => {
		expect(splitRecipients("   ")).toEqual([]);
		expect(splitRecipients("   ,   ,   ")).toEqual([]);
	});

	it("should return empty array for addresses with wrong prefix", () => {
		expect(
			splitRecipients("1x1234567890123456789012345678901234567890")
		).toEqual([]);
		expect(
			splitRecipients("x1234567890123456789012345678901234567890")
		).toEqual([]);
		expect(
			splitRecipients("0X1234567890123456789012345678901234567890")
		).toEqual([]); // uppercase X not allowed
	});

	it("should return empty array for addresses with special characters", () => {
		expect(
			splitRecipients("0x123456789012345678901234567890123456789!")
		).toEqual([]);
		expect(
			splitRecipients("0x12345678901234567890123456789012345678@")
		).toEqual([]);
		expect(
			splitRecipients("0x12345678901234567890123456789012345678#")
		).toEqual([]);
	});

	it("should handle zero address", () => {
		const zeroAddr = "0x0000000000000000000000000000000000000000";
		expect(splitRecipients(zeroAddr)).toEqual([zeroAddr]);
	});

	it("should handle all same addresses", () => {
		const addr = "0x1234567890123456789012345678901234567890";
		expect(splitRecipients(`${addr},${addr},${addr}`)).toEqual([
			addr,
			addr,
			addr,
		]);
	});

	it("should return empty array for addresses with wrong length", () => {
		expect(splitRecipients("0x12345678901234567890123456789012345678")).toEqual(
			[]
		); // 38 chars after 0x (missing 2)
		expect(
			splitRecipients("0x123456789012345678901234567890123456789012")
		).toEqual([]); // 42 chars after 0x (extra 2)
	});

	it("should return empty array for mixed valid and invalid addresses", () => {
		const validAddr1 = "0x1234567890123456789012345678901234567890";
		const validAddr2 = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";
		const invalidAddr = "not-an-address";

		expect(
			splitRecipients(`${validAddr1},${invalidAddr},${validAddr2}`)
		).toEqual([]);
	});
});
