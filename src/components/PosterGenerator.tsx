import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Palette, Download, Eye, Wand2, RotateCcw, Save, Upload, Type, Plus, Settings, Layout, Layers } from 'lucide-react';
import { PosterCanvas } from './PosterCanvas';
import { TrifoldCanvas } from './TrifoldCanvas';
import { TemplateSelector } from './TemplateSelector';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import { SizeSelector } from './SizeSelector';
import { TextEditor } from './TextEditor';
import { ElementPanel } from './ElementPanel';
import { ExportModal } from './ExportModal';
import { AIContentModal } from './AIContentModal';
import { PremadeTemplates } from './PremadeTemplates';
import { generateAdaptiveDesign, analyzeContent } from '../utils/adaptiveDesign';
import { generateEnhancedContent } from '../utils/enhancedContentGenerator';

export interface PosterElement {
  id: string;
  type: 'text' | 'image' | 'icon' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  alignment?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'center' | 'bottom';
  rotation?: number;
  opacity?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  textShadow?: boolean;
  zIndex?: number;
  side?: 'front' | 'back'; // For trifold support
}

export interface PosterData {
  title: string;
  subtitle: string;
  content: string;
  template: string;
  colorScheme: string;
  size: string;
  elements: PosterElement[];
  backgroundColor: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
}

interface HistoryState {
  posterData: PosterData;
  timestamp: number;
}

