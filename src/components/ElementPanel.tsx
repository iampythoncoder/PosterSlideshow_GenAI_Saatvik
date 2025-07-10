import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Eye, EyeOff, Trash2, Type, Image, Copy, MoveUp, MoveDown } from 'lucide-react';
import { PosterElement } from './PosterGenerator';

interface ElementPanelProps {
  elements: PosterElement[];
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  onElementDelete: (elementId: string) => void;
  onElementDuplicate?: (elementId: string) => void;
}

export const ElementPanel: React.FC<ElementPanelProps> = ({
  elements,
  selectedElement,
  onElementSelect,
  onElementDelete,
  onElementDuplicate
}) => {
  if (elements.length === 0) return null;

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return Type;
      case 'image':
        return Image;
      default:
        return Type;
    }
  };

  const getElementPreview = (element: PosterElement) => {
    if (element.type === 'text') {
      return element.content.substring(0, 30) + (element.content.length > 30 ? '...' : '');
    } else if (element.type === 'image') {
      return element.content ? 'Image' : 'Empty Image';
    }
    return 'Element';
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Layers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{elements.length} elements</p>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {elements.map((element, index) => {
          const IconComponent = getElementIcon(element.type);
          
          return (
            <motion.div
              key={element.id}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer group ${
                selectedElement === element.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 bg-slate-50 dark:bg-slate-700'
              }`}
              onClick={() => onElementSelect(element.id)}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Element Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    element.type === 'text' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  {/* Element Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {getElementPreview(element)}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="capitalize">{element.type}</span>
                      <span>•</span>
                      <span>{element.width}×{element.height}</span>
                      {element.opacity !== undefined && element.opacity < 1 && (
                        <>
                          <span>•</span>
                          <span>{Math.round(element.opacity * 100)}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Duplicate Button */}
                  {onElementDuplicate && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onElementDuplicate(element.id);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                  
                  {/* Visibility Toggle */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementSelect(element.opacity === 0 ? element.id : null);
                      // Toggle visibility by setting opacity
                      // This would need to be implemented in the parent component
                    }}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Toggle visibility"
                  >
                    {element.opacity === 0 ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </motion.button>
                  
                  {/* Delete Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementDelete(element.id);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
              
              {/* Layer Order Indicators */}
              {selectedElement === element.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Layer {elements.length - index}</span>
                    <div className="flex space-x-1">
                      <button
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        title="Move up"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        title="Move down"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {elements.filter(el => el.type === 'text').length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Text Elements</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {elements.filter(el => el.type === 'image').length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Images</p>
          </div>
        </div>
      </div>
    </div>
  );
};