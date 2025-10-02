# VeChain Testnet Deployment Guide

## Overview
This guide will help you deploy your EcoLedger smart contract to VeChain Testnet and connect it to your frontend application.

## Prerequisites

### 1. **VeChain Testnet Setup**
- VeChain Testnet account
- Test VET tokens for gas fees
- VeChain wallet (VeWorld, Sync2, or private key)

### 2. **Development Tools**
- VeChain IDE or Remix IDE
- VeChain SDK packages
- Contract deployment tools

## Step 1: Get Test VET Tokens

### **VeChain Testnet Faucet**
1. Go to [VeChain Faucet](https://faucet.vecha.in)
2. Enter your wallet address
3. Request test VET tokens (you'll need these for gas fees)
4. Wait for tokens to arrive (usually within minutes)

### **Alternative Faucets**
- [VeChain Testnet Faucet](https://faucet.vecha.in)
- [VeChain Discord Faucet](https://discord.gg/vechain) (ask in #faucet channel)

## Step 2: Deploy Smart Contract

### **Option A: Using VeChain IDE (Recommended)**

1. **Open VeChain IDE**
   - Go to [VeChain IDE](https://ide.vecha.in)
   - Connect your wallet (VeWorld, Sync2, or private key)

2. **Create New Project**
   - Click "New Project"
   - Name: "EcoLedger"
   - Select "Solidity" as language

3. **Deploy Contract**
   - Copy your `EcoLedger.sol` contract code
   - Paste into the IDE
   - Click "Compile" to check for errors
   - Click "Deploy" to deploy to Testnet
   - **Save the contract address** (you'll need this)

### **Option B: Using Remix IDE**

1. **Open Remix IDE**
   - Go to [Remix IDE](https://remix.ethereum.org)
   - Create new file: `EcoLedger.sol`

2. **Configure VeChain Network**
   - Go to "Deploy & Run Transactions"
   - Select "Injected Web3" as environment
   - Connect your VeChain wallet
   - Select VeChain Testnet network

3. **Deploy Contract**
   - Copy your contract code
   - Compile the contract
   - Deploy to VeChain Testnet
   - **Save the contract address**

## Step 3: Update Frontend Configuration

### **1. Install VeChain SDK**
```bash
cd frontend
npm install @vechain/sdk-core @vechain/sdk-network @vechain/sdk-ethers-adapter
```

### **2. Update Contract Address**
```typescript
// In frontend/src/services/vechain-simple.ts
export const vechainService = new VeChainService(
  '0xYOUR_DEPLOYED_CONTRACT_ADDRESS' // Replace with actual address
);
```

### **3. Create Real VeChain Service**
```typescript
// frontend/src/services/vechain-real.ts
import { ThorClient } from '@vechain/sdk-core';
import { getNetworkConfig } from '@vechain/sdk-network';

export class RealVeChainService {
  private thorClient: ThorClient;
  private contractAddress: string;
  private privateKey?: string;

  constructor(contractAddress: string) {
    this.thorClient = new ThorClient('https://testnet.veblocks.net');
    this.contractAddress = contractAddress;
  }

  // Real blockchain implementation
  async addProduct(product: any): Promise<string> {
    // Implement real VeChain transaction
    // This would use the actual VeChain SDK
  }
}
```

## Step 4: Test Deployment

### **1. Verify Contract on Explorer**
- Go to [VeChain Testnet Explorer](https://explore-testnet.vechain.org)
- Search for your contract address
- Verify the contract is deployed and visible

### **2. Test Contract Functions**
- Use the explorer to call contract functions
- Test `addProduct` function
- Verify events are emitted correctly

### **3. Test Frontend Integration**
- Update frontend to use real contract address
- Test wallet connection
- Test product addition to blockchain
- Verify transactions appear in explorer

## Step 5: Production Configuration

### **1. Environment Variables**
```typescript
// frontend/src/config/vechain.ts
export const VECHAIN_CONFIG = {
  testnet: {
    node: 'https://testnet.veblocks.net',
    explorer: 'https://explore-testnet.vechain.org',
    contractAddress: '0xYOUR_CONTRACT_ADDRESS'
  },
  mainnet: {
    node: 'https://mainnet.veblocks.net',
    explorer: 'https://explore.vechain.org',
    contractAddress: '0xYOUR_MAINNET_CONTRACT_ADDRESS'
  }
};
```

### **2. Network Detection**
```typescript
// Detect current network
const getCurrentNetwork = () => {
  if (window.location.hostname === 'localhost') {
    return 'testnet';
  }
  return 'mainnet';
};
```

## Step 6: Real Blockchain Integration

### **1. Replace Simulated Functions**
```typescript
// Replace simulated addProduct with real implementation
async addProduct(product: any): Promise<string> {
  const transaction = {
    to: this.contractAddress,
    data: this.encodeAddProduct(product),
    gas: 50000,
    gasPrice: 1000000000
  };

  const result = await this.thorClient.transactions.send(transaction);
  return result.id;
}
```

### **2. Real Wallet Integration**
```typescript
// Connect to real VeChain wallet
const connectWallet = async () => {
  if (window.vechain) {
    const accounts = await window.vechain.request({
      method: 'eth_requestAccounts'
    });
    return accounts[0];
  }
  throw new Error('VeChain wallet not found');
};
```

## Step 7: Testing Checklist

### **Contract Deployment**
- [ ] Contract deployed to VeChain Testnet
- [ ] Contract address saved
- [ ] Contract visible on explorer
- [ ] Functions callable from explorer

### **Frontend Integration**
- [ ] Contract address updated in frontend
- [ ] VeChain SDK installed
- [ ] Wallet connection working
- [ ] Product addition to blockchain working
- [ ] Transactions visible in explorer

### **User Experience**
- [ ] Demo mode notices removed/updated
- [ ] Real transaction hashes generated
- [ ] Explorer links working correctly
- [ ] Error handling implemented

## Troubleshooting

### **Common Issues**

1. **"Insufficient VET for gas"**
   - Get more test VET from faucet
   - Check gas price settings

2. **"Contract not found"**
   - Verify contract address is correct
   - Check if contract is deployed to correct network

3. **"Transaction failed"**
   - Check gas limit
   - Verify contract function parameters
   - Check network connection

4. **"Wallet not connected"**
   - Ensure VeChain wallet is installed
   - Check network selection
   - Verify wallet permissions

## Useful Resources

### **VeChain Documentation**
- [VeChain Developer Docs](https://docs.vechain.org)
- [VeChain SDK Guide](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk)
- [VeChain IDE](https://ide.vecha.in)

### **Explorer & Faucet**
- [VeChain Testnet Explorer](https://explore-testnet.vechain.org)
- [VeChain Faucet](https://faucet.vecha.in)
- [VeChain Mainnet Explorer](https://explore.vechain.org)

### **Community Support**
- [VeChain Discord](https://discord.gg/vechain)
- [VeChain Telegram](https://t.me/vechain_official_english)
- [VeChain GitHub](https://github.com/vechain)

## Next Steps

1. **Deploy to Testnet** - Follow steps 1-3
2. **Test Integration** - Follow step 4
3. **Update Frontend** - Follow step 5
4. **Real Implementation** - Follow step 6
5. **Production Ready** - Follow step 7

Your EcoLedger application will be running on the real VeChain blockchain! 🚀
