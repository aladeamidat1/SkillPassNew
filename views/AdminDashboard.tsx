import React, { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useUniversityManagement, useTransferAdmin, CONTRACT_CONFIG } from '../hooks/useContract';
import { Shield, Plus, Trash2, Users, Award, Eye, EyeOff } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { addUniversity, removeUniversity, isAdmin, loading } = useUniversityManagement();
  const { transferAdmin, isCurrentAdmin, loading: transferLoading } = useTransferAdmin();
  const [newUniversityAddress, setNewUniversityAddress] = useState('');
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);

  // Check if current user is admin
  if (!currentAccount || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary mb-2">
            Access Denied
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary">
            Only the system administrator can access this panel.
          </p>
          <div className="mt-4 p-4 bg-surface-light dark:bg-surface rounded-lg">
            <p className="text-sm font-mono text-text-secondary-light dark:text-text-secondary">
              Admin Address: {CONTRACT_CONFIG.ADMIN_ADDRESS}
            </p>
            <p className="text-sm font-mono text-text-secondary-light dark:text-text-secondary">
              Your Address: {currentAccount?.address || 'Not connected'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniversityAddress.trim()) return;

    try {
      await addUniversity(newUniversityAddress);
      setNewUniversityAddress('');
      setShowAddForm(false);
      alert('University added successfully!');
    } catch (error) {
      console.error('Failed to add university:', error);
      alert('Failed to add university. Please check the console for details.');
    }
  };

  const handleTransferAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminAddress.trim()) return;

    try {
      await transferAdmin(newAdminAddress);
      setNewAdminAddress('');
      setShowTransferForm(false);
      alert('Admin privileges transferred successfully!');
    } catch (error) {
      console.error('Failed to transfer admin:', error);
      alert('Failed to transfer admin privileges. Please check the console for details.');
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h2 className="text-4xl font-extrabold tracking-tight text-text-primary-light dark:text-text-primary sm:text-5xl font-heading">
            Admin Dashboard
          </h2>
        </div>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary-light dark:text-text-secondary">
          Manage universities and monitor the SkillPass certificate system.
        </p>
        {(currentAccount?.address === '0xc9b77d442570dafd4737da69ad2d3eadd36eb5eca8ecd021037979b117c35e2d') && (
          <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-600 dark:text-yellow-400 text-sm">
              ⚠️ You're using a temporary admin access. For full admin privileges, the contract admin needs to transfer admin rights to your address.
            </p>
          </div>
        )}
      </div>

      {/* Contract Information */}
      <div className="bg-surface-light/80 dark:bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary mb-4 font-heading">
          Contract Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-text-secondary-light dark:text-text-secondary font-medium">Package ID:</label>
            <p className="font-mono text-text-primary-light dark:text-text-primary break-all">
              {CONTRACT_CONFIG.PACKAGE_ID}
            </p>
          </div>
          <div>
            <label className="text-text-secondary-light dark:text-text-secondary font-medium">Registry ID:</label>
            <p className="font-mono text-text-primary-light dark:text-text-primary break-all">
              {CONTRACT_CONFIG.REGISTRY_ID}
            </p>
          </div>
          <div>
            <label className="text-text-secondary-light dark:text-text-secondary font-medium">Network:</label>
            <p className="font-mono text-text-primary-light dark:text-text-primary">
              Sui Testnet
            </p>
          </div>
          <div>
            <label className="text-text-secondary-light dark:text-text-secondary font-medium">Admin:</label>
            <p className="font-mono text-text-primary-light dark:text-text-primary break-all">
              {CONTRACT_CONFIG.ADMIN_ADDRESS}
            </p>
          </div>
        </div>
      </div>

      {/* University Management */}
      <div className="bg-surface-light/80 dark:bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary font-heading">
            University Management
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add University
          </button>
        </div>

        {/* Add University Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-background-light dark:bg-background rounded-lg border border-primary/20">
            <form onSubmit={handleAddUniversity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary mb-2">
                  University Sui Address
                </label>
                <input
                  type="text"
                  value={newUniversityAddress}
                  onChange={(e) => setNewUniversityAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-surface-light dark:bg-surface rounded-lg border border-white/10 p-3 text-text-primary-light dark:text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  {loading ? 'Adding...' : 'Add University'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-text-secondary-light dark:text-text-secondary hover:text-text-primary-light dark:hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Admin Transfer */}
      <div className="bg-surface-light/80 dark:bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary font-heading">
            Admin Transfer
          </h3>
          <button
            onClick={() => setShowTransferForm(!showTransferForm)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-yellow-500/30 transform hover:scale-105"
          >
            <Shield className="w-4 h-4" />
            Transfer Admin
          </button>
        </div>

        {/* Transfer Admin Form */}
        {showTransferForm && (
          <div className="mb-6 p-4 bg-background-light dark:bg-background rounded-lg border border-yellow-500/20">
            <form onSubmit={handleTransferAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary mb-2">
                  New Admin Sui Address
                </label>
                <input
                  type="text"
                  value={newAdminAddress}
                  onChange={(e) => setNewAdminAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-surface-light dark:bg-surface rounded-lg border border-white/10 p-3 text-text-primary-light dark:text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  required
                />
                <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                  Warning: This action will permanently transfer admin privileges. Make sure you trust this address.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={transferLoading}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="w-4 h-4" />
                  {transferLoading ? 'Transferring...' : 'Transfer Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransferForm(false)}
                  className="px-4 py-2 text-text-secondary-light dark:text-text-secondary hover:text-text-primary-light dark:hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="bg-surface-light/80 dark:bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary mb-4 font-heading">
          System Status
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-text-primary-light dark:text-text-primary">
            SkillPass Contract is Live on Sui Testnet
          </span>
        </div>
        <div className="mt-4 text-sm text-text-secondary-light dark:text-text-secondary">
          <p>✅ SEAL Encryption Enabled</p>
          <p>✅ Privacy-First Certificate Management</p>
          <p>✅ Homomorphic Operations Supported</p>
          <p>✅ Production Ready</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;