import { ConnectButton } from "@/components/ui/connectButton";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">TS-Sender</h1>
      <ConnectButton />
    </header>
  );
}
