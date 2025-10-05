// Contract configuration
const CONTRACT_ADDRESS = '0x92e647e3bc952154e8336673c4acd1acdcbe63eb';
const NETWORK = 'testnet';

export interface ProductData {
  productId: string;
  name: string;
  category: string;
  co2Footprint: number; // in grams
}

export interface BlockchainProduct {
  productId: string;
  name: string;
  category: string;
  co2Footprint: number;
  company: string;
  timestamp: number;
  txHash: string;
  exists: boolean;
}

// EcoLedger Contract ABI (from the deployed contract)
const ECOLEDGER_ABI = [
  "constructor()",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "event ProductRegistered(string indexed,string,string,uint256,address indexed,uint256)",
  "event ProductUpdated(string indexed,string,uint256,address indexed)",
  "function getAllProducts() view returns ((string,string,string,uint256,address,uint256,bool)[])",
  "function getGlobalStats() view returns (uint256,uint256,uint256)",
  "function getProduct(string) view returns ((string,string,string,uint256,address,uint256,bool))",
  "function getTotalCo2Footprint() view returns (uint256)",
  "function getTotalProducts() view returns (uint256)",
  "function getWalletProducts(address) view returns ((string,string,string,uint256,address,uint256,bool)[])",
  "function getWalletStats(address) view returns (uint256,uint256,uint256)",
  "function isProductExists(string) view returns (bool)",
  "function owner() view returns (address)",
  "function productIds(uint256) view returns (string)",
  "function products(string) view returns (string,string,string,uint256,address,uint256,bool)",
  "function registerProduct(string,string,string,uint256)",
  "function renounceOwnership()",
  "function transferOwnership(address)",
  "function updateProductCo2(string,uint256)",
  "function walletProducts(address,uint256) view returns (string)"
];

