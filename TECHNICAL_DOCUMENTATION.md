# 🔧 EcoLedger Technical Documentation

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Smart Contract Details](#smart-contract-details)
- [API Reference](#api-reference)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Blockchain Integration](#blockchain-integration)
- [Database Schema](#database-schema)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Testing Strategy](#testing-strategy)
- [Deployment Guide](#deployment-guide)
- [Monitoring & Logging](#monitoring--logging)

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        EcoLedger Platform                      │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React)          │  Backend (NestJS)                │
│  ┌─────────────────────┐   │  ┌─────────────────────────────┐  │
│  │ • Dashboard         │   │  │ • Products API             │  │
│  │ • Wallet Connection │   │  │ • CO2 Calculation Service  │  │
│  │ • QR Generator      │   │  │ • Validation Layer         │  │
│  │ • Blockchain UI     │   │  │ • Error Handling           │  │
│  └─────────────────────┘   │  └─────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                    VeChain Blockchain                          │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ • EcoLedger Smart Contract                             │  │
│  │ • Product Data Storage                                 │  │
│  │ • Transaction History                                  │  │
│  │ • Event Logging                                        │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → Frontend React Components
2. **API Calls** → NestJS Backend Services
3. **Data Processing** → Business Logic & Validation
4. **Blockchain Storage** → VeChain Smart Contract
5. **Transaction Confirmation** → VeChain Network
6. **UI Update** → Real-time Frontend Updates

## Smart Contract Details

### Contract: EcoLedger.sol

**Network**: VeChain Testnet/Mainnet
**Solidity Version**: ^0.8.19
**License**: MIT

### Contract Structure

```solidity
contract EcoLedger {
    // State Variables
    mapping(uint256 => Product) public products;
    mapping(address => uint256[]) public userProducts;
    uint256 public productCounter;
    address public owner;
    
    // Events
    event ProductAdded(uint256 indexed productId, ...);
    event ProductUpdated(uint256 indexed productId, ...);
    
    // Functions
    function addProduct(...) public returns (uint256);
    function getProduct(uint256) public view returns (...);
    function getUserProducts(address) public view returns (uint256[]);
    function updateEcoScore(uint256, uint256) public;
    function getStats() public view returns (uint256, uint256, uint256);
}
```

### Product Struct

```solidity
struct Product {
    string name;           // Product name
    string category;       // Product category
    string description;    // Product description
    uint256 emissionFactor; // CO2 emission factor (scaled by 1000)
    uint256 ecoScore;     // Eco score (0-100)
    uint256 timestamp;    // Creation timestamp
    address owner;        // Product owner address
    bool exists;          // Product existence flag
}
```

### Gas Optimization

- **Struct Packing**: Optimized struct layout for gas efficiency
- **Event Usage**: Events for data that doesn't need on-chain storage
- **Batch Operations**: Support for multiple product additions
- **Storage Optimization**: Minimal storage usage for cost efficiency

## API Reference

### Base URL
```
Development: http://localhost:3001
Production: https://api.ecoledger.com
```

### Products Endpoints

#### GET /products
Get all available products

**Response**:
```json
{
  "products": [
    {
      "id": "1",
      "name": "Organic Cotton T-Shirt",
      "category": "Clothing",
      "description": "100% organic cotton t-shirt",
      "ef": 2.5,
      "bestCo2g": 2.0,
      "worstCo2g": 3.0
    }
  ]
}
```

#### GET /products/:id
Get specific product by ID

**Response**:
```json
{
  "id": "1",
  "name": "Organic Cotton T-Shirt",
  "category": "Clothing",
  "description": "100% organic cotton t-shirt",
  "ef": 2.5,
  "bestCo2g": 2.0,
  "worstCo2g": 3.0
}
```

### CO2 Calculation Endpoints

#### POST /co2/calculate
Calculate carbon footprint and eco-score

**Request Body**:
```json
{
  "emissionFactor": 2.5,
  "weight": 0.2
}
```

**Response**:
```json
{
  "carbonFootprint": 0.5,
  "ecoScore": 85,
  "category": "Excellent"
}
```

### Error Responses

```json
{
  "statusCode": 400,
  "message": "Invalid emission factor",
  "error": "Bad Request"
}
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Dashboard
│   ├── WelcomeModal
│   ├── WalletConnection
│   ├── Tabs
│   │   ├── ProductSelector
│   │   ├── BlockchainProducts
│   │   └── WalletTab
│   └── ProductCards
│       ├── ProductCard
│       ├── BlockchainProductCard
│       └── QRCodeGenerator
└── Router
    ├── Index
    └── NotFound
```

### State Management

```typescript
// Global State
interface AppState {
  selectedProducts: FrontendProduct[];
  blockchainProducts: BlockchainProduct[];
  wallet: {
    isConnected: boolean;
    address: string;
    balance: string;
  };
  ui: {
    showWelcomeModal: boolean;
    showHelpButton: boolean;
  };
}
```

### Custom Hooks

#### useBlockchain
```typescript
const {
  isConnected,
  walletAddress,
  connectWallet,
  disconnectWallet,
  addProductToBlockchain,
  getUserProductsFromBlockchain,
  getExplorerUrl
} = useBlockchain();
```

#### useProducts
```typescript
const {
  products,
  loading,
  error,
  fetchProducts,
  addProduct,
  removeProduct
} = useProducts();
```

### Service Layer

#### API Service
```typescript
class ApiService {
  async getProducts(): Promise<BackendProduct[]>
  async calculateCO2(emissionFactor: number, weight: number): Promise<CO2Result>
}
```

#### VeChain Service
```typescript
class VeChainService {
  async addProduct(product: Product): Promise<string>
  async getProduct(productId: number): Promise<Product>
  async getUserProducts(address: string): Promise<number[]>
  getExplorerUrl(txHash: string): string
}
```

## Backend Architecture

### Module Structure

```
src/
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
├── products/               # Products module
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── co2/                    # CO2 calculation module
│   ├── co2.controller.ts
│   ├── co2.service.ts
│   └── co2.module.ts
└── common/                 # Shared utilities
    ├── filters/
    ├── guards/
    └── interceptors/
```

### Service Layer

#### Products Service
```typescript
@Injectable()
export class ProductsService {
  private readonly products: BackendProduct[] = [...];
  
  findAll(): BackendProduct[] {
    return this.products;
  }
  
  findOne(id: string): BackendProduct {
    return this.products.find(p => p.id === id);
  }
}
```

#### CO2 Service
```typescript
@Injectable()
export class CO2Service {
  calculateEcoScore(emissionFactor: number): number {
    // Eco-score calculation logic
  }
  
  calculateCarbonFootprint(emissionFactor: number, weight: number): number {
    return emissionFactor * weight;
  }
}
```

### Validation

```typescript
export class CalculateCO2Dto {
  @IsNumber()
  @Min(0)
  emissionFactor: number;
  
  @IsNumber()
  @Min(0)
  weight: number;
}
```

## Blockchain Integration

### VeChain SDK Integration

```typescript
import { ThorClient } from '@vechain/sdk-core';
import { getNetworkConfig } from '@vechain/sdk-network';

const thorClient = new ThorClient('https://testnet.veblocks.net');
```

### Transaction Flow

1. **Prepare Transaction**
   ```typescript
   const transaction = {
     to: contractAddress,
     data: encodedFunctionCall,
     gas: 50000,
     gasPrice: 1000000000
   };
   ```

2. **Sign Transaction**
   ```typescript
   const signedTx = await wallet.signTransaction(transaction);
   ```

3. **Send Transaction**
   ```typescript
   const result = await thorClient.transactions.send(signedTx);
   ```

4. **Wait for Confirmation**
   ```typescript
   const receipt = await thorClient.transactions.waitForTransaction(result.id);
   ```

### Event Handling

```typescript
// Listen for ProductAdded events
const filter = {
  address: contractAddress,
  topics: [keccak256('ProductAdded(uint256,string,string,uint256,uint256,address)')]
};

const events = await thorClient.logs.filter(filter);
```

## Database Schema

### Products Table (In-Memory)

```typescript
interface BackendProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  ef: number;           // Emission factor
  bestCo2g: number;     // Best case CO2
  worstCo2g: number;    // Worst case CO2
}
```

### Blockchain Storage

```solidity
// Stored on VeChain blockchain
struct Product {
    string name;
    string category;
    string description;
    uint256 emissionFactor;
    uint256 ecoScore;
    uint256 timestamp;
    address owner;
    bool exists;
}
```

## Security Considerations

### Frontend Security

- **Input Validation**: All user inputs validated
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection
- **Secure Storage**: Sensitive data encrypted in localStorage

### Backend Security

- **Input Sanitization**: All inputs sanitized and validated
- **Rate Limiting**: API rate limiting implemented
- **CORS Configuration**: Proper CORS headers
- **Error Handling**: Secure error messages

### Blockchain Security

- **Private Key Management**: Secure private key storage
- **Transaction Validation**: All transactions validated
- **Smart Contract Security**: Audited smart contract code
- **Access Control**: Proper access control mechanisms

## Performance Optimization

### Frontend Optimization

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large product lists
- **Image Optimization**: Optimized images and lazy loading

### Backend Optimization

- **Caching**: Redis caching for frequently accessed data
- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for API responses

### Blockchain Optimization

- **Gas Optimization**: Optimized smart contract code
- **Batch Operations**: Multiple operations in single transaction
- **Event Filtering**: Efficient event filtering
- **Caching**: Blockchain data caching

## Testing Strategy

### Frontend Testing

```typescript
// Component Testing
describe('ProductCard', () => {
  it('renders product information correctly', () => {
    // Test implementation
  });
});

// Integration Testing
describe('Dashboard Integration', () => {
  it('handles product selection flow', () => {
    // Test implementation
  });
});
```

### Backend Testing

```typescript
// Unit Testing
describe('ProductsService', () => {
  it('should return all products', () => {
    // Test implementation
  });
});

// E2E Testing
describe('Products API', () => {
  it('GET /products should return products', () => {
    // Test implementation
  });
});
```

### Blockchain Testing

```typescript
// Smart Contract Testing
describe('EcoLedger Contract', () => {
  it('should add product correctly', async () => {
    // Test implementation
  });
});
```

## Deployment Guide

### Development Deployment

1. **Start Backend**
   ```bash
   cd backend/api
   npm run start:dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

### Production Deployment

1. **Build Applications**
   ```bash
   # Backend
   cd backend/api
   npm run build
   
   # Frontend
   cd frontend
   npm run build
   ```

2. **Deploy to Servers**
   - Backend: Deploy to cloud provider (AWS, GCP, Azure)
   - Frontend: Deploy to CDN (Vercel, Netlify, Cloudflare)

3. **Configure Environment**
   - Set production environment variables
   - Configure database connections
   - Set up monitoring and logging

### Blockchain Deployment

1. **Deploy Smart Contract**
   - Use VeChain IDE or Remix
   - Deploy to VeChain Testnet/Mainnet
   - Verify contract deployment

2. **Update Configuration**
   - Update contract addresses
   - Configure network settings
   - Test blockchain integration

## Monitoring & Logging

### Application Monitoring

- **Performance Metrics**: Response times, throughput
- **Error Tracking**: Error rates and types
- **User Analytics**: User behavior and usage patterns
- **System Health**: CPU, memory, disk usage

### Blockchain Monitoring

- **Transaction Monitoring**: Transaction success rates
- **Gas Usage**: Gas consumption tracking
- **Event Monitoring**: Smart contract events
- **Network Status**: VeChain network health

### Logging Strategy

```typescript
// Structured Logging
logger.info('Product added to blockchain', {
  productId: '123',
  txHash: '0x...',
  userId: 'user123'
});
```

### Alerting

- **Error Alerts**: Critical errors and failures
- **Performance Alerts**: Performance degradation
- **Security Alerts**: Security incidents
- **Blockchain Alerts**: Transaction failures

---

This technical documentation provides comprehensive information about the EcoLedger platform's architecture, implementation, and deployment. For additional details, refer to the specific module documentation and code comments.
