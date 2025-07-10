import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Download, Share2, Trash2, Eye, Grid3X3, List, Calendar } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const projects = [
    {
      id: 1,
      name: 'FocusDrive Campaign',
      type: 'Poster',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-15',
      size: '2.4 MB',
      dimensions: '2550x1100'
    },
    {
      id: 2,
      name: 'Safety Awareness',
      type: 'Infographic',
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-14',
      size: '1.8 MB',
      dimensions: '1080x1920'
    },
    {
      id: 3,
      name: 'Product Launch',
      type: 'Poster',
      thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-13',
      size: '3.1 MB',
      dimensions: '2550x1100'
    },
    {
      id: 4,
      name: 'Event Promotion',
      type: 'Banner',
      thumbnail: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-12',
      size: '1.2 MB',
      dimensions: '1920x1080'
    },
    {
      id: 5,
      name: 'Brand Guidelines',
      type: 'Document',
      thumbnail: 'https://images.pexels.com/photos/3184341/pexels-photo-3184341.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-11',
      size: '4.5 MB',
      dimensions: '2480x3508'
    },
    {
      id: 6,
      name: 'Social Media Kit',
      type: 'Collection',
      thumbnail: 'https://images.pexels.com/photos/3184342/pexels-photo-3184342.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-10',
      size: '8.7 MB',
      dimensions: 'Various'
    }
  ];

  const toggleSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(selectedItems.length === projects.length ? [] : projects.map(p => p.id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Project Gallery
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and organize your created designs</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
            <motion.button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Grid3X3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={selectAll}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <input
                type="checkbox"
                checked={selectedItems.length === projects.length}
                onChange={() => {}}
                className="rounded border-slate-300 dark:border-slate-600"
              />
              <span className="text-sm font-medium">
                {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select all'}
              </span>
            </motion.button>

            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <motion.button
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </motion.button>
                <motion.button
                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </motion.button>
                <motion.button
                  className="flex items-center space-x-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </motion.button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{projects.length} projects</span>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 border-2 transition-all cursor-pointer group hover:shadow-2xl ${
                  selectedItems.includes(project.id)
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                onClick={() => toggleSelection(project.id)}
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden mb-4 relative">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(project.id)}
                      onChange={() => {}}
                      className="rounded border-white shadow-lg"
                    />
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {project.type}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/90 rounded-full shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4 text-slate-700" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/90 rounded-full shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-4 h-4 text-slate-700" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate">{project.name}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{project.dimensions}</span>
                    <span>{project.size}</span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{project.createdAt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer ${
                    selectedItems.includes(project.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => toggleSelection(project.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(project.id)}
                    onChange={() => {}}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  
                  <div className="w-16 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-800 dark:text-slate-200 truncate">{project.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{project.type}</p>
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400 text-right">
                    <p>{project.dimensions}</p>
                    <p>{project.size}</p>
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {project.createdAt}
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">No projects yet</h3>
            <p className="text-slate-500 dark:text-slate-500">Start creating your first poster or design</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};