import React from 'react';
import ThemeToggle from './ThemeToggle';
import WalletConnection from './WalletConnection';
import { Role } from '../types';
import { GraduationCap, Building, UserCheck, Shield } from 'lucide-react';
import { SuiIcon } from './SuiIcon';


interface HeaderProps {
  currentRole: Role;
  setRole: (role: Role) => void;
}

const Header: React.FC<HeaderProps> = ({ currentRole, setRole }) => {
    const roles = [
        { id: Role.Student, name: 'Student', icon: GraduationCap },
        { id: Role.University, name: 'University', icon: Building },
        { id: Role.Verifier, name: 'Verifier', icon: UserCheck },
        { id: Role.Admin, name: 'Admin', icon: Shield },
    ];

  return (
    <header className="bg-surface-light/80 dark:bg-surface/80 backdrop-blur-lg border-b border-white/10 dark:border-white/10 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SuiIcon className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary tracking-tight font-heading">SkillPass</h1>
        </div>
        
        <div className="hidden md:flex items-center justify-center p-1 rounded-full bg-background-light dark:bg-background">
          {roles.map((role) => (
             <button
                key={role.id}
                onClick={() => setRole(role.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    currentRole === role.id 
                    ? 'bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg shadow-primary/30' 
                    : 'text-text-secondary-light dark:text-text-secondary hover:bg-surface-light dark:hover:bg-surface'
                }`}
             >
                <role.icon className="w-4 h-4" />
                {role.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <WalletConnection />
        </div>
      </nav>
      {/* Mobile Role Switcher */}
      <div className="md:hidden flex items-center justify-center p-2 bg-background-light dark:bg-background border-t border-surface-dark/20 dark:border-surface-dark">
          {roles.map((role) => (
             <button
                key={role.id}
                onClick={() => setRole(role.id)}
                className={`flex-1 flex justify-center items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${
                    currentRole === role.id 
                    ? 'bg-primary/20 text-primary-dark dark:text-primary-light' 
                    : 'text-text-secondary-light dark:text-text-secondary'
                }`}
             >
                <role.icon className="w-4 h-4" />
                <span>{role.name}</span>
            </button>
          ))}
        </div>
    </header>
  );
};

export default Header;