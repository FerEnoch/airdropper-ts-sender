import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import basicSetup from "./wallet-setup/basic.setup";
import { anvilAddress_1 } from "./test-constants";

// create a test instance with Synpress and Metamask fixtures
const test = testWithSynpress(metaMaskFixtures(basicSetup));

// extract expect function from "test"
const { expect } = test;

// Define a basic test case
test("Should connect wallet to Metamask Test Dapp", async ({
	context,
	page,
	metamaskPage,
	extensionId,
}) => {
	// Create metamask instance
	const metamask = new MetaMask(
		context,
		metamaskPage,
		basicSetup.walletPassword,
		extensionId
	);

	const customNetwork = {
		name: "Anvil",
		rpcUrl: "http://localhost:8545",
		chainId: 31337,
		symbol: "ETH",
	};

	await metamask.addNetwork(customNetwork);

	// Navigate to homepage
	await page.goto("/");

	// click to connect button
	await page.getByTestId("rk-connect-button").first().click();

	await page.getByTestId("rk-wallet-option-metaMask").click();

	// Connect metamask to the dapp
	await metamask.connectToDapp();

	// Wait for the account button to appear after connection
	// Get the account address from the button
	const accountSelector = await page
		.getByTestId("rk-account-button")
		.textContent();

	// Verify the connected account address (might be truncated, so check if it contains part of the address)
	expect(accountSelector).toContain(anvilAddress_1.slice(0, 4)); // Check first 6 characters
	expect(accountSelector).toContain(anvilAddress_1.slice(-4)); // Check last 4 characters
});

test("Homepage has title", async ({ page }) => {
	await page.goto("/");

	const pageTitle = await page.title();

	expect(pageTitle).toBe("TS-Sender");
});

test("Should show the airdrop form when connected, otherwise, not", async ({
	context,
	page,
	metamaskPage,
	extensionId,
}) => {
	// Create metamask instance
	const metamask = new MetaMask(
		context,
		metamaskPage,
		basicSetup.walletPassword,
		extensionId
	);

	const customNetwork = {
		name: "Anvil",
		rpcUrl: "http://localhost:8545",
		chainId: 31337,
		symbol: "ETH",
	};

	await metamask.addNetwork(customNetwork);

	await page.goto("/");

	// Wait for the page to load completely
	await page.waitForLoadState("networkidle");

	const connectWalletText = await page.getByText(
		"To use the airdrop functionality, please connect your Web3 wallet."
	);

	await expect(connectWalletText).toBeVisible();

	// Initially, the airdrop form should not be visible
	await expect(page.getByTestId("airdrop-form")).not.toBeVisible();

	// click to connect button
	await page.getByTestId("rk-connect-button").first().click();

	await page.getByTestId("rk-wallet-option-metaMask").click();
	// connect metamask
	await metamask.connectToDapp();

	// Now the airdrop form should be visible after connection
	await expect(page.getByTestId("airdrop-form")).toBeVisible({
		timeout: 10000,
	});
});
