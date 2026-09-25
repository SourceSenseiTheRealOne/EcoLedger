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
      title: "Demo only — not saved",
      description: `${formData.name} was not saved; database registration is not implemented.`,
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
        title: "Transaction ID returned — unconfirmed",
        description: `Receipt not checked: ${txHash.slice(0, 10)}...`,
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
          Self-reported Product Form
        </CardTitle>
        <CardDescription>
          Self-reported inputs only. Demo submit does not save; testnet submit does not confirm a receipt.
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
              <Label htmlFor="carbonFootprint">Claimed CO₂ (kg, assumes 1 kg product) *</Label>
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
              <Label htmlFor="ecoScore">Illustrative score (0-100, not stored on chain) *</Label>
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
            <Label htmlFor="metadata">Self-reported notes (not stored on chain)</Label>
            <Textarea
              id="metadata"
              placeholder="Describe the claim and its source; this prototype does not verify it."
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
              Demo only (not saved)
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
                  Requesting transaction...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Submit to Testnet
                </>
              )}
            </Button>
          </div>
          
          {!isConnected && (
            <div className="text-center text-sm text-muted-foreground">
              Testnet signing is real; records are owner-mutable and receipt confirmation is not implemented.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
