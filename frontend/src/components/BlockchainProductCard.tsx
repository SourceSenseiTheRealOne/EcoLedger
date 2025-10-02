import { QRCodeSVG } from 'qrcode.react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Check, Link } from 'lucide-react';
import { useState } from 'react';

interface BlockchainProductCardProps {
  id: string;
  name: string;
  ecoScore: number;
  carbonFootprint: number;
  metadata?: string;
  txHash: string;
  onViewExplorer: (txHash: string) => void;
}

export function BlockchainProductCard({ 
  id, 
  name, 
  ecoScore, 
  carbonFootprint, 
  metadata,
  txHash,
  onViewExplorer
}: BlockchainProductCardProps) {
  const [copied, setCopied] = useState(false);

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

  const handleCopyTxHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewExplorer = () => {
    onViewExplorer(txHash);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:scale-[1.02] border-green-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getEcoScoreColor(ecoScore)}>
                {getEcoScoreLabel(ecoScore)} ({ecoScore}/100)
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Link className="w-3 h-3 mr-1" />
                On Chain
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm font-medium text-muted-foreground">Carbon Footprint</span>
          <span className="text-lg font-bold">{carbonFootprint} kg CO₂</span>
        </div>

        {/* Transaction Hash Section */}
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Transaction Hash</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyTxHash}
              className="h-6 px-2 text-xs"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <div className="font-mono text-xs text-green-700 break-all mb-2">
            {txHash}
          </div>
          <div className="space-y-2">
            <Button
              onClick={handleViewExplorer}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs bg-white hover:bg-green-50"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View on VeChain Explorer
            </Button>
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              <strong>Demo Mode:</strong> This is a simulated transaction hash. In production, this would be a real VeChain transaction.
            </div>
          </div>
        </div>

        {metadata && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Details:</p>
            <p className="line-clamp-2">{metadata}</p>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <div className="p-4 rounded-xl bg-background border-2 border-border">
            <QRCodeSVG 
              value={JSON.stringify({ 
                id, 
                name, 
                ecoScore, 
                carbonFootprint, 
                txHash,
                blockchain: 'VeChain'
              })}
              size={120}
              level="H"
              includeMargin={false}
              fgColor="hsl(var(--primary))"
            />
          </div>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          Scan to verify product authenticity on blockchain
        </p>
      </CardContent>
    </Card>
  );
}
