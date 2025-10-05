import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DAppKitProvider } from "@vechain/dapp-kit-react";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <DAppKitProvider
    usePersistence={false}
    requireCertificate={false}
    genesis="test"
    nodeUrl="https://testnet.vechain.org/"
    logLevel="ERROR"
    walletConnectOptions={{
      projectId: "ecoledger-vechain-hackathon",
      metadata: {
        name: "EcoLedger",
        description: "Blockchain Sustainability Platform",
        url: window.location.origin,
        icons: [`${window.location.origin}/favicon.svg`]
      }
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </DAppKitProvider>
);

export default App;
