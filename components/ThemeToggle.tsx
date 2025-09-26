
import React from 'react';
import { useTheme } from '../App';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-14 h-8 rounded-full p-1 bg-gray-200 dark:bg-surface-dark relative transition-colors duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <div
        className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center"
        style={theme === 'dark' ? { transform: 'translateX(28px)' } : { transform: 'translateX(0)' }}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-primary" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
