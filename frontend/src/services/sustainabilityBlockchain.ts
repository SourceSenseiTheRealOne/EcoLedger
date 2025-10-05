import { ethers } from 'ethers';

// Contract ABI and configuration
const SUSTAINABILITY_ABI = [
  "constructor()",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event CompanyRegistered(address indexed,string,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "event ProductRegistered(string indexed,string,string,uint256,address indexed,uint256)",
  "event ProductUpdated(string indexed,string,uint256,address indexed)",
  "function companies(address) view returns (string,address,uint256,bool)",
  "function companyNames(address) view returns (string)",
  "function companyProducts(address,uint256) view returns (string)",
  "function getAllProducts() view returns ((string,string,string,uint256,address,uint256,bool)[])",
  "function getCompany(address) view returns ((string,address,uint256,bool))",
  "function getCompanyProducts(address) view returns ((string,string,string,uint256,address,uint256,bool)[])",
  "function getCompanyStats(address) view returns (uint256,uint256,uint256)",
  "function getGlobalStats() view returns (uint256,uint256,uint256)",
  "function getProduct(string) view returns ((string,string,string,uint256,address,uint256,bool))",
  "function getTotalCo2Footprint() view returns (uint256)",
  "function getTotalProducts() view returns (uint256)",
  "function isCompanyRegistered(address) view returns (bool)",
  "function isProductExists(string) view returns (bool)",
  "function owner() view returns (address)",
  "function productIds(uint256) view returns (string)",
  "function products(string) view returns (string,string,string,uint256,address,uint256,bool)",
  "function registerCompany(string)",
  "function registerProduct(string,string,string,uint256)",
  "function renounceOwnership()",
  "function transferOwnership(address)",
  "function updateProductCo2(string,uint256)"
];

// Contract configuration
const CONTRACT_ADDRESS = '0x676021321593c4f11135be0ff79fd9d50d40fabe'; // Deployed contract address on VeChain testnet
const NETWORK = 'testnet'; // Change to 'mainnet' for production

export interface Company {
  name: string;
  wallet: string;
  registrationTime: number;
  exists: boolean;
}

export interface Product {
  productId: string;
  name: string;
  category: string;
  co2Footprint: number; // in grams
  company: string;
  timestamp: number;
  exists: boolean;
}

export interface CompanyStats {
  totalProducts: number;
  totalCo2Footprint: number;
  averageCo2PerProduct: number;
}

export interface GlobalStats {
  totalCompanies: number;
  totalProducts: number;
  totalCo2Footprint: number;
}

class SustainabilityBlockchainService {
  private contract: ethers.Contract | null = null;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      // Initialize VeChain provider
      this.provider = new ethers.JsonRpcProvider('https://testnet.vechain.org/');
      console.log('Sustainability blockchain service initialized');
    } catch (error) {
      console.error('Failed to initialize sustainability blockchain service:', error);
    }
  }

  // Connect to the contract using wallet address
  async connectContract(walletAddress: string) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      // For now, we'll create a simple wallet signer
      // In a real implementation, this would come from DAppKit
      const wallet = new ethers.Wallet('0x' + '0'.repeat(64), this.provider); // Mock private key
      
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        SUSTAINABILITY_ABI,
        wallet
      );
      
      console.log('Sustainability contract connected:', CONTRACT_ADDRESS);
      return true;
    } catch (error) {
      console.error('Failed to connect sustainability contract:', error);
      return false;
    }
  }

  // Register a company
  async registerCompany(companyName: string): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected. Please connect your wallet first.');
    }

    try {
      const tx = await this.contract.registerCompany(companyName);
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      return receipt.hash;
    } catch (error) {
      console.error('Failed to register company:', error);
      throw error;
    }
  }

  // Register a product
  async registerProduct(
    productId: string,
    name: string,
    category: string,
    co2Footprint: number // in grams
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected. Please connect your wallet first.');
    }

    try {
      const tx = await this.contract.registerProduct(
        productId,
        name,
        category,
        co2Footprint
      );

      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      return receipt.hash;
    } catch (error) {
      console.error('Failed to register product:', error);
      throw error;
    }
  }

  // Update product CO2 footprint
  async updateProductCo2(productId: string, newCo2Footprint: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected. Please connect your wallet first.');
    }

    try {
      const tx = await this.contract.updateProductCo2(productId, newCo2Footprint);
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      return receipt.hash;
    } catch (error) {
      console.error('Failed to update product CO2:', error);
      throw error;
    }
  }

  // Get product information
  async getProduct(productId: string): Promise<Product | null> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const product = await this.contract.getProduct(productId);
      
      return {
        productId: product[0],
        name: product[1],
        category: product[2],
        co2Footprint: Number(product[3]),
        company: product[4],
        timestamp: Number(product[5]),
        exists: product[6]
      };
    } catch (error) {
      console.error('Failed to get product:', error);
      return null;
    }
  }

  // Get all products by a company
  async getCompanyProducts(companyAddress: string): Promise<Product[]> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const products = await this.contract.getCompanyProducts(companyAddress);
      
      return products.map((product: any) => ({
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

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const products = await this.contract.getAllProducts();
      
      return products.map((product: any) => ({
        productId: product[0],
        name: product[1],
        category: product[2],
        co2Footprint: Number(product[3]),
        company: product[4],
        timestamp: Number(product[5]),
        exists: product[6]
      }));
    } catch (error) {
      console.error('Failed to get all products:', error);
      return [];
    }
  }

  // Get company information
  async getCompany(companyAddress: string): Promise<Company | null> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const company = await this.contract.getCompany(companyAddress);
      
      return {
        name: company[0],
        wallet: company[1],
        registrationTime: Number(company[2]),
        exists: company[3]
      };
    } catch (error) {
      console.error('Failed to get company:', error);
      return null;
    }
  }

  // Get company statistics
  async getCompanyStats(companyAddress: string): Promise<CompanyStats> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const stats = await this.contract.getCompanyStats(companyAddress);
      return {
        totalProducts: Number(stats[0]),
        totalCo2Footprint: Number(stats[1]),
        averageCo2PerProduct: Number(stats[2])
      };
    } catch (error) {
      console.error('Failed to get company stats:', error);
      return { totalProducts: 0, totalCo2Footprint: 0, averageCo2PerProduct: 0 };
    }
  }

  // Get global statistics
  async getGlobalStats(): Promise<GlobalStats> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const stats = await this.contract.getGlobalStats();
      return {
        totalCompanies: Number(stats[0]),
        totalProducts: Number(stats[1]),
        totalCo2Footprint: Number(stats[2])
      };
    } catch (error) {
      console.error('Failed to get global stats:', error);
      return { totalCompanies: 0, totalProducts: 0, totalCo2Footprint: 0 };
    }
  }

  // Check if company is registered
  async isCompanyRegistered(companyAddress: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      return await this.contract.isCompanyRegistered(companyAddress);
    } catch (error) {
      console.error('Failed to check company registration:', error);
      return false;
    }
  }

  // Check if product exists
  async isProductExists(productId: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      return await this.contract.isProductExists(productId);
    } catch (error) {
      console.error('Failed to check product existence:', error);
      return false;
    }
  }

  // Get contract address
  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }

  // Get explorer URL for transaction
  getExplorerUrl(txHash: string): string {
    return `https://explore-testnet.vechain.org/transactions/${txHash}`;
  }
}

export const sustainabilityBlockchainService = new SustainabilityBlockchainService();
