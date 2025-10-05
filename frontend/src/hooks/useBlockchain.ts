import { useState, useCallback, useEffect } from 'react';
import { FrontendProduct } from '@/services/api';
import { vechainDAppKitService, BlockchainProduct } from '@/services/vechain-dappkit';
import { useWallet, useWalletModal, useConnex } from '@vechain/dapp-kit-react';

export const useBlockchain = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Get wallet state from DAppKit
  const { account } = useWallet();
  const connex = useConnex();

  // Connect contract when wallet is connected
  useEffect(() => {
    let disconnectTimer: NodeJS.Timeout;

    const connectContract = async () => {
      if (account) {
        // Clear any pending disconnect timer
        if (disconnectTimer) {
          clearTimeout(disconnectTimer);
        }
        
        try {
          setWalletAddress(account);
          setIsConnected(true);
          setError('');
          
          console.log('Wallet connected successfully:', account);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          setError('Failed to connect wallet');
        }
      } else {
        // Add a small delay before disconnecting to prevent UI flickering
        // This is especially useful when wallet disconnects after transactions
        disconnectTimer = setTimeout(() => {
          setIsConnected(false);
          setWalletAddress('');
          console.log('Wallet disconnected');
        }, 1000); // 1 second delay
      }
    };

    connectContract();

    // Cleanup function
    return () => {
      if (disconnectTimer) {
        clearTimeout(disconnectTimer);
      }
    };
  }, [account]);

  const connectWallet = useCallback((address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    setError('');
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress('');
    setIsConnected(false);
    setError('');
  }, []);

  const addProductToBlockchain = useCallback(async (product: FrontendProduct) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    if (!connex) {
      throw new Error('Connex not available');
    }

    setIsLoading(true);
    setError('');

    try {
      // Convert FrontendProduct to ProductData format for EcoLedger
      // Calculate CO2 footprint: assume 1kg product weight * emission factor * 1000 (kg to grams)
      const productWeightKg = 1.0; // Assume 1kg product weight for calculation
      const co2FootprintGrams = Math.floor(productWeightKg * product.ef * 1000);
      
      const productData = {
        productId: product.id || Date.now().toString(), // Use existing ID or generate one
        name: product.name,
        category: product.category,
        co2Footprint: co2FootprintGrams // CO2 footprint in grams
      };

      console.log('useBlockchain - Original product:', product);
      console.log('useBlockchain - Product data:', productData);
      console.log('useBlockchain - Account:', account);
      console.log('useBlockchain - Connex:', connex);

      console.log('useBlockchain - Calling registerProduct...');
      
      // Add a timeout to prevent hanging if wallet disconnects
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Transaction timeout - wallet may have disconnected')), 30000);
      });
      
      const result = await Promise.race([
        vechainDAppKitService.registerProduct(productData, connex, account),
        timeoutPromise
      ]) as { txHash: string };
      
      console.log('useBlockchain - Received result:', result);
      
      if (!result || !result.txHash) {
        throw new Error('No transaction hash returned from blockchain service');
      }
      
      // Check if wallet is still connected after transaction
      if (!account) {
        console.warn('useBlockchain - Wallet disconnected after transaction, but we have the txHash');
      }
      
      console.log('useBlockchain - Returning txHash:', result.txHash);
      return result.txHash;
    } catch (err) {
      console.error('useBlockchain - Error in addProductToBlockchain:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product to blockchain';
      setError(errorMessage);
      throw err;
    } finally {
      console.log('useBlockchain - Setting isLoading to false');
      setIsLoading(false);
    }
  }, [account, connex]);

  const getExplorerUrl = useCallback((txHash: string) => {
    return vechainDAppKitService.getExplorerUrl(txHash);
  }, []);


  const getUserProductsFromBlockchain = useCallback(async (): Promise<BlockchainProduct[]> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    if (!connex) {
      throw new Error('Connex not available');
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Fetching products from blockchain for wallet:', account);
      // Get products directly from blockchain using the new getWalletProducts function
      const products = await vechainDAppKitService.getWalletProducts(account, connex);
      console.log('Retrieved products from blockchain:', products.length);
      return products;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user products from blockchain';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account, connex]);

  const getProductFromBlockchain = useCallback(async (productId: string): Promise<BlockchainProduct | null> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    if (!connex) {
      throw new Error('Connex not available');
    }

    setIsLoading(true);
    setError('');

    try {
      const product = await vechainDAppKitService.getProduct(productId, connex);
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get product from blockchain';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account, connex]);

  const getBlockchainStats = useCallback(async () => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    if (!connex) {
      throw new Error('Connex not available');
    }

    setIsLoading(true);
    setError('');

    try {
      const stats = await vechainDAppKitService.getGlobalStats(connex);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get blockchain stats';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account, connex]);

  return {
    isConnected: !!account,
    walletAddress: account || '',
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    addProductToBlockchain,
    getProductFromBlockchain,
    getUserProductsFromBlockchain,
    getBlockchainStats,
    getExplorerUrl: (txHash: string) => vechainDAppKitService.getExplorerUrl(txHash)
  };
};
