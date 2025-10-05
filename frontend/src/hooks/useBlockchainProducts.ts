import { useState, useEffect, useCallback } from 'react';

export interface BlockchainProduct {
  id: string;
  name: string;
  category: string;
  ecoScore: number;
  carbonFootprint: number;
  metadata?: string;
  description?: string;
  ef: number;
  bestCo2g?: number;
  worstCo2g?: number;
  txHash: string;
}

const STORAGE_KEY = 'ecoledger-blockchain-products';

export const useBlockchainProducts = () => {
  const [blockchainProducts, setBlockchainProducts] = useState<BlockchainProduct[]>(() => {
    // Load from localStorage on initialization
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded blockchain products from localStorage on init:', parsed.length);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Failed to load blockchain products from localStorage:', error);
    }
    return [];
  });

  // Save to localStorage whenever products change
  useEffect(() => {
    if (blockchainProducts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blockchainProducts));
      console.log('Saved blockchain products to localStorage:', blockchainProducts.length);
    }
  }, [blockchainProducts]);

  // Add a product to blockchain products
  const addBlockchainProduct = useCallback((product: BlockchainProduct) => {
    setBlockchainProducts(prev => {
      // Check if product already exists (by id or txHash)
      const exists = prev.some(p => p.id === product.id || p.txHash === product.txHash);
      
      if (exists) {
        console.log('Product already exists in blockchain products:', product.name);
        return prev; // Don't add duplicate
      }
      
      const updated = [...prev, product];
      console.log('Added blockchain product:', product.name, 'Total products:', updated.length);
      return updated;
    });
  }, []);

  // Remove a product from blockchain products
  const removeBlockchainProduct = useCallback((productId: string) => {
    setBlockchainProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      console.log('Removed blockchain product:', productId, 'Remaining products:', updated.length);
      return updated;
    });
  }, []);

  // Clear all blockchain products
  const clearBlockchainProducts = useCallback(() => {
    setBlockchainProducts([]);
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared all blockchain products');
  }, []);

  // Remove duplicates from current state
  const removeDuplicates = useCallback(() => {
    setBlockchainProducts(prev => {
      const uniqueProducts = prev.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id && p.txHash === product.txHash)
      );
      
      if (uniqueProducts.length !== prev.length) {
        console.log('Removed duplicates from blockchain products:', prev.length - uniqueProducts.length, 'duplicates removed');
      }
      
      return uniqueProducts;
    });
  }, []);

  // Load products from localStorage (useful for wallet reconnection)
  const loadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove duplicates based on id and txHash
          const uniqueProducts = parsed.filter((product, index, self) => 
            index === self.findIndex(p => p.id === product.id && p.txHash === product.txHash)
          );
          
          setBlockchainProducts(uniqueProducts);
          console.log('Loaded blockchain products from storage:', uniqueProducts.length, 'duplicates removed:', parsed.length - uniqueProducts.length);
          return uniqueProducts;
        }
      }
    } catch (error) {
      console.error('Failed to load blockchain products from storage:', error);
    }
    return [];
  }, []);

  return {
    blockchainProducts,
    addBlockchainProduct,
    removeBlockchainProduct,
    clearBlockchainProducts,
    loadFromStorage,
    removeDuplicates
  };
};
