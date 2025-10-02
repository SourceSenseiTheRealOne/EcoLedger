import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductFormData {
  name: string;
  carbonFootprint: string;
  ecoScore: string;
  metadata: string;
}

interface RegisterProductFormProps {
  onSubmit: (data: ProductFormData) => void;
}

export function RegisterProductForm({ onSubmit }: RegisterProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    carbonFootprint: '',
    ecoScore: '',
    metadata: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.carbonFootprint || !formData.ecoScore) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const ecoScore = parseInt(formData.ecoScore);
    if (ecoScore < 0 || ecoScore > 100) {
      toast({
        title: "Invalid EcoScore",
        description: "EcoScore must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    setFormData({ name: '', carbonFootprint: '', ecoScore: '', metadata: '' });
    
    toast({
      title: "Product registered!",
      description: `${formData.name} has been added to the blockchain`,
    });
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

          <Button type="submit" className="w-full">
            Register Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
