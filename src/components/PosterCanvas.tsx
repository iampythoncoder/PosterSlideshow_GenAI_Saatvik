import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { PosterData, PosterElement } from './PosterGenerator';

interface PosterCanvasProps {
  posterData: PosterData;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<PosterElement>) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const PosterCanvas = forwardRef<HTMLCanvasElement, PosterCanvasProps>(
  ({ posterData, selectedElement, onElementSelect, onElementUpdate, onUndo, onRedo, canUndo, canRedo }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 600, height: 800 });
    const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
    const [alignmentGuides, setAlignmentGuides] = useState<{
      vertical: number[];
      horizontal: number[];
    }>({ vertical: [], horizontal: [] });
    const [showGuides, setShowGuides] = useState(false);

    // Enhanced size configurations with proper scaling for ALL templates
    const sizeConfigs = {
      a4: { 
        width: 595, height: 842, 
        displayWidth: 500, displayHeight: 707, 
        margin: 40, ratio: 595/842 
      },
      letter: { 
        width: 612, height: 792, 
        displayWidth: 500, displayHeight: 647, 
        margin: 40, ratio: 612/792 
      },
      poster: { 
        width: 1728, height: 2592, 
        displayWidth: 400, displayHeight: 600, 
        margin: 80, ratio: 1728/2592 
      },
      instagram: { 
        width: 1080, height: 1080, 
        displayWidth: 500, displayHeight: 500, 
        margin: 60, ratio: 1 
      },
      banner: { 
        width: 1920, height: 1080, 
        displayWidth: 700, displayHeight: 394, 
        margin: 60, ratio: 1920/1080 
      },
      trifold: { 
        width: 2550, height: 1100, 
        displayWidth: 900, displayHeight: 388, 
        margin: 30, ratio: 2550/1100 
      }
    };

    // Update canvas size based on poster size and template with proper scaling
    useEffect(() => {
      const config = sizeConfigs[posterData.size as keyof typeof sizeConfigs] || sizeConfigs.a4;
      
      // Skip trifold here - it has its own canvas component
      if (posterData.template === 'trifold') {
        return;
      }
      
      let displayWidth = config.displayWidth;
      let displayHeight = config.displayHeight;
      
      setCanvasSize({ width: displayWidth, height: displayHeight });
    }, [posterData.size, posterData.template]);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (canUndo) onUndo();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
          e.preventDefault();
          if (canRedo) onRedo();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, onUndo, onRedo]);

    // Enhanced image loading with better error handling
    useEffect(() => {
      const imageElements = posterData.elements.filter(el => el.type === 'image' && el.content);
      
      // Load background image
      if (posterData.backgroundImage && !loadedImages.has('background')) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          setLoadedImages(prev => new Map(prev.set('background', img)));
        };
        img.onerror = () => {
          console.error('Failed to load background image:', posterData.backgroundImage);
        };
        img.src = posterData.backgroundImage;
      }
      
      imageElements.forEach(element => {
        if (!loadedImages.has(element.id) && element.content) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            setLoadedImages(prev => new Map(prev.set(element.id, img)));
          };
          img.onerror = () => {
            console.error('Failed to load image:', element.content);
            // Create a better placeholder
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // Gradient background
              const gradient = ctx.createLinearGradient(0, 0, 300, 200);
              gradient.addColorStop(0, '#f8fafc');
              gradient.addColorStop(1, '#e2e8f0');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 300, 200);
              
              // Border
              ctx.strokeStyle = '#cbd5e1';
              ctx.lineWidth = 2;
              ctx.strokeRect(1, 1, 298, 198);
              
              // Icon and text
              ctx.fillStyle = '#64748b';
              ctx.font = 'bold 16px Inter, sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('📷', 150, 90);
              ctx.font = '14px Inter, sans-serif';
              ctx.fillText('Image not found', 150, 115);
              ctx.fillText('Click to replace', 150, 135);
              
              const placeholderImg = new Image();
              placeholderImg.src = canvas.toDataURL();
              setLoadedImages(prev => new Map(prev.set(element.id, placeholderImg)));
            }
          };
          img.src = element.content;
        }
      });
    }, [posterData.elements, posterData.backgroundImage]);

    // Enhanced canvas drawing with better typography
    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        drawCanvas();
      }
    }, [posterData, selectedElement, canvasSize, loadedImages]);

    const wrapText = useCallback((ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    }, []);

    // Enhanced alignment guide calculation with Google Slides style behavior
    const calculateAlignmentGuides = useCallback((draggedElement: PosterElement) => {
      const guides = { vertical: [], horizontal: [] };
      const threshold = 8; // Slightly larger threshold for better UX
      
      // Canvas center guides (always available)
      const canvasCenterX = canvasSize.width / 2;
      const canvasCenterY = canvasSize.height / 2;
      
      // Dragged element positions
      const draggedCenterX = draggedElement.x + draggedElement.width / 2;
      const draggedCenterY = draggedElement.y + draggedElement.height / 2;
      const draggedLeft = draggedElement.x;
      const draggedRight = draggedElement.x + draggedElement.width;
      const draggedTop = draggedElement.y;
      const draggedBottom = draggedElement.y + draggedElement.height;
      
      // Check alignment with canvas center
      if (Math.abs(draggedCenterX - canvasCenterX) < threshold) {
        guides.vertical.push(canvasCenterX);
      }
      if (Math.abs(draggedCenterY - canvasCenterY) < threshold) {
        guides.horizontal.push(canvasCenterY);
      }
      
      // Check alignment with other elements
      posterData.elements.forEach(element => {
        if (element.id === draggedElement.id) return;
        
        const elementCenterX = element.x + element.width / 2;
        const elementCenterY = element.y + element.height / 2;
        const elementLeft = element.x;
        const elementRight = element.x + element.width;
        const elementTop = element.y;
        const elementBottom = element.y + element.height;
        
        // Vertical alignment guides
        if (Math.abs(elementCenterX - draggedCenterX) < threshold) {
          guides.vertical.push(elementCenterX);
        }
        if (Math.abs(elementLeft - draggedLeft) < threshold) {
          guides.vertical.push(elementLeft);
        }
        if (Math.abs(elementRight - draggedRight) < threshold) {
          guides.vertical.push(elementRight);
        }
        if (Math.abs(elementLeft - draggedRight) < threshold) {
          guides.vertical.push(elementLeft);
        }
        if (Math.abs(elementRight - draggedLeft) < threshold) {
          guides.vertical.push(elementRight);
        }
        
        // Horizontal alignment guides
        if (Math.abs(elementCenterY - draggedCenterY) < threshold) {
          guides.horizontal.push(elementCenterY);
        }
        if (Math.abs(elementTop - draggedTop) < threshold) {
          guides.horizontal.push(elementTop);
        }
        if (Math.abs(elementBottom - draggedBottom) < threshold) {
          guides.horizontal.push(elementBottom);
        }
        if (Math.abs(elementTop - draggedBottom) < threshold) {
          guides.horizontal.push(elementTop);
        }
        if (Math.abs(elementBottom - draggedTop) < threshold) {
          guides.horizontal.push(elementBottom);
        }
      });
      
      // Remove duplicates and sort
      guides.vertical = [...new Set(guides.vertical)].sort((a, b) => a - b);
      guides.horizontal = [...new Set(guides.horizontal)].sort((a, b) => a - b);
      
      return guides;
    }, [posterData.elements, canvasSize]);

    const drawCanvas = useCallback(() => {
      if (!ref || !('current' in ref) || !ref.current) return;

      const canvas = ref.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size with high DPI
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvasSize.width * dpr;
      canvas.height = canvasSize.height * dpr;
      canvas.style.width = `${canvasSize.width}px`;
      canvas.style.height = `${canvasSize.height}px`;
      ctx.scale(dpr, dpr);

      // Enhanced text rendering
      ctx.textRenderingOptimization = 'optimizeQuality';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear canvas with background
      ctx.fillStyle = posterData.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw background image if exists - FULL COVERAGE
      if (posterData.backgroundImage) {
        const bgImg = loadedImages.get('background');
        if (bgImg) {
          ctx.globalAlpha = posterData.backgroundOpacity || 0.3;
          // Calculate aspect ratio to cover entire canvas
          const imgAspect = bgImg.width / bgImg.height;
          const canvasAspect = canvasSize.width / canvasSize.height;
          
          let drawWidth = canvasSize.width;
          let drawHeight = canvasSize.height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (imgAspect > canvasAspect) {
            drawWidth = canvasSize.height * imgAspect;
            offsetX = (canvasSize.width - drawWidth) / 2;
          } else {
            drawHeight = canvasSize.width / imgAspect;
            offsetY = (canvasSize.height - drawHeight) / 2;
          }
          
          ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);
          ctx.globalAlpha = 1;
        }
      }

      // Draw template guides
      drawTemplateGuides(ctx);

      // Draw elements in z-index order
      const sortedElements = [...posterData.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      sortedElements.forEach(element => {
        drawElement(ctx, element);
      });

      // Draw alignment guides (Google Slides style)
      if (showGuides) {
        drawAlignmentGuides(ctx);
      }

      // Draw margins/safe area
      drawMargins(ctx);
    }, [posterData, selectedElement, canvasSize, loadedImages, wrapText, showGuides, alignmentGuides]);

    // Google Slides style alignment guides
    const drawAlignmentGuides = useCallback((ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = '#ff4081'; // Pink/magenta color like Google Slides
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.8;
      
      // Draw vertical guides
      alignmentGuides.vertical.forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize.height);
        ctx.stroke();
      });
      
      // Draw horizontal guides
      alignmentGuides.horizontal.forEach(y => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
        ctx.stroke();
      });
      
      ctx.globalAlpha = 1;
    }, [alignmentGuides, canvasSize]);

    const drawMargins = useCallback((ctx: CanvasRenderingContext2D) => {
      const config = sizeConfigs[posterData.size as keyof typeof sizeConfigs] || sizeConfigs.a4;
      const margin = (config.margin / config.width) * canvasSize.width;

      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(margin, margin, canvasSize.width - margin * 2, canvasSize.height - margin * 2);
      ctx.setLineDash([]);
    }, [posterData.size, canvasSize]);

    const drawTemplateGuides = useCallback((ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      if (posterData.template === 'trifold' || posterData.size === 'trifold') {
        const panelWidth = canvasSize.width / 3;
        ctx.beginPath();
        ctx.moveTo(panelWidth, 0);
        ctx.lineTo(panelWidth, canvasSize.height);
        ctx.moveTo(panelWidth * 2, 0);
        ctx.lineTo(panelWidth * 2, canvasSize.height);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }, [posterData.template, posterData.size, canvasSize]);

    const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: PosterElement) => {
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
        drawTextElement(ctx, element, element.width, element.height, 1);
      } else if (element.type === 'image') {
        drawImageElement(ctx, element, element.width, element.height);
      } else if (element.type === 'shape') {
        drawShapeElement(ctx, element, element.width, element.height);
      }

      // Draw selection border
      if (selectedElement === element.id) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(-2, -2, element.width + 4, element.height + 4);
        
        // Draw resize handles
        const handleSize = 8;
        ctx.fillStyle = '#3b82f6';
        const handles = [
          [-handleSize/2, -handleSize/2], // top-left
          [element.width - handleSize/2, -handleSize/2], // top-right
          [-handleSize/2, element.height - handleSize/2], // bottom-left
          [element.width - handleSize/2, element.height - handleSize/2], // bottom-right
          [element.width/2 - handleSize/2, -handleSize/2], // top-center
          [element.width/2 - handleSize/2, element.height - handleSize/2], // bottom-center
          [-handleSize/2, element.height/2 - handleSize/2], // left-center
          [element.width - handleSize/2, element.height/2 - handleSize/2], // right-center
        ];
        
        handles.forEach(([x, y]) => {
          ctx.fillRect(x, y, handleSize, handleSize);
        });
      }

      ctx.restore();
    }, [selectedElement]);

    const drawTextElement = useCallback((ctx: CanvasRenderingContext2D, element: PosterElement, width: number, height: number, scale: number) => {
      // Background with rounded corners
      if (element.backgroundColor && element.backgroundColor !== 'transparent') {
        ctx.fillStyle = element.backgroundColor;
        if (element.borderRadius) {
          drawRoundedRect(ctx, 0, 0, width, height, element.borderRadius * scale);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, width, height);
        }
      }

      // Border
      if (element.borderWidth && element.borderColor) {
        ctx.strokeStyle = element.borderColor;
        ctx.lineWidth = element.borderWidth * scale;
        if (element.borderRadius) {
          drawRoundedRect(ctx, 0, 0, width, height, element.borderRadius * scale);
          ctx.stroke();
        } else {
          ctx.strokeRect(0, 0, width, height);
        }
      }

      // Enhanced text setup
      ctx.fillStyle = element.color || '#000000';
      const fontSize = (element.fontSize || 16) * scale;
      const fontWeight = element.fontWeight || 'normal';
      const fontFamily = element.fontFamily || 'Inter, system-ui, sans-serif';
      
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textBaseline = 'top';
      
      // Calculate padding and available space
      const padding = Math.max(12 * scale, fontSize * 0.5);
      const availableWidth = width - (padding * 2);
      const lineHeight = fontSize * 1.4;
      
      // Wrap text with improved algorithm
      const wrappedLines = wrapText(ctx, element.content, availableWidth, fontSize);
      
      // Calculate starting position
      const totalTextHeight = wrappedLines.length * lineHeight;
      let startY = padding;
      
      // Vertical alignment
      if (element.verticalAlign === 'center' && totalTextHeight < height - (padding * 2)) {
        startY = (height - totalTextHeight) / 2;
      } else if (element.verticalAlign === 'bottom') {
        startY = height - totalTextHeight - padding;
      }
      
      // Draw text with shadows if specified
      if (element.textShadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4 * scale;
        ctx.shadowOffsetX = 2 * scale;
        ctx.shadowOffsetY = 2 * scale;
      }
      
      // Draw each line
      wrappedLines.forEach((line, index) => {
        const y = startY + (index * lineHeight);
        
        if (y + fontSize <= height - padding) {
          let x = padding;
          
          // Horizontal alignment
          if (element.alignment === 'center') {
            x = width / 2;
            ctx.textAlign = 'center';
          } else if (element.alignment === 'right') {
            x = width - padding;
            ctx.textAlign = 'right';
          } else {
            ctx.textAlign = 'left';
          }
          
          ctx.fillText(line, x, y);
        }
      });
      
      // Reset styles
      ctx.textAlign = 'left';
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }, [wrapText]);

    const drawImageElement = useCallback((ctx: CanvasRenderingContext2D, element: PosterElement, width: number, height: number) => {
      const img = loadedImages.get(element.id);
      
      if (img) {
        // Calculate aspect ratio and fit
        const imgAspect = img.width / img.height;
        const elementAspect = width / height;
        
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;
        
        // Fit image properly (cover mode)
        if (imgAspect > elementAspect) {
          drawWidth = height * imgAspect;
          offsetX = (width - drawWidth) / 2;
        } else {
          drawHeight = width / imgAspect;
          offsetY = (height - drawHeight) / 2;
        }
        
        // Clip to element bounds
        ctx.save();
        if (element.borderRadius) {
          drawRoundedRect(ctx, 0, 0, width, height, element.borderRadius);
          ctx.clip();
        } else {
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.clip();
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();
        
        // Border for images
        if (element.borderWidth && element.borderColor) {
          ctx.strokeStyle = element.borderColor;
          ctx.lineWidth = element.borderWidth;
          if (element.borderRadius) {
            drawRoundedRect(ctx, 0, 0, width, height, element.borderRadius);
            ctx.stroke();
          } else {
            ctx.strokeRect(0, 0, width, height);
          }
        }
      } else {
        // Enhanced placeholder
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(0, 0, width, height);
        ctx.setLineDash([]);
        
        // Placeholder icon and text
        ctx.fillStyle = '#64748b';
        ctx.font = `${Math.min(width, height) * 0.2}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('📷', width / 2, height / 2 - 10);
        ctx.font = `${Math.min(width, height) * 0.08}px Inter, sans-serif`;
        ctx.fillText('Click to add image', width / 2, height / 2 + 20);
        ctx.textAlign = 'left';
      }
    }, [loadedImages]);

    const drawShapeElement = useCallback((ctx: CanvasRenderingContext2D, element: PosterElement, width: number, height: number) => {
      ctx.fillStyle = element.backgroundColor || '#000000';
      
      if (element.borderRadius) {
        drawRoundedRect(ctx, 0, 0, width, height, element.borderRadius);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, width, height);
      }
      
      if (element.borderWidth && element.borderColor) {
        ctx.strokeStyle = element.borderColor;
        ctx.lineWidth = element.borderWidth;
        if (element.borderRadius) {
          drawRoundedRect(ctx, 0, 0, width, height, element.borderRadius);
          ctx.stroke();
        } else {
          ctx.strokeRect(0, 0, width, height);
        }
      }
    }, []);

    const drawRoundedRect = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
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
    }, []);

    const getElementAtPosition = useCallback((x: number, y: number): PosterElement | null => {
      // Find clicked element (reverse order for top-to-bottom selection)
      return posterData.elements
        .slice()
        .reverse()
        .find(element => 
          x >= element.x && x <= element.x + element.width &&
          y >= element.y && y <= element.y + element.height
        ) || null;
    }, [posterData.elements]);

    const getResizeHandle = useCallback((element: PosterElement, x: number, y: number): string | null => {
      const handleSize = 8;
      const handles = [
        { name: 'nw', x: element.x - handleSize/2, y: element.y - handleSize/2 },
        { name: 'ne', x: element.x + element.width - handleSize/2, y: element.y - handleSize/2 },
        { name: 'sw', x: element.x - handleSize/2, y: element.y + element.height - handleSize/2 },
        { name: 'se', x: element.x + element.width - handleSize/2, y: element.y + element.height - handleSize/2 },
        { name: 'n', x: element.x + element.width/2 - handleSize/2, y: element.y - handleSize/2 },
        { name: 's', x: element.x + element.width/2 - handleSize/2, y: element.y + element.height - handleSize/2 },
        { name: 'w', x: element.x - handleSize/2, y: element.y + element.height/2 - handleSize/2 },
        { name: 'e', x: element.x + element.width - handleSize/2, y: element.y + element.height/2 - handleSize/2 },
      ];
      
      for (const handle of handles) {
        if (x >= handle.x && x <= handle.x + handleSize && y >= handle.y && y <= handle.y + handleSize) {
          return handle.name;
        }
      }
      
      return null;
    }, []);

    const getCursorForHandle = useCallback((handle: string | null): string => {
      if (!handle) return 'default';
      
      const cursors: { [key: string]: string } = {
        'nw': 'nw-resize',
        'ne': 'ne-resize',
        'sw': 'sw-resize',
        'se': 'se-resize',
        'n': 'n-resize',
        's': 's-resize',
        'w': 'w-resize',
        'e': 'e-resize'
      };
      
      return cursors[handle] || 'default';
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clickedElement = getElementAtPosition(x, y);

      if (clickedElement) {
        onElementSelect(clickedElement.id);
        
        // Check if clicking on resize handle
        const handle = getResizeHandle(clickedElement, x, y);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          setDragStart({ x, y });
        } else {
          setIsDragging(true);
          setDragStart({ x: x - clickedElement.x, y: y - clickedElement.y });
          
          // Calculate alignment guides
          const guides = calculateAlignmentGuides(clickedElement);
          setAlignmentGuides(guides);
          setShowGuides(true);
        }
      } else {
        onElementSelect(null);
        setShowGuides(false);
      }
    }, [getElementAtPosition, getResizeHandle, onElementSelect, calculateAlignmentGuides]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const selectedEl = posterData.elements.find(el => el.id === selectedElement);
      if (!selectedEl) {
        // Update cursor based on hover
        const hoveredElement = getElementAtPosition(x, y);
        if (hoveredElement) {
          const handle = getResizeHandle(hoveredElement, x, y);
          if (containerRef.current) {
            containerRef.current.style.cursor = handle ? getCursorForHandle(handle) : 'move';
          }
        } else {
          if (containerRef.current) {
            containerRef.current.style.cursor = 'default';
          }
        }
        return;
      }

      if (isDragging) {
        let newX = x - dragStart.x;
        let newY = y - dragStart.y;
        
        // Snap to alignment guides with Google Slides style behavior
        const threshold = 8;
        alignmentGuides.vertical.forEach(guideX => {
          const elementCenterX = newX + selectedEl.width / 2;
          if (Math.abs(elementCenterX - guideX) < threshold) {
            newX = guideX - selectedEl.width / 2;
          }
          if (Math.abs(newX - guideX) < threshold) {
            newX = guideX;
          }
          if (Math.abs(newX + selectedEl.width - guideX) < threshold) {
            newX = guideX - selectedEl.width;
          }
        });
        
        alignmentGuides.horizontal.forEach(guideY => {
          const elementCenterY = newY + selectedEl.height / 2;
          if (Math.abs(elementCenterY - guideY) < threshold) {
            newY = guideY - selectedEl.height / 2;
          }
          if (Math.abs(newY - guideY) < threshold) {
            newY = guideY;
          }
          if (Math.abs(newY + selectedEl.height - guideY) < threshold) {
            newY = guideY - selectedEl.height;
          }
        });
        
        // Constrain to canvas bounds
        newX = Math.max(0, Math.min(canvasSize.width - selectedEl.width, newX));
        newY = Math.max(0, Math.min(canvasSize.height - selectedEl.height, newY));
        
        onElementUpdate(selectedElement!, { x: newX, y: newY });
        
        // Update alignment guides in real-time
        const updatedElement = { ...selectedEl, x: newX, y: newY };
        const guides = calculateAlignmentGuides(updatedElement);
        setAlignmentGuides(guides);
      } else if (isResizing && resizeHandle) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;
        
        let newWidth = selectedEl.width;
        let newHeight = selectedEl.height;
        let newX = selectedEl.x;
        let newY = selectedEl.y;
        
        switch (resizeHandle) {
          case 'se':
            newWidth = Math.max(20, selectedEl.width + deltaX);
            newHeight = Math.max(20, selectedEl.height + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(20, selectedEl.width - deltaX);
            newHeight = Math.max(20, selectedEl.height + deltaY);
            newX = selectedEl.x + deltaX;
            break;
          case 'ne':
            newWidth = Math.max(20, selectedEl.width + deltaX);
            newHeight = Math.max(20, selectedEl.height - deltaY);
            newY = selectedEl.y + deltaY;
            break;
          case 'nw':
            newWidth = Math.max(20, selectedEl.width - deltaX);
            newHeight = Math.max(20, selectedEl.height - deltaY);
            newX = selectedEl.x + deltaX;
            newY = selectedEl.y + deltaY;
            break;
          case 'n':
            newHeight = Math.max(20, selectedEl.height - deltaY);
            newY = selectedEl.y + deltaY;
            break;
          case 's':
            newHeight = Math.max(20, selectedEl.height + deltaY);
            break;
          case 'w':
            newWidth = Math.max(20, selectedEl.width - deltaX);
            newX = selectedEl.x + deltaX;
            break;
          case 'e':
            newWidth = Math.max(20, selectedEl.width + deltaX);
            break;
        }
        
        // Constrain to canvas bounds
        if (newX < 0) {
          newWidth += newX;
          newX = 0;
        }
        if (newY < 0) {
          newHeight += newY;
          newY = 0;
        }
        if (newX + newWidth > canvasSize.width) {
          newWidth = canvasSize.width - newX;
        }
        if (newY + newHeight > canvasSize.height) {
          newHeight = canvasSize.height - newY;
        }
        
        onElementUpdate(selectedElement!, { 
          width: newWidth, 
          height: newHeight, 
          x: newX, 
          y: newY 
        });
        setDragStart({ x, y });
      }
    }, [isDragging, isResizing, resizeHandle, selectedElement, posterData.elements, dragStart, canvasSize, onElementUpdate, alignmentGuides, calculateAlignmentGuides, getElementAtPosition, getResizeHandle, getCursorForHandle]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
      setShowGuides(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = 'default';
      }
    }, []);

    return (
      <div className="relative flex flex-col items-center">
        {/* Undo/Redo buttons */}
        <div className="flex space-x-2 mb-4 z-10">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              canUndo 
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              canRedo 
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>

        <div 
          ref={containerRef}
          className="relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xl"
          style={{ width: canvasSize.width, height: canvasSize.height }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={ref}
            className="absolute inset-0"
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Interactive overlay elements */}
          {posterData.elements.map(element => (
            <div
              key={element.id}
              className={`absolute border-2 transition-all ${
                selectedElement === element.id 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : 'border-transparent hover:border-blue-300 hover:bg-blue-300/5'
              }`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                cursor: isDragging || isResizing ? 'grabbing' : 'grab'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onElementSelect(element.id);
              }}
            />
          ))}
        </div>
      </div>
    );
  }
);

PosterCanvas.displayName = 'PosterCanvas';