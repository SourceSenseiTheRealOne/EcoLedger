import { useState, useCallback } from 'react';
import { vechainService, VeChainProduct } from '@/services/vechain-simple';
import { FrontendProduct } from '@/services/api';

export const useBlockchain = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

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
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError('');

    try {
      const txHash = await vechainService.addProduct({
        name: product.name,
        category: product.category,
        description: product.description,
        emissionFactor: product.ef,
        ecoScore: product.ecoScore
      });

      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product to blockchain';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const getExplorerUrl = useCallback((txHash: string) => {
    return vechainService.getExplorerUrl(txHash);
  }, []);

  const getProductFromBlockchain = useCallback(async (productId: number): Promise<VeChainProduct | null> => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError('');

    try {
      const product = await vechainService.getProduct(productId);
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get product from blockchain';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const getUserProductsFromBlockchain = useCallback(async (): Promise<number[]> => {
    if (!isConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError('');

    try {
      const productIds = await vechainService.getUserProducts(walletAddress);
      return productIds;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user products from blockchain';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress]);

  return {
    isConnected,
    walletAddress,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    addProductToBlockchain,
    getProductFromBlockchain,
    getUserProductsFromBlockchain,
    getExplorerUrl
  };
};
