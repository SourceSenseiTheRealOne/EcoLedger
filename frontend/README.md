# EcoLedger Vision Dashboard

A blockchain-powered sustainability platform for tracking and verifying product eco-credentials.

## Features

- **Product Registration**: Register products with detailed sustainability information
- **QR Code Scanning**: Scan QR codes to view product sustainability data
- **EcoScore Tracking**: Monitor environmental impact scores
- **Carbon Footprint Analysis**: Track and visualize carbon emissions
- **Blockchain Verification**: Immutable sustainability records on VeChain

## Technologies

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - Modern UI library
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **VeChain** - Blockchain for sustainability verification

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecoledger-vision-dash
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ProductCard.tsx # Product display component
│   ├── QRScanner.tsx   # QR code scanning
│   └── RegisterProductForm.tsx # Product registration
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Index.tsx       # Landing page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.