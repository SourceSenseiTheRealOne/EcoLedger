import { Injectable } from '@nestjs/common';

// Emission Factors (EF) - kg CO2 per kg of product (based on real-world data)
const EF = {
  // Low impact materials
  paper: { kgCO2PerKg: 0.8 },      // Recycled paper
  cardboard: { kgCO2PerKg: 1.2 },  // Cardboard packaging
  glass: { kgCO2PerKg: 1.0 },      // Recycled glass
  bamboo: { kgCO2PerKg: 0.5 },     // Bamboo products
  
  // Medium impact materials
  plastic: { kgCO2PerKg: 6.0 },    // Virgin plastic
  aluminum: { kgCO2PerKg: 8.2 },   // Aluminum (recycled: 2.5)
  steel: { kgCO2PerKg: 1.8 },      // Steel (recycled: 0.5)
  concrete: { kgCO2PerKg: 0.13 },  // Concrete
  
  // High impact materials
  cotton: { kgCO2PerKg: 27.0 },    // Conventional cotton
  polyester: { kgCO2PerKg: 5.5 },  // Polyester fabric
  leather: { kgCO2PerKg: 15.0 },   // Leather
  electronics: { kgCO2PerKg: 25.0 }, // Electronic devices
  
  // Very high impact materials
  beef: { kgCO2PerKg: 60.0 },      // Beef (for comparison)
  cement: { kgCO2PerKg: 0.9 },     // Cement
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
    // EXCELLENT ECO SCORE (80-100) - Low impact materials
    {
      id: '1',
      name: 'Bamboo Cutlery Set',
      category: 'bamboo',
      description: 'Reusable bamboo cutlery set with carrying case',
      ef: EF.bamboo.kgCO2PerKg,
      bestCo2g: 2,
      worstCo2g: 10,
    },
    {
      id: '2',
      name: 'Recycled Paper Notebook',
      category: 'paper',
      description: 'A4 notebook made from 100% recycled paper',
      ef: EF.paper.kgCO2PerKg,
      bestCo2g: 3,
      worstCo2g: 15,
    },
    {
      id: '3',
      name: 'Recycled Glass Bottle',
      category: 'glass',
      description: '500ml glass bottle made from recycled glass',
      ef: EF.glass.kgCO2PerKg,
      bestCo2g: 5,
      worstCo2g: 20,
    },
    {
      id: '4',
      name: 'Cardboard Packaging Box',
      category: 'cardboard',
      description: 'Eco-friendly cardboard packaging box',
      ef: EF.cardboard.kgCO2PerKg,
      bestCo2g: 4,
      worstCo2g: 25,
    },
    
    // GOOD ECO SCORE (60-79) - Medium impact materials
    {
      id: '5',
      name: 'Recycled Steel Water Bottle',
      category: 'steel',
      description: 'Stainless steel water bottle made from recycled steel',
      ef: 0.5, // Recycled steel
      bestCo2g: 8,
      worstCo2g: 50,
    },
    {
      id: '6',
      name: 'Recycled Aluminum Can',
      category: 'aluminum',
      description: '330ml aluminum can made from recycled aluminum',
      ef: 2.5, // Recycled aluminum
      bestCo2g: 10,
      worstCo2g: 60,
    },
    {
      id: '7',
      name: 'Concrete Building Block',
      category: 'concrete',
      description: 'Standard concrete building block',
      ef: EF.concrete.kgCO2PerKg,
      bestCo2g: 1,
      worstCo2g: 5,
    },
    {
      id: '8',
      name: 'Polyester Jacket',
      category: 'polyester',
      description: 'Outdoor jacket made from recycled polyester',
      ef: EF.polyester.kgCO2PerKg,
      bestCo2g: 15,
      worstCo2g: 100,
    },
    
    // FAIR ECO SCORE (40-59) - Higher impact materials
    {
      id: '9',
      name: 'Virgin Plastic Bottle',
      category: 'plastic',
      description: '500ml plastic water bottle made from virgin plastic',
      ef: EF.plastic.kgCO2PerKg,
      bestCo2g: 20,
      worstCo2g: 150,
    },
    {
      id: '10',
      name: 'Leather Handbag',
      category: 'leather',
      description: 'Genuine leather handbag',
      ef: EF.leather.kgCO2PerKg,
      bestCo2g: 30,
      worstCo2g: 200,
    },
    {
      id: '11',
      name: 'Virgin Aluminum Can',
      category: 'aluminum',
      description: '330ml aluminum can made from virgin aluminum',
      ef: EF.aluminum.kgCO2PerKg,
      bestCo2g: 25,
      worstCo2g: 180,
    },
    {
      id: '12',
      name: 'Cement Bag',
      category: 'cement',
      description: '50kg bag of Portland cement',
      ef: EF.cement.kgCO2PerKg,
      bestCo2g: 5,
      worstCo2g: 30,
    },
    
    // POOR ECO SCORE (0-39) - Very high impact materials
    {
      id: '13',
      name: 'Conventional Cotton T-Shirt',
      category: 'cotton',
      description: '100% cotton t-shirt from conventional farming',
      ef: EF.cotton.kgCO2PerKg,
      bestCo2g: 50,
      worstCo2g: 500,
    },
    {
      id: '14',
      name: 'Smartphone',
      category: 'electronics',
      description: 'Standard smartphone with rare earth materials',
      ef: EF.electronics.kgCO2PerKg,
      bestCo2g: 100,
      worstCo2g: 800,
    },
    {
      id: '15',
      name: 'Laptop Computer',
      category: 'electronics',
      description: 'Laptop computer with high energy consumption',
      ef: 30.0, // Higher than smartphone due to larger size
      bestCo2g: 200,
      worstCo2g: 1200,
    },
    {
      id: '16',
      name: 'Beef Jerky (for comparison)',
      category: 'beef',
      description: 'Dried beef jerky - extremely high carbon footprint',
      ef: EF.beef.kgCO2PerKg,
      bestCo2g: 300,
      worstCo2g: 2000,
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
