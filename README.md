# Token-sender airdropper

This is a simple airdropper for sending ERC20 tokens to a single or multiple recipients.
This project is part of the full-stack-web3 course of [Cyfrin Updraft](https://updraft.cyfrin.io/courses/full-stack-web3-development-crash-course) - [github repo](https://github.com/Cyfrin/ts-tsender-ui-cu) 

## Features

- Send ERC20 tokens to multiple addresses
- Check token balances
- Approve token transfers

## Tech Stack

Make sure you have the correct version of Node.js installed. You can use [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It uses [Tailwind CSS](https://tailwindcss.com/) for styling, and [Typescript](https://www.typescriptlang.org/) for type safety.

### web3

You'll want to make sure you have a Metamask/Rabby wallet connected to your anvil instance. Ideally you're connected to the wallet that comes with the default anvil instance. This will have some mock tokens in it.

This project uses [rainbowkit](https://www.rainbowkit.com/) for wallet connection and management, [wagmi](https://wagmi.sh/) for React hooks and interacting with the Ethereum blockchain (with [viem](https://viem.sh/) on the background).

You need to have anvil installed.
- [anvil](https://book.getfoundry.sh/anvil/)
    - You'll know you've installed it right if you can run `anvil --version` and get a response like `anvil 0.3.0 (5a8bd89 2024-12-20T08:45:53.195623000Z)`


## Getting Started

### Environment Variables

You'll need a `.env.local` the following environment variables:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Project ID from [reown cloud](https://cloud.reown.com/)

## Setup

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Tests
For unit testing, simply run:

```bash
pnpm test:unit
```

For e2e testing, note that you've to make sure your anvil instance is up and running!

The e2e setup with "xvfb-run" is usable with WSL. Not sure if it works on other environments.

Please, for troubleshooting see the [course repo](https://github.com/Cyfrin/ts-tsender-ui-cu) or [official Synpress documentation](https://docs.synpress.io/docs/known-issues).

```bash
pnpm test:e2e
```

This will throw an error like:

```
Error: Cache for 08a20e3c7fc77e6ae298 does not exist. Create it first!
```

The `08a20e3c7fc77e6ae298` is your `CACHE_NAME`

In your `.cache-synpress` folder, rename the folder that isn't `metamask-chrome-***` to your `CACHE_NAME`.

Then, you should be able to run:

```
pnpm test:e2e
```

And it'll work!

# Anvil Setup

```bash
pnpm start-anvil # This will start a locally running anvil server, with TSender deployed
```

## tsender-deployed.json

The `tsender-deployed.json` object is a starting state for testing and working with the UI.

- TSender: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Mock token address: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` (can use the `mint` or `mintTo` function)
- The anvil1 default address (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`) with private key `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` has some tokens already minted.

```solidity
    uint256 MINT_AMOUNT = 1e18;

    function mint() external {
        _mint(msg.sender, MINT_AMOUNT);
    }

    function mintTo(address to, uint256 amount) external {
        _mint(to, amount);
    }
```