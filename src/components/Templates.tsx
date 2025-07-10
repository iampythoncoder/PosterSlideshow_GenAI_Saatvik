import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Star, Download, Eye, Search, Filter } from 'lucide-react';

export const Templates: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'business', name: 'Business', count: 8 },
    { id: 'education', name: 'Education', count: 6 },
    { id: 'event', name: 'Event', count: 5 },
    { id: 'marketing', name: 'Marketing', count: 5 }
  ];

  const templates = [
    {
      id: 1,
      name: 'Professional Trifold',
      category: 'business',
      preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      downloads: 1234,
      isPremium: false
    },
    {
      id: 2,
      name: 'Modern Infographic',
      category: 'business',
      preview: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      downloads: 2156,
      isPremium: true
    },
    {
      id: 3,
      name: 'Educational Poster',
      category: 'education',
      preview: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      downloads: 987,
      isPremium: false
    },
    {
      id: 4,
      name: 'Event Announcement',
      category: 'event',
      preview: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      downloads: 756,
      isPremium: false
    },
    {
      id: 5,
      name: 'Marketing Campaign',
      category: 'marketing',
      preview: 'https://images.pexels.com/photos/3184341/pexels-photo-3184341.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      downloads: 1543,
      isPremium: true
    },
    {
      id: 6,
      name: 'Research Presentation',
      category: 'education',
      preview: 'https://images.pexels.com/photos/3184342/pexels-photo-3184342.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      downloads: 432,
      isPremium: false
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Template Library
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Choose from professionally designed templates to jumpstart your project</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Filter Button */}
          <motion.button
            className="flex items-center space-x-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Templates Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xl group hover:shadow-2xl transition-all"
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden mb-4 relative">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    PRO
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/90 rounded-full shadow-lg"
                    >
                      <Eye className="w-5 h-5 text-slate-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-green-500 text-white rounded-full shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{template.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{template.rating}</span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{template.downloads.toLocaleString()} downloads</span>
                </div>

                <motion.button
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-xl font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Use Template
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Layout className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">No templates found</h3>
            <p className="text-slate-500 dark:text-slate-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};