import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, FlipHorizontal, Eye, EyeOff, Grid, Layers } from 'lucide-react';
import { PosterData, PosterElement } from './PosterGenerator';

interface TrifoldCanvasProps {
  posterData: PosterData;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<PosterElement>) => void;
  canvasSize: { width: number; height: number };
}

export const TrifoldCanvas: React.FC<TrifoldCanvasProps> = ({
  posterData,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  canvasSize
}) => {
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [showFoldLines, setShowFoldLines] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Separate elements by side
  const frontElements = posterData.elements.filter(el => !el.side || el.side === 'front');
  const backElements = posterData.elements.filter(el => el.side === 'back');
  const currentElements = currentSide === 'front' ? frontElements : backElements;

  // Panel dimensions for trifold
  const panelWidth = canvasSize.width / 3;
  const panelHeight = canvasSize.height;

  const drawCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    ctx.scale(dpr, dpr);

    // Clear and set background
    ctx.fillStyle = posterData.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw background image if exists
    if (posterData.backgroundImage) {
      // Background image logic here
    }

    // Draw fold lines
    if (showFoldLines) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      
      // Vertical fold lines
      ctx.beginPath();
      ctx.moveTo(panelWidth, 0);
      ctx.lineTo(panelWidth, canvasSize.height);
      ctx.moveTo(panelWidth * 2, 0);
      ctx.lineTo(panelWidth * 2, canvasSize.height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      const gridSize = 20;
      
      for (let x = 0; x <= canvasSize.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvasSize.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
        ctx.stroke();
      }
    }

    // Draw panel labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    const labels = ['Left Panel', 'Center Panel', 'Right Panel'];
    labels.forEach((label, index) => {
      const x = (index * panelWidth) + (panelWidth / 2);
      ctx.fillText(label, x, 20);
    });

    // Draw elements for current side
    currentElements.forEach(element => {
      drawElement(ctx, element);
    });
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: PosterElement) => {
    ctx.save();

    // Apply transformations
    if (element.rotation) {
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-element.width / 2, -element.height / 2);
    } else {
      ctx.translate(element.x, element.y);
    }

    if (element.opacity !== undefined) {
      ctx.globalAlpha = element.opacity;
    }

    if (element.type === 'text') {
      drawTextElement(ctx, element);
    } else if (element.type === 'image') {
      drawImageElement(ctx, element);
    }

    // Draw selection border
    if (selectedElement === element.id) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(-2, -2, element.width + 4, element.height + 4);
    }

    ctx.restore();
  };

  const drawTextElement = (ctx: CanvasRenderingContext2D, element: PosterElement) => {
    // Background
    if (element.backgroundColor && element.backgroundColor !== 'transparent') {
      ctx.fillStyle = element.backgroundColor;
      if (element.borderRadius) {
        drawRoundedRect(ctx, 0, 0, element.width, element.height, element.borderRadius);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, element.width, element.height);
      }
    }

    // Text
    ctx.fillStyle = element.color || '#000000';
    const fontSize = element.fontSize || 16;
    const fontWeight = element.fontWeight || 'normal';
    const fontFamily = element.fontFamily || 'Inter, system-ui, sans-serif';
    
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    
    const padding = 12;
    const availableWidth = element.width - (padding * 2);
    const lineHeight = fontSize * 1.4;
    
    // Word wrap
    const words = element.content.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > availableWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Draw text lines
    lines.forEach((line, index) => {
      const y = padding + (index * lineHeight);
      if (y + fontSize <= element.height - padding) {
        let x = padding;
        
        if (element.alignment === 'center') {
          x = element.width / 2;
          ctx.textAlign = 'center';
        } else if (element.alignment === 'right') {
          x = element.width - padding;
          ctx.textAlign = 'right';
        } else {
          ctx.textAlign = 'left';
        }
        
        ctx.fillText(line, x, y);
      }
    });
    
    ctx.textAlign = 'left';
  };

  const drawImageElement = (ctx: CanvasRenderingContext2D, element: PosterElement) => {
    // Placeholder for now
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, element.width, element.height);
    
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(0, 0, element.width, element.height);
    ctx.setLineDash([]);
    
    // Placeholder text
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📷', element.width / 2, element.height / 2 - 10);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Image', element.width / 2, element.height / 2 + 10);
    ctx.textAlign = 'left';
  };

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  useEffect(() => {
    drawCanvas();
  }, [posterData, selectedElement, currentSide, showFoldLines, showGrid, canvasSize]);

  const flipToSide = (side: 'front' | 'back') => {
    setCurrentSide(side);
    onElementSelect(null); // Clear selection when flipping
  };

  const addElementToCurrentSide = (elementType: 'text' | 'image') => {
    const newElement: PosterElement = {
      id: `${elementType}-${currentSide}-${Date.now()}`,
      type: elementType,
      content: elementType === 'text' ? 'New text element' : '',
      x: 50,
      y: 50,
      width: elementType === 'text' ? 200 : 150,
      height: elementType === 'text' ? 80 : 100,
      side: currentSide,
      fontSize: 16,
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#1f2937',
      backgroundColor: elementType === 'text' ? 'rgba(255, 255, 255, 0.9)' : '#f3f4f6',
      borderRadius: 8,
      zIndex: 1
    };
    
    onElementUpdate(newElement.id, newElement);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Side:</span>
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <motion.button
                onClick={() => flipToSide('front')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  currentSide === 'front'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Front
              </motion.button>
              <motion.button
                onClick={() => flipToSide('back')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  currentSide === 'back'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
            </div>
          </div>

          <motion.button
            onClick={() => setShowFoldLines(!showFoldLines)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
              showFoldLines
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Layers className="w-4 h-4" />
            <span className="text-sm">Fold Lines</span>
          </motion.button>

          <motion.button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
              showGrid
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Grid className="w-4 h-4" />
            <span className="text-sm">Grid</span>
          </motion.button>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => addElementToCurrentSide('text')}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Text
          </motion.button>
          <motion.button
            onClick={() => addElementToCurrentSide('image')}
            className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Image
          </motion.button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSide}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <canvas
              ref={canvasRef}
              className="block"
              style={{ width: canvasSize.width, height: canvasSize.height }}
              onClick={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Find clicked element
                const clickedElement = currentElements
                  .slice()
                  .reverse()
                  .find(element => 
                    x >= element.x && x <= element.x + element.width &&
                    y >= element.y && y <= element.y + element.height
                  );
                
                onElementSelect(clickedElement?.id || null);
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Side indicator */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentSide === 'front' ? 'Front Side' : 'Back Side'}
        </div>

        {/* Panel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {['Left', 'Center', 'Right'].map((panel, index) => (
            <div
              key={panel}
              className="bg-black/70 text-white px-2 py-1 rounded text-xs"
              style={{ marginLeft: index === 0 ? 0 : panelWidth - 40 }}
            >
              {panel}
            </div>
          ))}
        </div>
      </div>

      {/* Element count indicator */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        {currentElements.length} elements on {currentSide} side
      </div>
    </div>
  );
};