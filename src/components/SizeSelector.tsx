import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

interface SizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

const sizes = [
  { id: 'a4', name: 'A4', dimensions: '8.3" × 11.7"', description: 'Standard document' },
  { id: 'letter', name: 'Letter', dimensions: '8.5" × 11"', description: 'US standard' },
  { id: 'poster', name: 'Poster', dimensions: '24" × 36"', description: 'Large format' },
  { id: 'instagram', name: 'Instagram', dimensions: '1080 × 1080', description: 'Square social' },
  { id: 'banner', name: 'Web Banner', dimensions: '1920 × 1080', description: 'Landscape web' },
  { id: 'trifold', name: 'Trifold', dimensions: '8.5" × 11"', description: 'Folded brochure' }
];

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  selectedSize,
  onSizeChange
}) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
          <Maximize2 className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Size</h2>
      </div>

      <div className="space-y-2">
        {sizes.map((size) => (
          <motion.button
            key={size.id}
            onClick={() => onSizeChange(size.id)}
            className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
              selectedSize === size.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 bg-slate-50 dark:bg-slate-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{size.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{size.description}</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{size.dimensions}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};