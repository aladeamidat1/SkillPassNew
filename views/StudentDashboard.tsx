import React from 'react';
import CertificateCard from '../components/CertificateCard';
import { useCertificates, convertSuiCertificateToLocal } from '../hooks/useContract';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Loader2, Award, Plus } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { certificates, loading, error, refetch } = useCertificates();

  if (!currentAccount) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary">
            Please connect your Sui wallet to view your certificates.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-text-secondary-light dark:text-text-secondary">
            Loading your certificates...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary mb-2">
            Error Loading Certificates
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary mb-4">
            {error}
          </p>
          <button
            onClick={refetch}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-text-primary-light dark:text-text-primary sm:text-5xl font-heading">
          Your Digital Credentials
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary-light dark:text-text-secondary">
          Manage and share your verified academic achievements securely on the Sui blockchain.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Connected to {currentAccount.address.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>{certificates.length} Certificates</span>
          </div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary mb-2">
            No Certificates Yet
          </h3>
          <p className="text-text-secondary-light dark:text-text-secondary mb-6">
            You don't have any certificates yet. Once a university issues you a certificate,<br />
            it will appear here automatically.
          </p>
          <div className="bg-surface-light/60 dark:bg-surface/60 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-text-primary-light dark:text-text-primary mb-3">
              How to get certificates:
            </h4>
            <ol className="text-left text-sm text-text-secondary-light dark:text-text-secondary space-y-2">
              <li>1. Complete your studies at a registered university</li>
              <li>2. Ask your university to issue your certificate on SkillPass</li>
              <li>3. Your certificate will be minted directly to your wallet</li>
              <li>4. View and share your verifiable credentials instantly</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map(cert => (
            <CertificateCard 
              key={cert.id} 
              certificate={convertSuiCertificateToLocal(cert)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;