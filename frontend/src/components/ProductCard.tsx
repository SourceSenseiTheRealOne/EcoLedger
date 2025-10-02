import { QRCodeSVG } from 'qrcode.react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Leaf } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  ecoScore: number;
  carbonFootprint: number;
  metadata?: string;
  onEdit?: () => void;
}

export function ProductCard({ 
  id, 
  name, 
  ecoScore, 
  carbonFootprint, 
  metadata,
  onEdit 
}: ProductCardProps) {
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{name}</CardTitle>
            <Badge className={getEcoScoreColor(ecoScore)}>
              <Leaf className="w-3 h-3 mr-1" />
              {getEcoScoreLabel(ecoScore)} ({ecoScore}/100)
            </Badge>
          </div>
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm font-medium text-muted-foreground">Carbon Footprint</span>
          <span className="text-lg font-bold">{carbonFootprint} kg CO₂</span>
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
              value={JSON.stringify({ id, name, ecoScore, carbonFootprint })}
              size={120}
              level="H"
              includeMargin={false}
              fgColor="hsl(var(--primary))"
            />
          </div>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          Scan to verify product authenticity
        </p>
      </CardContent>
    </Card>
  );
}
