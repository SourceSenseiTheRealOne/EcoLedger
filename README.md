# 🌱 EcoLedger - Blockchain Sustainability Platform

> **VeChain Hackathon MVP** - A decentralized application for tracking and verifying product sustainability data on the blockchain.

[![VeChain](https://img.shields.io/badge/VeChain-Testnet-blue)](https://www.vechain.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-green)](https://soliditylang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [API Endpoints](#api-endpoints)
- [Blockchain Integration](#blockchain-integration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**EcoLedger** is a blockchain-based sustainability platform that allows users to register, track, and verify the environmental impact of products. Built for the VeChain Hackathon, this MVP demonstrates how blockchain technology can create transparent, immutable records of product sustainability data.

### 🏆 Hackathon Context

This project was developed as an **MVP (Minimum Viable Product)** for the VeChain Hackathon. It showcases the core functionality of a sustainability tracking platform using VeChain's blockchain technology. A complete, production-ready dApp will be developed after the hackathon with additional features, enhanced security, and scalability improvements.

### 🌟 Key Value Propositions

- **Transparency**: All product data is stored on the blockchain, ensuring immutability and transparency
- **Verification**: Products can be verified by scanning QR codes linked to blockchain transactions
- **Accessibility**: Anyone with a wallet can register products without complex company registration
- **Real-time**: Live blockchain integration with VeChain testnet
- **User-friendly**: Intuitive interface for both technical and non-technical users

## ✨ Features

### 🔗 Blockchain Integration
- **VeChain Testnet**: Live blockchain integration with real transactions
- **Wallet Connection**: VeChain DAppKit for seamless wallet integration
- **Transaction Verification**: QR codes link to VeChain Explorer for transaction verification
- **Real-time Data**: Products fetched directly from blockchain

### 📊 Product Management
- **Product Registry**: 16 pre-loaded sustainable products with real emission factors
- **EcoScore Calculation**: Dynamic sustainability scoring (0-100 scale)
- **Carbon Footprint Tracking**: CO2 emissions calculated and stored on blockchain
- **Category Classification**: Products organized by material type and sustainability impact

### 🎨 User Interface
- **Responsive Design**: Mobile-first design with desktop optimization
- **Tab-based Navigation**: Organized interface for different functionalities
- **Real-time Stats**: Dynamic statistics based on selected products
- **Interactive Cards**: Product cards with blockchain integration

### 🔧 Technical Features
- **Frontend-only Architecture**: No backend server required
- **Local API**: All product data and calculations handled in frontend
- **TypeScript**: Full type safety and better development experience
- **Modern React**: Hooks, context, and modern React patterns

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Dashboard │  │  Components │  │   Services  │         │
│  │             │  │             │  │             │         │
│  │ • Product   │  │ • Product   │  │ • Local API │         │
│  │   Registry  │  │   Cards     │  │ • Blockchain│         │
│  │ • Blockchain│  │ • QR Codes  │  │ • VeChain   │         │
│  │   Products  │  │ • Forms     │  │   DAppKit   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    VeChain Testnet                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ EcoLedger   │  │ VeChain     │  │ VeChain     │         │
│  │ Smart       │  │ DAppKit     │  │ Explorer    │         │
│  │ Contract    │  │ Wallet      │  │ (QR Links)  │         │
│  │             │  │ Integration │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons

### Blockchain
- **VeChain** - Blockchain platform for sustainability tracking
- **VeChain DAppKit** - Wallet integration and blockchain interaction
- **Solidity 0.8.20** - Smart contract development
- **Hardhat** - Development environment for smart contracts
- **OpenZeppelin** - Secure smart contract libraries

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

## 📁 Project Structure

```
EcoLedger/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Shadcn/ui components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── BlockchainProductCard.tsx
│   │   │   ├── RegisterProductForm.tsx
│   │   │   └── ...
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useBlockchain.ts
│   │   │   ├── useProducts.ts
│   │   │   └── ...
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/       # API and blockchain services
│   │   │   ├── api.ts
│   │   │   ├── local-api.ts
│   │   │   ├── vechain-dappkit.ts
│   │   │   └── ...
│   │   └── util/           # Utility functions
│   ├── public/             # Static assets
│   ├── package.json
│   └── vite.config.ts
├── contracts/              # Smart contracts
│   ├── contracts/
│   │   └── EcoLedger.sol   # Main smart contract
│   ├── scripts/
│   │   └── deploy-ecoledger.ts
│   ├── test/
│   │   └── EcoLedger.test.ts
│   ├── hardhat.config.ts
│   └── package.json
├── backend/                # NestJS backend (optional)
│   └── api/               # API endpoints and services
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **VeChain Wallet** (Sync2)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/EcoLedger.git
   cd ecoledger
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install contract dependencies** (optional)
   ```bash
   cd ../contracts
   npm install
   ```

### Running the Application

#### Frontend Development
```bash
cd frontend
npm run dev
```


#### Smart Contract Development
```bash
cd contracts
npm run compile          # Compile contracts
npm run test            # Run tests
npm run deploy:testnet  # Deploy to VeChain testnet
```

## 📜 Smart Contract

### EcoLedger Contract

The `EcoLedger.sol` contract is deployed on VeChain testnet and provides:

#### Key Functions
- `registerProduct()` - Register a new product with sustainability data
- `getWalletProducts()` - Get all products registered by a wallet
- `getProduct()` - Get specific product information
- `getGlobalStats()` - Get global sustainability statistics
- `updateProductCo2()` - Update product CO2 footprint
- `updateProductTxHash()` - Update product transaction hash

#### Contract Address
```
VeChain Testnet: 0x92e647e3bc952154e8336673c4acd1acdcbe63eb
```

#### Contract Features
- **No Company Registration**: Anyone can register products directly
- **Wallet-based Ownership**: Products are associated with wallet addresses
- **Transaction Hash Storage**: Each product stores its registration transaction hash
- **Global Statistics**: Track total products, wallets, and CO2 footprint
- **Immutable Records**: All data is stored permanently on the blockchain

## 🎨 Frontend

### Main Components

#### Dashboard
- **Product Registry**: View and manage selected products
- **Blockchain Products**: View products stored on blockchain
- **Add from Database**: Select from 16 pre-loaded sustainable products
- **Wallet Connection**: Connect VeChain wallet
- **Register New**: Register custom products

#### Product Cards
- **EcoScore Display**: Visual sustainability score (0-100)
- **Carbon Footprint**: CO2 emissions in kg
- **Blockchain Integration**: Add products to blockchain
- **QR Code Generation**: Automatic QR codes for blockchain products

#### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Desktop Support**: Enhanced experience on larger screens
- **Touch-friendly**: Easy interaction on all devices

## 🔌 API Endpoints

### Local API (Frontend)

All API endpoints are now handled locally in the frontend:

#### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get specific product
- `GET /products/emission-factors` - Get emission factors

#### CO2 Calculations
- `POST /co2/calculate` - Calculate CO2 footprint
- `POST /co2/calculate-simple` - Simple CO2 calculation
- `GET /co2/ecoscore-interpretation` - Get EcoScore interpretation

### Product Data

The application includes 16 pre-loaded sustainable products:

#### Excellent EcoScore (80-100)
- Bamboo Cutlery Set (0.5 kg CO2/kg)
- Recycled Paper Notebook (0.8 kg CO2/kg)
- Recycled Glass Bottle (1.0 kg CO2/kg)
- Cardboard Packaging Box (1.2 kg CO2/kg)

#### Good EcoScore (60-79)
- Recycled Steel Water Bottle (0.5 kg CO2/kg)
- Recycled Aluminum Can (2.5 kg CO2/kg)
- Concrete Building Block (0.13 kg CO2/kg)
- Polyester Jacket (5.5 kg CO2/kg)

#### Average EcoScore (40-59)
- Virgin Plastic Bottle (6.0 kg CO2/kg)
- Aluminum Foil (8.2 kg CO2/kg)
- Cotton T-Shirt (27.0 kg CO2/kg)
- Leather Wallet (15.0 kg CO2/kg)

#### Poor EcoScore (20-39)
- Smartphone (25.0 kg CO2/kg)
- Cement Block (0.9 kg CO2/kg)
- Laptop Computer (30.0 kg CO2/kg)
- Beef Jerky (60.0 kg CO2/kg)

## ⛓️ Blockchain Integration

### VeChain DAppKit

The application uses VeChain DAppKit for:

- **Wallet Connection**: Seamless wallet integration
- **Transaction Signing**: Secure transaction signing
- **Network Interaction**: Direct interaction with VeChain testnet
- **Event Listening**: Real-time blockchain event monitoring

### Transaction Flow

1. **User Selects Product**: Choose from database or register new
2. **Wallet Connection**: Connect VeChain wallet
3. **Transaction Creation**: Create blockchain transaction
4. **User Approval**: User signs transaction in wallet
5. **Blockchain Confirmation**: Transaction confirmed on VeChain
6. **QR Code Generation**: Automatic QR code with transaction hash
7. **Explorer Integration**: QR code links to VeChain Explorer

### QR Code Integration

- **Automatic Generation**: QR codes generated for all blockchain products
- **VeChain Explorer**: Direct links to transaction details
- **Verification**: Users can verify products by scanning QR codes
- **Mobile-friendly**: Easy scanning with mobile devices

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

#### Smart Contracts
```bash
npm run compile      # Compile contracts
npm run test         # Run tests
npm run deploy       # Deploy to testnet
npm run verify       # Verify contract on explorer
```

### Environment Variables

#### Frontend
```env
VITE_VECHAIN_NETWORK=testnet
VITE_CONTRACT_ADDRESS=0x92e647e3bc952154e8336673c4acd1acdcbe63eb
```

#### Smart Contracts
```env
VECHAIN_PRIVATE_KEY=your_private_key
VECHAIN_NETWORK=testnet
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🚀 Deployment

### Frontend Deployment

#### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

#### Netlify
```bash
npm run build
# Deploy to Netlify
```

#### Static Hosting
```bash
npm run build
# Upload dist/ folder to any static hosting
```

### Smart Contract Deployment

#### VeChain Testnet
```bash
cd contracts
npm run deploy:testnet
```

#### VeChain Mainnet
```bash
cd contracts
npm run deploy:mainnet
```

## 🔮 Future Development

### Post-Hackathon Roadmap

#### Phase 1: Enhanced Features
- **Company Registration**: Optional company profiles
- **Product Verification**: Third-party verification system
- **Supply Chain Tracking**: Multi-step supply chain tracking
- **Carbon Credits**: Integration with carbon credit markets

#### Phase 2: Advanced Functionality
- **AI Integration**: Machine learning for sustainability scoring
- **IoT Integration**: Real-time sensor data integration
- **Multi-chain Support**: Support for other blockchain networks
- **Mobile App**: Native mobile applications

#### Phase 3: Enterprise Features
- **Enterprise Dashboard**: Advanced analytics and reporting
- **API Access**: Public API for third-party integrations
- **White-label Solution**: Customizable platform for enterprises
- **Compliance Tools**: Regulatory compliance features

### Technical Improvements

#### Security
- **Audit**: Professional smart contract audit
- **Multi-sig**: Multi-signature wallet integration
- **Access Control**: Role-based access control
- **Encryption**: End-to-end encryption for sensitive data

#### Scalability
- **Layer 2**: Integration with VeChain Layer 2 solutions
- **Database**: Hybrid blockchain-database architecture
- **Caching**: Advanced caching strategies
- **CDN**: Content delivery network integration

#### User Experience
- **Progressive Web App**: PWA capabilities
- **Offline Support**: Offline functionality
- **Accessibility**: WCAG compliance
- **Internationalization**: Multi-language support

## 🤝 Contributing

### Hackathon Contributions

This project was developed for the VeChain Hackathon. Contributions are welcome:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Submit a pull request**

### Development Guidelines

- **Code Style**: Follow TypeScript and React best practices
- **Testing**: Write tests for new features
- **Documentation**: Update documentation for changes
- **Commit Messages**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VeChain Foundation** - For providing the blockchain platform
- **VeChain DAppKit Team** - For excellent developer tools
- **OpenZeppelin** - For secure smart contract libraries
- **React Community** - For the amazing React ecosystem
- **Hackathon Participants** - For inspiration and feedback

## 📞 Contact

- **Project**: EcoLedger
- **Hackathon**: VeChain Hackathon 2024
- **Status**: MVP - Production version coming soon
- **Website**: [Coming Soon]

---

**Built with ❤️ for the VeChain Hackathon**

*This is an MVP developed for demonstration purposes. A complete, production-ready version will be developed after the hackathon with enhanced features, security, and scalability.*