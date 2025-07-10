import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

interface ColorSchemeSelectorProps {
  selectedScheme: string;
  onSchemeChange: (scheme: string) => void;
}

const colorSchemes = [
  { 
    id: 'professional', 
    name: 'Professional', 
    colors: ['#1e40af', '#3b82f6', '#60a5fa'],
    background: '#ffffff'
  },
  { 
    id: 'vibrant', 
    name: 'Vibrant', 
    colors: ['#dc2626', '#f59e0b', '#10b981'],
    background: '#fef7f0'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    colors: ['#374151', '#6b7280', '#9ca3af'],
    background: '#f9fafb'
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    colors: ['#7c3aed', '#a855f7', '#c084fc'],
    background: '#faf5ff'
  },
  { 
    id: 'nature', 
    name: 'Nature', 
    colors: ['#059669', '#34d399', '#6ee7b7'],
    background: '#f0fdf4'
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    colors: ['#ea580c', '#fb923c', '#fbbf24'],
    background: '#fffbeb'
  }
];

export const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
  selectedScheme,
  onSchemeChange
}) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Color Scheme</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {colorSchemes.map((scheme) => (
          <motion.button
            key={scheme.id}
            onClick={() => onSchemeChange(scheme.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedScheme === scheme.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-600 hover:border-blue-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex space-x-1 mb-2 justify-center">
              {scheme.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{scheme.name}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};