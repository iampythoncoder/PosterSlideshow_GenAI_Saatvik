import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { PosterGenerator } from './components/PosterGenerator';
import { ImageGenerator } from './components/ImageGenerator';
import { Gallery } from './components/Gallery';
import { Templates } from './components/Templates';
import { Settings } from './components/Settings';

function App() {
  const [activeSection, setActiveSection] = useState('generator');

  const renderMainContent = () => {
    switch (activeSection) {
      case 'generator':
        return <PosterGenerator />;
      case 'images':
        return <ImageGenerator />;
      case 'templates':
        return <Templates />;
      case 'gallery':
        return <Gallery />;
      case 'settings':
        return <Settings />;
      default:
        return <PosterGenerator />;
    }
  };

  return (
    <ThemeProvider>
      <AppContent activeSection={activeSection} setActiveSection={setActiveSection} renderMainContent={renderMainContent} />
    </ThemeProvider>
  );
}

const AppContent: React.FC<{
  activeSection: string;
  setActiveSection: (section: string) => void;
  renderMainContent: () => React.ReactNode;
}> = ({ activeSection, setActiveSection, renderMainContent }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 text-slate-900 dark:text-slate-100 transition-all duration-500">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/5 dark:to-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 dark:from-indigo-400/5 dark:to-cyan-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-gradient-to-r from-emerald-400/8 to-teal-400/8 dark:from-emerald-400/4 dark:to-teal-400/4 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="flex h-screen relative">
        {/* Sidebar */}
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {renderMainContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;