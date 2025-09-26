import React, { useState, useRef, useEffect } from 'react';
import { 
  ConnectButton, 
  useCurrentAccount, 
  useDisconnectWallet 
} from '@mysten/dapp-kit';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';

const WalletConnection: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [showDetails, setShowDetails] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDetails(false);
      }
    };

    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails]);

  if (!currentAccount) {
    return (
      <ConnectButton
        connectText={
          <>
            <Wallet className="w-5 h-5" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </>
        }
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 transform hover:scale-105"
      />
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 transform hover:scale-105"
      >
        <Wallet className="w-5 h-5" />
        <span className="hidden sm:inline">
          {formatAddress(currentAccount.address)}
        </span>
      </button>

      {showDetails && (
        <div className="absolute right-0 top-full mt-2 bg-surface-light dark:bg-surface border border-white/10 rounded-xl shadow-2xl p-4 min-w-[280px] z-50">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-text-secondary-light dark:text-text-secondary uppercase tracking-wide">
                Wallet Address
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono text-text-primary-light dark:text-text-primary">
                  {formatAddress(currentAccount.address)}
                </span>
                <button
                  onClick={() => copyToClipboard(currentAccount.address)}
                  className="p-1 hover:bg-background-light dark:hover:bg-background rounded"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://suiscan.xyz/devnet/account/${currentAccount.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-background-light dark:hover:bg-background rounded"
                  title="View on Suiscan"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  disconnect();
                  setShowDetails(false);
                }}
                className="flex items-center gap-2 w-full text-left text-red-500 hover:bg-red-500/10 rounded-lg px-2 py-1 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;