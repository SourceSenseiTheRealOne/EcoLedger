import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { RegisterProductForm } from '@/components/RegisterProductForm';
import { ProductSelector } from '@/components/ProductSelector';
import { WalletConnection } from '@/components/WalletConnection';
import { BlockchainProductCard } from '@/components/BlockchainProductCard';
import { WelcomeModal } from '@/components/WelcomeModal';
import { DAppKitWalletButton } from '@/components/DAppKitWalletButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, PlusCircle, Database, Wallet, Link, HelpCircle, Leaf } from 'lucide-react';
import { FrontendProduct } from '@/services/api';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useToast } from '@/hooks/use-toast';
import { useWallet, useWalletModal } from '@vechain/dapp-kit-react';

interface BlockchainProduct extends FrontendProduct {
  txHash: string;
}

export default function Dashboard() {
  const [selectedProducts, setSelectedProducts] = useState<FrontendProduct[]>([]);
  const [blockchainProducts, setBlockchainProducts] = useState<BlockchainProduct[]>([]);
  const [productTxHashes, setProductTxHashes] = useState<Record<string, string>>({});
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showHelpButton, setShowHelpButton] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('products');
  const { toast } = useToast();
  
  // DAppKit wallet state
  const { account: walletAddress } = useWallet();
  const { open: openWalletModal } = useWalletModal();
  
  const {
    isConnected: blockchainConnected,
    walletAddress: blockchainWalletAddress,
    isLoading: blockchainLoading,
    error: blockchainError,
    addProductToBlockchain,
    getUserProductsFromBlockchain,
    getExplorerUrl
  } = useBlockchain();

  // Fetch products from blockchain when wallet connects
  const fetchBlockchainProducts = async () => {
    if (walletAddress && blockchainConnected) {
      try {
        console.log('Fetching products from blockchain...');
        const products = await getUserProductsFromBlockchain();
        console.log('Fetched products from blockchain:', products.length);
        

            const convertedProducts: BlockchainProduct[] = products.map(product => ({
              id: product.productId,
              name: product.name,
              category: product.category,
              ecoScore: 85, 
              carbonFootprint: product.co2Footprint / 1000, // Convert grams to kg
              ef: product.co2Footprint / 1000, // Convert grams to kg
              bestCo2g: product.co2Footprint * 0.8, // Estimate best case
              worstCo2g: product.co2Footprint * 1.2, // Estimate worst case
              metadata: `Blockchain product registered by ${product.company}`,
              description: `Product registered on blockchain at ${new Date(product.timestamp * 1000).toLocaleString()}`,
              txHash: product.txHash || 'unknown-tx' // Use transaction hash from blockchain
            }));
        
        setBlockchainProducts(convertedProducts);
      } catch (error) {
        console.error('Failed to fetch blockchain products:', error);
        toast({
          title: "Error",
          description: "Failed to fetch products from blockchain",
          variant: "destructive"
        });
      }
    }
  };

  
  // Debug wallet connection state
  // console.log('Wallet Debug:', {
  //   dappKitConnected: !!walletAddress,
  //   dappKitAccount: walletAddress,
  //   blockchainConnected,
  //   blockchainWalletAddress,
  //   blockchainProductsCount: blockchainProducts.length
  // });

  const handleProductSelect = (product: FrontendProduct) => {
    setSelectedProducts(prev => [...prev, product]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddToBlockchain = async (product: FrontendProduct) => {
    if (!blockchainConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to add products to the blockchain.",
        variant: "destructive"
      });
      return;
    }

    // console.log('Dashboard - Starting blockchain transaction for product:', product);

    try {
      const txHash = await addProductToBlockchain(product);
      console.log('Dashboard - Received txHash:', txHash);
      
      if (!txHash) {
        throw new Error('No transaction hash received');
      }
      
          toast({
            title: "Product Added to Blockchain",
            description: `Transaction hash: ${txHash.slice(0, 10)}...`,
          });

          // Store the transaction hash for this product
          setProductTxHashes(prev => ({
            ...prev,
            [product.id]: txHash
          }));

          // Remove from selected products
          setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
          
          // Refresh blockchain products from the blockchain
          await fetchBlockchainProducts();
          
          // console.log('Dashboard - Product successfully added to blockchain');
      
    } catch (error) {
      console.error('Dashboard - Error adding product to blockchain:', error);
      toast({
        title: "Blockchain Error",
        description: error instanceof Error ? error.message : "Failed to add product to blockchain",
        variant: "destructive"
      });
    }
  };

      const handleViewExplorer = (txHash: string) => {
        // Open the real VeChain explorer
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


  // Fetch blockchain products when wallet connects
  useEffect(() => {
    if (walletAddress && blockchainConnected) {
      fetchBlockchainProducts();
    } else {
      // Clear products when wallet disconnects
      setBlockchainProducts([]);
    }
  }, [walletAddress, blockchainConnected]);

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

  // Dynamic calculations based on active tab
  const getCurrentProducts = () => {
    if (activeTab === 'blockchain') {
      return blockchainProducts;
    }
    return selectedProducts;
  };

  const currentProducts = getCurrentProducts();
  const totalProducts = currentProducts.length;
  const avgEcoScore = totalProducts > 0 ? Math.round(
    currentProducts.reduce((sum, p) => sum + p.ecoScore, 0) / totalProducts
  ) : 0;
  const totalCarbonSaved = currentProducts.reduce((sum, p) => sum + p.carbonFootprint, 0).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  EcoLedger
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Blockchain Sustainability Platform</p>
              </div>
            </div>
            
            {/* Center - Help & Tutorial Button (hidden on mobile, shown on larger screens) */}
            {showHelpButton && (
              <div className="hidden md:flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowHelp}
                  className="gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help & Tutorial
                </Button>
              </div>
            )}
            
            {/* Right side - Wallet Connection & Mobile Help */}
            <div className="flex items-center gap-2">
              {/* Mobile Help Button */}
              {showHelpButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowHelp}
                  className="md:hidden h-8 w-8 p-0"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              )}
              <DAppKitWalletButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground mb-1">
              {activeTab === 'blockchain' ? 'Blockchain Products' : 'Selected Products'}
            </p>
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
        <Tabs defaultValue="products" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
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
                  <Button onClick={() => (document.querySelector('[value="add"]') as HTMLButtonElement)?.click()}>
                    <Database className="w-4 h-4 mr-2" />
                    Add from Database
                  </Button>
                  <Button variant="outline" onClick={() => (document.querySelector('[value="register"]') as HTMLButtonElement)?.click()}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Register New
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedProducts.map((product) => (
                  <div key={`selected-${product.id}`} className="relative group">
                    <ProductCard {...product} />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {blockchainConnected ? (
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
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openWalletModal}
                          className="h-8 px-2 text-xs hover:bg-primary hover:text-primary-foreground"
                        >
                          <Wallet className="w-3 h-3 mr-1" />
                          Connect Wallet
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
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Blockchain Products</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {blockchainConnected ? `Connected: ${blockchainWalletAddress?.slice(0, 6)}...${blockchainWalletAddress?.slice(-4)}` : 'Not connected'}
                </div>
              </div>
            </div>
            
            {/* Demo Notice */}
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-600">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Live Blockchain Integration</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Products are fetched directly from the VeChain testnet blockchain. All data is real and 
                    synchronized across all devices. Transaction hashes are live and can be viewed in the VeChain explorer.
                  </p>
                  <div className="text-xs text-green-600">
                    <strong>Real blockchain data:</strong> Live transaction hashes, real wallet connections, 
                    and actual blockchain interactions on VeChain testnet.
                  </div>
                </div>
              </div>
            </div>
            
            {!walletAddress ? (
              <div className="text-center py-12">
                <Link className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Connect Wallet to View Blockchain Products</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your wallet to see products stored on the VeChain blockchain.
                </p>
                <Button onClick={() => (document.querySelector('[value="wallet"]') as HTMLButtonElement)?.click()}>
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
                    key={`blockchain-${product.id}-${product.txHash}`}
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
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Wallet Connection</h3>
                <p className="text-muted-foreground">
                  Use the wallet button in the header to connect your VeChain wallet.
                </p>
                <div className="flex justify-center">
                  <DAppKitWalletButton />
                </div>
                {walletAddress && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>✅ Wallet Connected!</strong> Your wallet is connected and ready to use.
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Address: {walletAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="max-w-2xl mx-auto">
              <RegisterProductForm onSubmit={() => {}} />
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
