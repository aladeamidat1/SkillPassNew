# 🎓 SkillPass - Verifiable Credentials on Sui Blockchain

**SkillPass** is a decentralized application (dApp) for issuing, managing, and verifying academic credentials on the Sui blockchain. Built with privacy-first principles using Microsoft SEAL homomorphic encryption.

![SkillPass Banner](https://img.shields.io/badge/Blockchain-Sui-blue) ![React](https://img.shields.io/badge/React-18+-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6) ![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF)

---

## 🚀 **Features**

### 🔐 **SEAL Encryption Support**
- **Privacy-First Certificates**: Encrypt sensitive data using Microsoft SEAL homomorphic encryption
- **Selective Disclosure**: Share certificates without revealing sensitive information
- **Verifiable Privacy**: Maintain authenticity while protecting personal data

### 🏛️ **Multi-Role Dashboard**
- **👨‍🎓 Student Dashboard**: View and manage your earned certificates
- **🏫 University Portal**: Issue standard and encrypted certificates
- **🔍 Verifier Portal**: Real-time certificate verification
- **👑 Admin Dashboard**: System management and university authorization

### ⛓️ **Blockchain Integration**
- **Sui Testnet**: Live smart contract integration
- **Real-time Data**: No mock data - all information from blockchain
- **Wallet Connection**: Sui wallet integration with auto-connect
- **Transaction Handling**: Complete certificate lifecycle management

### 🎨 **Modern UI/UX**
- **Three.js Animations**: Beautiful particle background effects
- **Dark/Light Theme**: Responsive design with theme switching
- **Real-time Status**: Live contract and authorization status indicators
- **Error Handling**: Comprehensive error messages and recovery guidance

---

## 🛠️ **Tech Stack**

| Category | Technology | Purpose |
|----------|------------|----------|
| **Frontend** | React 19 + TypeScript | Modern UI framework |
| **Build Tool** | Vite 6.0+ | Fast development and building |
| **Blockchain** | Sui Testnet | Decentralized certificate storage |
| **Wallet** | @mysten/dapp-kit | Sui wallet integration |
| **Styling** | TailwindCSS | Utility-first CSS framework |
| **3D Graphics** | Three.js + React Three Fiber | Animated backgrounds |
| **Encryption** | Microsoft SEAL | Homomorphic encryption support |
| **State Management** | React Hooks + Context | Centralized state management |

---

## 📋 **Prerequisites**

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Sui Wallet**: [Sui Wallet Extension](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)
- **Testnet SUI**: Get testnet SUI from [Sui Discord Faucet](https://discord.gg/sui)

---

## 🚀 **Quick Start**

### 1. **Clone & Install**
```bash
# Clone the repository
git clone <repository-url>
cd Skill-pass-frontend

# Install dependencies
npm install
```

### 2. **Environment Setup**
```bash
# Start development server
npm run dev

# The app will be available at:
# ➜  Local:   http://localhost:3000/
# ➜  Network: http://172.16.0.158:3000/
```

### 3. **Connect Wallet**
1. Install Sui Wallet browser extension
2. Create or import a wallet
3. Switch to **Sui Testnet**
4. Get testnet SUI from Discord faucet
5. Click "Connect Wallet" in the app

---

## 🔧 **Smart Contract Configuration**

### **Contract Details**
```typescript
export const CONTRACT_CONFIG = {
  PACKAGE_ID: "0xf1cb82954194f281b4bcddee3b8922b81322cd742d2ab23d169dfaf11883c736",
  REGISTRY_ID: "0x6c0bab54d2c4ba3caba62063cb7e972370e60deb9dbbe2fd46f825897bde0bdd",
  NETWORK: "https://fullnode.testnet.sui.io:443",
  MODULE_NAME: "skillpass",
  CERTIFICATE_REGISTRY: "certificate_registry",
  ADMIN_ADDRESS: "0x83b3e15b0f43aacdbd39ede604391ef9720df83b33420fb72deef7f8e795cbe9"
};
```

### **Updating Contract Configuration**
If you deploy your own contract, update the configuration in:
- `src/hooks/useContract.ts`

---

## 📖 **User Guide**

### **🏫 For Universities**

1. **Get Authorized**
   - Contact the system administrator
   - Provide your Sui wallet address
   - Admin will add you through Admin Dashboard

2. **Issue Certificates**
   ```
   University Portal → Connect Wallet → Issue New Certificate
   ```
   - **Standard Certificates**: Public information
   - **SEAL Encrypted**: Privacy-protected sensitive data

3. **Manage Certificates**
   - View all issued certificates
   - Revoke certificates if needed
   - Track certificate status

### **👨‍🎓 For Students**

1. **View Certificates**
   ```
   Student Dashboard → Connect Wallet → View Certificates
   ```
   - See all certificates owned by your wallet
   - Check certificate validity status
   - Share verification URLs

2. **Share Certificates**
   - Copy certificate ID for verification
   - Direct others to Verifier Portal

### **🔍 For Verifiers**

1. **Verify Certificates**
   ```
   Verifier Portal → Enter Certificate ID → Verify
   ```
   - Real-time blockchain verification
   - Complete certificate details
   - Validity status checking

### **👑 For Administrators**

1. **Manage Universities**
   ```
   Admin Dashboard → University Management → Add University
   ```
   - Add/remove authorized universities
   - Monitor system status
   - View contract information

---

## 🔐 **SEAL Encryption Guide**

### **What is SEAL?**
Microsoft SEAL is a homomorphic encryption library that allows:
- **Encrypted Storage**: Sensitive data encrypted at rest
- **Verifiable Privacy**: Prove authenticity without revealing content
- **Homomorphic Operations**: Compute on encrypted data

### **Using Encrypted Certificates**

1. **For Universities**:
   - Toggle "Privacy Mode" when issuing certificates
   - Sensitive fields (grades, detailed credentials) are encrypted
   - Public metadata remains verifiable

2. **For Students**:
   - Encrypted certificates show `[ENCRYPTED]` status
   - Full data accessible only with proper keys
   - Maintain privacy while proving authenticity

3. **For Verifiers**:
   - Can verify certificate authenticity
   - Cannot access encrypted sensitive data
   - Receive confirmation of validity without privacy breach

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **❌ "Package object does not exist"**
**Cause**: Network mismatch or incorrect contract address
**Solution**:
1. Ensure wallet is connected to **Sui Testnet**
2. Verify contract configuration in `useContract.ts`
3. Check contract deployment status

#### **❌ "MoveAbort(..., 2) - ENotAuthorizedUniversity"**
**Cause**: Wallet not registered as authorized university
**Solution**:
1. Go to Admin Dashboard
2. Add your wallet address as university
3. Retry certificate issuance

#### **❌ "Certificate Not Found"**
**Cause**: Invalid certificate ID or revoked certificate
**Solution**:
1. Verify certificate ID is correct
2. Check if certificate was revoked
3. Contact issuing university

#### **❌ Wallet Connection Issues**
**Solution**:
1. Install Sui Wallet extension
2. Switch to Sui Testnet in wallet
3. Refresh the page
4. Ensure sufficient testnet SUI balance

### **Getting Help**
- Check browser console for detailed error messages
- Verify wallet network settings
- Ensure sufficient gas fees for transactions

---

## 🏗️ **Development**

### **Project Structure**
```
Skill-pass-frontend/
├── components/          # Reusable UI components
│   ├── AnimatedBackground.tsx
│   ├── CertificateCard.tsx
│   ├── Header.tsx
│   ├── WalletConnection.tsx
│   └── ...
├── contexts/           # React context providers
│   └── WalletProvider.tsx
├── hooks/              # Custom React hooks
│   └── useContract.ts  # Smart contract interactions
├── views/              # Main application views
│   ├── AdminDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── UniversityPortal.tsx
│   └── VerifierPortal.tsx
├── types.ts           # TypeScript type definitions
└── App.tsx           # Main application component
```

### **Available Scripts**
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Adding New Features**

1. **New Contract Functions**:
   - Add function to `hooks/useContract.ts`
   - Create corresponding UI components
   - Handle error states and loading

2. **New UI Components**:
   - Follow existing component patterns
   - Use TailwindCSS for styling
   - Implement proper TypeScript types

---

## 🌐 **Deployment**

### **Build for Production**
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### **Environment Variables**
Update contract configuration in production:
- Verify `CONTRACT_CONFIG` in `hooks/useContract.ts`
- Ensure correct network endpoints
- Update admin addresses as needed

---

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain component reusability
- Add proper error handling
- Write meaningful commit messages
- Test on Sui Testnet before submitting

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 **Links**

- **Sui Documentation**: [https://docs.sui.io/](https://docs.sui.io/)
- **Sui Wallet**: [Chrome Extension](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)
- **Sui Explorer**: [https://suiexplorer.com/](https://suiexplorer.com/)
- **Microsoft SEAL**: [https://github.com/Microsoft/SEAL](https://github.com/Microsoft/SEAL)
- **Discord Testnet Faucet**: [Sui Discord](https://discord.gg/sui)

---

## 🙏 **Acknowledgments**

- **Sui Foundation** for the blockchain infrastructure
- **Microsoft** for SEAL homomorphic encryption
- **Mysten Labs** for the dApp Kit
- **React Team** for the amazing frontend framework
- **Vite Team** for the lightning-fast build tool

---

**Built with ❤️ for the future of verifiable credentials**

*Last updated: December 2024*