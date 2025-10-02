import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Leaf } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { FrontendProduct } from '@/services/api';

interface ProductSelectorProps {
  onProductSelect: (product: FrontendProduct) => void;
  selectedProductIds: string[];
}

export const ProductSelector = ({ onProductSelect, selectedProductIds }: ProductSelectorProps) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const { data: products, isLoading, error } = useProducts();

  const handleAddProduct = () => {
    if (!selectedProductId || !products) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (product && !selectedProductIds.includes(product.id)) {
      onProductSelect(product);
      setSelectedProductId('');
    }
  };

  const availableProducts = products?.filter(product => !selectedProductIds.includes(product.id)) || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading products...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading products: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Product to Registry
        </CardTitle>
        <CardDescription>
          Select a product from the database to add to your registry
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose a product..." />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{product.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {product.category}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddProduct}
            disabled={!selectedProductId || availableProducts.length === 0}
            className="px-6"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        {availableProducts.length === 0 && selectedProductIds.length > 0 && (
          <div className="text-center text-muted-foreground py-4">
            <Leaf className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>All available products have been added to your registry!</p>
          </div>
        )}
        
        {products && products.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <p>No products available in the database.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
