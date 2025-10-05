import { Button } from "@/components/ui/button";
import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";
import { Wallet, User, AlertCircle } from "lucide-react";
import { humanAddress } from "@/util/formatting";
import { useState } from "react";

export const DAppKitWalletButton = () => {
  const { account } = useWallet();
  const { open } = useWalletModal();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await open();
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet. Please try again or use a different wallet.');
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          onClick={handleConnect}
          variant="default"
          size="sm"
          className="gap-2"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
        {error && (
          <div className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
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


