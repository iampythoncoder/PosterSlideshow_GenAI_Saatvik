// Adaptive design system for intelligent font and color scheme selection
export interface DesignContext {
  template: string;
  size: string;
  content: string;
  audience?: string;
  tone?: string;
}

export interface AdaptiveDesign {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
  };
  spacing: {
    margin: number;
    padding: number;
    lineHeight: number;
  };
}

// Sophisticated font pairing system
const fontPairings = {
  modern: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    accent: 'Helvetica Neue, sans-serif'
  },
  elegant: {
    heading: 'Playfair Display, serif',
    body: 'Source Sans Pro, sans-serif',
    accent: 'Crimson Text, serif'
  },
  corporate: {
    heading: 'Montserrat, sans-serif',
    body: 'Open Sans, sans-serif',
    accent: 'Lato, sans-serif'
  },
  creative: {
    heading: 'Poppins, sans-serif',
    body: 'Nunito, sans-serif',
    accent: 'Quicksand, sans-serif'
  },
  academic: {
    heading: 'Merriweather, serif',
    body: 'Source Sans Pro, sans-serif',
    accent: 'Lora, serif'
  },
  tech: {
    heading: 'Space Grotesk, sans-serif',
    body: 'Inter, sans-serif',
    accent: 'JetBrains Mono, monospace'
  }
};

// Advanced color psychology system
const colorPsychology = {
  trust: ['#1e40af', '#3b82f6', '#60a5fa'], // Blues
  energy: ['#dc2626', '#ef4444', '#f87171'], // Reds
  growth: ['#059669', '#10b981', '#34d399'], // Greens
  creativity: ['#7c3aed', '#8b5cf6', '#a78bfa'], // Purples
  warmth: ['#ea580c', '#f97316', '#fb923c'], // Oranges
  sophistication: ['#374151', '#6b7280', '#9ca3af'], // Grays
  luxury: ['#92400e', '#d97706', '#f59e0b'], // Golds
  calm: ['#0891b2', '#06b6d4', '#22d3ee'], // Cyans
};

// Intelligent design analysis
export const analyzeContent = (content: string): {
  sentiment: string;
  keywords: string[];
  industry: string;
  formality: string;
} => {
  const text = content.toLowerCase();
  
  // Sentiment analysis
  const positiveWords = ['success', 'growth', 'innovation', 'excellent', 'outstanding', 'achieve', 'transform'];
  const energeticWords = ['dynamic', 'powerful', 'bold', 'strong', 'impact', 'drive', 'accelerate'];
  const calmWords = ['peaceful', 'serene', 'balance', 'harmony', 'wellness', 'mindful', 'gentle'];
  
  let sentiment = 'neutral';
  if (positiveWords.some(word => text.includes(word))) sentiment = 'positive';
  if (energeticWords.some(word => text.includes(word))) sentiment = 'energetic';
  if (calmWords.some(word => text.includes(word))) sentiment = 'calm';
  
  // Industry detection
  const industries = {
    tech: ['technology', 'software', 'digital', 'ai', 'data', 'cloud', 'innovation'],
    healthcare: ['health', 'medical', 'wellness', 'care', 'treatment', 'patient'],
    finance: ['financial', 'investment', 'banking', 'money', 'capital', 'fund'],
    education: ['education', 'learning', 'student', 'academic', 'research', 'knowledge'],
    creative: ['design', 'art', 'creative', 'brand', 'visual', 'aesthetic'],
    corporate: ['business', 'corporate', 'professional', 'enterprise', 'company']
  };
  
  let industry = 'general';
  for (const [key, words] of Object.entries(industries)) {
    if (words.some(word => text.includes(word))) {
      industry = key;
      break;
    }
  }
  
  // Formality level
  const formalWords = ['professional', 'corporate', 'executive', 'strategic', 'comprehensive'];
  const casualWords = ['friendly', 'easy', 'simple', 'fun', 'awesome', 'cool'];
  
  let formality = 'neutral';
  if (formalWords.some(word => text.includes(word))) formality = 'formal';
  if (casualWords.some(word => text.includes(word))) formality = 'casual';
  
  // Extract keywords
  const keywords = text
    .replace(/[^\w\s]/g, ' ')
    .split(' ')
    .filter(word => word.length > 4)
    .slice(0, 5);
  
  return { sentiment, keywords, industry, formality };
};

// Generate adaptive design based on context
export const generateAdaptiveDesign = (context: DesignContext): AdaptiveDesign => {
  const analysis = analyzeContent(context.content);
  
  // Select font pairing based on context
  let fontStyle = 'modern';
  if (analysis.industry === 'corporate') fontStyle = 'corporate';
  else if (analysis.industry === 'creative') fontStyle = 'creative';
  else if (analysis.industry === 'tech') fontStyle = 'tech';
  else if (analysis.industry === 'education') fontStyle = 'academic';
  else if (analysis.formality === 'formal') fontStyle = 'elegant';
  
  const fonts = fontPairings[fontStyle as keyof typeof fontPairings];
  
  // Select color scheme based on sentiment and industry
  let colorKey = 'trust';
  if (analysis.sentiment === 'energetic') colorKey = 'energy';
  else if (analysis.sentiment === 'calm') colorKey = 'calm';
  else if (analysis.industry === 'creative') colorKey = 'creativity';
  else if (analysis.industry === 'finance') colorKey = 'sophistication';
  else if (analysis.industry === 'healthcare') colorKey = 'calm';
  
  const colors = colorPsychology[colorKey as keyof typeof colorPsychology];
  
  // Adaptive sizing based on template and size
  const baseFontSize = context.size === 'poster' ? 24 : context.size === 'banner' ? 20 : 18;
  const sizeMultiplier = context.template === 'trifold' ? 0.8 : 1;
  
  return {
    fontFamily: fonts.heading,
    fontSize: Math.round(baseFontSize * sizeMultiplier),
    fontWeight: analysis.formality === 'formal' ? '600' : '500',
    colorScheme: {
      primary: colors[0],
      secondary: colors[1],
      accent: colors[2],
      background: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280'
    },
    spacing: {
      margin: context.template === 'trifold' ? 20 : 40,
      padding: context.template === 'trifold' ? 15 : 25,
      lineHeight: 1.4
    }
  };
};

// Template-specific optimizations
export const getTemplateOptimizations = (template: string, size: string) => {
  const optimizations = {
    trifold: {
      columns: 3,
      gutterWidth: 20,
      foldMargin: 10,
      maxTextWidth: '90%',
      imageAspectRatio: '4:3'
    },
    single: {
      columns: 1,
      maxTextWidth: '80%',
      imageAspectRatio: '16:9'
    },
    infographic: {
      sections: 4,
      iconSize: 48,
      chartHeight: 200,
      maxTextWidth: '70%'
    },
    presentation: {
      titleSize: 'large',
      bulletPoints: true,
      maxTextWidth: '85%',
      imageAspectRatio: '16:9'
    }
  };
  
  return optimizations[template as keyof typeof optimizations] || optimizations.single;
};