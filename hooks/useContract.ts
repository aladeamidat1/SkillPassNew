import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiObjectResponse } from '@mysten/sui/client';
import { useState, useEffect } from 'react';
import { Certificate } from '../types';

// Contract configuration - Your actual deployed contract
export const CONTRACT_CONFIG = {
  PACKAGE_ID: "0xf1cb82954194f281b4bcddee3b8922b81322cd742d2ab23d169dfaf11883c736",
  REGISTRY_ID: "0x6c0bab54d2c4ba3caba62063cb7e972370e60deb9dbbe2fd46f825897bde0bdd", 
  NETWORK: "https://fullnode.testnet.sui.io:443", 
  MODULE_NAME: "skillpass",
  CERTIFICATE_REGISTRY: "certificate_registry",
  ADMIN_ADDRESS: "0x83b3e15b0f43aacdbd39ede604391ef9720df83b33420fb72deef7f8e795cbe9"
};

// Enhanced Certificate interface matching your contract
export interface SuiCertificate {
  id: string;
  student_address: string;
  university: string;
  // SEAL Encrypted fields
  encrypted_credential_type?: Uint8Array;
  encrypted_grade?: Uint8Array;
  // SEAL Metadata
  encryption_params?: Uint8Array;
  public_key_hash?: Uint8Array;
  access_policy?: string;
  // Plain fields
  credential_type?: string; // For legacy certificates
  grade?: string; // For legacy certificates
  issue_date: number;
  walrus_evidence_blob?: Uint8Array;
  is_valid: boolean;
}

// Hook to fetch all certificates for current user
export function useCertificates() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [certificates, setCertificates] = useState<SuiCertificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    if (!currentAccount) {
      setCertificates([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all Certificate objects owned by the current account
      const ownedObjects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.CERTIFICATE_REGISTRY}::Certificate`,
        },
        options: {
          showContent: true,
          showDisplay: true,
        },
      });

      const certificateData: SuiCertificate[] = [];

      for (const obj of ownedObjects.data) {
        if (obj.data?.content && 'fields' in obj.data.content) {
          const fields = obj.data.content.fields as any;
          certificateData.push({
            id: obj.data.objectId,
            student_address: fields.student_address || '',
            university: fields.university || '',
            // Handle both encrypted and legacy certificates
            encrypted_credential_type: fields.encrypted_credential_type ? new Uint8Array(fields.encrypted_credential_type) : undefined,
            encrypted_grade: fields.encrypted_grade?.[0] ? new Uint8Array(fields.encrypted_grade[0]) : undefined,
            encryption_params: fields.encryption_params ? new Uint8Array(fields.encryption_params) : undefined,
            public_key_hash: fields.public_key_hash ? new Uint8Array(fields.public_key_hash) : undefined,
            access_policy: fields.access_policy || '',
            // Legacy fields
            credential_type: fields.credential_type || '',
            grade: fields.grade?.[0] || '',
            issue_date: parseInt(fields.issue_date) || Date.now(),
            walrus_evidence_blob: fields.walrus_evidence_blob?.[0] ? new Uint8Array(fields.walrus_evidence_blob[0]) : undefined,
            is_valid: fields.is_valid || false,
          });
        }
      }

      setCertificates(certificateData);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [currentAccount?.address]);

  return { certificates, loading, error, refetch: fetchCertificates };
}

// Hook to mint certificate (University function)
export function useMintCertificate() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);

  const mintCertificate = async (certificateData: {
    studentAddress: string;
    credentialType: string;
    grade?: string;
  }) => {
    setLoading(true);

    try {
      const tx = new Transaction();

      // Call the mint_certificate function
      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.CERTIFICATE_REGISTRY}::mint_certificate`,
        arguments: [
          tx.object(CONTRACT_CONFIG.REGISTRY_ID),
          tx.pure.address(certificateData.studentAddress),
          tx.pure.vector('u8', Array.from(new TextEncoder().encode(certificateData.credentialType))),
          tx.pure.option('vector<u8>', certificateData.grade ? Array.from(new TextEncoder().encode(certificateData.grade)) : null),
          tx.object('0x6') // Clock object ID
        ],
      });

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('Certificate minted successfully:', result);
              setLoading(false);
              resolve(result);
            },
            onError: (error) => {
              console.error('Failed to mint certificate:', error);
              setLoading(false);
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { mintCertificate, loading };
}

