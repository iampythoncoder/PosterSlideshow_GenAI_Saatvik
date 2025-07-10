import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileImage, FileText, Image as ImageIcon, Zap } from 'lucide-react';
import { exportToPNG, exportToPDF, exportToJPEG, exportHighRes } from '../utils/posterExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvas: HTMLCanvasElement | null;
  posterTitle: string;
  posterSize: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  canvas,
  posterTitle,
  posterSize
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | 'jpeg' | 'hd'>('png');

  const handleExport = async () => {
    if (!canvas) return;
    
    setIsExporting(true);
    
    try {
      const filename = posterTitle || 'poster';
      
      switch (exportType) {
        case 'png':
          await exportToPNG(canvas, filename);
          break;
        case 'pdf':
          await exportToPDF(canvas, filename, posterSize);
          break;
        case 'jpeg':
          await exportToJPEG(canvas, filename, 0.9);
          break;
        case 'hd':
          await exportHighRes(canvas, filename, 3);
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      type: 'png' as const,
      name: 'PNG Image',
      description: 'High quality with transparency',
      icon: ImageIcon,
      size: '~2-5 MB'
    },
    {
      type: 'pdf' as const,
      name: 'PDF Document',
      description: 'Print-ready format',
      icon: FileText,
      size: '~1-3 MB'
    },
    {
      type: 'jpeg' as const,
      name: 'JPEG Image',
      description: 'Smaller file size',
      icon: FileImage,
      size: '~500KB-2MB'
    },
    {
      type: 'hd' as const,
      name: 'HD PNG (3x)',
      description: 'Ultra high resolution',
      icon: Zap,
      size: '~10-20 MB'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Export Poster</h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-3 mb-6">
              {exportOptions.map((option) => (
                <motion.button
                  key={option.type}
                  onClick={() => setExportType(option.type)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    exportType === option.type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-blue-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      exportType === option.type
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-800 dark:text-slate-200">{option.name}</h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{option.size}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex space-x-3">
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleExport}
                disabled={isExporting || !canvas}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: isExporting ? 1 : 1.02 }}
                whileTap={{ scale: isExporting ? 1 : 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};