import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Link, Wallet } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useWallet, useWalletModal } from '@vechain/dapp-kit-react';

interface ProductFormData {
  name: string;
  carbonFootprint: string;
  ecoScore: string;
  metadata: string;
}

interface RegisterProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onBlockchainSubmit?: (data: ProductFormData) => void;
}

export function RegisterProductForm({ onSubmit, onBlockchainSubmit }: RegisterProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    carbonFootprint: '',
    ecoScore: '',
    metadata: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open: openWalletModal } = useWalletModal();
  const { isConnected, addProductToBlockchain, isLoading: blockchainLoading } = useBlockchain();

  const validateForm = () => {
    if (!formData.name || !formData.carbonFootprint || !formData.ecoScore) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    const ecoScore = parseInt(formData.ecoScore);
    if (ecoScore < 0 || ecoScore > 100) {
      toast({
        title: "Invalid EcoScore",
        description: "EcoScore must be between 0 and 100",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
    setFormData({ name: '', carbonFootprint: '', ecoScore: '', metadata: '' });
    
    toast({
      title: "Product registered!",
      description: `${formData.name} has been added to the database`,
    });
  };

  const handleBlockchainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to add products to the blockchain.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert form data to FrontendProduct format
      const productData = {
        id: Date.now().toString(), // Temporary ID
        name: formData.name,
        category: 'general', // Default category
        description: formData.metadata || '',
        ef: parseFloat(formData.carbonFootprint),
        ecoScore: parseInt(formData.ecoScore),
        carbonFootprint: parseFloat(formData.carbonFootprint)
      };

      const txHash = await addProductToBlockchain(productData);
      
      toast({
        title: "Product Added to Blockchain!",
        description: `Transaction hash: ${txHash.slice(0, 10)}...`,
      });

      // Call the blockchain submit callback if provided
      if (onBlockchainSubmit) {
        onBlockchainSubmit(formData);
      }

      setFormData({ name: '', carbonFootprint: '', ecoScore: '', metadata: '' });
      
    } catch (error) {
      toast({
        title: "Blockchain Error",
        description: error instanceof Error ? error.message : "Failed to add product to blockchain",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Register New Product
        </CardTitle>
        <CardDescription>
          Add a new sustainable product to the EcoLedger blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Organic Cotton T-Shirt"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carbonFootprint">Carbon Footprint (kg CO₂) *</Label>
              <Input
                id="carbonFootprint"
                type="number"
                step="0.01"
                placeholder="e.g., 2.5"
                value={formData.carbonFootprint}
                onChange={(e) => setFormData({ ...formData, carbonFootprint: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ecoScore">EcoScore (0-100) *</Label>
              <Input
                id="ecoScore"
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 85"
                value={formData.ecoScore}
                onChange={(e) => setFormData({ ...formData, ecoScore: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata">Additional Information</Label>
            <Textarea
              id="metadata"
              placeholder="e.g., Made from 100% organic cotton, Fair Trade certified..."
              value={formData.metadata}
              onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSubmit}
              className="flex-1"
            >
              Register to Database
            </Button>
            <Button 
              type="button" 
              onClick={!isConnected ? openWalletModal : handleBlockchainSubmit}
              disabled={isSubmitting || blockchainLoading}
              className="flex-1"
            >
              {!isConnected ? (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet First
                </>
              ) : isSubmitting || blockchainLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Adding to Blockchain...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Add to Blockchain
                </>
              )}
            </Button>
          </div>
          
          {!isConnected && (
            <div className="text-center text-sm text-muted-foreground">
              Connect your wallet to add products directly to the blockchain
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
