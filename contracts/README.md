# EcoLedger Smart Contracts

This directory contains the smart contracts for the EcoLedger project, designed to run on VeChain blockchain.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (for local VeChain Solo network)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile contracts:**
   ```bash
   npm run compile
   ```

3. **Run tests:**
   ```bash
   npm run test
   ```

## Deployment

### Local Development (VeChain Solo)

1. **Start VeChain Solo:**
   ```bash
   npm run solo-up
   # or
   docker-compose up -d
   ```

2. **Deploy to Solo:**
   ```bash
   npm run deploy:solo
   ```

3. **Stop Solo when done:**
   ```bash
   npm run solo-down
   # or
   docker-compose down
   ```

### Testnet Deployment

1. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your mnemonic and testnet URL
   ```

2. **Deploy to testnet:**
   ```bash
   npm run deploy:testnet
   ```

### Mainnet Deployment

1. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your mnemonic and mainnet URL
   ```

2. **Deploy to mainnet:**
   ```bash
   npm run deploy:mainnet
   ```

## Contract Details

### EcoLedger Contract

The main contract that manages product sustainability data:

- **Functions:**
  - `addProduct()` - Add a new product with sustainability data
  - `getProduct()` - Retrieve product information
  - `getUserProducts()` - Get all products for a user
  - `updateEcoScore()` - Update product eco score
  - `getStats()` - Get contract statistics

- **Events:**
  - `ProductAdded` - Emitted when a product is added
  - `ProductUpdated` - Emitted when a product is updated

## File Structure

```
contracts/
├── contracts/
│   └── EcoLedger.sol          # Main smart contract
├── scripts/
│   └── deploy.ts              # Deployment script
├── test/
│   └── EcoLedger.test.ts      # Contract tests
├── utils/
│   └── abi.ts                 # ABI utilities
├── deployments/               # Deployment artifacts (auto-generated)
├── hardhat.config.ts          # Hardhat configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── docker-compose.yaml        # VeChain Solo setup
└── Makefile                   # Build commands
```

## Available Scripts

- `npm run compile` - Compile contracts
- `npm run test` - Run tests on Hardhat network
- `npm run test:solo` - Run tests on VeChain Solo
- `npm run deploy:solo` - Deploy to VeChain Solo
- `npm run deploy:testnet` - Deploy to VeChain Testnet
- `npm run deploy:mainnet` - Deploy to VeChain Mainnet
- `npm run solo-up` - Start VeChain Solo
- `npm run solo-down` - Stop VeChain Solo
- `npm run clean` - Clean build artifacts

## Network Configuration

The project supports three networks:

1. **Hardhat** - Local testing (chainId: 1337)
2. **VeChain Solo** - Local VeChain network (chainId: 818)
3. **VeChain Testnet** - VeChain testnet (chainId: 39)
4. **VeChain Mainnet** - VeChain mainnet (chainId: 1)

## Security Notes

- Never commit your `.env` file with real mnemonics
- Use testnet for development and testing
- Verify contracts on VeChain Explorer after deployment
- Keep your private keys secure
