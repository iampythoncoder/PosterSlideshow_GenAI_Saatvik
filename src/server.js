import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const port = 5500;

// Support ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/spec', (req, res) => {
  const filePath = path.join(__dirname, 'generated_spec.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading spec file:', err);
      return res.status(500).json({ error: 'Error loading spec' });
    }
    res.json({ content: data });
  });
});

// Generate poster endpoint
app.post('/api/generate-poster', (req, res) => {
  const { title, subtitle, content, template, colorScheme } = req.body;
  
  // Simulate poster generation
  setTimeout(() => {
    res.json({
      success: true,
      posterUrl: '/api/poster/preview',
      message: 'Poster generated successfully'
    });
  }, 2000);
});

// Get poster preview
app.get('/api/poster/preview', (req, res) => {
  // Return the existing generated spec as HTML
  const filePath = path.join(__dirname, 'generated_spec.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading spec file:', err);
      return res.status(500).send('Error loading poster preview');
    }
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-store');
    res.send(data);
  });
});

// Generate AI image using Pollinations API
app.post('/api/generate-image', (req, res) => {
  const { prompt, style } = req.body;
  
  try {
    // Create enhanced prompt based on style
    const stylePrompts = {
      realistic: `${prompt}, photorealistic, high quality, detailed`,
      artistic: `${prompt}, artistic style, painterly, creative interpretation`,
      cartoon: `${prompt}, cartoon style, animated, colorful, fun`,
      abstract: `${prompt}, abstract art, geometric, modern, artistic`
    };
    
    const enhancedPrompt = stylePrompts[style] || prompt;
    const seed = Math.floor(Math.random() * 1000000);
    
    // Generate Pollinations URL
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=800&height=800&seed=${seed}`;
    
    res.json({
      success: true,
      imageUrl: pollinationsUrl,
      prompt: prompt,
      enhancedPrompt: enhancedPrompt,
      seed: seed
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate image'
    });
  }
});

// Proxy endpoint for Pollinations images (to handle CORS if needed)
app.get('/api/pollinations-proxy', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.buffer();
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(buffer);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🎨 Pollinations AI integration enabled`);
});