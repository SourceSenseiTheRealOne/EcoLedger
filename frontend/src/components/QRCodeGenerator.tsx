import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, QrCode } from 'lucide-react';
import { FrontendProduct } from '@/services/api';

interface QRCodeGeneratorProps {
  product: FrontendProduct;
}

export const QRCodeGenerator = ({ product }: QRCodeGeneratorProps) => {
  // Create a comprehensive product data object for the QR code
  const productData = {
    id: product.id,
    name: product.name,
    category: product.category,
    ecoScore: product.ecoScore,
    carbonFootprint: product.carbonFootprint,
    description: product.description,
    emissionFactor: product.ef,
    bestCo2g: product.bestCo2g,
    worstCo2g: product.worstCo2g,
    timestamp: new Date().toISOString(),
    platform: 'EcoLedger',
  };

  const qrData = JSON.stringify(productData, null, 2);

  const handleDownloadQR = () => {
    // Create a canvas element to render the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    // Create a temporary div to render the QR code
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);

    // Render QR code to canvas
    const qrElement = document.createElement('div');
    qrElement.innerHTML = `<div style="width: ${size}px; height: ${size}px;">${QRCodeSVG({ value: qrData, size: size })}</div>`;
    tempDiv.appendChild(qrElement);

    // Convert to image and download
    setTimeout(() => {
      const svgElement = qrElement.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = size;
          canvas.height = size;
          ctx?.drawImage(img, 0, 0);
          
          const link = document.createElement('a');
          link.download = `ecoledger-${product.name.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
      
      document.body.removeChild(tempDiv);
    }, 100);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="w-4 h-4" />
          Generate QR
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code for {product.name}
          </DialogTitle>
          <DialogDescription>
            Scan this QR code to view product sustainability information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
            <QRCodeSVG 
              value={qrData} 
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">EcoScore:</span>
              <span className="font-medium">{product.ecoScore}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Carbon Footprint:</span>
              <span className="font-medium">{product.carbonFootprint} kg CO₂/kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium capitalize">{product.category}</span>
            </div>
          </div>
          
          <Button onClick={handleDownloadQR} className="w-full gap-2">
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
