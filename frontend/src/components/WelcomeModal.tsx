import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Wallet, Database, Link, QrCode, ArrowRight, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
}

export const WelcomeModal = ({ isOpen, onClose, onStartTutorial }: WelcomeModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to EcoLedger',
      description: 'Your blockchain-powered sustainability platform',
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            EcoLedger helps you track product sustainability and store information on the VeChain blockchain 
            for complete transparency and verification.
          </p>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>🚀 Demo Mode:</strong> This is a demonstration version. Blockchain transactions are simulated 
              for the hackathon. In production, this would connect to the real VeChain blockchain.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-medium text-green-800">🌱 Sustainability</h4>
              <p className="text-sm text-green-600">Track carbon footprints and eco scores</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-medium text-blue-800">⛓️ Blockchain</h4>
              <p className="text-sm text-blue-600">Store data on VeChain for transparency</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wallet',
      title: 'Step 1: Connect Your Wallet',
      description: 'Connect to VeChain to interact with the blockchain',
      icon: <Wallet className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            First, you'll need to connect a VeChain wallet to add products to the blockchain.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <span className="text-sm">Go to the <strong>Wallet</strong> tab</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <span className="text-sm">Generate a new wallet or import existing private key</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <span className="text-sm">Save your private key and mnemonic safely</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'products',
      title: 'Step 2: Select Products',
      description: 'Choose products from our sustainability database',
      icon: <Database className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Browse our database of products with real carbon footprint data and eco scores.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs font-medium text-green-600">1</span>
              </div>
              <span className="text-sm">Go to the <strong>Add from DB</strong> tab</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs font-medium text-green-600">2</span>
              </div>
              <span className="text-sm">Select products from the dropdown</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs font-medium text-green-600">3</span>
              </div>
              <span className="text-sm">Click <strong>Add</strong> to add to your registry</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-800">
              <strong>💡 Tip:</strong> Products have different eco scores based on their carbon footprint. 
              Lower carbon footprint = higher eco score!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'blockchain',
      title: 'Step 3: Add to Blockchain',
      description: 'Store products on VeChain for transparency',
      icon: <Link className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Add your selected products to the VeChain blockchain for permanent, transparent storage.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">1</span>
              </div>
              <span className="text-sm">Go to the <strong>Products</strong> tab</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">2</span>
              </div>
              <span className="text-sm">Click <strong>Add to Chain</strong> on any product</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">3</span>
              </div>
              <span className="text-sm">Wait for transaction confirmation</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">4</span>
              </div>
              <span className="text-sm">View in <strong>Blockchain</strong> tab</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
            <p className="text-sm text-purple-800">
              <strong>🔗 Blockchain Benefits:</strong> Your products are stored permanently on VeChain, 
              creating an immutable record of sustainability data.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'verification',
      title: 'Step 4: Generate QR Codes',
      description: 'Create verifiable QR codes for your products',
      icon: <QrCode className="w-8 h-8 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Generate QR codes that contain all product information and transaction details for easy verification.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">1</span>
              </div>
              <span className="text-sm">Click <strong>Generate QR</strong> on any product</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">2</span>
              </div>
              <span className="text-sm">View QR code in the modal</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">3</span>
              </div>
              <span className="text-sm">Download QR code as PNG image</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">4</span>
              </div>
              <span className="text-sm">Scan QR code to verify product authenticity</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>📱 QR Code Features:</strong> Contains product data, eco score, carbon footprint, 
              and blockchain transaction hash for complete verification.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartTutorial();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStepData.icon}
              <div>
                <DialogTitle className="text-2xl">{currentStepData.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {currentStepData.description}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={onStartTutorial}>
                  Start Using EcoLedger
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <h4 className="font-medium mb-2">💡 Quick Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You can always access this tutorial from the help menu</li>
              <li>• All your data is stored locally and securely</li>
              <li>• Blockchain transactions are permanent and transparent</li>
              <li>• QR codes work offline for product verification</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
