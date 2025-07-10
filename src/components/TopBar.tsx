import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Download, Share2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const TopBar: React.FC = () => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm"
    >
      {/* Left section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates, images..."
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all w-80"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </motion.button>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          />
        </motion.button>

        {/* User avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg"
        >
          <span className="text-white font-bold text-sm">U</span>
        </motion.div>
      </div>
    </motion.div>
  );
};