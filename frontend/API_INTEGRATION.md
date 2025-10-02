# API Integration Documentation

## Overview
The frontend now integrates with the backend products API to fetch real product data instead of using hardcoded values.

## New Features

### 1. API Service (`src/services/api.ts`)
- Fetches products from backend API at `http://localhost:3001/products`
- Converts backend product format to frontend format
- Handles error cases and loading states
- Calculates ecoScore based on real-world CO2 emission factors with realistic scoring

### 2. Product Selection (`src/components/ProductSelector.tsx`)
- Dropdown to select products from the database
- Prevents duplicate selections
- Shows loading and error states
- Displays product categories and descriptions

### 3. QR Code Generation (`src/components/QRCodeGenerator.tsx`)
- Generates comprehensive QR codes with product data
- Includes product details, ecoScore, carbon footprint, and metadata
- Downloadable QR codes as PNG images
- Modal interface for better UX

### 4. Updated Dashboard (`src/pages/Dashboard.tsx`)
- New "Add from DB" tab for product selection
- State management for selected products array
- Product removal functionality
- Enhanced product display with QR generation
- Empty state with helpful guidance

## Backend Integration

### API Endpoints Used
- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch single product
- `GET /products/emission-factors` - Get emission factors

### Data Transformation
Backend products are transformed to include:
- Realistic ecoScore calculation based on emission factors (kg CO2/kg)
- Formatted metadata with category and description
- Consistent interface for frontend components

### Eco Score Calculation
The eco score is calculated based on real-world carbon footprint data:
- **Excellent (80-100)**: Low impact materials (bamboo, recycled paper, glass)
- **Good (60-79)**: Medium impact materials (recycled steel, aluminum, polyester)
- **Fair (40-59)**: Higher impact materials (virgin plastic, leather, virgin aluminum)
- **Poor (0-39)**: Very high impact materials (cotton, electronics, beef)

## Usage

1. **Start the backend**: `cd backend/api && npm run start:dev`
2. **Start the frontend**: `cd frontend && npm run dev`
3. **Add products**: Use the "Add from DB" tab to select products
4. **Generate QR codes**: Click the QR button on any product card
5. **Manage products**: Remove products or clear all selections

## Product Data Structure

### Backend Product
```typescript
interface BackendProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  ef: number; // kg CO2 per kg
  bestCo2g: number;
  worstCo2g: number;
}
```

### Frontend Product
```typescript
interface FrontendProduct {
  id: string;
  name: string;
  ecoScore: number; // Calculated from CO2 values
  carbonFootprint: number; // Uses emission factor
  metadata?: string; // Formatted description + category
  category: string;
  description: string;
  ef: number;
  bestCo2g: number;
  worstCo2g: number;
}
```

## Error Handling
- Network errors are caught and displayed to users
- Loading states prevent UI confusion
- Graceful fallbacks for missing data
- Retry mechanisms for failed requests
