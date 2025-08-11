import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
	it("should calculate total for single valid number", () => {
		expect(calculateTotal("10")).toBe(10);
		expect(calculateTotal("5.5")).toBe(5.5);
		expect(calculateTotal("0")).toBe(0);
	});

	it("should calculate total for multiple comma-separated values", () => {
		expect(calculateTotal("1,2,3")).toBe(6);
		expect(calculateTotal("10,20,30")).toBe(60);
		expect(calculateTotal("1.5,2.5,3")).toBe(7);
	});

	it("should handle values with spaces", () => {
		expect(calculateTotal("1, 2, 3")).toBe(6);
		expect(calculateTotal(" 10 , 20 , 30 ")).toBe(60);
		expect(calculateTotal("1.5,  2.5,   3")).toBe(7);
	});

	it("should return 0 for invalid number strings", () => {
		expect(calculateTotal("abc")).toBe(0);
		expect(calculateTotal("1,abc,3")).toBe(0);
		expect(calculateTotal("hello,world")).toBe(0);
	});

	it("should return 0 for empty string", () => {
		expect(calculateTotal("")).toBe(0);
	});

	it("should handle negative numbers", () => {
		expect(calculateTotal("-5")).toBe(0);
		expect(calculateTotal("10,-5,3")).toBe(0);
		expect(calculateTotal("-1,-2,-3")).toBe(0);
	});

	it("should handle decimal numbers", () => {
		expect(calculateTotal("1.1,2.2,3.3")).toBeCloseTo(6.6);
		expect(calculateTotal("0.1,0.2,0.3")).toBeCloseTo(0.6);
	});

	it("should handle mixed valid and zero values", () => {
		expect(calculateTotal("5,0,3")).toBe(0);
		expect(calculateTotal("0,0,0")).toBe(0);
	});

	it("should handle single comma", () => {
		expect(calculateTotal(",")).toBe(0);
	});

	it("should handle only commas and spaces", () => {
		expect(calculateTotal(", , ,")).toBe(0);
		expect(calculateTotal("   ,   ,   ")).toBe(0);
	});

	it("should handle very large numbers", () => {
		expect(calculateTotal("1000000,2000000")).toBe(3000000);
	});

	it("should handle scientific notation", () => {
		expect(calculateTotal("1e2,2e2")).toBe(300); // 100 + 200
		expect(calculateTotal("1e-2,2e-2")).toBeCloseTo(0.03); // 0.01 + 0.02
	});
});
