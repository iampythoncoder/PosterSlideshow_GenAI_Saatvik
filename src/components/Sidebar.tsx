import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileImage, Image, Layout, FolderOpen, Settings, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'generator', label: 'Poster Generator', icon: FileImage },
  { id: 'images', label: 'AI Images', icon: Image },
  { id: 'templates', label: 'Templates', icon: Layout },
  { id: 'gallery', label: 'Gallery', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 flex flex-col h-full shadow-xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-3"
        >
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PosterCraft</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Design</p>
              </div>
            </>
          )}
        </motion.div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all relative group ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`relative ${activeSection === item.id ? 'drop-shadow-lg' : ''}`}>
              <item.icon className="w-6 h-6" />
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
            )}
            {activeSection === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute right-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Creative User</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pro Plan</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};