export const PosterGenerator: React.FC = () => {
  const [posterData, setPosterData] = useState<PosterData>({
    title: '',
    subtitle: '',
    content: '',
    template: 'modern-business',
    colorScheme: 'professional',
    size: 'a4',
    elements: [],
    backgroundColor: '#ffffff',
    backgroundOpacity: 0.3,
    adaptiveDesign: true
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [savedProjects, setSavedProjects] = useState<PosterData[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Undo/Redo functionality
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add to history when posterData changes
  const addToHistory = useCallback((data: PosterData) => {
    const newState: HistoryState = {
      posterData: JSON.parse(JSON.stringify(data)),
      timestamp: Date.now()
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      // Keep only last 50 states
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setPosterData(history[historyIndex - 1].posterData);
    }
  }, [history, historyIndex]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setPosterData(history[historyIndex + 1].posterData);
    }
  }, [history, historyIndex]);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      addToHistory(posterData);
    }
  }, []);

  // Load saved projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('posterProjects');
    if (saved) {
      setSavedProjects(JSON.parse(saved));
    }
  }, []);

  // Auto-save current project
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (posterData.title || posterData.subtitle || posterData.content || posterData.elements.length > 0) {
        const currentProjects = [...savedProjects];
        const projectTitle = posterData.title || `Project ${Date.now()}`;
        const existingIndex = currentProjects.findIndex(p => p.title === projectTitle);
        
        const projectToSave = { ...posterData, title: projectTitle };
        
        if (existingIndex >= 0) {
          currentProjects[existingIndex] = projectToSave;
        } else {
          currentProjects.push(projectToSave);
        }
        
        setSavedProjects(currentProjects);
        localStorage.setItem('posterProjects', JSON.stringify(currentProjects));
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [posterData, savedProjects]);

  const handleAIContentGenerated = (content: { 
    title: string; 
    subtitle: string; 
    content: string;
    backgroundImage?: string;
    keyPoints?: string[];
    callToAction?: string;
  }) => {
    console.log('🎨 Handling AI content generation:', content);
    
    // Generate adaptive design based on content
    const designContext = {
      template: posterData.template,
      size: posterData.size,
      content: content.content,
      tone: 'professional' // This could be passed from the AI modal
    };
    
    const adaptiveDesign = generateAdaptiveDesign(designContext);
    console.log('🎨 Generated adaptive design:', adaptiveDesign);
    
    const elements: PosterElement[] = [];
    
    // GUARANTEED safe content with fallbacks
    const safeTitle = content.title || 'Professional Design Solution';
    const safeSubtitle = content.subtitle || 'Excellence in every detail';
    const safeContent = content.content || 'This professionally generated content is designed to meet your specific requirements and deliver exceptional results through innovative design and strategic thinking.';
    
    // Apply adaptive design to elements
    const titleFontSize = posterData.template === 'trifold' ? 28 : 42;
    const subtitleFontSize = posterData.template === 'trifold' ? 18 : 22;
    const contentFontSize = posterData.template === 'trifold' ? 14 : 16;
    
    const elementWidth = posterData.template === 'trifold' ? 280 : 520;
    const margin = adaptiveDesign.spacing.margin;
    
    // Professional title styling
    elements.push({
      id: 'title-element',
      type: 'text',
      content: safeTitle,
      x: margin,
      y: content.backgroundImage ? 60 : margin,
      width: elementWidth,
      height: posterData.template === 'trifold' ? 80 : 100,
      fontSize: titleFontSize,
      fontFamily: adaptiveDesign.fontFamily,
      fontWeight: 'bold',
      color: adaptiveDesign.colorScheme.primary,
      alignment: 'center',
      verticalAlign: 'center',
      backgroundColor: content.backgroundImage ? 'rgba(255, 255, 255, 0.95)' : 'rgba(248, 250, 252, 0.8)',
      borderRadius: 12,
      textShadow: !!content.backgroundImage,
      zIndex: 2
    });
    
    // Elegant subtitle
    elements.push({
      id: 'subtitle-element',
      type: 'text',
      content: safeSubtitle,
      x: margin + 20,
      y: content.backgroundImage ? 180 : 160,
      width: elementWidth - 40,
      height: posterData.template === 'trifold' ? 60 : 80,
      fontSize: subtitleFontSize,
      fontFamily: adaptiveDesign.fontFamily,
      fontWeight: '500',
      color: adaptiveDesign.colorScheme.secondary,
      alignment: 'center',
      verticalAlign: 'center',
      backgroundColor: content.backgroundImage ? 'rgba(255, 255, 255, 0.9)' : 'rgba(248, 250, 252, 0.6)',
      borderRadius: 8,
      zIndex: 2
    });
    
    // Well-formatted content
    elements.push({
      id: 'content-element',
      type: 'text',
      content: safeContent,
      x: margin + 20,
      y: content.backgroundImage ? 280 : 260,
      width: elementWidth - 40,
      height: posterData.template === 'trifold' ? 280 : 320,
      fontSize: contentFontSize,
      fontFamily: adaptiveDesign.fontFamily,
      fontWeight: 'normal',
      color: adaptiveDesign.colorScheme.text,
      alignment: 'left',
      verticalAlign: 'top',
      backgroundColor: content.backgroundImage ? 'rgba(255, 255, 255, 0.95)' : 'rgba(248, 250, 252, 0.8)',
      borderRadius: 8,
      zIndex: 2
    });

    // Add key points if provided
    if (content.keyPoints && content.keyPoints.length > 0) {
      const keyPointsText = content.keyPoints.map(point => `• ${point}`).join('\n');
      elements.push({
        id: 'keypoints-element',
        type: 'text',
        content: keyPointsText,
        x: margin + 20,
        y: content.backgroundImage ? 600 : 580,
        width: elementWidth - 40,
        height: 120,
        fontSize: contentFontSize - 2,
        fontFamily: adaptiveDesign.fontFamily,
        fontWeight: 'normal',
        color: adaptiveDesign.colorScheme.textSecondary,
        alignment: 'left',
        verticalAlign: 'top',
        backgroundColor: content.backgroundImage ? 'rgba(255, 255, 255, 0.9)' : 'rgba(248, 250, 252, 0.6)',
        borderRadius: 8,
        zIndex: 2
      });
    }
    
    // Add call to action if provided
    if (content.callToAction) {
      elements.push({
        id: 'cta-element',
        type: 'text',
        content: content.callToAction,
        x: margin + 20,
        y: content.backgroundImage ? 740 : 720,
        width: elementWidth - 40,
        height: 50,
        fontSize: contentFontSize + 2,
        fontFamily: adaptiveDesign.fontFamily,
        fontWeight: 'bold',
        color: '#ffffff',
        alignment: 'center',
        verticalAlign: 'center',
        backgroundColor: adaptiveDesign.colorScheme.accent,
        borderRadius: 12,
        zIndex: 2
      });
    }
    
    // Add decorative accent line
    elements.push({
      id: 'accent-line',
      type: 'shape',
      content: '',
      x: margin + 20,
      y: content.backgroundImage ? 150 : 130,
      width: elementWidth - 40,
      height: 4,
      backgroundColor: adaptiveDesign.colorScheme.accent,
      borderRadius: 2,
      zIndex: 1
    });

    const newPosterData = {
      ...posterData,
      title: safeTitle,
      subtitle: safeSubtitle,
      content: safeContent,
      elements,
      backgroundImage: content.backgroundImage,
      backgroundOpacity: content.backgroundImage ? 0.3 : undefined,
      backgroundColor: adaptiveDesign.colorScheme.background
    };
    
    console.log('✅ Final poster data created:', newPosterData);
    setPosterData(newPosterData);
    addToHistory(newPosterData);
  };

  const handleTemplateSelect = (templateData: Partial<PosterData>) => {
    const newPosterData = {
      ...posterData,
      ...templateData,
      elements: templateData.elements || []
    };
    setPosterData(newPosterData);
    addToHistory(newPosterData);
    setShowTemplates(false);
  };

  const handleReset = () => {
    const resetData = {
      title: '',
      subtitle: '',
      content: '',
      template: 'modern-business',
      colorScheme: 'professional',
      size: 'a4',
      elements: [],
      backgroundColor: '#ffffff',
      backgroundOpacity: 0.3
    };
    setPosterData(resetData);
    addToHistory(resetData);
    setSelectedElement(null);
  };

  const handleSave = () => {
    const projectName = prompt('Enter project name:', posterData.title || 'My Poster');
    if (projectName) {
      const updatedPoster = { ...posterData, title: projectName };
      const currentProjects = [...savedProjects];
      const existingIndex = currentProjects.findIndex(p => p.title === projectName);
      
      if (existingIndex >= 0) {
        currentProjects[existingIndex] = updatedPoster;
      } else {
        currentProjects.push(updatedPoster);
      }
      
      setSavedProjects(currentProjects);
      localStorage.setItem('posterProjects', JSON.stringify(currentProjects));
      setPosterData(updatedPoster);
      addToHistory(updatedPoster);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newElement: PosterElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          content: imageUrl,
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          borderRadius: 8,
          zIndex: 1
        };
        
        const newPosterData = {
          ...posterData,
          elements: [...posterData.elements, newElement]
        };
        setPosterData(newPosterData);
        addToHistory(newPosterData);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    const newElement: PosterElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Click to edit this text. This text will automatically wrap to the next line when it reaches the edge of the text box.',
      x: 100,
      y: 100,
      width: 280,
      height: 120,
      fontSize: 18,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 'normal',
      color: '#1f2937',
      alignment: 'left',
      verticalAlign: 'top',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 8,
      zIndex: 2
    };
    
    const newPosterData = {
      ...posterData,
      elements: [...posterData.elements, newElement]
    };
    setPosterData(newPosterData);
    addToHistory(newPosterData);
    setSelectedElement(newElement.id);
  };

  const addImagePlaceholder = () => {
    const newElement: PosterElement = {
      id: `image-placeholder-${Date.now()}`,
      type: 'image',
      content: '', // Empty for placeholder
      x: 150,
      y: 150,
      width: 200,
      height: 150,
      backgroundColor: '#f8fafc',
      borderWidth: 2,
      borderColor: '#e2e8f0',
      borderRadius: 12,
      zIndex: 1
    };
    
    const newPosterData = {
      ...posterData,
      elements: [...posterData.elements, newElement]
    };
    setPosterData(newPosterData);
    addToHistory(newPosterData);
    setSelectedElement(newElement.id);
  };

  const generateAIImage = async (prompt: string, elementId: string) => {
    try {
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=300&seed=${seed}`;
      
      updateElement(elementId, { content: imageUrl });
    } catch (error) {
      console.error('Failed to generate AI image:', error);
    }
  };

  const updateElement = (elementId: string, updates: Partial<PosterElement>) => {
    const newPosterData = {
      ...posterData,
      elements: posterData.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    };
    setPosterData(newPosterData);
    addToHistory(newPosterData);
  };

  const deleteElement = (elementId: string) => {
    const newPosterData = {
      ...posterData,
      elements: posterData.elements.filter(el => el.id !== elementId)
    };
    setPosterData(newPosterData);
    addToHistory(newPosterData);
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  const duplicateElement = (elementId: string) => {
    const element = posterData.elements.find(el => el.id === elementId);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20
      };
      const newPosterData = {
        ...posterData,
        elements: [...posterData.elements, newElement]
      };
      setPosterData(newPosterData);
      addToHistory(newPosterData);
    }
  };

  const selectedElementData = posterData.elements.find(el => el.id === selectedElement);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="space-y-8 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Professional Design Studio
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Create stunning posters, infographics, and presentations with AI assistance, professional templates, and advanced editing tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="xl:col-span-1 space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-blue-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  onClick={() => setShowAIModal(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>AI Generate</span>
                </motion.button>

                <motion.button
                  onClick={() => setShowTemplates(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Layout className="w-4 h-4" />
                  <span>Templates</span>
                </motion.button>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    onClick={addTextElement}
                    className="flex items-center justify-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Type className="w-4 h-4" />
                    <span>Text</span>
                  </motion.button>

                  <motion.button
                    onClick={addImagePlaceholder}
                    className="flex items-center justify-center space-x-1 bg-orange-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-orange-600 transition-all text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image className="w-4 h-4" />
                    <span>Image</span>
                  </motion.button>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 bg-slate-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <TemplateSelector
              selectedTemplate={posterData.template}
              onTemplateChange={(template) => {
                const newPosterData = { ...posterData, template };
                setPosterData(newPosterData);
                addToHistory(newPosterData);
              }}
            />

            {/* Size Selection */}
            <SizeSelector
              selectedSize={posterData.size}
              onSizeChange={(size) => {
                const newPosterData = { ...posterData, size };
                setPosterData(newPosterData);
                addToHistory(newPosterData);
              }}
            />

            {/* Color Scheme */}
            <ColorSchemeSelector
              selectedScheme={posterData.colorScheme}
              onSchemeChange={(colorScheme) => {
                const newPosterData = { ...posterData, colorScheme };
                setPosterData(newPosterData);
                addToHistory(newPosterData);
              }}
            />

            {/* Element Panel */}
            <ElementPanel
              elements={posterData.elements}
              selectedElement={selectedElement}
              onElementSelect={setSelectedElement}
              onElementDelete={deleteElement}
              onElementDuplicate={duplicateElement}
            />
          </motion.div>

          {/* Center Panel - Canvas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:col-span-2"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-500" />
                  Live Preview
                </h3>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`p-2 rounded-lg transition-colors ${
                      showPreview 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {showPreview && (
                <div className="flex justify-center overflow-x-auto">
                  {posterData.template === 'trifold' ? (
                    <TrifoldCanvas
                      posterData={posterData}
                      selectedElement={selectedElement}
                      onElementSelect={setSelectedElement}
                      onElementUpdate={updateElement}
                      canvasSize={canvasSize}
                    />
                  ) : (
                    <PosterCanvas
                      ref={canvasRef}
                      posterData={posterData}
                      selectedElement={selectedElement}
                      onElementSelect={setSelectedElement}
                      onElementUpdate={updateElement}
                      onUndo={handleUndo}
                      onRedo={handleRedo}
                      canUndo={historyIndex > 0}
                      canRedo={historyIndex < history.length - 1}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <motion.button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </motion.button>

              <motion.button
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-all shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>

              <motion.button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-slate-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-600 transition-all shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Panel - Text Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="xl:col-span-1"
          >
            {selectedElementData && (
              <TextEditor
                element={selectedElementData}
                onElementUpdate={(updates) => updateElement(selectedElementData.id, updates)}
                onGenerateAIImage={(prompt) => generateAIImage(prompt, selectedElementData.id)}
              />
            )}

            {/* Saved Projects */}
            {savedProjects.length > 0 && (
              <div className="mt-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-indigo-500" />
                  Recent Projects
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedProjects.slice(-5).map((project, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setPosterData(project);
                        addToHistory(project);
                      }}
                      className="w-full text-left p-3 bg-slate-100/50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-600/50 transition-colors backdrop-blur-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{project.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{project.elements.length} elements • {project.size.toUpperCase()}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        canvas={canvasRef.current}
        posterTitle={posterData.title}
        posterSize={posterData.size}
      />

      <AIContentModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onContentGenerated={handleAIContentGenerated}
      />

      <PremadeTemplates
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};