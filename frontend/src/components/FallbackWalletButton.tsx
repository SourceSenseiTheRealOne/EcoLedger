import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink } from "lucide-react";
import { useState } from "react";

export const FallbackWalletButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleFallbackConnect = () => {
    setIsConnecting(true);
    
    // Open VeWorld wallet directly
    const veWorldUrl = 'https://www.veworld.net/';
    window.open(veWorldUrl, '_blank');
    
    // Show instructions
    setTimeout(() => {
      alert(
        'Please:\n' +
        '1. Install VeWorld wallet from the opened page\n' +
        '2. Create or import your wallet\n' +
        '3. Switch to VeChain Testnet\n' +
        '4. Return to this page and try connecting again'
      );
      setIsConnecting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleFallbackConnect}
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={isConnecting}
      >
        <ExternalLink className="w-4 h-4" />
        {isConnecting ? 'Opening...' : 'Install VeWorld'}
      </Button>
      <p className="text-xs text-muted-foreground text-right max-w-32">
        Alternative wallet connection method
      </p>
    </div>
  );
};
