import React, { useState, useMemo, createContext, useContext } from 'react';
import Header from './components/Header';
import StudentDashboard from './views/StudentDashboard';
import UniversityPortal from './views/UniversityPortal';
import VerifierPortal from './views/VerifierPortal';
import AdminDashboard from './views/AdminDashboard';
import AnimatedBackground from './components/AnimatedBackground';
import SplashScreen from './views/SplashScreen';
import SuiWalletProvider from './contexts/WalletProvider';
import '@mysten/dapp-kit/dist/index.css';
import { Role } from './types';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [role, setRole] = useState<Role>(Role.Student);
  const [showSplash, setShowSplash] = useState(true);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
  
  const handleEnterApp = () => {
    setShowSplash(false);
  };

  const renderPortal = () => {
    switch (role) {
      case Role.Student:
        return <StudentDashboard />;
      case Role.University:
        return <UniversityPortal />;
      case Role.Verifier:
        return <VerifierPortal />;
      case Role.Admin:
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <SuiWalletProvider>
      <ThemeContext.Provider value={themeValue}>
        <div className="bg-background-light dark:bg-background text-text-primary-light dark:text-text-primary min-h-screen font-sans transition-colors duration-500">
          <AnimatedBackground />
          {showSplash ? (
            <SplashScreen onEnterApp={handleEnterApp} />
          ) : (
            <div className="relative z-10">
              <Header currentRole={role} setRole={setRole} />
              <main className="container mx-auto px-4 py-8">
                 <div className="bg-surface-light/60 dark:bg-surface/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/20">
                  {renderPortal()}
                </div>
              </main>
            </div>
          )}
        </div>
      </ThemeContext.Provider>
    </SuiWalletProvider>
  );
};

export default App;