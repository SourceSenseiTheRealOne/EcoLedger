import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Scan, CheckCircle2, AlertCircle, Leaf } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScannedProduct {
  id: string;
  name: string;
  ecoScore: number;
  carbonFootprint: number;
}

export function QRScanner() {
  const [scannedData, setScannedData] = useState<ScannedProduct | null>(null);
  const [manualInput, setManualInput] = useState('');

  const handleManualScan = () => {
    try {
      const data = JSON.parse(manualInput);
      if (data.id && data.name && data.ecoScore !== undefined && data.carbonFootprint !== undefined) {
        setScannedData(data);
        toast({
          title: "Product verified!",
          description: `${data.name} found on the blockchain`,
        });
      } else {
        throw new Error('Invalid product data');
      }
    } catch (error) {
      toast({
        title: "Invalid QR code",
        description: "Could not verify product data",
        variant: "destructive",
      });
    }
  };

  const getEcoScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success text-success-foreground';
    if (score >= 60) return 'bg-accent text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getEcoScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Scan Product QR Code
          </CardTitle>
          <CardDescription>
            Verify product authenticity and sustainability metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qrInput">Enter QR Code Data (JSON)</Label>
            <div className="flex gap-2">
              <Input
                id="qrInput"
                placeholder='{"id":"...","name":"...","ecoScore":85,...}'
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
              <Button onClick={handleManualScan}>
                <Scan className="w-4 h-4 mr-2" />
                Scan
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              In production, this would use your device's camera
            </p>
          </div>
        </CardContent>
      </Card>

      {scannedData && (
        <Card className="border-success/20 bg-gradient-to-br from-background to-success/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-6 h-6" />
              <CardTitle>Product Verified on Blockchain</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{scannedData.name}</h3>
              <Badge className={getEcoScoreColor(scannedData.ecoScore)}>
                <Leaf className="w-3 h-3 mr-1" />
                {getEcoScoreLabel(scannedData.ecoScore)} ({scannedData.ecoScore}/100)
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background border border-border">
                <p className="text-sm text-muted-foreground mb-1">Carbon Footprint</p>
                <p className="text-2xl font-bold">{scannedData.carbonFootprint} kg CO₂</p>
              </div>
              
              <div className="p-4 rounded-lg bg-background border border-border">
                <p className="text-sm text-muted-foreground mb-1">Product ID</p>
                <p className="text-sm font-mono">{scannedData.id.slice(0, 16)}...</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-accent-foreground mb-1">Blockchain Verified</p>
                <p className="text-muted-foreground">
                  This product's sustainability data is immutably recorded on the blockchain
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
