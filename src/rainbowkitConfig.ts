import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, zksync } from "wagmi/chains";

export default getDefaultConfig({
  appName: "TS-Sender",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_REOWN_PROJECT_ID!,
  chains: [anvil, zksync],
  ssr: false,
});
