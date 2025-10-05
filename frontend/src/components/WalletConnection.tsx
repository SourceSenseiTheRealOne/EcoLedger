import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Key, Copy, Check } from 'lucide-react';
import { vechainService } from '@/services/vechain-simple';

interface WalletConnectionProps {
  onWalletConnected: (address: string) => void;
  onWalletDisconnected: () => void;
}

export const WalletConnection = ({ onWalletConnected, onWalletDisconnected }: WalletConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [privateKey, setPrivateKey] = useState('');
  const [newWallet, setNewWallet] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if wallet is already connected
    if (vechainService.isWalletConnected()) {
      const address = vechainService.getWalletAddress();
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        onWalletConnected(address);
      }
    }
  }, [onWalletConnected]);

  const handleConnectWallet = () => {
    if (!privateKey.trim()) {
      setError('Please enter a private key');
      return;
    }

    try {
      vechainService.setPrivateKey(privateKey);
      const address = vechainService.getWalletAddress();
      
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        onWalletConnected(address);
        setError('');
      } else {
        setError('Invalid private key');
      }
    } catch (err) {
      setError('Invalid private key format');
    }
  };

  const handleDisconnectWallet = () => {
    vechainService.setPrivateKey('');
    setWalletAddress('');
    setIsConnected(false);
    setPrivateKey('');
    onWalletDisconnected();
  };

  const handleGenerateWallet = () => {
    const wallet = vechainService.generateWallet();
    setNewWallet(wallet);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-500" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Your wallet is connected to VeChain Testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Wallet Address</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={walletAddress}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyToClipboard(walletAddress)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={handleDisconnectWallet}
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Connect to VeChain
        </CardTitle>
        <CardDescription>
          Connect your wallet to interact with the EcoLedger smart contract
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="privateKey">Private Key</Label>
          <Input
            id="privateKey"
            type="password"
            placeholder="Enter your private key (0x...)"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your private key is stored locally and never sent to our servers
          </p>
        </div>

        <Button 
          onClick={handleConnectWallet}
          className="w-full"
          disabled={!privateKey.trim()}
        >
          Connect Wallet
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={handleGenerateWallet}
          className="w-full"
        >
          Generate New Wallet
        </Button>

        {newWallet && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium">New Wallet Generated</div>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={newWallet.address}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(newWallet.address)}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-xs">Private Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={newWallet.privateKey}
                    readOnly
                    className="font-mono text-xs"
                    type="password"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(newWallet.privateKey)}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs">Mnemonic (Keep Safe!)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={newWallet.mnemonic}
                    readOnly
                    className="font-mono text-xs"
                    type="password"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(newWallet.mnemonic)}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => {
                setPrivateKey(newWallet.privateKey);
                setNewWallet(null);
              }}
              className="w-full"
            >
              Use This Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
