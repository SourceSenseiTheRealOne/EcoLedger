import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSustainabilityBlockchain } from '@/hooks/useSustainabilityBlockchain';
import { useWalletModal } from '@vechain/dapp-kit-react';

interface CompanyRegistrationFormProps {
  onCompanyRegistered?: (txHash: string) => void;
}

export const CompanyRegistrationForm: React.FC<CompanyRegistrationFormProps> = ({
  onCompanyRegistered
}) => {
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { 
    isConnected, 
    registerCompany, 
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

    if (!companyName.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);

    try {
      // Check if company is already registered
      const alreadyRegistered = await isCompanyRegistered();
      if (alreadyRegistered) {
        setSuccess('Company is already registered!');
        setIsSubmitting(false);
        return;
      }

      const txHash = await registerCompany(companyName.trim());
      setSuccess(`Company registered successfully! Transaction: ${txHash}`);
      setCompanyName('');
      
      if (onCompanyRegistered) {
        onCompanyRegistered(txHash);
      }
    } catch (err) {
      console.error('Failed to register company:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Registration
          </CardTitle>
          <CardDescription>
            Connect your wallet to register your company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={openWalletModal}
            className="w-full"
          >
            Connect Wallet to Register Company
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Company Registration
        </CardTitle>
        <CardDescription>
          Register your company to start adding products to the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isSubmitting || isLoading}
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
              {success}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || isLoading || !companyName.trim()}
            className="w-full"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Registering Company...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4 mr-2" />
                Register Company
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
