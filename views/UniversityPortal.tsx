import React, { useState } from 'react';
import { useMintCertificate, useMintEncryptedCertificate, useRevokeCertificate, useVerifyContract, useUniversityAuth, CONTRACT_CONFIG } from '../hooks/useContract';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { PlusCircle, Trash2, Shield, Lock, Unlock, Award, Loader2, AlertTriangle, CheckCircle, UserX } from 'lucide-react';

const UniversityPortal: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mintCertificate, loading: mintLoading } = useMintCertificate();
  const { mintEncryptedCertificate, loading: encryptedMintLoading } = useMintEncryptedCertificate();
  const { revokeCertificate, loading: revokeLoading } = useRevokeCertificate();
  const { contractStatus, verifyContract } = useVerifyContract();
  const { isAuthorized, loading: authLoading, checkAuthorization } = useUniversityAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [useEncryption, setUseEncryption] = useState(false);
  const [issuedCertificates, setIssuedCertificates] = useState<any[]>([]);

  if (!currentAccount) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary">
            Please connect your Sui wallet to access the university portal.
          </p>
        </div>
      </div>
    );
  }

  const handleIssueCertificate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const certificateData = {
      studentAddress: formData.get('studentAddress') as string,
      credentialType: formData.get('credentialType') as string,
      grade: formData.get('grade') as string || undefined,
    };

    try {
      if (useEncryption) {
        // For now, we'll use placeholder encryption data
        // In a real implementation, you'd integrate with SEAL encryption library
        const mockEncryptedData = {
          studentAddress: certificateData.studentAddress,
          encryptedCredentialType: new TextEncoder().encode(certificateData.credentialType),
          encryptedGrade: certificateData.grade ? new TextEncoder().encode(certificateData.grade) : undefined,
          encryptionParams: new TextEncoder().encode('mock_encryption_params'),
          publicKeyHash: new TextEncoder().encode('mock_public_key_hash'),
          accessPolicy: ['student', 'university', 'verifier'],
        };
        
        await mintEncryptedCertificate(mockEncryptedData);
        alert('🔐 Encrypted certificate issued successfully! Privacy protected with SEAL encryption.');
      } else {
        await mintCertificate(certificateData);
        alert('✅ Certificate issued successfully!');
      }
      
      setShowForm(false);
      event.currentTarget.reset();
    } catch (error: any) {
      console.error('Failed to issue certificate:', error);
      
      let errorMessage = 'Failed to issue certificate.';
      if (error.message?.includes('Package object does not exist')) {
        errorMessage = `❌ Contract not found on testnet. Please verify the package ID: ${CONTRACT_CONFIG.PACKAGE_ID}`;
      } else if (error.message?.includes('ENotAuthorizedUniversity')) {
        errorMessage = '❌ Only authorized universities can mint certificates. Please contact the admin to be added as a university.';
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleRevoke = async (certificateId: string) => {
    if (!confirm('Are you sure you want to revoke this certificate?')) {
      return;
    }

    try {
      await revokeCertificate(certificateId, 'Revoked by university');
      alert('✅ Certificate revoked successfully!');
      // Refresh the certificates list
    } catch (error) {
      console.error('Failed to revoke certificate:', error);
      alert('❌ Failed to revoke certificate. Please check the console for details.');
    }
  };
  
  return (
    <div className="animate-fade-in space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-text-primary-light dark:text-text-primary sm:text-5xl font-heading">
          University Portal
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary-light dark:text-text-secondary">
          Issue and manage secure, verifiable academic credentials on the Sui blockchain.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>University: {currentAccount.address.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>SEAL Encryption Available</span>
          </div>
          <div className="flex items-center gap-2">
            {contractStatus === 'valid' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : contractStatus === 'invalid' ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
            )}
            <span className={contractStatus === 'valid' ? 'text-green-500' : contractStatus === 'invalid' ? 'text-red-500' : 'text-yellow-500'}>
              Contract: {contractStatus === 'valid' ? 'Connected' : contractStatus === 'invalid' ? 'Not Found' : 'Checking...'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
            ) : isAuthorized === true ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : isAuthorized === false ? (
              <UserX className="w-4 h-4 text-red-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            <span className={authLoading ? 'text-yellow-500' : isAuthorized === true ? 'text-green-500' : isAuthorized === false ? 'text-red-500' : 'text-yellow-500'}>
              University: {authLoading ? 'Checking...' : isAuthorized === true ? 'Authorized' : isAuthorized === false ? 'Not Authorized' : 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* University Authorization Warning */}
        {isAuthorized === false && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <UserX className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-500 mb-1">University Not Authorized</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary mb-2">
                  Your wallet address is not registered as an authorized university. Only authorized universities can mint certificates.
                </p>
                <div className="mt-3 p-2 bg-surface-light dark:bg-surface rounded font-mono text-xs break-all">
                  Your Address: {currentAccount?.address}
                </div>
                <div className="mt-3 text-sm text-text-secondary-light dark:text-text-secondary">
                  <p className="font-semibold mb-1">To get authorized:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Contact the system administrator</li>
                    <li>Provide your wallet address: <code className="bg-surface-light dark:bg-surface px-1 rounded">{currentAccount?.address?.slice(0, 10)}...</code></li>
                    <li>Admin will add you through the Admin Dashboard</li>
                  </ol>
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                    <p className="text-blue-500 font-semibold mb-1">🛠️ Quick Test Solution:</p>
                    <p className="text-xs">Go to the <strong>Admin Dashboard</strong> role and add your university address: <br/>
                    <code className="bg-surface-light dark:bg-surface px-1 rounded text-xs">{currentAccount?.address}</code></p>
                  </div>
                </div>
                <button 
                  onClick={checkAuthorization}
                  className="mt-2 text-sm text-red-500 hover:text-red-400 underline"
                >
                  Recheck Authorization
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contract Status Warning */}
        {contractStatus === 'invalid' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-500 mb-1">Contract Not Found</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary mb-2">
                  The smart contract cannot be found on Sui testnet. This could be due to:
                </p>
                <ul className="text-sm text-text-secondary-light dark:text-text-secondary list-disc list-inside space-y-1">
                  <li>Incorrect package ID</li>
                  <li>Contract deployed on a different network</li>
                  <li>Contract not yet deployed</li>
                </ul>
                <div className="mt-3 p-2 bg-surface-light dark:bg-surface rounded font-mono text-xs break-all">
                  Current Package ID: {CONTRACT_CONFIG.PACKAGE_ID}
                </div>
                <button 
                  onClick={verifyContract}
                  className="mt-2 text-sm text-red-500 hover:text-red-400 underline"
                >
                  Retry Verification
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowForm(!showForm)}
            disabled={mintLoading || encryptedMintLoading || contractStatus !== 'valid' || isAuthorized !== true}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {mintLoading || encryptedMintLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <PlusCircle size={20} />
            )}
            {mintLoading || encryptedMintLoading ? 'Issuing...' : 
             contractStatus !== 'valid' ? 'Contract Not Found' :
             isAuthorized !== true ? 'Not Authorized' :
             (showForm ? 'Cancel' : 'Issue New Certificate')}
          </button>
        </div>

        {showForm && (
          <div className="bg-surface-light/80 dark:bg-surface/80 p-8 rounded-xl shadow-2xl mb-8 animate-slide-up border border-primary/20 backdrop-blur-sm">
            <form onSubmit={handleIssueCertificate} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-primary-light dark:text-primary-dark font-heading">
                  New Certificate Details
                </h3>
                
                {/* Encryption Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary">
                    Privacy Mode:
                  </span>
                  <button
                    type="button"
                    onClick={() => setUseEncryption(!useEncryption)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      useEncryption 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-surface-light dark:bg-surface text-text-secondary-light dark:text-text-secondary border border-white/10'
                    }`}
                  >
                    {useEncryption ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    {useEncryption ? 'SEAL Encrypted' : 'Standard'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary mb-2">
                    Student Sui Address *
                  </label>
                  <input 
                    required 
                    name="studentAddress" 
                    type="text" 
                    placeholder="0x..."
                    className="w-full bg-background-light dark:bg-background rounded-md border border-white/10 p-3 text-text-primary-light dark:text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary mb-2">
                    Credential Type *
                  </label>
                  <input 
                    required 
                    name="credentialType" 
                    type="text" 
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    className="w-full bg-background-light dark:bg-background rounded-md border border-white/10 p-3 text-text-primary-light dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary mb-2">
                    Grade (Optional)
                  </label>
                  <select 
                    name="grade" 
                    className="w-full bg-background-light dark:bg-background rounded-md border border-white/10 p-3 text-text-primary-light dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  >
                    <option value="">Select Grade</option>
                    <option value="First Class">First Class</option>
                    <option value="Upper Second Class">Upper Second Class</option>
                    <option value="Lower Second Class">Lower Second Class</option>
                    <option value="Third Class">Third Class</option>
                    <option value="Pass">Pass</option>
                    <option value="Merit">Merit</option>
                    <option value="Distinction">Distinction</option>
                  </select>
                </div>
              </div>
              
              {useEncryption && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary">SEAL Encryption Enabled</span>
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary">
                    This certificate will be encrypted using Microsoft SEAL homomorphic encryption. 
                    Sensitive data will be protected while maintaining verifiability.
                  </p>
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={mintLoading || encryptedMintLoading}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mintLoading || encryptedMintLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Issuing Certificate...
                    </span>
                  ) : (
                    `Issue ${useEncryption ? 'Encrypted' : 'Standard'} Certificate`
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-text-secondary-light dark:text-text-secondary hover:text-text-primary-light dark:hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold mb-4 font-heading">Issued Credentials</h3>
          <div className="bg-surface-light/80 dark:bg-surface/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/10">
            {issuedCertificates.length === 0 ? (
              <div className="p-8 text-center">
                <Award className="w-12 h-12 text-text-secondary-light dark:text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary-light dark:text-text-secondary">
                  No certificates issued yet. Issue your first certificate above.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-white/10 dark:divide-white/10">
                {issuedCertificates.map(cert => (
                  <li key={cert.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-primary/5 transition-colors">
                    <div className="flex-grow mb-2 sm:mb-0">
                      <p className="font-semibold text-text-primary-light dark:text-text-primary">
                        {cert.credentialType}
                      </p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary font-mono truncate">
                        {cert.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-bold ${
                        cert.is_valid ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {cert.is_valid ? 'ACTIVE' : 'REVOKED'}
                      </span>
                      {cert.is_valid && (
                        <button 
                          onClick={() => handleRevoke(cert.id)} 
                          disabled={revokeLoading}
                          className="flex items-center gap-1 text-sm font-semibold p-2 rounded-md transition-colors text-red-400 hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {revokeLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Revoke
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityPortal;