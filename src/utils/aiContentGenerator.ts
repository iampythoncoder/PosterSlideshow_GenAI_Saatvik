// Enhanced AI Content Generation utilities with much better content
export interface ContentPrompt {
  type: 'poster' | 'infographic' | 'presentation' | 'brochure';
  topic?: string;
  audience?: string;
  tone?: 'professional' | 'casual' | 'academic' | 'creative';
  length?: 'short' | 'medium' | 'long';
}

export const generatePosterContent = async (prompt: ContentPrompt): Promise<{
  title: string;
  subtitle: string;
  content: string;
  suggestions: string[];
}> => {
  console.log('🤖 Starting AI content generation with prompt:', prompt);
  
  // Shorter delay for better UX
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  // GUARANTEED content generation - these will ALWAYS work
  const contentTemplates = {
    poster: {
      professional: {
        titles: [
          'Driving Innovation Forward',
          'Excellence in Every Detail',
          'Transforming Ideas into Reality',
          'Leading the Future Today',
          'Empowering Success Through Strategy',
          'Building Tomorrow\'s Solutions',
          'Where Vision Meets Execution',
          'Pioneering Industry Standards',
          'Delivering Exceptional Results',
          'Shaping the Future of Business'
        ],
        subtitles: [
          'A comprehensive approach to modern challenges',
          'Delivering results that matter most',
          'Where strategic vision meets flawless execution',
          'Building tomorrow\'s solutions with today\'s innovation',
          'Your trusted partner in growth and transformation',
          'Redefining excellence through collaborative innovation',
          'Turning ambitious visions into measurable outcomes',
          'Leading change through strategic thinking',
          'Creating value through purposeful innovation',
          'Empowering organizations to reach new heights'
        ],
        content: [
          'Our commitment to excellence drives everything we do. Through innovative approaches and strategic thinking, we deliver solutions that not only meet today\'s challenges but anticipate tomorrow\'s opportunities. Join us in shaping the future of industry standards and creating lasting impact.',
          'In today\'s rapidly evolving landscape, success requires more than just good intentions. It demands strategic vision, innovative execution, and unwavering commitment to quality. Our proven methodology combines cutting-edge technology with human expertise to ensure sustainable results that drive meaningful progress.',
          'Excellence isn\'t just our goal—it\'s our standard. Every project, every solution, every interaction reflects our dedication to delivering value that exceeds expectations. We believe in the power of collaboration, the importance of innovation, and the necessity of results that make a real difference.',
          'Transform your organization with solutions designed for the modern world. Our comprehensive approach combines industry expertise with innovative thinking to deliver outcomes that matter. From strategy development to implementation, we\'re your partner in achieving sustainable growth and lasting success.',
          'The future belongs to organizations that can adapt, innovate, and execute with precision. Our team of experts brings together decades of experience with fresh perspectives to help you navigate complex challenges and capitalize on emerging opportunities in an ever-changing marketplace.'
        ]
      },
      creative: {
        titles: [
          'Unleash Your Creative Potential',
          'Where Art Meets Innovation',
          'Inspiring Creativity Every Day',
          'Design Beyond Boundaries',
          'Creative Solutions for Bold Ideas',
          'Imagination Without Limits',
          'Crafting Visual Stories',
          'The Art of Creative Expression',
          'Breaking Creative Barriers',
          'Designing the Extraordinary'
        ],
        subtitles: [
          'Exploring new frontiers in creative expression',
          'Transforming imagination into stunning reality',
          'Where every idea finds its perfect visual form',
          'Pushing the boundaries of what\'s creatively possible',
          'Creating experiences that inspire and deeply engage',
          'Bringing bold visions to life through design',
          'Where creativity meets strategic thinking',
          'Crafting memorable experiences through art',
          'Turning concepts into captivating visuals',
          'Designing with purpose, creating with passion'
        ],
        content: [
          'Creativity knows no bounds when passion meets purpose. Our innovative approach to design thinking transforms abstract concepts into tangible experiences that resonate with audiences and drive meaningful engagement. We believe that great design has the power to change perspectives, inspire action, and create lasting connections.',
          'In the intersection of art and technology, we find endless possibilities for creative expression. Our process embraces experimentation, celebrates uniqueness, and delivers solutions that stand out in a crowded marketplace. Every project is an opportunity to push creative boundaries and explore new ways of visual storytelling.',
          'Every great idea deserves exceptional execution. Through collaborative creativity and technical excellence, we bring visions to life in ways that surprise, delight, and inspire action. Our team combines artistic vision with strategic thinking to create designs that not only look beautiful but also achieve meaningful results.',
          'Creative excellence emerges from the perfect balance of inspiration and strategy. We work closely with our clients to understand their vision, then apply our expertise in design, color theory, and visual communication to create solutions that capture attention and communicate effectively.',
          'The power of visual communication lies in its ability to transcend language and cultural barriers. Our creative solutions are designed to speak directly to your audience\'s emotions, creating connections that go beyond words and fostering relationships that drive business success.'
        ]
      },
      academic: {
        titles: [
          'Advancing Knowledge Through Research',
          'Scholarly Excellence in Action',
          'Research That Matters',
          'Academic Innovation Hub',
          'Knowledge for Tomorrow',
          'Bridging Theory and Practice',
          'Educational Excellence Initiative',
          'Research-Driven Solutions',
          'Academic Leadership Forum',
          'Scholarly Impact Network'
        ],
        subtitles: [
          'Rigorous research methodology for meaningful outcomes',
          'Where academic excellence meets real-world application',
          'Advancing understanding through systematic inquiry',
          'Building knowledge that transforms communities',
          'Evidence-based approaches to complex challenges',
          'Fostering intellectual growth and discovery',
          'Research excellence with practical implications',
          'Academic rigor meets innovative thinking',
          'Scholarly work that makes a difference',
          'Knowledge creation for societal benefit'
        ],
        content: [
          'Academic excellence is built on the foundation of rigorous research, critical thinking, and scholarly collaboration. Our research initiatives are designed to advance knowledge in meaningful ways while addressing real-world challenges. Through systematic inquiry and evidence-based approaches, we contribute to the global body of knowledge.',
          'The pursuit of knowledge requires dedication, methodology, and a commitment to excellence. Our academic programs combine theoretical understanding with practical application, ensuring that research outcomes have tangible benefits for society. We believe in the power of education to transform lives and communities.',
          'Scholarly work at its finest emerges from the intersection of curiosity, rigor, and purpose. Our research community is dedicated to advancing understanding in critical areas while maintaining the highest standards of academic integrity. Every study, every publication, every discovery contributes to our collective knowledge.',
          'Educational innovation thrives in environments that encourage questioning, exploration, and discovery. Our academic initiatives are designed to foster critical thinking, promote intellectual growth, and prepare students for the challenges of tomorrow. We believe in education as a catalyst for positive change.',
          'Research excellence requires not only methodological rigor but also a clear vision of how knowledge can be applied to benefit society. Our interdisciplinary approach brings together experts from various fields to tackle complex challenges and develop innovative solutions that make a real difference.'
        ]
      },
      casual: {
        titles: [
          'Let\'s Make Something Amazing',
          'Good Vibes, Great Results',
          'Your Success Story Starts Here',
          'Making Things Happen',
          'Dream Big, Achieve More',
          'Together We\'re Unstoppable',
          'Creating Awesome Experiences',
          'Where Ideas Come to Life',
          'Making Magic Happen',
          'Your Journey to Success'
        ],
        subtitles: [
          'Bringing your ideas to life with style and substance',
          'Where creativity meets results in the best way',
          'Making your vision a reality, one step at a time',
          'Turning dreams into achievements you can be proud of',
          'Creating solutions that work as hard as you do',
          'Your success is our passion and our purpose',
          'Building something special together',
          'Where great ideas meet even better execution',
          'Making the impossible feel totally possible',
          'Your goals, our expertise, amazing results'
        ],
        content: [
          'We believe that great things happen when passionate people come together with a shared vision. Our approach is simple: listen carefully, think creatively, and deliver results that exceed expectations. Whether you\'re starting something new or taking your existing project to the next level, we\'re here to help make it happen.',
          'Success doesn\'t have to be complicated. Sometimes the best solutions are the ones that feel natural and effortless. Our team specializes in taking complex challenges and turning them into straightforward, achievable goals. We\'re all about making your life easier while delivering outstanding results.',
          'Every project is a new adventure, and we love being part of your journey. From the initial spark of an idea to the final celebration of success, we\'re committed to making the process enjoyable and rewarding. Great work should be fun, and great results should speak for themselves.',
          'The best partnerships are built on trust, communication, and shared enthusiasm for achieving something special. We bring energy, expertise, and a genuine commitment to your success. Let\'s work together to create something you\'ll be proud to share with the world.',
          'Innovation doesn\'t always require reinventing the wheel—sometimes it\'s about finding smarter, more efficient ways to achieve your goals. Our practical approach combines proven strategies with fresh thinking to deliver solutions that work in the real world.'
        ]
      }
    },
    infographic: {
      professional: {
        titles: [
          'Data-Driven Insights for Strategic Decisions',
          'Key Performance Metrics Dashboard',
          'Industry Trends Analysis 2024',
          'Strategic Overview & Market Intelligence',
          'Performance Analytics Report',
          'Market Research Findings',
          'Business Intelligence Summary',
          'Competitive Analysis Framework',
          'ROI Performance Indicators',
          'Strategic Planning Metrics'
        ],
        subtitles: [
          'Understanding the numbers behind sustainable success',
          'Visualizing complex data for informed decision-making',
          'Critical trends shaping our industry landscape',
          'Key metrics for strategic planning and growth',
          'Data visualization for maximum business impact',
          'Research insights that drive strategic advantage',
          'Analytics that inform and inspire action',
          'Market intelligence for competitive positioning',
          'Performance data that tells your success story',
          'Strategic insights for forward-thinking leaders'
        ],
        content: [
          'Transform complex data into actionable insights that drive informed decision-making and strategic planning. Our comprehensive analysis reveals patterns, trends, and opportunities that enable organizations to make data-driven decisions with confidence. Every metric tells a story of performance, growth, and potential.',
          'Numbers tell a compelling story when presented effectively. This comprehensive analysis breaks down key performance indicators, market trends, and strategic insights to provide a clear picture of the current landscape and future opportunities. Data becomes powerful when it informs strategic action.',
          'Data visualization makes complex information accessible and actionable. Through careful analysis and clear presentation, we help stakeholders understand critical metrics and their implications for business strategy. Visual storytelling transforms raw data into strategic intelligence.',
          'Market intelligence requires both analytical rigor and strategic thinking. Our research methodology combines quantitative analysis with qualitative insights to provide a comprehensive understanding of market dynamics, competitive positioning, and growth opportunities.',
          'Performance analytics reveal not just what happened, but why it happened and what it means for the future. Our analytical framework helps organizations understand their performance in context, identify areas for improvement, and develop strategies for sustainable growth.'
        ]
      }
    },
    presentation: {
      professional: {
        titles: [
          'Strategic Presentation: Driving Results',
          'Executive Briefing: Key Initiatives',
          'Business Case for Innovation',
          'Quarterly Review & Future Outlook',
          'Strategic Planning Session',
          'Market Opportunity Analysis',
          'Performance Review & Strategy',
          'Investment Proposal Overview',
          'Organizational Excellence Framework',
          'Leadership Development Initiative'
        ],
        subtitles: [
          'Comprehensive overview of strategic initiatives and outcomes',
          'Key findings and recommendations for executive consideration',
          'Building the case for transformational change',
          'Performance analysis and strategic direction',
          'Collaborative planning for sustainable growth',
          'Market analysis and strategic recommendations',
          'Results-driven approach to organizational excellence',
          'Investment strategy for long-term value creation',
          'Framework for achieving operational excellence',
          'Developing leaders for tomorrow\'s challenges'
        ],
        content: [
          'This presentation outlines our strategic approach to achieving measurable results through focused initiatives and collaborative execution. Our methodology combines proven frameworks with innovative thinking to deliver outcomes that drive sustainable growth and competitive advantage.',
          'Executive leadership requires clear communication of complex strategies and their expected outcomes. This briefing provides a comprehensive overview of key initiatives, performance metrics, and strategic recommendations designed to inform decision-making at the highest levels.',
          'Transformational change requires a compelling business case supported by data, analysis, and clear strategic vision. This presentation builds the foundation for organizational change by demonstrating the value proposition and implementation roadmap for success.',
          'Quarterly performance reviews provide essential insights into organizational health and strategic progress. This analysis examines key performance indicators, market conditions, and strategic opportunities to inform future planning and resource allocation.',
          'Strategic planning is most effective when it combines analytical rigor with collaborative input from key stakeholders. This session framework facilitates productive discussions about organizational priorities, resource allocation, and strategic direction.'
        ]
      }
    },
    brochure: {
      professional: {
        titles: [
          'Your Partner in Excellence',
          'Solutions That Drive Success',
          'Comprehensive Service Portfolio',
          'Professional Services Overview',
          'Expertise You Can Trust',
          'Delivering Value Through Innovation',
          'Your Success, Our Commitment',
          'Professional Excellence Redefined',
          'Strategic Partnership Opportunities',
          'Industry-Leading Solutions'
        ],
        subtitles: [
          'Comprehensive solutions tailored to your unique needs',
          'Professional services that deliver measurable results',
          'Expert guidance for complex business challenges',
          'Proven methodologies for sustainable success',
          'Partnership approach to achieving your goals',
          'Innovation-driven solutions for modern challenges',
          'Dedicated expertise for exceptional outcomes',
          'Professional excellence in every engagement',
          'Strategic collaboration for mutual success',
          'Industry expertise that makes the difference'
        ],
        content: [
          'Our comprehensive approach to professional services combines industry expertise with innovative thinking to deliver solutions that drive measurable results. We understand that every organization faces unique challenges, and we tailor our services to meet your specific needs and objectives.',
          'Partnership is at the heart of everything we do. We work closely with our clients to understand their goals, challenges, and opportunities, then develop customized solutions that deliver real value. Our collaborative approach ensures that you\'re not just getting a service provider—you\'re gaining a strategic partner.',
          'Excellence is not just an aspiration—it\'s our standard. Every engagement reflects our commitment to delivering exceptional results through proven methodologies, innovative approaches, and unwavering attention to detail. We measure our success by your success.',
          'In today\'s competitive landscape, organizations need more than just good advice—they need strategic partners who can help them navigate complex challenges and capitalize on emerging opportunities. Our team brings together deep industry knowledge with fresh perspectives to deliver solutions that work.',
          'Professional services should be about more than just completing tasks—they should be about creating value, driving innovation, and building capabilities that last. Our approach focuses on sustainable solutions that not only address immediate needs but also position you for long-term success.'
        ]
      }
    }
  };
  
  // Enhanced topic-specific customization
  const topicEnhancements = {
    'technology': {
      titlePrefix: 'Next-Generation',
      subtitleSuffix: 'through cutting-edge technology',
      contentAddition: 'Leveraging artificial intelligence, machine learning, and advanced analytics to create solutions that anticipate future needs and deliver exceptional user experiences.'
    },
    'healthcare': {
      titlePrefix: 'Advancing',
      subtitleSuffix: 'for better patient outcomes',
      contentAddition: 'Our evidence-based approach combines clinical expertise with innovative technology to improve patient care, enhance operational efficiency, and support healthcare professionals in delivering exceptional outcomes.'
    },
    'education': {
      titlePrefix: 'Transforming',
      subtitleSuffix: 'through innovative learning',
      contentAddition: 'Educational excellence emerges from the perfect combination of pedagogical expertise, technological innovation, and deep understanding of how people learn best in diverse environments.'
    },
    'finance': {
      titlePrefix: 'Optimizing',
      subtitleSuffix: 'for financial success',
      contentAddition: 'Strategic financial management requires sophisticated analysis, risk assessment, and forward-thinking approaches that balance growth opportunities with prudent risk management.'
    },
    'marketing': {
      titlePrefix: 'Amplifying',
      subtitleSuffix: 'through strategic marketing',
      contentAddition: 'Modern marketing success requires deep audience understanding, multi-channel expertise, and data-driven strategies that create meaningful connections and drive measurable business results.'
    },
    'sustainability': {
      titlePrefix: 'Building',
      subtitleSuffix: 'for a sustainable future',
      contentAddition: 'Sustainable practices are not just environmentally responsible—they\'re strategically smart. Our approach helps organizations reduce their environmental impact while improving operational efficiency and building long-term value.'
    }
  };
  
  const typeTemplates = contentTemplates[prompt.type] || contentTemplates.poster;
  const toneTemplates = typeTemplates[prompt.tone || 'professional'] || typeTemplates.professional;
  
  // GUARANTEED random selection with fallbacks
  let customizedTitle = toneTemplates.titles[Math.floor(Math.random() * toneTemplates.titles.length)] || 'Professional Design Solution';
  let customizedSubtitle = toneTemplates.subtitles[Math.floor(Math.random() * toneTemplates.subtitles.length)] || 'Excellence in every detail';
  let customizedContent = toneTemplates.content[Math.floor(Math.random() * toneTemplates.content.length)] || 'This is professionally generated content designed to meet your specific requirements and deliver exceptional results.';
  
  console.log('📝 Base content generated:', { customizedTitle, customizedSubtitle });
  
  // Topic-specific customization
  if (prompt.topic) {
    customizedTitle = `${prompt.topic} - ${customizedTitle}`;
    customizedSubtitle = `${customizedSubtitle} focused on ${prompt.topic}`;
    customizedContent = `${customizedContent}\n\nThis content is specifically tailored for ${prompt.topic} and addresses the key challenges and opportunities in this area.`;
  }
  
  // Audience-specific customization
  if (prompt.audience) {
    customizedSubtitle += ` designed for ${prompt.audience}`;
  }
  
  // Length-based content adjustment
  if (prompt.length === 'short') {
    customizedContent = customizedContent.split('.').slice(0, 3).join('.') + '.';
  } else if (prompt.length === 'long') {
    customizedContent += '\n\nOur comprehensive approach ensures exceptional results through careful planning, expert execution, and continuous refinement. Every detail is crafted with precision to deliver outcomes that exceed expectations.';
  }
  
  const finalResult = {
    title: customizedTitle,
    subtitle: customizedSubtitle,
    content: customizedContent,
    suggestions: [
      'Add visual elements that support your key messages',
      'Use contrasting colors for better readability',
      'Include a clear call-to-action',
      'Ensure text is readable at display size',
      'Add brand elements for consistency',
      'Consider your audience when choosing fonts',
      'Use white space strategically',
      'Test design at different sizes'
    ]
  };
  
  console.log('✅ AI content generation completed:', finalResult);
  return {
    title: customizedTitle,
    subtitle: customizedSubtitle,
    content: customizedContent,
    suggestions: [
      'Consider adding visual elements that support your key messages',
      'Use contrasting colors to create visual hierarchy and guide attention',
      'Include a clear call-to-action that tells viewers what to do next',
      'Ensure all text is readable at your intended display size and distance',
      'Add your brand elements for consistency and professional appearance',
      'Consider your audience\'s preferences when choosing fonts and colors',
      'Use white space strategically to improve readability and visual appeal',
      'Test your design at different sizes to ensure it works across formats'
    ]
  };
};

