# Playwright + MetaMask Testing Setup

## Overview
This project uses Synpress for testing Web3 applications with MetaMask in Playwright. The MetaMask extension is automatically injected into the browser context by Synpress.

## Configuration

### Playwright Config
- **Headless**: Set to `false` (required for browser extensions)
- **Workers**: Set to `1` (wallet tests must run sequentially)
- **Parallel**: Set to `false` (prevents wallet state conflicts)

### MetaMask Setup
- Synpress automatically installs and configures MetaMask
- Test wallet uses a known seed phrase for consistent testing
- Extension ID is provided automatically by Synpress

## Running Tests

### Start local blockchain (required)
```bash
pnpm start-anvil
```

### Run E2E tests with UI
```bash
pnpm test:e2e
```

### Run specific test file
```bash
pnpm exec playwright test test/metamask-setup.spec.ts --ui
```

## Test Structure

### Basic Setup (`/test/wallet-setup/basic.setup.ts`)
- Defines wallet password and seed phrase
- Imports test wallet into MetaMask
- Sets up initial wallet state

### Test Examples

#### Connection Test
```typescript
const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
await page.goto("/");
await page.getByTestId("rk-connect-button").click();
await page.getByTestId("rk-wallet-option-metaMask").click();
await metamask.connectToDapp();
```

#### Network Management
```typescript
const customNetwork = {
  name: "Anvil",
  rpcUrl: "http://localhost:8545", 
  chainId: 31337,
  symbol: "ETH"
};
await metamask.addNetwork(customNetwork);
```

## Available Test Constants
- `anvilAddress_1`: Pre-funded test address from Anvil
- Test seed phrase: "test test test test test test test test test test test junk"
- Test password: "Tester@1234"

## Troubleshooting

### Common Issues
1. **Extension not loading**: Ensure `headless: false` in playwright.config.ts
2. **Tests failing**: Make sure Anvil is running with the correct state
3. **Wallet connection issues**: Verify the test seed phrase matches Anvil accounts

### Debug Mode
- Use `--ui` flag to see browser interactions
- Check browser console for MetaMask errors
- Verify extension is loaded in browser dev tools
