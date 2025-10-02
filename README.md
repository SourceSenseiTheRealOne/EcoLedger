# 🌱 EcoLedger - Blockchain-Powered Carbon Footprint Tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VeChain](https://img.shields.io/badge/Blockchain-VeChain-green.svg)](https://vechain.org)
[![React](https://img.shields.io/badge/Frontend-React-blue.svg)](https://reactjs.org)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-red.svg)](https://nestjs.com)

> **A decentralized platform for tracking product carbon footprints and eco-scores using VeChain blockchain technology**

## 📋 Table of Contents

- [🌱 About EcoLedger](#-about-ecoledger)
- [✨ Key Features](#-key-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Technical Documentation](#-technical-documentation)
- [🔗 API Documentation](#-api-documentation)
- [🌐 Blockchain Integration](#-blockchain-integration)
- [📱 User Interface](#-user-interface)
- [🛠️ Development](#️-development)
- [🚀 Deployment](#-deployment)
- [📈 Business Plan & Roadmap](#-business-plan--roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌱 About EcoLedger

EcoLedger is a revolutionary blockchain-based platform that enables consumers and businesses to track, verify, and manage the carbon footprint of products throughout their lifecycle. Built on VeChain's enterprise-grade blockchain, EcoLedger provides transparent, immutable, and verifiable carbon footprint data that promotes sustainable consumption and environmental responsibility.

### 🎯 Mission

To create a transparent, trustworthy ecosystem where every product's environmental impact is tracked, verified, and accessible to all stakeholders, driving the transition to a sustainable economy.

### 🌍 Vision

A world where consumers can make informed decisions based on verified environmental data, and businesses are incentivized to reduce their carbon footprint through transparent, blockchain-verified sustainability metrics.

## ✨ Key Features

### 🔍 **Product Carbon Footprint Tracking**
- Real-time carbon footprint calculation based on emission factors
- Comprehensive product database with verified environmental data
- Dynamic eco-score calculation (0-100 scale)
- Category-based emission factor analysis

### ⛓️ **Blockchain Integration**
- **VeChain Testnet/Mainnet** integration for immutable data storage
- Smart contract-based product registration and verification
- Transparent transaction history and audit trails
- Decentralized data ownership and control

### 📱 **User-Friendly Interface**
- Intuitive dashboard for product management
- QR code generation and scanning capabilities
- Real-time blockchain transaction tracking
- Mobile-responsive design

### 🔐 **Wallet Integration**
- Secure VeChain wallet connection
- Private key management
- Transaction signing and verification
- Multi-wallet support

### 📊 **Analytics & Reporting**
- Carbon footprint analytics and trends
- Eco-score distribution analysis
- User sustainability metrics
- Export capabilities for reporting

## 🏗️ Tech Stack

### **Frontend**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: React Hooks + Context
- **Routing**: React Router DOM
- **Charts**: Recharts
- **QR Codes**: qrcode.react
- **Forms**: React Hook Form + Zod validation

### **Backend**
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Architecture**: Modular microservices
- **API**: RESTful APIs
- **Validation**: Class-validator

### **Blockchain**
- **Network**: VeChain Testnet/Mainnet
- **Smart Contracts**: Solidity ^0.8.19
- **SDK**: VeChain SDK Core, Network, Ethers Adapter
- **Wallet**: VeChain-compatible wallets (VeWorld, Sync2)

### **Development Tools**
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Testing**: Jest (Backend)
- **Version Control**: Git
- **IDE**: VS Code recommended

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**
- **VeChain Wallet** (VeWorld or Sync2)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ecoledger.git
   cd ecoledger
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend/api
   npm install

   # Install frontend dependencies
   cd ../../frontend
   npm install
   ```

3. **Start the development servers**
   ```bash
   # Terminal 1: Start backend
   cd backend/api
   npm run start:dev

   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### 🎯 First Steps

1. **Connect Wallet**: Click "Connect Wallet" to connect your VeChain wallet
2. **Add Products**: Use the "Add from DB" tab to select products from the database
3. **Add to Blockchain**: Click "Add to Chain" to store products on VeChain
4. **Generate QR Codes**: Create QR codes for easy product sharing
5. **View on Explorer**: Click "View on VeChain Explorer" to see blockchain transactions

## 📖 Technical Documentation

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   VeChain       │
│   (React)       │◄──►│   (NestJS)      │◄──►│   Blockchain    │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Products API  │    │ • Smart Contract│
│ • Wallet Conn   │    │ • CO2 Service   │    │ • Transactions  │
│ • QR Generator  │    │ • Validation    │    │ • Events        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Smart Contract

**Contract**: `EcoLedger.sol`
**Network**: VeChain Testnet/Mainnet
**Functions**:
- `addProduct()` - Add new product with carbon data
- `getProduct()` - Retrieve product information
- `getUserProducts()` - Get user's products
- `updateEcoScore()` - Update product eco-score
- `getStats()` - Get platform statistics

### Data Flow

1. **Product Selection**: User selects products from database
2. **Eco-Score Calculation**: Backend calculates carbon footprint and eco-score
3. **Blockchain Storage**: Product data stored on VeChain via smart contract
4. **Transaction Verification**: Transaction hash generated and stored
5. **QR Code Generation**: QR codes created for easy sharing
6. **Explorer Integration**: Direct links to VeChain explorer for verification

## 🔗 API Documentation

### Products Endpoint

```http
GET /products
```
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

### CO2 Calculation

```http
POST /co2/calculate
```
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
  "ecoScore": 85
}
```

## 🌐 Blockchain Integration

### VeChain Smart Contract

The `EcoLedger` smart contract provides:

- **Immutable Storage**: Product data stored permanently on blockchain
- **Transparency**: All transactions are publicly verifiable
- **Ownership**: Users own their product data
- **Events**: Real-time notifications for product additions/updates

### Wallet Integration

- **VeWorld Wallet**: Primary wallet integration
- **Sync2 Wallet**: Alternative wallet option
- **Private Key**: Secure key management
- **Transaction Signing**: Automatic transaction signing

### Transaction Flow

1. User initiates product addition
2. Frontend calls smart contract function
3. Transaction signed with user's private key
4. Transaction broadcast to VeChain network
5. Transaction hash returned and stored
6. User can view transaction on VeChain explorer

## 📱 User Interface

### Dashboard Features

- **Product Management**: Add, view, and manage products
- **Wallet Connection**: Secure VeChain wallet integration
- **QR Code Generation**: Create shareable QR codes
- **Blockchain Integration**: Add products to VeChain
- **Explorer Links**: Direct access to VeChain explorer

### Components

- **ProductCard**: Display product information and actions
- **BlockchainProductCard**: Show blockchain-stored products
- **WalletConnection**: Handle wallet connection and management
- **QRCodeGenerator**: Generate QR codes for products
- **WelcomeModal**: Onboarding and tutorial system

## 🛠️ Development

### Project Structure

```
ecoledger/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and blockchain services
│   │   └── lib/            # Utility functions
│   └── package.json
├── backend/                 # NestJS backend API
│   └── api/
│       ├── src/
│       │   ├── products/   # Products module
│       │   ├── co2/        # CO2 calculation module
│       │   └── main.ts     # Application entry point
│       └── package.json
├── contracts/               # Smart contracts
│   └── EcoLedger.sol       # Main smart contract
├── scripts/                 # Deployment scripts
└── docs/                   # Documentation
```

### Development Commands

```bash
# Backend development
cd backend/api
npm run start:dev          # Start with hot reload
npm run build              # Build for production
npm run test               # Run tests
npm run lint               # Run linter

# Frontend development
cd frontend
npm run dev                # Start development server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Run linter
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Frontend (.env)**:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_VECHAIN_NETWORK=testnet
VITE_CONTRACT_ADDRESS=0x...
```

**Backend (.env)**:
```env
PORT=3001
NODE_ENV=development
```

## 🚀 Deployment

### VeChain Testnet Deployment

1. **Get Test VET Tokens**
   - Visit [VeChain Faucet](https://faucet.vecha.in)
   - Request test VET tokens for gas fees

2. **Deploy Smart Contract**
   - Use [VeChain IDE](https://ide.vecha.in)
   - Deploy `EcoLedger.sol` to Testnet
   - Save contract address

3. **Update Configuration**
   - Update contract address in frontend services
   - Configure VeChain network settings

4. **Deploy Frontend**
   - Build production version
   - Deploy to hosting service (Vercel, Netlify, etc.)

### Production Deployment

1. **Deploy to VeChain Mainnet**
2. **Update contract addresses**
3. **Configure production environment**
4. **Deploy to production servers**

## 📈 Business Plan & Roadmap

### 🎯 Business Model

#### **Revenue Streams**

1. **SaaS Subscription**
   - **Basic Plan**: $29/month - Up to 100 products
   - **Professional Plan**: $99/month - Up to 1,000 products
   - **Enterprise Plan**: $299/month - Unlimited products + API access

2. **API Licensing**
   - **Developer API**: $0.01 per API call
   - **Enterprise API**: Custom pricing for high-volume usage
   - **White-label Solutions**: Custom implementation for large clients

3. **Carbon Credits Marketplace**
   - **Transaction Fees**: 2-5% on carbon credit trades
   - **Verification Services**: $50-200 per verification
   - **Certification Programs**: $500-2,000 per certification

4. **Data Analytics & Insights**
   - **Sustainability Reports**: $500-5,000 per report
   - **Industry Benchmarks**: $1,000-10,000 per benchmark
   - **Custom Analytics**: $2,000-20,000 per project

#### **Target Market**

1. **Primary**: Sustainability-focused companies (500-5,000 employees)
2. **Secondary**: E-commerce platforms and marketplaces
3. **Tertiary**: Government agencies and NGOs
4. **Future**: Individual consumers and small businesses

### 🗺️ Roadmap

#### **Phase 1: MVP & Foundation (Q1 2024)**
- ✅ Core platform development
- ✅ VeChain blockchain integration
- ✅ Basic product tracking
- ✅ QR code generation
- ✅ Wallet integration

#### **Phase 2: Market Entry (Q2 2024)**
- 🔄 Beta testing with 10 pilot customers
- 🔄 Smart contract optimization
- 🔄 Mobile app development
- 🔄 API documentation and developer tools
- 🔄 Initial marketing and partnerships

#### **Phase 3: Scale & Growth (Q3-Q4 2024)**
- 📋 Public launch and marketing campaign
- 📋 Enterprise customer acquisition
- 📋 Advanced analytics and reporting
- 📋 Carbon credits marketplace
- 📋 International expansion

#### **Phase 4: Ecosystem Development (2025)**
- 📋 Third-party integrations
- 📋 Industry-specific solutions
- 📋 AI-powered sustainability insights
- 📋 Carbon offset programs
- 📋 Regulatory compliance tools

#### **Phase 5: Global Impact (2026+)**
- 📋 Global carbon tracking network
- 📋 Government partnerships
- 📋 Climate impact measurement
- 📋 Sustainable supply chain solutions
- 📋 Carbon neutrality certification

### 💰 Financial Projections

#### **Year 1 (2024)**
- **Revenue**: $50,000 - $100,000
- **Customers**: 50-100
- **Team Size**: 5-8 people
- **Focus**: Product development and market validation

#### **Year 2 (2025)**
- **Revenue**: $500,000 - $1,000,000
- **Customers**: 500-1,000
- **Team Size**: 15-25 people
- **Focus**: Scale and enterprise sales

#### **Year 3 (2026)**
- **Revenue**: $2,000,000 - $5,000,000
- **Customers**: 2,000-5,000
- **Team Size**: 30-50 people
- **Focus**: International expansion and ecosystem

### 🎯 Key Metrics

- **Monthly Recurring Revenue (MRR)**
- **Customer Acquisition Cost (CAC)**
- **Customer Lifetime Value (CLV)**
- **Churn Rate**
- **API Usage and Adoption**
- **Carbon Footprint Reduction Impact**

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**

1. **Code Contributions**
   - Bug fixes and feature implementations
   - Performance optimizations
   - Test coverage improvements

2. **Documentation**
   - API documentation updates
   - User guides and tutorials
   - Code comments and examples

3. **Testing**
   - Bug reporting and testing
   - User experience feedback
   - Performance testing

4. **Community**
   - Answering questions
   - Sharing use cases
   - Promoting the project

### **Getting Started**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Development Guidelines**

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VeChain Foundation** for blockchain infrastructure
- **React Community** for the amazing frontend framework
- **NestJS Team** for the robust backend framework
- **Open Source Contributors** for various libraries and tools
- **Sustainability Community** for inspiration and feedback

## 📚 Additional Documentation

- **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get up and running in 5 minutes
- **[Technical Documentation](TECHNICAL_DOCUMENTATION.md)** - Comprehensive technical details
- **[Business Plan](BUSINESS_PLAN.md)** - Business strategy and financial projections
- **[API Integration](frontend/API_INTEGRATION.md)** - API documentation and examples
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deploy to VeChain Testnet
- **[Blockchain Integration](BLOCKCHAIN_INTEGRATION.md)** - Smart contract details

## 📞 Contact & Support

- **Website**: [ecoledger.com](https://ecoledger.com)
- **Email**: support@ecoledger.com
- **Discord**: [EcoLedger Community](https://discord.gg/ecoledger)
- **Twitter**: [@EcoLedgerApp](https://twitter.com/EcoLedgerApp)
- **GitHub**: [github.com/ecoledger](https://github.com/ecoledger)

---

**Built with ❤️ for a sustainable future**

*EcoLedger - Where blockchain meets sustainability* 🌱
