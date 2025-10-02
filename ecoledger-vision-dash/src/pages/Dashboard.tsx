import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { RegisterProductForm } from '@/components/RegisterProductForm';
import { QRScanner } from '@/components/QRScanner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, PlusCircle, ScanLine, Leaf } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  ecoScore: number;
  carbonFootprint: number;
  metadata?: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod-001',
      name: 'Organic Cotton T-Shirt',
      ecoScore: 85,
      carbonFootprint: 2.3,
      metadata: '100% organic cotton, Fair Trade certified, biodegradable packaging',
    },
    {
      id: 'prod-002',
      name: 'Bamboo Water Bottle',
      ecoScore: 92,
      carbonFootprint: 1.1,
      metadata: 'Sustainable bamboo fiber, BPA-free, carbon-neutral shipping',
    },
    {
      id: 'prod-003',
      name: 'Recycled Notebook',
      ecoScore: 78,
      carbonFootprint: 0.8,
      metadata: '100% recycled paper, vegetable-based inks, plastic-free',
    },
    {
      id: 'prod-004',
      name: 'Solar Power Bank',
      ecoScore: 88,
      carbonFootprint: 3.5,
      metadata: 'Solar-powered charging, recycled materials, 5-year warranty',
    },
  ]);

  const handleRegisterProduct = (formData: any) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      ecoScore: parseInt(formData.ecoScore),
      carbonFootprint: parseFloat(formData.carbonFootprint),
      metadata: formData.metadata || undefined,
    };
    setProducts([newProduct, ...products]);
  };

  const totalProducts = products.length;
  const avgEcoScore = Math.round(
    products.reduce((sum, p) => sum + p.ecoScore, 0) / totalProducts
  );
  const totalCarbonSaved = products.reduce((sum, p) => sum + p.carbonFootprint, 0).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  EcoLedger
                </h1>
                <p className="text-xs text-muted-foreground">Blockchain Sustainability Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground mb-1">Total Products</p>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground mb-1">Avg EcoScore</p>
            <p className="text-3xl font-bold text-success">{avgEcoScore}/100</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground mb-1">Carbon Tracked</p>
            <p className="text-3xl font-bold">{totalCarbonSaved} kg CO₂</p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="products" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="register" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Register
            </TabsTrigger>
            <TabsTrigger value="scan" className="gap-2">
              <ScanLine className="w-4 h-4" />
              Scanner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Product Registry</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="max-w-2xl mx-auto">
              <RegisterProductForm onSubmit={handleRegisterProduct} />
            </div>
          </TabsContent>

          <TabsContent value="scan">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Try it:</strong> Copy a QR code value from any product card above and paste it here to verify the product!
                </p>
              </div>
              <QRScanner />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