// Hook to mint encrypted certificate (SEAL enhanced)
export function useMintEncryptedCertificate() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);

  const mintEncryptedCertificate = async (certificateData: {
    studentAddress: string;
    encryptedCredentialType: Uint8Array;
    encryptedGrade?: Uint8Array;
    encryptionParams: Uint8Array;
    publicKeyHash: Uint8Array;
    accessPolicy: string[];
  }) => {
    setLoading(true);

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.CERTIFICATE_REGISTRY}::mint_encrypted_certificate`,
        arguments: [
          tx.object(CONTRACT_CONFIG.REGISTRY_ID),
          tx.pure.address(certificateData.studentAddress),
          tx.pure.vector('u8', Array.from(certificateData.encryptedCredentialType)),
          tx.pure.option('vector<u8>', certificateData.encryptedGrade ? Array.from(certificateData.encryptedGrade) : null),
          tx.pure.vector('u8', Array.from(certificateData.encryptionParams)),
          tx.pure.vector('u8', Array.from(certificateData.publicKeyHash)),
          tx.pure.string(JSON.stringify(certificateData.accessPolicy)),
          tx.object('0x6') // Clock object ID
        ],
      });

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('Encrypted certificate minted successfully:', result);
              setLoading(false);
              resolve(result);
            },
            onError: (error) => {
              console.error('Failed to mint encrypted certificate:', error);
              setLoading(false);
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { mintEncryptedCertificate, loading };
}

// Hook to revoke certificate
export function useRevokeCertificate() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);

  const revokeCertificate = async (certificateId: string, reason: string) => {
    setLoading(true);

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.CERTIFICATE_REGISTRY}::revoke_certificate`,
        arguments: [
          tx.object(certificateId),
          tx.pure.string(reason)
        ],
      });

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('Certificate revoked successfully:', result);
              setLoading(false);
              resolve(result);
            },
            onError: (error) => {
              console.error('Failed to revoke certificate:', error);
              setLoading(false);
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { revokeCertificate, loading };
}

