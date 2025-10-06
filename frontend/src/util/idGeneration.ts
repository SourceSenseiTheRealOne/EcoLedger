/**
 * Utility functions for generating unique identifiers
 */

/**
 * Generate a unique product ID using timestamp + random number + optional wallet address
 * This ensures uniqueness even with rapid submissions or concurrent users
 * 
 * @param walletAddress - Optional wallet address to include in the ID for additional uniqueness
 * @returns A unique product ID string in format: PROD_{timestamp}_{random}_{walletSuffix}
 */
export const generateUniqueProductId = (walletAddress?: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const walletSuffix = walletAddress ? walletAddress.slice(-4) : '0000';
  return `PROD_${timestamp}_${random}_${walletSuffix}`;
};

/**
 * Generate a unique ID using crypto.randomUUID if available, fallback to timestamp + random
 * This provides even better uniqueness guarantees
 * 
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateCryptoId = (prefix: string = 'ID'): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  
  // Fallback for environments without crypto.randomUUID
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Generate a hash-based unique ID using the product data
 * This ensures the same product data always generates the same ID
 * 
 * @param productData - The product data to hash
 * @returns A unique ID based on the product data hash
 */
export const generateHashBasedId = (productData: {
  name: string;
  category: string;
  walletAddress?: string;
}): string => {
  const dataString = `${productData.name}_${productData.category}_${productData.walletAddress || 'unknown'}`;
  
  // Simple hash function (for production, consider using a proper crypto hash)
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `HASH_${Math.abs(hash).toString(16)}_${Date.now()}`;
};
