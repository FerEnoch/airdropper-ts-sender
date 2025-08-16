import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import basicSetup from "./wallet-setup/basic.setup";

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test("MetaMask Extension Setup Verification", async ({
	context,
	page,
	metamaskPage,
	extensionId,
}) => {
	// Verify MetaMask extension is loaded
	expect(extensionId).toBeTruthy();
	console.log(`MetaMask Extension ID: ${extensionId}`);

	// Navigate to the homepage
	await page.goto("/");

	// Verify the page loads
	expect(await page.title()).toBe("TS-Sender");

	// Verify MetaMask is accessible
	expect(metamaskPage).toBeTruthy();

	// Log success
	console.log("✅ MetaMask extension is properly loaded and accessible");
});
