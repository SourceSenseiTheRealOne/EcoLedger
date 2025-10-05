# 🚀 EcoLedger - Quick Start Guide

> **VeChain Hackathon MVP** - Get up and running in 5 minutes!

## ⚡ Quick Setup

### 1. Clone and Install
```bash
git clone https://github.com/your-username/EcoLedger.git
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Connect Wallet
1. Install [Sync2](https://sync2.vecha.in/) wallet
2. Switch to **VeChain Testnet**
3. Get test VET from [VeChain Faucet](https://faucet.vecha.in/)
4. Click "Connect Wallet" in the app

### 4. Try the App
1. **Add Products**: Go to "Add from DB" tab and select products
2. **Add to Blockchain**: Click "Add to Chain" on any product
3. **View Blockchain**: Check "Blockchain" tab to see your products
4. **Scan QR**: Scan QR codes to view transactions on VeChain Explorer

## 🎯 Key Features to Test

### Product Management
- ✅ **16 Pre-loaded Products** - Sustainable products with real emission factors
- ✅ **EcoScore Calculation** - Dynamic sustainability scoring (0-100)
- ✅ **Carbon Footprint** - CO2 emissions in kg and grams

### Blockchain Integration
- ✅ **Live Transactions** - Real VeChain testnet transactions
- ✅ **QR Code Verification** - Scan to view on VeChain Explorer
- ✅ **Wallet Integration** - Seamless VeChain DAppKit integration

### User Interface
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Real-time Stats** - Dynamic statistics based on selected products
- ✅ **Tab Navigation** - Organized interface for different features

## 🔧 Development Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📱 Mobile Testing

1. **Start dev server**: `npm run dev`
2. **Get local IP**: Check terminal for network URL
3. **Open on mobile**: Use the network URL on your phone
4. **Test wallet**: Connect VeWorld mobile app

## 🌐 Contract Information

- **Network**: VeChain Testnet
- **Contract**: `0x92e647e3bc952154e8336673c4acd1acdcbe63eb`
- **Explorer**: [VeChain Explorer](https://explore-testnet.vechain.org/)

## 🆘 Troubleshooting

### Wallet Issues
- Ensure you're on **VeChain Testnet**
- Get test VET from [faucet](https://faucet.vecha.in/)
- Try refreshing the page

### Transaction Issues
- Check wallet has enough VET for gas
- Ensure network is VeChain Testnet
- Try disconnecting and reconnecting wallet

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📚 Learn More

- **Full Documentation**: [README.md](README.md)
- **VeChain Docs**: [VeChain Documentation](https://docs.vechain.org/)
- **DAppKit Guide**: [VeChain DAppKit](https://docs.vechain.org/dapp-kit/)

---

**Ready to build the future of sustainability tracking! 🌱**
