import { describe, it, expect } from "vitest";
import { splitAmounts } from "./splitAmounts";

describe("splitAmounts", () => {
	it("should split single valid amount", () => {
		expect(splitAmounts("100")).toEqual(["100"]);
		expect(splitAmounts("0")).toEqual(["0"]);
		expect(splitAmounts("999999")).toEqual(["999999"]);
	});

	it("should split multiple comma-separated amounts", () => {
		expect(splitAmounts("100,200,300")).toEqual(["100", "200", "300"]);
		expect(splitAmounts("1,2,3,4,5")).toEqual(["1", "2", "3", "4", "5"]);
		expect(splitAmounts("0,100,0")).toEqual(["0", "100", "0"]);
	});

	it("should handle amounts with spaces", () => {
		expect(splitAmounts("100, 200, 300")).toEqual(["100", "200", "300"]);
		expect(splitAmounts(" 100 , 200 , 300 ")).toEqual(["100", "200", "300"]);
		expect(splitAmounts("1,  2,   3")).toEqual(["1", "2", "3"]);
	});

	it("should return empty array for invalid amounts", () => {
		expect(splitAmounts("abc")).toEqual([]);
		expect(splitAmounts("100,abc,300")).toEqual([]);
		expect(splitAmounts("hello,world")).toEqual([]);
		expect(splitAmounts("100.5")).toEqual([]); // decimals not allowed
		expect(splitAmounts("1.5,2.5")).toEqual([]); // decimals not allowed
	});

	it("should return empty array for negative amounts", () => {
		expect(splitAmounts("-100")).toEqual([]);
		expect(splitAmounts("100,-200,300")).toEqual([]);
		expect(splitAmounts("-1,-2,-3")).toEqual([]);
	});

	it("should return empty array for empty string", () => {
		expect(splitAmounts("")).toEqual([]);
	});

	it("should return empty array for only commas", () => {
		expect(splitAmounts(",")).toEqual([]);
		expect(splitAmounts(",,")).toEqual([]);
		expect(splitAmounts(", , ,")).toEqual([]);
	});

	it("should return empty array for only spaces", () => {
		expect(splitAmounts("   ")).toEqual([]);
		expect(splitAmounts("   ,   ,   ")).toEqual([]);
	});

	it("should return empty array for amounts with special characters", () => {
		expect(splitAmounts("100$")).toEqual([]);
		expect(splitAmounts("100,200$,300")).toEqual([]);
		expect(splitAmounts("$100")).toEqual([]);
	});

	it("should handle very large amounts", () => {
		expect(splitAmounts("1000000,2000000")).toEqual(["1000000", "2000000"]);
		expect(splitAmounts("999999999999999999")).toEqual(["999999999999999999"]);
	});

	it("should return empty array for scientific notation", () => {
		expect(splitAmounts("1e2")).toEqual([]); // scientific notation not allowed
		expect(splitAmounts("100,1e2,300")).toEqual([]);
	});

	it("should handle leading zeros", () => {
		expect(splitAmounts("0")).toEqual(["0"]); // single zero is valid
		expect(splitAmounts("00")).toEqual(["00"]); // leading zeros are valid (still digits)
		expect(splitAmounts("01")).toEqual(["01"]); // leading zeros are valid (still digits)
		expect(splitAmounts("100,001,300")).toEqual(["100", "001", "300"]);
	});
});
