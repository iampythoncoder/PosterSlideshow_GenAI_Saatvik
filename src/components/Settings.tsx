import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Grid, 
  Palette, 
  Zap, 
  Monitor, 
  Download, 
  Bell,
  Save,
  Upload,
  RotateCcw,
  Check,
  X
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Canvas Settings
    snapToGrid: true,
    gridSize: 20,
    showRulers: true,
    showGuides: true,
    
    // Default Styles
    defaultFont: 'Inter, system-ui, sans-serif',
    defaultFontSize: 16,
    defaultTextColor: '#000000',
    defaultBackgroundColor: '#ffffff',
    
    // Performance
    autoSave: true,
    autoSaveInterval: 30,
    imageQuality: 'high',
    memoryOptimization: false,
    
    // Appearance
    theme: 'system',
    compactMode: false,
    showTips: true,
    
    // Export
    defaultExportFormat: 'png',
    exportQuality: 90,
    includeMetadata: true,
    
    // Notifications
    enableNotifications: true,
    exportNotifications: true,
    autoSaveNotifications: false
  });

  const [activeTab, setActiveTab] = useState('canvas');
  const [showSuccess, setShowSuccess] = useState(false);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('posterSettings', JSON.stringify(settings));
  }, [settings]);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('posterSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.log('Could not load saved settings');
      }
    }
  }, []);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      snapToGrid: true,
      gridSize: 20,
      showRulers: true,
      showGuides: true,
      defaultFont: 'Inter, system-ui, sans-serif',
      defaultFontSize: 16,
      defaultTextColor: '#000000',
      defaultBackgroundColor: '#ffffff',
      autoSave: true,
      autoSaveInterval: 30,
      imageQuality: 'high',
      memoryOptimization: false,
      theme: 'system',
      compactMode: false,
      showTips: true,
      defaultExportFormat: 'png',
      exportQuality: 90,
      includeMetadata: true,
      enableNotifications: true,
      exportNotifications: true,
      autoSaveNotifications: false
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'poster-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings(imported);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
          console.log('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'canvas', name: 'Canvas', icon: Grid },
    { id: 'styles', name: 'Defaults', icon: Palette },
    { id: 'performance', name: 'Performance', icon: Zap },
    { id: 'appearance', name: 'Appearance', icon: Monitor },
    { id: 'export', name: 'Export', icon: Download },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  const fonts = [
    'Inter, system-ui, sans-serif',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Georgia, serif',
    'Verdana, sans-serif'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Settings & Preferences
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Customize your design experience</p>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3"
        >
          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-200">Settings updated successfully!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="xl:col-span-1"
        >
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Categories
            </h3>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <motion.button
                onClick={resetSettings}
                className="w-full flex items-center justify-center space-x-2 bg-slate-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-slate-600 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All</span>
              </motion.button>

              <motion.button
                onClick={exportSettings}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-4 h-4" />
                <span>Export</span>
              </motion.button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <motion.button
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="xl:col-span-3"
        >
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
            {/* Canvas Settings */}
            {activeTab === 'canvas' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Canvas Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Snap to Grid</label>
                      <input
                        type="checkbox"
                        checked={settings.snapToGrid}
                        onChange={(e) => updateSetting('snapToGrid', e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Grid Size: {settings.gridSize}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={settings.gridSize}
                        onChange={(e) => updateSetting('gridSize', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Rulers</label>
                      <input
                        type="checkbox"
                        checked={settings.showRulers}
                        onChange={(e) => updateSetting('showRulers', e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Alignment Guides</label>
                      <input
                        type="checkbox"
                        checked={settings.showGuides}
                        onChange={(e) => updateSetting('showGuides', e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Default Styles */}
            {activeTab === 'styles' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Default Styles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Font</label>
                      <select
                        value={settings.defaultFont}
                        onChange={(e) => updateSetting('defaultFont', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
                      >
                        {fonts.map(font => (
                          <option key={font} value={font}>{font.split(',')[0]}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Default Font Size: {settings.defaultFontSize}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="72"
                        value={settings.defaultFontSize}
                        onChange={(e) => updateSetting('defaultFontSize', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Text Color</label>
                      <input
                        type="color"
                        value={settings.defaultTextColor}
                        onChange={(e) => updateSetting('defaultTextColor', e.target.value)}
                        className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Background Color</label>
                      <input
                        type="color"
                        value={settings.defaultBackgroundColor}
                        onChange={(e) => updateSetting('defaultBackgroundColor', e.target.value)}
                        className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Settings */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Performance Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto-save</label>
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => updateSetting('autoSave', e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Auto-save Interval: {settings.autoSaveInterval}s
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="300"
                        value={settings.autoSaveInterval}
                        onChange={(e) => updateSetting('autoSaveInterval', parseInt(e.target.value))}
                        className="w-full"
                        disabled={!settings.autoSave}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Quality</label>
                      <select
                        value={settings.imageQuality}
                        onChange={(e) => updateSetting('imageQuality', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
                      >
                        <option value="low">Low (Faster)</option>
                        <option value="medium">Medium</option>
                        <option value="high">High (Better Quality)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Memory Optimization</label>
                      <input
                        type="checkbox"
                        checked={settings.memoryOptimization}
                        onChange={(e) => updateSetting('memoryOptimization', e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Appearance Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                      <select
                        value={settings.theme}
                        onChange={(e) => updateSetting('theme', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Compact Mode</label>
                      <input
                        type="checkbox"
                        checked={settings.compactMode}
                        onChange={(e) => updateSetting('compactMode', e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Tips & Tutorials</label>
                      <input
                        type="checkbox"
                        checked={settings.showTips}
                        onChange={(e) => updateSetting('showTips', e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Export Settings */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Export Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Export Format</label>
                      <select
                        value={settings.defaultExportFormat}
                        onChange={(e) => updateSetting('defaultExportFormat', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
                      >
                        <option value="png">PNG</option>
                        <option value="pdf">PDF</option>
                        <option value="jpeg">JPEG</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Export Quality: {settings.exportQuality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={settings.exportQuality}
                        onChange={(e) => updateSetting('exportQuality', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Include Metadata</label>
                      <input
                        type="checkbox"
                        checked={settings.includeMetadata}
                        onChange={(e) => updateSetting('includeMetadata', e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Notifications</label>
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Export Completion Notifications</label>
                    <input
                      type="checkbox"
                      checked={settings.exportNotifications}
                      onChange={(e) => updateSetting('exportNotifications', e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600"
                      disabled={!settings.enableNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto-save Notifications</label>
                    <input
                      type="checkbox"
                      checked={settings.autoSaveNotifications}
                      onChange={(e) => updateSetting('autoSaveNotifications', e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600"
                      disabled={!settings.enableNotifications}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};