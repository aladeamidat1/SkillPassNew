import React from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

interface SuiTransactionProps {
  children?: React.ReactNode;
  className?: string;
}

export const SuiTransactionButton: React.FC<SuiTransactionProps> = ({ 
  children = "Execute Transaction", 
  className = "" 
}) => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleTransaction = () => {
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    const tx = new Transaction();
    
    // Example: Transfer some SUI (you can customize this)
    // tx.transferObjects([tx.gas], currentAccount.address);
    
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log('Transaction successful:', result);
          alert(`Transaction successful! Digest: ${result.digest}`);
        },
        onError: (error) => {
          console.error('Transaction failed:', error);
          alert('Transaction failed. Check console for details.');
        },
      }
    );
  };

  return (
    <button
      onClick={handleTransaction}
      disabled={!currentAccount}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};