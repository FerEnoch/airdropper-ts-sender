import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";

// test seed phrase for anvil
const SEED_PHRASE =
	"test test test test test test test test test test test junk";
const PASSWORD = "Tester@1234";

// Define basic setup
export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
	// Create a new Metamask instance
	const metamask = new MetaMask(context, walletPage, PASSWORD);

	// Import the seed phrase
	await metamask.importWallet(SEED_PHRASE);
});
