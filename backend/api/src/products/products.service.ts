import { Injectable } from '@nestjs/common';

// Emission Factors (EF) - kg CO2 per kg of product
const EF = {
  bottle: { kgCO2PerKg: 6.0 },     // Plastic bottle
  can:    { kgCO2PerKg: 8.0 },     // Aluminum can
  box:    { kgCO2PerKg: 1.5 },     // Cardboard box
  glass:  { kgCO2PerKg: 2.2 },     // Glass container
  paper:  { kgCO2PerKg: 0.8 },     // Paper product
  metal:  { kgCO2PerKg: 12.0 },    // Steel/metal product
  textile: { kgCO2PerKg: 15.0 },   // Textile product
  electronics: { kgCO2PerKg: 25.0 }, // Electronic device
};

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  ef: number; // kg CO2 per kg
  bestCo2g: number; // Best case CO2 in grams for ecoScore calculation
  worstCo2g: number; // Worst case CO2 in grams for ecoScore calculation
}

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    {
      id: '1',
      name: 'Plastic Water Bottle',
      category: 'bottle',
      description: '500ml plastic water bottle',
      ef: EF.bottle.kgCO2PerKg,
      bestCo2g: 10,
      worstCo2g: 2000,
    },
    {
      id: '2',
      name: 'Aluminum Soda Can',
      category: 'can',
      description: '330ml aluminum soda can',
      ef: EF.can.kgCO2PerKg,
      bestCo2g: 15,
      worstCo2g: 2500,
    },
    {
      id: '3',
      name: 'Cardboard Packaging',
      category: 'box',
      description: 'Recycled cardboard packaging box',
      ef: EF.box.kgCO2PerKg,
      bestCo2g: 5,
      worstCo2g: 800,
    },
    {
      id: '4',
      name: 'Glass Jar',
      category: 'glass',
      description: '500ml glass jar container',
      ef: EF.glass.kgCO2PerKg,
      bestCo2g: 8,
      worstCo2g: 1200,
    },
    {
      id: '5',
      name: 'Paper Notebook',
      category: 'paper',
      description: 'A4 recycled paper notebook',
      ef: EF.paper.kgCO2PerKg,
      bestCo2g: 3,
      worstCo2g: 500,
    },
    {
      id: '6',
      name: 'Steel Water Bottle',
      category: 'metal',
      description: 'Stainless steel reusable water bottle',
      ef: EF.metal.kgCO2PerKg,
      bestCo2g: 20,
      worstCo2g: 3000,
    },
    {
      id: '7',
      name: 'Organic Cotton T-Shirt',
      category: 'textile',
      description: '100% organic cotton t-shirt',
      ef: EF.textile.kgCO2PerKg,
      bestCo2g: 25,
      worstCo2g: 4000,
    },
    {
      id: '8',
      name: 'Smartphone',
      category: 'electronics',
      description: 'Smartphone with sustainable materials',
      ef: EF.electronics.kgCO2PerKg,
      bestCo2g: 50,
      worstCo2g: 8000,
    },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getEmissionFactors() {
    return EF;
  }
}
