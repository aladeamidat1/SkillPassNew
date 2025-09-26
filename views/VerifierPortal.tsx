import React, { useState } from 'react';
import { useVerifyCertificate, convertSuiCertificateToLocal, SuiCertificate } from '../hooks/useContract';
import CertificateCard from '../components/CertificateCard';
import { Search, Loader2, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const VerifierPortal: React.FC = () => {
  const [certificateId, setCertificateId] = useState('');
  const { verifyCertificate, loading } = useVerifyCertificate();
  const [verificationResult, setVerificationResult] = useState<SuiCertificate | 'not_found' | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setVerificationResult(null);
    
    try {
      const result = await verifyCertificate(certificateId.trim());
      setVerificationResult(result || 'not_found');
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult('not_found');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-text-primary-light dark:text-text-primary sm:text-5xl font-heading">
          Verify a Credential
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary-light dark:text-text-secondary">
          Instantly check the authenticity of any SkillPass credential on the Sui blockchain.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Blockchain Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Real-time Validation</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleVerify} className="flex items-center gap-2 bg-surface-light dark:bg-surface p-2 rounded-full shadow-lg border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <input
            type="text"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="Enter Certificate ID (e.g., 0x1a2b...)"
            className="flex-grow bg-transparent p-3 pl-4 focus:outline-none text-text-primary-light dark:text-text-primary font-mono"
          />
          <button
            type="submit"
            disabled={loading || !certificateId.trim()}
            className="flex items-center justify-center w-32 h-12 bg-gradient-to-r from-primary to-violet-600 hover:shadow-lg hover:shadow-primary/40 text-white font-semibold rounded-full transition-all duration-300 disabled:bg-gray-500 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Search size={20} />
                <span>Verify</span>
              </div>
            )}
          </button>
        </form>

        {/* Verification Result */}
        {verificationResult && (
          <div className="mt-8">
            {verificationResult === 'not_found' ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-500 mb-2">Certificate Not Found</h3>
                <p className="text-text-secondary-light dark:text-text-secondary">
                  The certificate ID you entered does not exist on the Sui blockchain or has been revoked.
                </p>
                <div className="mt-4 p-3 bg-surface-light dark:bg-surface rounded-lg">
                  <p className="text-sm font-mono text-text-secondary-light dark:text-text-secondary break-all">
                    Searched ID: {certificateId}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Verification Status */}
                <div className={`border rounded-xl p-6 text-center ${
                  verificationResult.is_valid 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}>
                  {verificationResult.is_valid ? (
                    <>
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-500 mb-2">Certificate Verified ✓</h3>
                      <p className="text-text-secondary-light dark:text-text-secondary">
                        This certificate is authentic and has been verified on the Sui blockchain.
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-red-500 mb-2">Certificate Revoked</h3>
                      <p className="text-text-secondary-light dark:text-text-secondary">
                        This certificate has been revoked by the issuing university.
                      </p>
                    </>
                  )}
                </div>

                {/* Certificate Details */}
                <div className="bg-surface-light/80 dark:bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-bold text-text-primary-light dark:text-text-primary mb-4">
                    Certificate Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-text-secondary-light dark:text-text-secondary font-medium">Student Address:</label>
                      <p className="font-mono text-text-primary-light dark:text-text-primary break-all">
                        {verificationResult.student_address}
                      </p>
                    </div>
                    <div>
                      <label className="text-text-secondary-light dark:text-text-secondary font-medium">University:</label>
                      <p className="font-mono text-text-primary-light dark:text-text-primary break-all">
                        {verificationResult.university}
                      </p>
                    </div>
                    <div>
                      <label className="text-text-secondary-light dark:text-text-secondary font-medium">Credential Type:</label>
                      <p className="text-text-primary-light dark:text-text-primary">
                        {verificationResult.encrypted_credential_type ? '[ENCRYPTED]' : (verificationResult.credential_type || 'Not specified')}
                      </p>
                    </div>
                    <div>
                      <label className="text-text-secondary-light dark:text-text-secondary font-medium">Grade:</label>
                      <p className="text-text-primary-light dark:text-text-primary">
                        {verificationResult.encrypted_grade ? '[ENCRYPTED]' : (verificationResult.grade || 'Not specified')}
                      </p>
                    </div>
                    <div>
                      <label className="text-text-secondary-light dark:text-text-secondary font-medium">Issue Date:</label>
                      <p className="text-text-primary-light dark:text-text-primary">
                        {new Date(verificationResult.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-text-secondary-light dark:text-text-secondary font-medium">Certificate ID:</label>
                      <p className="font-mono text-text-primary-light dark:text-text-primary break-all">
                        {verificationResult.id}
                      </p>
                    </div>
                  </div>

                  {/* SEAL Encryption Info */}
                  {(verificationResult.encrypted_credential_type || verificationResult.encrypted_grade) && (
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-primary">SEAL Encrypted Certificate</span>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary">
                        This certificate contains encrypted data protected by Microsoft SEAL homomorphic encryption. 
                        Full details are only accessible to authorized parties with proper decryption keys.
                      </p>
                    </div>
                  )}

                  {/* Evidence */}
                  {verificationResult.walrus_evidence_blob && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-blue-500">Evidence Available</span>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary">
                        This certificate includes supporting evidence stored on Walrus distributed storage.
                      </p>
                    </div>
                  )}
                </div>

                {/* Certificate Card Display */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <CertificateCard certificate={convertSuiCertificateToLocal(verificationResult)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        {!verificationResult && (
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary mb-4">
              How to verify a certificate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-4 bg-surface-light/60 dark:bg-surface/60 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary mb-2">Get Certificate ID</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary">
                  Obtain the certificate ID from the certificate holder or university
                </p>
              </div>
              <div className="p-4 bg-surface-light/60 dark:bg-surface/60 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary mb-2">Enter ID Above</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary">
                  Paste the certificate ID in the verification form above
                </p>
              </div>
              <div className="p-4 bg-surface-light/60 dark:bg-surface/60 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary mb-2">Instant Results</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary">
                  Get immediate verification results from the Sui blockchain
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifierPortal;