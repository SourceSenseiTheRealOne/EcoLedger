import { Button } from "@/components/ui/button";
import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";
import { Wallet, User } from "lucide-react";
import { humanAddress } from "@/util/formatting";

export const DAppKitWalletButton = () => {
  const { account } = useWallet();
  const { open } = useWalletModal();

  if (!account) {
    return (
      <Button
        onClick={open}
        variant="default"
        size="sm"
        className="gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        <User className="w-4 h-4 text-green-500" />
        <span className="text-sm font-mono">
          {humanAddress(account, 4, 6)}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={open}
      >
        Manage
      </Button>
    </div>
  );
};


