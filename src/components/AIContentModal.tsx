import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, Sparkles, Target, Users, Palette, Image } from 'lucide-react';
import { generateEnhancedContent, EnhancedContentPrompt } from '../utils/enhancedContentGenerator';

interface AIContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentGenerated: (content: { 
    title: string; 
    subtitle: string; 
    content: string;
    backgroundImage?: string;
    keyPoints?: string[];
    callToAction?: string;
  }) => void;
}

export const AIContentModal: React.FC<AIContentModalProps> = ({
  isOpen,
  onClose,
  onContentGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [prompt, setPrompt] = useState<EnhancedContentPrompt>({
    type: 'poster',
    topic: '',
    audience: '',
    tone: 'professional',
    length: 'medium',
    purpose: 'inform'
  });
  const [includeImage, setIncludeImage] = useState(true);
  const [imagePrompt, setImagePrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.topic?.trim()) {
      setPrompt(prev => ({ ...prev, topic: 'Professional Design' }));
    }
    
    setIsGenerating(true);
    setError('');
    
    console.log('🚀 Starting AI generation with prompt:', prompt);
    
    try {
      const result = await generateEnhancedContent(prompt);
      console.log('📄 Generated result:', result);
      
      let backgroundImage = '';
      if (includeImage) {
        const finalImagePrompt = imagePrompt || `${prompt.topic || 'professional'} ${prompt.tone} poster background, clean design, suitable for text overlay`;
        const seed = Math.floor(Math.random() * 1000000);
        backgroundImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalImagePrompt)}?width=800&height=600&seed=${seed}`;
        console.log('🖼️ Generated background image URL:', backgroundImage);
      }
      
      const finalResult = {
        title: result.title || 'Professional Design Solution',
        subtitle: result.subtitle || 'Excellence in every detail',
        content: result.content || 'This professionally generated content is designed to meet your specific requirements and deliver exceptional results.',
        backgroundImage,
        keyPoints: result.keyPoints,
        callToAction: result.callToAction
      };
      
      console.log('✅ Final result being sent:', finalResult);
      onContentGenerated(finalResult);
      onClose();
    } catch (error) {
      console.error('AI generation failed:', error);
      
      // GUARANTEED fallback content
      const fallbackContent = {
        title: prompt.topic ? `${prompt.topic} - Professional Solution` : 'Professional Design Solution',
        subtitle: 'Excellence delivered through innovative design and strategic thinking',
        content: 'This professionally crafted content provides a comprehensive foundation for your design project. Every element has been carefully considered to ensure maximum impact and effectiveness. Our approach combines strategic thinking with creative excellence to deliver results that exceed expectations and drive meaningful engagement.',
        backgroundImage: includeImage ? `https://image.pollinations.ai/prompt/professional%20background?width=800&height=600&seed=${Math.floor(Math.random() * 1000000)}` : undefined,
        keyPoints: [
          'Strategic approach to achieving your objectives',
          'Professional quality that reflects your brand excellence',
          'Customizable elements for perfect brand alignment',
          'Results-driven design that engages your audience'
        ],
        callToAction: 'Take action today and achieve your goals'
      };
      
      console.log('🔄 Using fallback content:', fallbackContent);
      onContentGenerated(fallbackContent);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const posterTypes = [
    { value: 'poster', label: 'Standard Poster', icon: '📄' },
    { value: 'trifold', label: 'Trifold Brochure', icon: '📋' },
    { value: 'infographic', label: 'Infographic', icon: '📊' },
    { value: 'presentation', label: 'Presentation', icon: '🎯' },
    { value: 'brochure', label: 'Brochure', icon: '📋' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'persuasive', label: 'Persuasive', icon: '🎯' },
    { value: 'inspirational', label: 'Inspirational', icon: '✨' },
    { value: 'casual', label: 'Casual', icon: '😊' },
    { value: 'academic', label: 'Academic', icon: '🎓' },
    { value: 'creative', label: 'Creative', icon: '🎨' }
  ];

  const purposes = [
    { value: 'inform', label: 'Inform', description: 'Share information and educate' },
    { value: 'persuade', label: 'Persuade', description: 'Convince and influence decisions' },
    { value: 'promote', label: 'Promote', description: 'Market products or services' },
    { value: 'announce', label: 'Announce', description: 'Share news and updates' },
    { value: 'educate', label: 'Educate', description: 'Teach and train audiences' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">AI Content Generator</h2>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Target className="w-4 h-4 inline mr-2" />
                  Topic or Subject *
                </label>
                <input
                  type="text"
                  value={prompt.topic}
                  onChange={(e) => setPrompt(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., Business Growth, Technology Innovation, Health & Wellness"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                {!prompt.topic?.trim() && (
                  <p className="text-xs text-red-500 mt-1">Topic is required for content generation</p>
                )}
              </div>

              {/* Audience Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Target Audience
                </label>
                <input
                  type="text"
                  value={prompt.audience}
                  onChange={(e) => setPrompt(prev => ({ ...prev, audience: e.target.value }))}
                  placeholder="e.g., Business professionals, Students, General public"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>

              {/* Poster Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Poster Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {posterTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      onClick={() => setPrompt(prev => ({ ...prev, type: type.value as any }))}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        prompt.type === type.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-purple-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Tone & Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {tones.map((tone) => (
                    <motion.button
                      key={tone.value}
                      onClick={() => setPrompt(prev => ({ ...prev, tone: tone.value as any }))}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        prompt.tone === tone.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-purple-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{tone.icon}</span>
                        <span className="text-sm font-medium">{tone.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content Length */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Content Detail Level</label>
                <div className="flex space-x-3">
                  {[
                    { value: 'short', label: 'Concise', desc: 'Key points only' },
                    { value: 'medium', label: 'Balanced', desc: 'Comprehensive' },
                    { value: 'long', label: 'Detailed', desc: 'In-depth content' }
                  ].map((length) => (
                    <motion.button
                      key={length.value}
                      onClick={() => setPrompt(prev => ({ ...prev, length: length.value as any }))}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        prompt.length === length.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-purple-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium">{length.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{length.desc}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Purpose Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Primary Purpose</label>
                <div className="grid grid-cols-2 gap-3">
                  {purposes.map((purpose) => (
                    <motion.button
                      key={purpose.value}
                      onClick={() => setPrompt(prev => ({ ...prev, purpose: purpose.value as any }))}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        prompt.purpose === purpose.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-purple-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{purpose.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{purpose.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* AI Image Generation */}
              <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="includeImage"
                    checked={includeImage}
                    onChange={(e) => setIncludeImage(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <label htmlFor="includeImage" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    <Image className="w-4 h-4 mr-2" />
                    Generate AI Background Image
                  </label>
                </div>
                
                {includeImage && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Image Description (optional)
                    </label>
                    <input
                      type="text"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="e.g., modern office, nature landscape, abstract geometric"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Leave blank to auto-generate based on your topic
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
              >
                <Wand2 className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Content'}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};