class VeChainDAppKitService {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      this.isInitialized = true;
      console.log('VeChain DAppKit service initialized');
    } catch (error) {
      console.error('Failed to initialize VeChain DAppKit service:', error);
    }
  }

  // Register a product to the blockchain using VeChain DAppKit
  async registerProduct(productData: ProductData, connex: any, walletAddress: string): Promise<{ txHash: string }> {
    if (!this.isInitialized) {
      throw new Error('VeChain service not initialized');
    }

    if (!connex) {
      throw new Error('Connex instance not provided');
    }

    if (!walletAddress) {
      throw new Error('Wallet address not provided');
    }

    try {
      console.log('Registering product with data:', productData);
      console.log('Wallet address (will be used as company):', walletAddress);
      console.log('Contract address:', CONTRACT_ADDRESS);
      
      // Create the method using the EcoLedger ABI with transaction hash parameter
      const method = connex.thor
        .account(CONTRACT_ADDRESS)
        .method({
          "inputs": [
            {"internalType": "string", "name": "_productId", "type": "string"},
            {"internalType": "string", "name": "_name", "type": "string"},
            {"internalType": "string", "name": "_category", "type": "string"},
            {"internalType": "uint256", "name": "_co2Footprint", "type": "uint256"},
            {"internalType": "string", "name": "_txHash", "type": "string"}
          ],
          "name": "registerProduct",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        });

      // Use a placeholder transaction hash initially
      const placeholderTxHash = `pending_${Date.now()}`;

      // Create the transaction clause
      const clause = method.asClause(
        productData.productId,
        productData.name,
        productData.category,
        productData.co2Footprint,
        placeholderTxHash
      );

      // Sign and send the transaction using VeChain Connex vendor
      console.log('Sending transaction to wallet...');
      const result = await connex.vendor
        .sign('tx', [clause])
        .comment('Registering product to blockchain')
        .request();

      console.log('Transaction result:', result);

      if (!result.txid) {
        console.error('Transaction failed - no txid in result:', result);
        throw new Error('Transaction failed - no transaction ID returned');
      }

      console.log('Transaction successful! TX Hash:', result.txid);
      
      // Now update the product with the actual transaction hash
      try {
        await this.updateProductTxHash(productData.productId, result.txid, connex, walletAddress);
        console.log('Transaction hash updated successfully');
      } catch (updateError) {
        console.warn('Failed to update transaction hash, but product was registered:', updateError);
        // Don't throw here, the product was successfully registered
      }
      
      return {
        txHash: result.txid
      };
    } catch (error) {
      console.error('Failed to register product:', error);
      throw error;
    }
  }

  // Get a product by ID
  async getProduct(productId: string, connex: any): Promise<BlockchainProduct | null> {
    if (!this.isInitialized) {
      throw new Error('VeChain service not initialized');
    }

    if (!connex) {
      throw new Error('Connex instance not provided');
    }

    try {
      const result = await connex.thor
        .account(CONTRACT_ADDRESS)
        .method({
          "inputs": [{"internalType": "string", "name": "_productId", "type": "string"}],
          "name": "getProduct",
          "outputs": [
            {"internalType": "string", "name": "productId", "type": "string"},
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "string", "name": "category", "type": "string"},
            {"internalType": "uint256", "name": "co2Footprint", "type": "uint256"},
            {"internalType": "address", "name": "company", "type": "address"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
            {"internalType": "bool", "name": "exists", "type": "bool"}
          ],
          "stateMutability": "view",
          "type": "function"
        })
        .call(productId);
      
      if (!result || result.length < 7) {
        return null;
      }

      return {
        productId: result[0],
        name: result[1],
        category: result[2],
        co2Footprint: Number(result[3]),
        company: result[4],
        timestamp: Number(result[5]),
        exists: result[6]
      };
    } catch (error) {
      console.error('Failed to get product:', error);
      return null;
    }
  }

  // Get all products for a company
  async getCompanyProducts(companyAddress: string, connex: any): Promise<BlockchainProduct[]> {
    if (!this.isInitialized) {
      throw new Error('VeChain service not initialized');
    }

    if (!connex) {
      throw new Error('Connex instance not provided');
    }

    try {
      const result = await connex.thor
        .account(CONTRACT_ADDRESS)
        .method({
          "inputs": [{"internalType": "address", "name": "_company", "type": "address"}],
          "name": "getCompanyProducts",
          "outputs": [
            {
              "components": [
                {"internalType": "string", "name": "productId", "type": "string"},
                {"internalType": "string", "name": "name", "type": "string"},
                {"internalType": "string", "name": "category", "type": "string"},
                {"internalType": "uint256", "name": "co2Footprint", "type": "uint256"},
                {"internalType": "address", "name": "company", "type": "address"},
                {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                {"internalType": "bool", "name": "exists", "type": "bool"}
              ],
              "internalType": "struct EcoLedger.Product[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        })
        .call(companyAddress);
      
      return result.map((product: any) => ({
        productId: product[0],
        name: product[1],
        category: product[2],
        co2Footprint: Number(product[3]),
        company: product[4],
        timestamp: Number(product[5]),
        exists: product[6]
      }));
    } catch (error) {
      console.error('Failed to get company products:', error);
      return [];
    }
  }

  // Get products by wallet address (new simplified approach)
  async getWalletProducts(walletAddress: string, connex: any): Promise<BlockchainProduct[]> {
    if (!this.isInitialized) {
      throw new Error('VeChain service not initialized');
    }
    if (!connex) {
      throw new Error('Connex instance not provided');
    }

    try {
      // Use the new getWalletProducts function from the simplified contract
      const result = await connex.thor
        .account(CONTRACT_ADDRESS)
        .method({
          "inputs": [{"internalType": "address", "name": "_wallet", "type": "address"}],
          "name": "getWalletProducts",
          "outputs": [
            {
              "components": [
                {"internalType": "string", "name": "productId", "type": "string"},
                {"internalType": "string", "name": "name", "type": "string"},
                {"internalType": "string", "name": "category", "type": "string"},
                {"internalType": "uint256", "name": "co2Footprint", "type": "uint256"},
                {"internalType": "address", "name": "company", "type": "address"},
                {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                {"internalType": "string", "name": "txHash", "type": "string"},
                {"internalType": "bool", "name": "exists", "type": "bool"}
              ],
              "internalType": "struct EcoLedger.Product[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        })
        .call(walletAddress);

      if (result.reverted) {
        console.error('Transaction reverted:', result);
        return [];
      }

      const products = result.decoded[0]; // Array of products
      return products.map((product: any) => ({
        productId: product.productId,
        name: product.name,
        category: product.category,
        co2Footprint: Number(product.co2Footprint),
        company: product.company,
        timestamp: Number(product.timestamp),
        txHash: product.txHash,
        exists: product.exists
      }));
    } catch (error) {
      console.error('Failed to get wallet products:', error);
      return [];
    }
  }

  // Get global statistics
  async getGlobalStats(connex: any): Promise<{ totalCompanies: number; totalProducts: number; totalCo2Footprint: number }> {
    if (!this.isInitialized) {
      throw new Error('VeChain service not initialized');
    }

    if (!connex) {
      throw new Error('Connex instance not provided');
    }

    try {
      const result = await connex.thor
        .account(CONTRACT_ADDRESS)
        .method({
          "inputs": [],
          "name": "getGlobalStats",
          "outputs": [
            {"internalType": "uint256", "name": "totalCompanies", "type": "uint256"},
            {"internalType": "uint256", "name": "totalProducts", "type": "uint256"},
            {"internalType": "uint256", "name": "totalCo2Footprint", "type": "uint256"}
          ],
          "stateMutability": "view",
          "type": "function"
        })
        .call();
      
      return {
        totalCompanies: Number(result[0]),
        totalProducts: Number(result[1]),
        totalCo2Footprint: Number(result[2])
      };
    } catch (error) {
      console.error('Failed to get global stats:', error);
      return { totalCompanies: 0, totalProducts: 0, totalCo2Footprint: 0 };
    }
  }

  // Register a company
  async registerCompany(companyName: string, connex: any, walletAddress: string): Promise<{ txHash: string }> {
    if (!this.isInitialized) {
      throw new Error('VeChain service not initialized');
    }

    if (!connex) {
      throw new Error('Connex instance not provided');
    }

    if (!walletAddress) {
      throw new Error('Wallet address not provided');
    }

    try {
      const method = connex.thor
        .account(CONTRACT_ADDRESS)
        .method({
          "inputs": [{"internalType": "string", "name": "_name", "type": "string"}],
          "name": "registerCompany",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        });

      const clause = method.asClause(companyName);

      const result = await connex.vendor
        .sign('tx', [clause])
        .comment('Registering company to blockchain')
        .request();

      if (!result.txid) {
        throw new Error('Transaction failed');
      }

      return {
        txHash: result.txid
      };
    } catch (error) {
      console.error('Failed to register company:', error);
      throw error;
    }
  }

  // Check if company is registered
  async isCompanyRegistered(companyAddress: string, connex: any): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('VeChain service not initialized');
    }

    if (!connex) {
      throw new Error('Connex instance not provided');
    }

    try {
      const result = await connex.thor
        .account(CONTRACT_ADDRESS)
        .method({
          "inputs": [{"internalType": "address", "name": "_company", "type": "address"}],
          "name": "isCompanyRegistered",
          "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
          "stateMutability": "view",
          "type": "function"
        })
        .call(companyAddress);
      
      return result;
    } catch (error) {
      console.error('Failed to check company registration:', error);
      return false;
    }
  }

  async updateProductTxHash(productId: string, txHash: string, connex: any, walletAddress: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('VeChain service not initialized');
    }

    if (!connex) {
      throw new Error('Connex instance not provided');
    }

    if (!walletAddress) {
      throw new Error('Wallet address not provided');
    }

    try {
      console.log('Updating transaction hash for product:', productId, 'with hash:', txHash);
      
      // Create the method for updateProductTxHash
      const method = connex.thor
        .account(CONTRACT_ADDRESS)
        .method({
          "inputs": [
            {"internalType": "string", "name": "_productId", "type": "string"},
            {"internalType": "string", "name": "_txHash", "type": "string"}
          ],
          "name": "updateProductTxHash",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        });

      // Create the transaction clause
      const clause = method.asClause(productId, txHash);

      // Sign and send the transaction
      const result = await connex.vendor
        .sign('tx', [clause])
        .comment('Updating product transaction hash')
        .request();

      if (!result.txid) {
        throw new Error('Failed to update transaction hash - no transaction ID returned');
      }

      console.log('Transaction hash updated successfully:', result.txid);
    } catch (error) {
      console.error('Failed to update product transaction hash:', error);
      throw error;
    }
  }

  // Get contract address
  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }

  // Get explorer URL for a transaction
  getExplorerUrl(txHash: string): string {
    return `https://explore-testnet.vechain.org/transactions/${txHash}`;
  }

  // Check if contract is connected
  isConnected(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const vechainDAppKitService = new VeChainDAppKitService();