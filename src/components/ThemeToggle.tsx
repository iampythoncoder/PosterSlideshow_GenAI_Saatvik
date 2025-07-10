import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-1">
      {themes.map((themeOption) => (
        <motion.button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={`relative p-2 rounded-lg transition-colors ${
            theme === themeOption.value
              ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-600 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <themeOption.icon className="w-4 h-4" />
          {theme === themeOption.value && (
            <motion.div
              layoutId="activeTheme"
              className="absolute inset-0 bg-blue-500/10 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};