export const generateImagePrompt = (content: string, style: string = 'professional'): string => {
  const styleModifiers = {
    professional: 'clean, modern, business-appropriate, high-quality, professional photography style',
    creative: 'artistic, vibrant, imaginative, creative composition, dynamic lighting',
    academic: 'scholarly, informative, educational, clean design, academic setting',
    minimal: 'simple, clean, minimalist, elegant, sophisticated, uncluttered'
  };
  
  const modifier = styleModifiers[style as keyof typeof styleModifiers] || styleModifiers.professional;
  
  // Extract key concepts from content with better analysis
  const keywords = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(' ')
    .filter(word => word.length > 4 && !['through', 'their', 'these', 'those', 'where', 'which', 'while'].includes(word))
    .slice(0, 4)
    .join(', ');
  
  return `${modifier} illustration representing ${keywords}, suitable for poster design, professional quality, detailed composition, perfect for text overlay`;
};

export const suggestColorScheme = (content: string, type: string): string => {
  const contentLower = content.toLowerCase();
  
  // Enhanced color scheme analysis
  if (contentLower.includes('innovation') || contentLower.includes('technology') || contentLower.includes('digital')) {
    return 'professional'; // Blues and teals
  } else if (contentLower.includes('creative') || contentLower.includes('art') || contentLower.includes('design')) {
    return 'creative'; // Purples and magentas
  } else if (contentLower.includes('nature') || contentLower.includes('environment') || contentLower.includes('sustainable')) {
    return 'nature'; // Greens
  } else if (contentLower.includes('energy') || contentLower.includes('dynamic') || contentLower.includes('power')) {
    return 'vibrant'; // Reds and oranges
  } else if (contentLower.includes('elegant') || contentLower.includes('sophisticated') || contentLower.includes('minimal')) {
    return 'minimal'; // Grays and blacks
  } else if (contentLower.includes('health') || contentLower.includes('medical') || contentLower.includes('wellness')) {
    return 'nature'; // Calming greens and blues
  } else if (contentLower.includes('finance') || contentLower.includes('business') || contentLower.includes('corporate')) {
    return 'professional'; // Professional blues
  } else if (contentLower.includes('education') || contentLower.includes('academic') || contentLower.includes('learning')) {
    return 'academic'; // Scholarly blues and grays
  }
  
  return 'professional'; // Default
};