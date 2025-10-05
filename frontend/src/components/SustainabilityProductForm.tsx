import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useSustainabilityBlockchain } from '@/hooks/useSustainabilityBlockchain';
import { useWalletModal } from '@vechain/dapp-kit-react';

interface SustainabilityProductFormProps {
  onProductRegistered?: (txHash: string) => void;
}

const PRODUCT_CATEGORIES = [
  'clothing',
  'electronics',
  'food',
  'furniture',
  'automotive',
  'cosmetics',
  'packaging',
  'textiles',
  'footwear',
  'other'
];

export const SustainabilityProductForm: React.FC<SustainabilityProductFormProps> = ({
  onProductRegistered
}) => {
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [co2Footprint, setCo2Footprint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { 
    isConnected, 
    registerProduct, 
    isLoading, 
    error,
    isCompanyRegistered 
  } = useSustainabilityBlockchain();
  const { open: openWalletModal } = useWalletModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      openWalletModal();
      return;
    }

    if (!productId.trim() || !name.trim() || !category || !co2Footprint) {
      return;
    }

    const co2Value = parseFloat(co2Footprint);
    if (isNaN(co2Value) || co2Value <= 0) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);

    try {
      // Check if company is registered
      const companyRegistered = await isCompanyRegistered();
      if (!companyRegistered) {
        setSuccess('Please register your company first!');
        setIsSubmitting(false);
        return;
      }

      const txHash = await registerProduct(
        productId.trim(),
        name.trim(),
        category,
        co2Value
      );
      
      setSuccess(`Product registered successfully! Transaction: ${txHash}`);
      
      // Reset form
      setProductId('');
      setName('');
      setCategory('');
      setCo2Footprint('');
      
      if (onProductRegistered) {
        onProductRegistered(txHash);
      }
    } catch (err) {
      console.error('Failed to register product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Registration
          </CardTitle>
          <CardDescription>
            Connect your wallet to register products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={openWalletModal}
            className="w-full"
          >
            Connect Wallet to Register Products
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Registration
        </CardTitle>
        <CardDescription>
          Register your products with CO2 footprint data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              type="text"
              placeholder="e.g., PROD-001"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              disabled={isSubmitting || isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Eco-Friendly T-Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting || isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={isSubmitting || isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="co2Footprint">CO2 Footprint (grams)</Label>
            <Input
              id="co2Footprint"
              type="number"
              placeholder="e.g., 500"
              value={co2Footprint}
              onChange={(e) => setCo2Footprint(e.target.value)}
              disabled={isSubmitting || isLoading}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 rounded-md">
              <CheckCircle className="w-4 h-4" />
              <div className="flex-1">
                <div>{success.split('Transaction:')[0]}</div>
                {success.includes('Transaction:') && (
                  <a 
                    href={`https://explore-testnet.vechain.org/transactions/${success.split('Transaction: ')[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Transaction <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || isLoading || !productId.trim() || !name.trim() || !category || !co2Footprint}
            className="w-full"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Registering Product...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Register Product
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
