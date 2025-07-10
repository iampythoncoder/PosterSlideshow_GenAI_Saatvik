import React from 'react';
import { motion } from 'framer-motion';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Trash2, Copy, Wand2, Image } from 'lucide-react';
import { PosterElement } from './PosterGenerator';

interface TextEditorProps {
  element: PosterElement;
  onElementUpdate: (updates: Partial<PosterElement>) => void;
  onGenerateAIImage?: (prompt: string) => void;
}

const fontFamilies = [
  'Inter, system-ui, sans-serif',
  'Arial, sans-serif',
  'Helvetica, sans-serif', 
  'Times New Roman, serif',
  'Georgia, serif',
  'Verdana, sans-serif',
  'Trebuchet MS, sans-serif',
  'Impact, sans-serif',
  'Courier New, monospace'
];

const fontWeights = [
  { value: '300', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: 'bold', label: 'Bold' },
  { value: '900', label: 'Black' }
];

export const TextEditor: React.FC<TextEditorProps> = ({ 
  element, 
  onElementUpdate, 
  onGenerateAIImage 
}) => {
  const [aiPrompt, setAiPrompt] = React.useState('');

  const handleAIImageGenerate = () => {
    if (aiPrompt.trim() && onGenerateAIImage) {
      onGenerateAIImage(aiPrompt);
      setAiPrompt('');
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          {element.type === 'text' ? <Type className="w-5 h-5 text-white" /> : <Image className="w-5 h-5 text-white" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {element.type === 'text' ? 'Text Editor' : 'Image Editor'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {element.type === 'text' ? 'Customize text appearance' : 'Modify image properties'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {element.type === 'text' ? (
          <>
            {/* Text Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content</label>
              <textarea
                value={element.content}
                onChange={(e) => onElementUpdate({ content: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                rows={4}
                placeholder="Enter your text here..."
              />
            </div>

            {/* Typography Controls */}
            <div className="grid grid-cols-2 gap-4">
              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Font</label>
                <select
                  value={element.fontFamily || 'Inter, system-ui, sans-serif'}
                  onChange={(e) => onElementUpdate({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font}>{font.split(',')[0]}</option>
                  ))}
                </select>
              </div>

              {/* Font Weight */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Weight</label>
                <select
                  value={element.fontWeight || 'normal'}
                  onChange={(e) => onElementUpdate({ fontWeight: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                >
                  {fontWeights.map(weight => (
                    <option key={weight.value} value={weight.value}>{weight.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Size: {element.fontSize || 16}px
              </label>
              <input
                type="range"
                min="8"
                max="120"
                value={element.fontSize || 16}
                onChange={(e) => onElementUpdate({ fontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>8px</span>
                <span>120px</span>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Text Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={element.color || '#000000'}
                    onChange={(e) => onElementUpdate({ color: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.color || '#000000'}
                    onChange={(e) => onElementUpdate({ color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Background</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={element.backgroundColor || '#ffffff'}
                    onChange={(e) => onElementUpdate({ backgroundColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.backgroundColor || ''}
                    onChange={(e) => onElementUpdate({ backgroundColor: e.target.value })}
                    placeholder="Transparent"
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Alignment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Text Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'left', icon: AlignLeft, label: 'Left' },
                  { value: 'center', icon: AlignCenter, label: 'Center' },
                  { value: 'right', icon: AlignRight, label: 'Right' }
                ].map(({ value, icon: Icon, label }) => (
                  <motion.button
                    key={value}
                    onClick={() => onElementUpdate({ alignment: value as 'left' | 'center' | 'right' })}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      element.alignment === value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 text-slate-600 dark:text-slate-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-600">
              <h4 className="font-medium text-slate-700 dark:text-slate-300">Advanced Options</h4>
              
              {/* Border Radius */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Border Radius: {element.borderRadius || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={element.borderRadius || 0}
                  onChange={(e) => onElementUpdate({ borderRadius: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Opacity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Opacity: {Math.round((element.opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={element.opacity || 1}
                  onChange={(e) => onElementUpdate({ opacity: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Text Shadow Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="textShadow"
                  checked={element.textShadow || false}
                  onChange={(e) => onElementUpdate({ textShadow: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                <label htmlFor="textShadow" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Text Shadow
                </label>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Image Controls */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
              <input
                type="text"
                value={element.content}
                onChange={(e) => onElementUpdate({ content: e.target.value })}
                placeholder="Enter image URL or upload an image"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* AI Image Generation */}
            {onGenerateAIImage && (
              <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 flex items-center">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate AI Image
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the image you want..."
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-purple-200 dark:border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAIImageGenerate()}
                  />
                  <motion.button
                    onClick={handleAIImageGenerate}
                    disabled={!aiPrompt.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ✨ Generate
                  </motion.button>
                </div>
              </div>
            )}

            {/* AI Image Generation Button for Images */}
            {element.type === 'image' && (
              <div className="mt-4">
                <motion.button
                  onClick={() => {
                    const prompt = `professional high-quality image, modern design, suitable for poster, clean composition, ${element.content ? 'replacement image' : 'placeholder content'}`;
                    if (onGenerateAIImage) {
                      onGenerateAIImage(prompt);
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Generate New AI Image</span>
                </motion.button>
              </div>
            )}

            {/* Image Properties */}
            <div className="space-y-4">
              {/* Border Radius */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Border Radius: {element.borderRadius || 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={element.borderRadius || 0}
                  onChange={(e) => onElementUpdate({ borderRadius: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Opacity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Opacity: {Math.round((element.opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={element.opacity || 1}
                  onChange={(e) => onElementUpdate({ opacity: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Border */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Border Width</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={element.borderWidth || 0}
                    onChange={(e) => onElementUpdate({ borderWidth: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Border Color</label>
                  <input
                    type="color"
                    value={element.borderColor || '#000000'}
                    onChange={(e) => onElementUpdate({ borderColor: e.target.value })}
                    className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Position and Size */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-600">
          <h4 className="font-medium text-slate-700 dark:text-slate-300">Position & Size</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">X Position</label>
              <input
                type="number"
                value={element.x}
                onChange={(e) => onElementUpdate({ x: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Y Position</label>
              <input
                type="number"
                value={element.y}
                onChange={(e) => onElementUpdate({ y: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Width</label>
              <input
                type="number"
                value={element.width}
                onChange={(e) => onElementUpdate({ width: parseInt(e.target.value) || 100 })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Height</label>
              <input
                type="number"
                value={element.height}
                onChange={(e) => onElementUpdate({ height: parseInt(e.target.value) || 50 })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};