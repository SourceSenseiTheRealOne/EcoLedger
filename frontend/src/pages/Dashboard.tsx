import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { RegisterProductForm } from '@/components/RegisterProductForm';
import { QRScanner } from '@/components/QRScanner';
import { ProductSelector } from '@/components/ProductSelector';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { WalletConnection } from '@/components/WalletConnection';
import { BlockchainProductCard } from '@/components/BlockchainProductCard';
import { WelcomeModal } from '@/components/WelcomeModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, PlusCircle, ScanLine, Leaf, Database, Wallet, Link, HelpCircle } from 'lucide-react';
import { FrontendProduct } from '@/services/api';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useToast } from '@/hooks/use-toast';

interface BlockchainProduct extends FrontendProduct {
  txHash: string;
}

export default function Dashboard() {
  const [selectedProducts, setSelectedProducts] = useState<FrontendProduct[]>([]);
  const [blockchainProducts, setBlockchainProducts] = useState<BlockchainProduct[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showHelpButton, setShowHelpButton] = useState(false);
  const { toast } = useToast();
  
  const {
    isConnected,
    walletAddress,
    isLoading: blockchainLoading,
    error: blockchainError,
    connectWallet,
    disconnectWallet,
    addProductToBlockchain,
    getUserProductsFromBlockchain,
    getExplorerUrl
  } = useBlockchain();

  const handleProductSelect = (product: FrontendProduct) => {
    setSelectedProducts(prev => [...prev, product]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddToBlockchain = async (product: FrontendProduct) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to add products to the blockchain.",
        variant: "destructive"
      });
      return;
    }

    try {
      const txHash = await addProductToBlockchain(product);
      
      toast({
        title: "Product Added to Blockchain",
        description: `Transaction hash: ${txHash.slice(0, 10)}...`,
      });

      // Add to blockchain products list with transaction hash
      const blockchainProduct: BlockchainProduct = {
        ...product,
        txHash
      };
      setBlockchainProducts(prev => [...prev, blockchainProduct]);
      
      // Remove from selected products
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
      
    } catch (error) {
      toast({
        title: "Blockchain Error",
        description: error instanceof Error ? error.message : "Failed to add product to blockchain",
        variant: "destructive"
      });
    }
  };

  const handleViewExplorer = (txHash: string) => {
    // Show a helpful message about demo mode
    toast({
      title: "Demo Mode - Simulated Transaction",
      description: `This is a demo transaction hash: ${txHash.slice(0, 10)}... In production, this would open the real VeChain explorer.`,
      duration: 5000,
    });
    
    // Still open the explorer for demonstration purposes
    const explorerUrl = getExplorerUrl(txHash);
    window.open(explorerUrl, '_blank');
  };

  // Check if it's the first time opening the app
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('ecoledger-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    } else {
      setShowHelpButton(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('ecoledger-welcome-seen', 'true');
    setShowHelpButton(true);
  };

  const handleStartTutorial = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('ecoledger-welcome-seen', 'true');
    setShowHelpButton(true);
    // You could add additional tutorial logic here
  };

  const handleShowHelp = () => {
    setShowWelcomeModal(true);
  };

  const totalProducts = selectedProducts.length;
  const avgEcoScore = totalProducts > 0 ? Math.round(
    selectedProducts.reduce((sum, p) => sum + p.ecoScore, 0) / totalProducts
  ) : 0;
  const totalCarbonSaved = selectedProducts.reduce((sum, p) => sum + p.carbonFootprint, 0).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  EcoLedger
                </h1>
                <p className="text-xs text-muted-foreground">Blockchain Sustainability Platform</p>
              </div>
            </div>
            
            {showHelpButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowHelp}
                className="gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Help & Tutorial
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground mb-1">Total Products</p>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground mb-1">Avg EcoScore</p>
            <p className="text-3xl font-bold text-success">{avgEcoScore}/100</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground mb-1">Carbon Tracked</p>
            <p className="text-3xl font-bold">{totalCarbonSaved} kg CO₂</p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-6">
            <TabsTrigger value="products" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="gap-2">
              <Link className="w-4 h-4" />
              Blockchain
            </TabsTrigger>
            <TabsTrigger value="add" className="gap-2">
              <Database className="w-4 h-4" />
              Add from DB
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-2">
              <Wallet className="w-4 h-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="register" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Register
            </TabsTrigger>
            <TabsTrigger value="scan" className="gap-2">
              <ScanLine className="w-4 h-4" />
              Scanner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Product Registry</h2>
              {selectedProducts.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProducts([])}
                  className="text-sm"
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {selectedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No products selected</h3>
                <p className="text-muted-foreground mb-4">
                  Add products from the database or register new ones to get started.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => document.querySelector('[value="add"]')?.click()}>
                    <Database className="w-4 h-4 mr-2" />
                    Add from Database
                  </Button>
                  <Button variant="outline" onClick={() => document.querySelector('[value="register"]')?.click()}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Register New
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard {...product} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <QRCodeGenerator product={product} />
                        {isConnected && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAddToBlockchain(product)}
                            disabled={blockchainLoading}
                            className="h-8 px-2 text-xs"
                          >
                            <Link className="w-3 h-3 mr-1" />
                            Add to Chain
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="h-8 w-8 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Blockchain Products</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {isConnected ? `Connected: ${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}` : 'Not connected'}
                </div>
                {blockchainProducts.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setBlockchainProducts([])}
                    className="text-sm"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
            
            {/* Demo Notice */}
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-amber-600">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">Demo Mode - Simulated Blockchain</h4>
                  <p className="text-sm text-amber-700 mb-2">
                    This is a demonstration version for the VeChain hackathon. Transaction hashes are simulated 
                    and won't appear in the VeChain explorer. In production, this would connect to the real VeChain blockchain.
                  </p>
                  <div className="text-xs text-amber-600">
                    <strong>What you'll see:</strong> Simulated transaction hashes, demo wallet generation, 
                    and mock blockchain interactions for demonstration purposes.
                  </div>
                </div>
              </div>
            </div>
            
            {!isConnected ? (
              <div className="text-center py-12">
                <Link className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Connect Wallet to View Blockchain Products</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your wallet to see products stored on the VeChain blockchain.
                </p>
                <Button onClick={() => document.querySelector('[value="wallet"]')?.click()}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            ) : blockchainProducts.length === 0 ? (
              <div className="text-center py-12">
                <Link className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No Blockchain Products</h3>
                <p className="text-muted-foreground mb-4">
                  Add products to the blockchain from the Products tab.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blockchainProducts.map((product) => (
                  <BlockchainProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    ecoScore={product.ecoScore}
                    carbonFootprint={product.carbonFootprint}
                    metadata={product.metadata}
                    txHash={product.txHash}
                    onViewExplorer={handleViewExplorer}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <ProductSelector 
                onProductSelect={handleProductSelect}
                selectedProductIds={selectedProducts.map(p => p.id)}
              />
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <WalletConnection 
                onWalletConnected={connectWallet}
                onWalletDisconnected={disconnectWallet}
              />
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="max-w-2xl mx-auto">
              <RegisterProductForm onSubmit={() => {}} />
            </div>
          </TabsContent>

          <TabsContent value="scan">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Try it:</strong> Copy a QR code value from any product card above and paste it here to verify the product!
                </p>
              </div>
              <QRScanner />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeClose}
        onStartTutorial={handleStartTutorial}
      />
    </div>
  );
}