// Hook to verify certificate
export function useVerifyCertificate() {
  const suiClient = useSuiClient();
  const [loading, setLoading] = useState(false);

  const verifyCertificate = async (certificateId: string): Promise<SuiCertificate | null> => {
    setLoading(true);

    try {
      const response = await suiClient.getObject({
        id: certificateId,
        options: {
          showContent: true,
          showDisplay: true,
        },
      });

      if (response.data?.content && 'fields' in response.data.content) {
        const fields = response.data.content.fields as any;
        return {
          id: response.data.objectId,
          student_address: fields.student_address || '',
          university: fields.university || '',
          encrypted_credential_type: fields.encrypted_credential_type ? new Uint8Array(fields.encrypted_credential_type) : undefined,
          encrypted_grade: fields.encrypted_grade?.[0] ? new Uint8Array(fields.encrypted_grade[0]) : undefined,
          encryption_params: fields.encryption_params ? new Uint8Array(fields.encryption_params) : undefined,
          public_key_hash: fields.public_key_hash ? new Uint8Array(fields.public_key_hash) : undefined,
          access_policy: fields.access_policy || '',
          credential_type: fields.credential_type || '',
          grade: fields.grade?.[0] || '',
          issue_date: parseInt(fields.issue_date) || Date.now(),
          walrus_evidence_blob: fields.walrus_evidence_blob?.[0] ? new Uint8Array(fields.walrus_evidence_blob[0]) : undefined,
          is_valid: fields.is_valid || false,
        };
      }

      return null;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { verifyCertificate, loading };
}

// Hook for university management (Admin functions)
export function useUniversityManagement() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const [loading, setLoading] = useState(false);

  const addUniversity = async (universityAddress: string) => {
    if (currentAccount?.address !== CONTRACT_CONFIG.ADMIN_ADDRESS) {
      throw new Error('Only admin can add universities');
    }

    setLoading(true);
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.CERTIFICATE_REGISTRY}::add_university`,
      arguments: [
        tx.object(CONTRACT_CONFIG.REGISTRY_ID),
        tx.pure.address(universityAddress)
      ]
    });

    return new Promise((resolve, reject) => {
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setLoading(false);
            resolve(result);
          },
          onError: (error) => {
            setLoading(false);
            reject(error);
          },
        }
      );
    });
  };

  const removeUniversity = async (universityAddress: string) => {
    if (currentAccount?.address !== CONTRACT_CONFIG.ADMIN_ADDRESS) {
      throw new Error('Only admin can remove universities');
    }

    setLoading(true);
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.CERTIFICATE_REGISTRY}::remove_university`,
      arguments: [
        tx.object(CONTRACT_CONFIG.REGISTRY_ID),
        tx.pure.address(universityAddress)
      ]
    });

    return new Promise((resolve, reject) => {
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setLoading(false);
            resolve(result);
          },
          onError: (error) => {
            setLoading(false);
            reject(error);
          },
        }
      );
    });
  };

  const isAdmin = currentAccount?.address === CONTRACT_CONFIG.ADMIN_ADDRESS;

  return { addUniversity, removeUniversity, isAdmin, loading };
}

// Hook to check if current user is an authorized university
export function useUniversityAuth() {
  const currentAccount = useCurrentAccount();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAuthorization = async () => {
    if (!currentAccount) {
      setIsAuthorized(null);
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we'll show this is not authorized
      // The admin can add universities through the admin dashboard
      setIsAuthorized(false);
    } catch (error) {
      console.error('Error checking university authorization:', error);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, [currentAccount?.address]);

  return { isAuthorized, loading, checkAuthorization };
}

// Utility function to verify contract deployment
export function useVerifyContract() {
  const suiClient = useSuiClient();
  const [contractStatus, setContractStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');

  const verifyContract = async () => {
    try {
      // Try to get the package object
      const packageResponse = await suiClient.getObject({
        id: CONTRACT_CONFIG.PACKAGE_ID,
        options: {
          showContent: true,
          showType: true
        }
      });
      
      if (packageResponse.data) {
        console.log('✅ Package found:', packageResponse.data);
        setContractStatus('valid');
        return true;
      } else {
        console.error('❌ Package not found');
        setContractStatus('invalid');
        return false;
      }
    } catch (error) {
      console.error('❌ Error verifying contract:', error);
      setContractStatus('invalid');
      return false;
    }
  };

  useEffect(() => {
    verifyContract();
  }, []);

  return { contractStatus, verifyContract };
}

// Utility function to convert SuiCertificate to Certificate type
export function convertSuiCertificateToLocal(suiCert: SuiCertificate): Certificate {
  // For encrypted certificates, show encrypted status
  const credentialType = suiCert.encrypted_credential_type 
    ? '[ENCRYPTED]' 
    : (suiCert.credential_type || 'Unknown');
  
  const grade = suiCert.encrypted_grade 
    ? '[ENCRYPTED]' 
    : (suiCert.grade || 'Not specified');

  return {
    id: suiCert.id,
    studentName: 'Connected User', // We don't store student names in the contract
    studentId: suiCert.student_address.slice(0, 8) + '...', // Use address as ID
    degree: credentialType,
    major: grade,
    issuingUniversity: suiCert.university.slice(0, 8) + '...', // Shorten address
    issueDate: new Date(suiCert.issue_date).toISOString().split('T')[0],
    isRevoked: !suiCert.is_valid,
    verificationUrl: `${window.location.origin}/verify/${suiCert.id}`,
  };
}