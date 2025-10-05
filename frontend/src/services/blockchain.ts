import { ethers } from 'ethers';
import { ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { Connex } from '@vechain/connex';

// Contract ABI and configuration
const ECOLEDGER_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "emissionFactor",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ecoScore",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ProductAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ecoScore",
        "type": "uint256"
      }
    ],
    "name": "ProductUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_emissionFactor",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_ecoScore",
        "type": "uint256"
      }
    ],
    "name": "addProduct",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProducts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserProducts",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "emissionFactor",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "ecoScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newEcoScore",
        "type": "uint256"
      }
    ],
    "name": "updateEcoScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract configuration
const CONTRACT_CONFIG = {
  TESTNET: {
    chainId: 39,
    rpcUrl: 'https://testnet.vechain.org/',
    explorerUrl: 'https://explore-testnet.vechain.org/',
  },
  MAINNET: {
    chainId: 1,
    rpcUrl: 'https://mainnet.vechain.org/',
    explorerUrl: 'https://explore.vechain.org/',
  },
  SOLO: {
    chainId: 818,
    rpcUrl: 'http://localhost:8669',
    explorerUrl: 'http://localhost:8669',
  },
};

function getContractConfig(network: 'testnet' | 'mainnet' | 'solo' = 'testnet') {
  return CONTRACT_CONFIG[network.toUpperCase() as keyof typeof CONTRACT_CONFIG];
}

// Contract configuration
const CONTRACT_ADDRESS = '0x92e647e3bc952154e8336673c4acd1acdcbe63eb'; // Deployed EcoLedger contract address on VeChain testnet
const NETWORK = 'testnet'; // Change to 'mainnet' for production

export interface ProductData {
  name: string;
  category: string;
  description: string;
  emissionFactor: number; // kg CO2 per kg
  ecoScore: number; // 0-100
}

export interface BlockchainProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  emissionFactor: number;
  ecoScore: number;
  timestamp: number;
  owner: string;
  txHash?: string;
}

class BlockchainService {
  private contract: ethers.Contract | null = null;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private connex: Connex | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      // Initialize VeChain provider
      this.provider = new ethers.JsonRpcProvider('https://testnet.vechain.org/');
      console.log('Blockchain service initialized');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
    }
  }

  // Connect to the contract using wallet address
  async connectContract(walletAddress: string) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      // Initialize Connex for VeChain DAppKit integration
      this.connex = new Connex({
        node: 'https://testnet.vechain.org/',
        network: 'test'
      });

      // Create a simple wallet signer for now
      // In production, this should be replaced with DAppKit wallet integration
      const wallet = new ethers.Wallet('0x' + '0'.repeat(64), this.provider);
      
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ECOLEDGER_ABI,
        wallet
      );
      
      console.log('Contract connected:', CONTRACT_ADDRESS);
      return true;
    } catch (error) {
      console.error('Failed to connect contract:', error);
      return false;
    }
  }

  // Add a product to the blockchain
  async addProduct(productData: ProductData): Promise<{ productId: number; txHash: string }> {
    if (!this.contract) {
      throw new Error('Contract not connected. Please connect your wallet first.');
    }

    try {
      // Convert emission factor to the contract's expected format (scaled by 1000)
      const emissionFactorScaled = ethers.parseUnits(productData.emissionFactor.toString(), 3);
      
      const tx = await this.contract.addProduct(
        productData.name,
        productData.category,
        productData.description,
        emissionFactorScaled,
        productData.ecoScore
      );

      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      // Get the product ID from the event
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract!.interface.parseLog(log);
          return parsed?.name === 'ProductAdded';
        } catch {
          return false;
        }
      });

      let productId = 0;
      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        productId = Number(parsed?.args.productId);
      }

      return {
        productId,
        txHash: receipt.hash
      };
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  }

  // Get a product by ID
  async getProduct(productId: number): Promise<BlockchainProduct | null> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const product = await this.contract.getProduct(productId);
      
      return {
        id: productId,
        name: product[0],
        category: product[1],
        description: product[2],
        emissionFactor: Number(ethers.formatUnits(product[3], 3)), // Convert back from scaled format
        ecoScore: Number(product[4]),
        timestamp: Number(product[5]),
        owner: product[6]
      };
    } catch (error) {
      console.error('Failed to get product:', error);
      return null;
    }
  }

  // Get all products for a user
  async getUserProducts(userAddress: string): Promise<number[]> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const productIds = await this.contract.getUserProducts(userAddress);
      return productIds.map(id => Number(id));
    } catch (error) {
      console.error('Failed to get user products:', error);
      return [];
    }
  }

  // Get contract statistics
  async getStats(): Promise<{ totalProducts: number; totalEmissionFactor: number; totalEcoScore: number }> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const stats = await this.contract.getStats();
      return {
        totalProducts: Number(stats[0]),
        totalEmissionFactor: Number(ethers.formatUnits(stats[1], 3)),
        totalEcoScore: Number(stats[2])
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return { totalProducts: 0, totalEmissionFactor: 0, totalEcoScore: 0 };
    }
  }

  // Update product eco score
  async updateEcoScore(productId: number, newEcoScore: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      const tx = await this.contract.updateEcoScore(productId, newEcoScore);
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      return receipt.hash;
    } catch (error) {
      console.error('Failed to update eco score:', error);
      throw error;
    }
  }

  // Get contract address
  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }

  // Get explorer URL for a transaction
  getExplorerUrl(txHash: string): string {
    const config = getContractConfig(NETWORK as any);
    return `${config.explorerUrl}/transactions/${txHash}`;
  }

  // Check if contract is connected
  isConnected(): boolean {
    return this.contract !== null && this.signer !== null;
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
