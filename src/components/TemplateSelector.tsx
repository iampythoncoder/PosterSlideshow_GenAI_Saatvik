import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Layout, BarChart3, Presentation } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = [
  { 
    id: 'trifold', 
    name: 'Trifold Brochure', 
    icon: FileText, 
    description: 'Three-panel folding design',
    preview: '📄'
  },
  { 
    id: 'single', 
    name: 'Single Panel', 
    icon: Layout, 
    description: 'Classic poster layout',
    preview: '📋'
  },
  { 
    id: 'infographic', 
    name: 'Infographic', 
    icon: BarChart3, 
    description: 'Data-driven visual design',
    preview: '📊'
  },
  { 
    id: 'presentation', 
    name: 'Presentation Board', 
    icon: Presentation, 
    description: 'Academic or business presentation',
    preview: '🎯'
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
          <Layout className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Template</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 bg-slate-50 dark:bg-slate-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{template.preview}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{template.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{template.description}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};