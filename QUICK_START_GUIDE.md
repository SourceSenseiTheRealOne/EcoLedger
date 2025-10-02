# 🚀 EcoLedger Quick Start Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **VeChain Wallet** - [VeWorld](https://veworld.io/) or [Sync2](https://sync2.vecha.in/)

## ⚡ Quick Setup (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ecoledger.git
cd ecoledger
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend/api
npm install

# Install frontend dependencies
cd ../../frontend
npm install
```

### 3. Start the Development Servers
```bash
# Terminal 1: Start backend (port 3001)
cd backend/api
npm run start:dev

# Terminal 2: Start frontend (port 5173)
cd frontend
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🎯 First Steps

### 1. Connect Your Wallet
1. Click "Connect Wallet" in the top-right corner
2. Select your VeChain wallet (VeWorld or Sync2)
3. Approve the connection

### 2. Add Products
1. Go to the "Add from DB" tab
2. Select products from the dropdown
3. Click "Add to Selection" to add them to your dashboard

### 3. Add to Blockchain
1. Click "Add to Chain" on any selected product
2. Confirm the transaction in your wallet
3. Wait for the transaction to be confirmed

### 4. Generate QR Codes
1. Click "Generate QR Code" on any product
2. Share the QR code or save it as an image

### 5. View on Explorer
1. Click "View on VeChain Explorer" on blockchain products
2. See your transaction on the VeChain blockchain

## 🔧 Development Commands

### Backend Commands
```bash
cd backend/api

# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run linter
npm run format             # Format code
```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev                # Start development server
npm run build              # Build for production
npm run preview            # Preview production build

# Code Quality
npm run lint               # Run linter
npm run type-check         # TypeScript type checking
```

## 🌐 Environment Configuration

### Frontend Environment (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_VECHAIN_NETWORK=testnet
VITE_CONTRACT_ADDRESS=0x...
```

### Backend Environment (.env)
```env
PORT=3001
NODE_ENV=development
VECHAIN_NETWORK=testnet
CONTRACT_ADDRESS=0x...
```

## 🔗 API Endpoints

### Products
```bash
# Get all products
GET http://localhost:3001/products

# Get specific product
GET http://localhost:3001/products/1
```

### CO2 Calculation
```bash
# Calculate carbon footprint
POST http://localhost:3001/co2/calculate
Content-Type: application/json

{
  "emissionFactor": 2.5,
  "weight": 0.2
}
```

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
cd backend/api
npm run test

# Frontend tests (when implemented)
cd frontend
npm run test
```

### Test API Endpoints
```bash
# Using curl
curl http://localhost:3001/products

# Using Postman
# Import the API collection from docs/
```

## 🚀 Deployment

### Deploy to VeChain Testnet

1. **Get Test VET Tokens**
   - Visit [VeChain Faucet](https://faucet.vecha.in)
   - Enter your wallet address
   - Request test VET tokens

2. **Deploy Smart Contract**
   - Go to [VeChain IDE](https://ide.vecha.in)
   - Connect your wallet
   - Deploy `contracts/EcoLedger.sol`
   - Save the contract address

3. **Update Configuration**
   - Update contract address in frontend services
   - Restart the application

### Deploy to Production

1. **Build Applications**
   ```bash
   # Backend
   cd backend/api
   npm run build
   
   # Frontend
   cd frontend
   npm run build
   ```

2. **Deploy to Cloud**
   - Backend: Deploy to AWS, GCP, or Azure
   - Frontend: Deploy to Vercel, Netlify, or Cloudflare

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001

# Kill process on port 5173
npx kill-port 5173
```

#### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Wallet Connection Issues
- Ensure VeChain wallet is installed
- Check network connection
- Try refreshing the page
- Clear browser cache

#### Blockchain Transaction Issues
- Check if you have enough VET for gas
- Verify network connection
- Check transaction status on explorer

### Getting Help

1. **Check Documentation**
   - README.md
   - TECHNICAL_DOCUMENTATION.md
   - API documentation

2. **Community Support**
   - GitHub Issues
   - Discord Community
   - Stack Overflow

3. **Contact Support**
   - Email: support@ecoledger.com
   - Discord: [EcoLedger Community](https://discord.gg/ecoledger)

## 📚 Additional Resources

### Documentation
- [Full README](README.md)
- [Technical Documentation](TECHNICAL_DOCUMENTATION.md)
- [Business Plan](BUSINESS_PLAN.md)
- [API Documentation](API_INTEGRATION.md)

### External Resources
- [VeChain Documentation](https://docs.vechain.org)
- [React Documentation](https://reactjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools
- [VeChain IDE](https://ide.vecha.in)
- [VeChain Explorer](https://explore-testnet.vechain.org)
- [VeChain Faucet](https://faucet.vecha.in)
- [VeWorld Wallet](https://veworld.io/)

## 🎉 You're Ready!

Congratulations! You now have EcoLedger running locally. Here's what you can do next:

1. **Explore the Features**: Try all the features in the dashboard
2. **Read the Code**: Understand how the application works
3. **Make Changes**: Modify the code to add new features
4. **Deploy**: Deploy your own version to the cloud
5. **Contribute**: Submit pull requests and help improve the project

Happy coding! 🚀
