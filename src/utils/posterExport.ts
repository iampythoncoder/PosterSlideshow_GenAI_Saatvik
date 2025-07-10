import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPNG = async (canvas: HTMLCanvasElement, filename: string = 'poster') => {
  try {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('PNG export failed:', error);
    throw error;
  }
};

export const exportToPDF = async (canvas: HTMLCanvasElement, filename: string = 'poster', size: string = 'a4') => {
  try {
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // PDF size configurations
    const sizeConfigs = {
      a4: { width: 210, height: 297 },
      letter: { width: 216, height: 279 },
      poster: { width: 610, height: 914 },
      instagram: { width: 200, height: 200 },
      banner: { width: 297, height: 167 },
      trifold: { width: 297, height: 210 }
    };
    
    const config = sizeConfigs[size as keyof typeof sizeConfigs] || sizeConfigs.a4;
    const pdf = new jsPDF({
      orientation: config.width > config.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [config.width, config.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, config.width, config.height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

export const exportToJPEG = async (canvas: HTMLCanvasElement, filename: string = 'poster', quality: number = 0.9) => {
  try {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/jpeg', quality);
  } catch (error) {
    console.error('JPEG export failed:', error);
    throw error;
  }
};

export const exportHighRes = async (canvas: HTMLCanvasElement, filename: string = 'poster', scale: number = 3) => {
  try {
    // Create a high-resolution version
    const highResCanvas = document.createElement('canvas');
    const ctx = highResCanvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    highResCanvas.width = canvas.width * scale;
    highResCanvas.height = canvas.height * scale;
    
    ctx.scale(scale, scale);
    ctx.drawImage(canvas, 0, 0);
    
    highResCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_hd.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('High-res export failed:', error);
    throw error;
  }
};