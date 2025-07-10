import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, RefreshCw, Heart, Share2, Wand2, AlertCircle } from 'lucide-react';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedSize, setSelectedSize] = useState('square');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedImages, setGeneratedImages] = useState([
    { id: 1, url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Modern office workspace' },
    { id: 2, url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Creative design studio' },
    { id: 3, url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Technology innovation' },
    { id: 4, url: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=400', prompt: 'Business presentation' }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      // Create enhanced prompt based on selected style
      const stylePrompts = {
        realistic: `${prompt}, photorealistic, high quality, detailed`,
        artistic: `${prompt}, artistic style, painterly, creative interpretation`,
        cartoon: `${prompt}, cartoon style, animated, colorful, fun`,
        abstract: `${prompt}, abstract art, geometric, modern, artistic`
      };
      
      const enhancedPrompt = stylePrompts[selectedStyle as keyof typeof stylePrompts] || prompt;
      
      // Get dimensions based on selected size
      const sizeOptions = {
        square: { width: 800, height: 800 },
        landscape: { width: 1024, height: 768 },
        portrait: { width: 768, height: 1024 },
        wide: { width: 1200, height: 600 },
        banner: { width: 1920, height: 1080 },
        poster: { width: 600, height: 900 }
      };
      
      const dimensions = sizeOptions[selectedSize as keyof typeof sizeOptions] || sizeOptions.square;
      
      // Generate image using Pollinations API
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${dimensions.width}&height=${dimensions.height}&seed=${Math.floor(Math.random() * 1000000)}`;
      
      // Test if the image loads successfully
      const img = new Image();
      img.onload = () => {
        const newImage = {
          id: Date.now(),
          url: pollinationsUrl,
          prompt: prompt
        };
        setGeneratedImages([newImage, ...generatedImages]);
        setIsGenerating(false);
        setPrompt('');
      };
      
      img.onerror = () => {
        setError('Failed to generate image. Please try again with a different prompt.');
        setIsGenerating(false);
      };
      
      img.src = pollinationsUrl;
      
    } catch (err) {
      setError('An error occurred while generating the image.');
      setIsGenerating(false);
    }
  };

  const styles = [
    { id: 'realistic', name: 'Realistic', emoji: '📸', description: 'Photorealistic images' },
    { id: 'artistic', name: 'Artistic', emoji: '🎨', description: 'Painterly and creative' },
    { id: 'cartoon', name: 'Cartoon', emoji: '🎭', description: 'Animated and colorful' },
    { id: 'abstract', name: 'Abstract', emoji: '🌀', description: 'Geometric and modern' }
  ];

  const sizes = [
    { id: 'square', name: 'Square', dimensions: '800×800', description: 'Perfect for social media' },
    { id: 'landscape', name: 'Landscape', dimensions: '1024×768', description: 'Standard landscape' },
    { id: 'portrait', name: 'Portrait', dimensions: '768×1024', description: 'Vertical orientation' },
    { id: 'wide', name: 'Wide', dimensions: '1200×600', description: 'Banner style' },
    { id: 'banner', name: 'HD Banner', dimensions: '1920×1080', description: 'Full HD banner' },
    { id: 'poster', name: 'Poster', dimensions: '600×900', description: 'Poster format' }
  ];

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          AI Image Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Create stunning images from text descriptions using Pollinations AI</p>
      </motion.div>

      {/* Generator Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Generate New Image</h2>
        </div>

        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Describe your image
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic cityscape at sunset with flying cars..."
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
              >
                <Wand2 className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
              </motion.button>
            </div>
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Style
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {styles.map((style) => (
                <motion.button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedStyle === style.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 hover:border-purple-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{style.emoji}</div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{style.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{style.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Image Size
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {sizes.map((size) => (
                <motion.button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedSize === size.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 hover:border-purple-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{size.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{size.dimensions}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{size.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
          {/* Pollinations Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Powered by Pollinations AI</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-300">
              Free, open-source AI image generation. Choose your preferred size and style. Images are generated in real-time and may take a few seconds to load.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Generated Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Generated Images</h2>
          <motion.button
            className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Generating with Pollinations AI...</p>
            </motion.div>
          )}

          {generatedImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xl group hover:shadow-2xl transition-all"
            >
              <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden mb-4 relative">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => downloadImage(image.url, `pollinations-${image.id}`)}
                      className="p-2 bg-white/90 rounded-full shadow-lg"
                    >
                      <Download className="w-4 h-4 text-slate-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/90 rounded-full shadow-lg"
                    >
                      <Heart className="w-4 h-4 text-slate-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/90 rounded-full shadow-lg"
                    >
                      <Share2 className="w-4 h-4 text-slate-700" />
                    </motion.button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{image.prompt}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};