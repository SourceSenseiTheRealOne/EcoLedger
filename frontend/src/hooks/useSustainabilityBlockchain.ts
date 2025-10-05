import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@vechain/dapp-kit-react';
import { sustainabilityBlockchainService, Company, Product, CompanyStats, GlobalStats } from '@/services/sustainabilityBlockchain';

export const useSustainabilityBlockchain = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Get wallet state from DAppKit
  const { account, isConnected: dappKitConnected } = useWallet();

  // Connect contract when wallet is connected
  useEffect(() => {
    const connectContract = async () => {
      if (account && dappKitConnected) {
        try {
          // Connect the blockchain service with the wallet address
          await sustainabilityBlockchainService.connectContract(account);
          
          setWalletAddress(account);
          setIsConnected(true);
          setError('');
          
          console.log('Sustainability contract connected successfully');
        } catch (error) {
          console.error('Failed to connect sustainability contract:', error);
          setError('Failed to connect to sustainability contract');
        }
      } else {
        setIsConnected(false);
        setWalletAddress('');
      }
    };

    connectContract();
  }, [account, dappKitConnected]);

  // Register a company
  const registerCompany = useCallback(async (companyName: string): Promise<string> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const txHash = await sustainabilityBlockchainService.registerCompany(companyName);
      setIsLoading(false);
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Register a product
  const registerProduct = useCallback(async (
    productId: string,
    name: string,
    category: string,
    co2Footprint: number
  ): Promise<string> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const txHash = await sustainabilityBlockchainService.registerProduct(
        productId,
        name,
        category,
        co2Footprint
      );
      setIsLoading(false);
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Update product CO2
  const updateProductCo2 = useCallback(async (productId: string, newCo2Footprint: number): Promise<string> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const txHash = await sustainabilityBlockchainService.updateProductCo2(productId, newCo2Footprint);
      setIsLoading(false);
      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Get product
  const getProduct = useCallback(async (productId: string): Promise<Product | null> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const product = await sustainabilityBlockchainService.getProduct(productId);
      setIsLoading(false);
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Get company products
  const getCompanyProducts = useCallback(async (companyAddress?: string): Promise<Product[]> => {
    const address = companyAddress || account;
    if (!address) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const products = await sustainabilityBlockchainService.getCompanyProducts(address);
      setIsLoading(false);
      return products;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Get all products
  const getAllProducts = useCallback(async (): Promise<Product[]> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const products = await sustainabilityBlockchainService.getAllProducts();
      setIsLoading(false);
      return products;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Get company info
  const getCompany = useCallback(async (companyAddress?: string): Promise<Company | null> => {
    const address = companyAddress || account;
    if (!address) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const company = await sustainabilityBlockchainService.getCompany(address);
      setIsLoading(false);
      return company;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Get company stats
  const getCompanyStats = useCallback(async (companyAddress?: string): Promise<CompanyStats> => {
    const address = companyAddress || account;
    if (!address) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const stats = await sustainabilityBlockchainService.getCompanyStats(address);
      setIsLoading(false);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Get global stats
  const getGlobalStats = useCallback(async (): Promise<GlobalStats> => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setError('');
    try {
      const stats = await sustainabilityBlockchainService.getGlobalStats();
      setIsLoading(false);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [account]);

  // Check if company is registered
  const isCompanyRegistered = useCallback(async (companyAddress?: string): Promise<boolean> => {
    const address = companyAddress || account;
    if (!address) {
      return false;
    }
    try {
      return await sustainabilityBlockchainService.isCompanyRegistered(address);
    } catch (err) {
      console.error('Failed to check company registration:', err);
      return false;
    }
  }, [account]);

  // Check if product exists
  const isProductExists = useCallback(async (productId: string): Promise<boolean> => {
    if (!account) {
      return false;
    }
    try {
      return await sustainabilityBlockchainService.isProductExists(productId);
    } catch (err) {
      console.error('Failed to check product existence:', err);
      return false;
    }
  }, [account]);

  return {
    isConnected,
    walletAddress,
    isLoading,
    error,
    registerCompany,
    registerProduct,
    updateProductCo2,
    getProduct,
    getCompanyProducts,
    getAllProducts,
    getCompany,
    getCompanyStats,
    getGlobalStats,
    isCompanyRegistered,
    isProductExists,
    getExplorerUrl: (txHash: string) => sustainabilityBlockchainService.getExplorerUrl(txHash)
  };
};
