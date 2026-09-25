import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Wallet, Database, Link, QrCode, ArrowRight } from 'lucide-react';
import { WalletConnection } from './WalletConnection';
import { DAppKitWalletButton } from './DAppKitWalletButton';
import { useWallet } from '@vechain/dapp-kit-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
}

export const WelcomeModal = ({ isOpen, onClose, onStartTutorial }: WelcomeModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { account } = useWallet();

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to EcoLedger',
      description: 'Self-reported records, not verified sustainability',
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            EcoLedger is a sustainability record prototype with an illustrative local catalog
            and a VeChain testnet registry. It does not certify environmental claims.
          </p>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>⛓️ Testnet prototype:</strong> Signing code is real, but the wallet lifecycle is unverified.
              Receipt confirmation is not implemented. Records can be changed by their owner.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-medium text-green-800">🌱 Sustainability</h4>
              <p className="text-sm text-green-600">Illustrative factors and unvalidated scores</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-medium text-blue-800">⛓️ Blockchain</h4>
              <p className="text-sm text-blue-600">Owner-mutable assertions on testnet</p>
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
          <div className="flex justify-center">
            <DAppKitWalletButton />
          </div>
          {account && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✅ Wallet Connected!</strong> You can now proceed to the next step.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'products',
      title: 'Step 2: Select Products',
      description: 'Choose products from the bundled illustrative catalog',
      icon: <Database className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Browse illustrative emission factors and heuristic scores. Selections stay in memory, not a database.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs font-medium text-green-600">1</span>
              </div>
              <span className="text-sm">Go to the <strong>Catalog</strong> tab</span>
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
              <span className="text-sm">Click <strong>Add</strong> to select for this session</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-800">
              <strong>💡 Score limits:</strong> Catalog scores use an illustrative factor heuristic.
              Retrieved testnet records show a hardcoded score of 85, not a measured rating.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'blockchain',
      title: 'Step 3: Add to Blockchain',
      description: 'Request a testnet transaction for a self-reported record',
      icon: <Link className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Testnet submission requests a real wallet signature. A returned transaction ID is not a checked receipt.
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
              <span className="text-sm">Receipt confirmation is not implemented</span>
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
              <strong>🔗 Record limits:</strong> Owners can update claimed CO₂ and stored transaction references.
              Transaction history does not prove that an environmental assertion is true.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'verification',
      title: 'Step 4: Inspect Record References',
      description: 'Access your blockchain products with automatic QR codes',
      icon: <QrCode className="w-8 h-8 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            QR codes contain local product JSON or an explorer link built from a stored reference, not a certificate.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">1</span>
              </div>
              <span className="text-sm">Go to the <strong>Blockchain</strong> tab</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">2</span>
              </div>
              <span className="text-sm">View your products with automatic QR codes</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">3</span>
              </div>
              <span className="text-sm">Inspect the stored transaction reference</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-medium text-orange-600">4</span>
              </div>
              <span className="text-sm">Scan for record details, not proof of authenticity</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>📱 QR limits:</strong> Owner-supplied references may be placeholders or invalid links.
              Neither a QR code nor an explorer page independently verifies sustainability.
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
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <div>
              <DialogTitle className="text-2xl">{currentStepData.title}</DialogTitle>
              <DialogDescription className="text-base">
                {currentStepData.description}
              </DialogDescription>
            </div>
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
              <li>• Catalog selections stay in memory; do not enter sensitive data</li>
              <li>• Blockchain transactions are permanent and transparent</li>
              <li>• QR codes contain sample or self-reported data, not verified product claims</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
