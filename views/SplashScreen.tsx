import React from 'react';
import UniversityMarquee from '../components/UniversityMarquee';
import { Rocket, Target, Send, Linkedin, Twitter, Github } from 'lucide-react';
import { SuiIcon } from '../components/SuiIcon';

interface SplashScreenProps {
  onEnterApp: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnterApp }) => {
  return (
    <div className="relative z-10 animate-fade-in text-center text-text-primary-light dark:text-text-primary font-sans">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center container mx-auto px-4 py-16">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-float" style={{animationDelay: '3s'}}></div>

        <SuiIcon className="w-24 h-24 text-primary mb-6" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 font-heading">
          Welcome to <span className="text-primary">SkillPass</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary-light dark:text-text-secondary mb-8">
          The decentralized platform for issuing, verifying, and managing academic credentials on the Sui Blockchain.
        </p>
        <button
          onClick={onEnterApp}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-2xl shadow-primary/40 transform hover:scale-105 flex items-center gap-3"
        >
          <Rocket size={24} />
          Launch dApp
        </button>
      </div>

      {/* Info Sections */}
      <div className="py-20 bg-surface-light/30 dark:bg-surface/30 backdrop-blur-md">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div className="p-8 rounded-xl bg-surface-light dark:bg-surface border border-primary/20 shadow-lg animate-slide-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Target size={28} className="text-primary-dark" />
              </div>
              <h2 className="text-3xl font-bold font-heading">Our Goal</h2>
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary">
              Our goal is to create a global, tamper-proof ecosystem for academic records. We empower students to own and control their credentials, while providing universities and employers with a seamless and secure verification process.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-surface-light dark:bg-surface border border-secondary/20 shadow-lg animate-slide-up" style={{animationDelay: '200ms'}}>
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-secondary/10 rounded-full">
                <Rocket size={28} className="text-secondary-dark" />
              </div>
              <h2 className="text-3xl font-bold font-heading">About Us</h2>
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary">
              SkillPass is a cutting-edge platform built on the Sui blockchain, designed to revolutionize academic credentialing. We leverage decentralized technology to ensure authenticity, security, and portability of diplomas and certificates.
            </p>
          </div>
        </div>
      </div>

      {/* University Marquee */}
      <div className="py-16">
        <h2 className="text-3xl font-bold mb-8 font-heading">Trusted by Leading Institutions</h2>
        <UniversityMarquee />
      </div>

      {/* Footer / Contact */}
      <footer className="py-12 bg-surface-light dark:bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 font-heading">Contact Us</h2>
          <p className="text-text-secondary-light dark:text-text-secondary mb-6">
            Have questions or want to partner with us? Reach out.
          </p>
          <a href="mailto:contact@skillpass.io" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:underline mb-8">
            <Send size={20} />
            contact@skillpass.io
          </a>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-text-secondary-light dark:text-text-secondary hover:text-primary transition-colors"><Twitter size={24} /></a>
            <a href="#" className="text-text-secondary-light dark:text-text-secondary hover:text-primary transition-colors"><Linkedin size={24} /></a>
            <a href="#" className="text-text-secondary-light dark:text-text-secondary hover:text-primary transition-colors"><Github size={24} /></a>
          </div>
           <p className="text-sm text-text-secondary-light dark:text-text-secondary mt-10">© {new Date().getFullYear()} SkillPass. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SplashScreen;