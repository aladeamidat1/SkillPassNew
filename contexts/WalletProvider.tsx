import React from 'react';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { 
    url: 'https://fullnode.testnet.sui.io/'  // Standard Sui testnet endpoint
  },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

// Create a query client with longer stale time to reduce requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Reduce retry attempts to 1
      retryDelay: 2000, // Increase delay between retries
      refetchOnWindowFocus: false, // Disable refetching on window focus to reduce requests
    },
  },
});

interface SuiWalletProviderProps {
  children: React.ReactNode;
}

export function SuiWalletProvider({ children }: SuiWalletProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default SuiWalletProvider;