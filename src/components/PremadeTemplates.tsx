import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Star, Download, Eye } from 'lucide-react';
import { PosterData, PosterElement } from './PosterGenerator';

interface PremadeTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: Partial<PosterData>) => void;
}

const templates = [
  {
    id: 'corporate-annual-report',
    name: 'Corporate Annual Report',
    category: 'business',
    preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    downloads: 2341,
    size: 'a4',
    elements: [
      {
        id: 'bg-corporate',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 595, height: 300, opacity: 0.15, zIndex: 0
      },
      {
        id: 'title-corporate',
        type: 'text' as const,
        content: 'ANNUAL REPORT 2024',
        x: 50, y: 80, width: 495, height: 80,
        fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#1e293b', alignment: 'center' as const, 
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, zIndex: 2
      },
      {
        id: 'subtitle-corporate',
        type: 'text' as const,
        content: 'Excellence in Performance & Innovation',
        x: 70, y: 180, width: 455, height: 60,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#475569', alignment: 'center' as const,
        backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, zIndex: 2
      },
      {
        id: 'stats-1',
        type: 'text' as const,
        content: '25% Growth\nRevenue Increase',
        x: 70, y: 300, width: 150, height: 100,
        fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#059669', alignment: 'center' as const,
        backgroundColor: '#f0fdf4', borderRadius: 12, zIndex: 2
      },
      {
        id: 'stats-2',
        type: 'text' as const,
        content: '500K+\nCustomers Served',
        x: 240, y: 300, width: 150, height: 100,
        fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#dc2626', alignment: 'center' as const,
        backgroundColor: '#fef2f2', borderRadius: 12, zIndex: 2
      },
      {
        id: 'stats-3',
        type: 'text' as const,
        content: '15 Countries\nGlobal Presence',
        x: 410, y: 300, width: 150, height: 100,
        fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#7c3aed', alignment: 'center' as const,
        backgroundColor: '#faf5ff', borderRadius: 12, zIndex: 2
      }
    ],
    backgroundColor: '#ffffff'
  },
  {
    id: 'event-conference',
    name: 'Tech Conference 2024',
    category: 'event',
    preview: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    downloads: 1876,
    size: 'poster',
    elements: [
      {
        id: 'bg-event',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 1728, height: 800, opacity: 0.6, zIndex: 0
      },
      {
        id: 'title-event',
        type: 'text' as const,
        content: 'TECH SUMMIT 2024',
        x: 150, y: 200, width: 1428, height: 150,
        fontSize: 84, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'subtitle-event',
        type: 'text' as const,
        content: 'The Future of Innovation',
        x: 300, y: 380, width: 1128, height: 80,
        fontSize: 36, fontFamily: 'Inter, sans-serif', fontWeight: '400',
        color: '#ffffff', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'date-event',
        type: 'text' as const,
        content: 'MARCH 15-17, 2024\nSAN FRANCISCO',
        x: 400, y: 500, width: 928, height: 120,
        fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#fbbf24', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'speakers-event',
        type: 'text' as const,
        content: '50+ World-Class Speakers\n3 Days of Innovation\nNetworking & Workshops',
        x: 500, y: 650, width: 728, height: 150,
        fontSize: 20, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#ffffff', alignment: 'center' as const,
        backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 16, zIndex: 2
      }
    ],
    backgroundColor: '#1e293b'
  },
  {
    id: 'product-launch',
    name: 'Product Launch Campaign',
    category: 'marketing',
    preview: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    downloads: 1654,
    size: 'banner',
    elements: [
      {
        id: 'bg-product',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 1920, height: 1080, opacity: 0.3, zIndex: 0
      },
      {
        id: 'title-product',
        type: 'text' as const,
        content: 'INTRODUCING THE FUTURE',
        x: 100, y: 200, width: 800, height: 120,
        fontSize: 64, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#1e40af', alignment: 'left' as const, zIndex: 2
      },
      {
        id: 'subtitle-product',
        type: 'text' as const,
        content: 'Revolutionary Technology\nMeets Elegant Design',
        x: 100, y: 340, width: 700, height: 120,
        fontSize: 32, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#1e3a8a', alignment: 'left' as const, zIndex: 2
      },
      {
        id: 'cta-product',
        type: 'text' as const,
        content: 'LEARN MORE',
        x: 100, y: 500, width: 200, height: 60,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'center' as const,
        backgroundColor: '#3b82f6', borderRadius: 30, zIndex: 2
      },
      {
        id: 'features-product',
        type: 'text' as const,
        content: '✓ Advanced AI Integration\n✓ 10x Performance Boost\n✓ Seamless User Experience\n✓ Enterprise Security',
        x: 1200, y: 300, width: 600, height: 300,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#1f2937', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, zIndex: 2
      }
    ],
    backgroundColor: '#f8fafc'
  },
  {
    id: 'educational-infographic',
    name: 'Educational Infographic',
    category: 'education',
    preview: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    downloads: 2103,
    size: 'a4',
    elements: [
      {
        id: 'title-edu',
        type: 'text' as const,
        content: 'THE SCIENCE OF LEARNING',
        x: 50, y: 50, width: 495, height: 80,
        fontSize: 36, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#1e40af', alignment: 'center' as const, zIndex: 2
      },
      {
        id: 'section1-edu',
        type: 'text' as const,
        content: 'VISUAL LEARNING\n65% of people are visual learners',
        x: 50, y: 150, width: 200, height: 120,
        fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#059669', alignment: 'center' as const,
        backgroundColor: '#ecfdf5', borderRadius: 12, zIndex: 2
      },
      {
        id: 'section2-edu',
        type: 'text' as const,
        content: 'AUDITORY LEARNING\n30% prefer audio content',
        x: 270, y: 150, width: 200, height: 120,
        fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#dc2626', alignment: 'center' as const,
        backgroundColor: '#fef2f2', borderRadius: 12, zIndex: 2
      },
      {
        id: 'section3-edu',
        type: 'text' as const,
        content: 'KINESTHETIC\n5% learn through movement',
        x: 490, y: 150, width: 200, height: 120,
        fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#7c3aed', alignment: 'center' as const,
        backgroundColor: '#faf5ff', borderRadius: 12, zIndex: 2
      },
      {
        id: 'chart-edu',
        type: 'shape' as const,
        content: '',
        x: 150, y: 300, width: 300, height: 200,
        backgroundColor: '#e0e7ff', borderRadius: 16, zIndex: 1
      },
      {
        id: 'chart-title-edu',
        type: 'text' as const,
        content: 'Learning Retention Rates',
        x: 150, y: 320, width: 300, height: 40,
        fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#1e40af', alignment: 'center' as const, zIndex: 2
      },
      {
        id: 'tips-edu',
        type: 'text' as const,
        content: 'EFFECTIVE STUDY TIPS:\n\n• Take regular breaks\n• Use multiple senses\n• Practice active recall\n• Create visual aids\n• Teach others',
        x: 50, y: 530, width: 495, height: 200,
        fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#374151', alignment: 'left' as const,
        backgroundColor: '#f9fafb', borderRadius: 12, zIndex: 2
      }
    ],
    backgroundColor: '#ffffff'
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu Design',
    category: 'food',
    preview: 'https://images.pexels.com/photos/3184342/pexels-photo-3184342.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    downloads: 1876,
    size: 'a4',
    elements: [
      {
        id: 'bg-menu',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3184342/pexels-photo-3184342.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 595, height: 400, opacity: 0.2, zIndex: 0
      },
      {
        id: 'title-menu',
        type: 'text' as const,
        content: 'BELLA VISTA',
        x: 50, y: 60, width: 495, height: 80,
        fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#92400e', alignment: 'center' as const,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, zIndex: 2
      },
      {
        id: 'subtitle-menu',
        type: 'text' as const,
        content: 'Authentic Italian Cuisine',
        x: 100, y: 160, width: 395, height: 50,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: '400',
        color: '#78350f', alignment: 'center' as const, zIndex: 2
      },
      {
        id: 'appetizers-menu',
        type: 'text' as const,
        content: 'APPETIZERS\n\nBruschetta Classica ............ $12\nAntipasto Platter .............. $18\nCaprese Salad .................. $14',
        x: 50, y: 230, width: 240, height: 150,
        fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#374151', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, zIndex: 2
      },
      {
        id: 'mains-menu',
        type: 'text' as const,
        content: 'MAIN COURSES\n\nSpaghetti Carbonara .......... $22\nOsso Buco Milanese ........... $32\nRisotto ai Funghi ............. $26',
        x: 305, y: 230, width: 240, height: 150,
        fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#374151', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, zIndex: 2
      },
      {
        id: 'desserts-menu',
        type: 'text' as const,
        content: 'DESSERTS\n\nTiramisu ........................ $9\nPanna Cotta .................... $8\nCannoli Siciliani .............. $10',
        x: 50, y: 400, width: 240, height: 120,
        fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#374151', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, zIndex: 2
      },
      {
        id: 'wines-menu',
        type: 'text' as const,
        content: 'WINE SELECTION\n\nChianti Classico .............. $45\nPinot Grigio .................. $38\nBarolo Riserva ................ $85',
        x: 305, y: 400, width: 240, height: 120,
        fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#374151', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, zIndex: 2
      }
    ],
    backgroundColor: '#fffbeb'
  },
  {
    id: 'fitness-program',
    name: 'Fitness Program Poster',
    category: 'health',
    preview: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    downloads: 1543,
    size: 'poster',
    elements: [
      {
        id: 'bg-fitness',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 1728, height: 1000, opacity: 0.4, zIndex: 0
      },
      {
        id: 'title-fitness',
        type: 'text' as const,
        content: 'TRANSFORM YOUR BODY',
        x: 200, y: 300, width: 1328, height: 120,
        fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'subtitle-fitness',
        type: 'text' as const,
        content: '12-Week Complete Transformation Program',
        x: 300, y: 450, width: 1128, height: 80,
        fontSize: 36, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#fbbf24', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'features-fitness',
        type: 'text' as const,
        content: '✓ Personal Training Sessions\n✓ Nutrition Guidance\n✓ Progress Tracking\n✓ 24/7 Gym Access',
        x: 200, y: 600, width: 600, height: 200,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#ffffff', alignment: 'left' as const,
        backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 16, zIndex: 2
      },
      {
        id: 'cta-fitness',
        type: 'text' as const,
        content: 'START TODAY\nFREE CONSULTATION',
        x: 900, y: 650, width: 400, height: 120,
        fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'center' as const,
        backgroundColor: '#059669', borderRadius: 20, zIndex: 2
      }
    ],
    backgroundColor: '#1f2937'
  },
  {
    id: 'real-estate-listing',
    name: 'Real Estate Listing',
    category: 'real-estate',
    preview: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    downloads: 1321,
    size: 'banner',
    elements: [
      {
        id: 'bg-realestate',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 1920, height: 1080, opacity: 0.7, zIndex: 0
      },
      {
        id: 'price-realestate',
        type: 'text' as const,
        content: '$2,450,000',
        x: 100, y: 150, width: 600, height: 100,
        fontSize: 64, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'left' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'title-realestate',
        type: 'text' as const,
        content: 'LUXURY MODERN HOME',
        x: 100, y: 270, width: 700, height: 80,
        fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'left' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'location-realestate',
        type: 'text' as const,
        content: 'Beverly Hills, California',
        x: 100, y: 370, width: 500, height: 60,
        fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#fbbf24', alignment: 'left' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'details-realestate',
        type: 'text' as const,
        content: '5 Bedrooms • 4 Bathrooms\n4,500 sq ft • 0.8 Acre Lot\nPool & Spa • 3-Car Garage',
        x: 1200, y: 300, width: 600, height: 200,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#1f2937', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, zIndex: 2
      },
      {
        id: 'contact-realestate',
        type: 'text' as const,
        content: 'SCHEDULE VIEWING\n(555) 123-4567',
        x: 100, y: 500, width: 400, height: 100,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'center' as const,
        backgroundColor: '#dc2626', borderRadius: 16, zIndex: 2
      }
    ],
    backgroundColor: '#1e293b'
  },
  {
    id: 'music-festival',
    name: 'Music Festival Poster',
    category: 'music',
    preview: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    downloads: 2654,
    size: 'poster',
    elements: [
      {
        id: 'bg-music',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 1728, height: 1200, opacity: 0.8, zIndex: 0
      },
      {
        id: 'title-music',
        type: 'text' as const,
        content: 'SUMMER BEATS',
        x: 200, y: 200, width: 1328, height: 150,
        fontSize: 96, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'subtitle-music',
        type: 'text' as const,
        content: 'MUSIC FESTIVAL 2024',
        x: 300, y: 380, width: 1128, height: 80,
        fontSize: 42, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#fbbf24', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'dates-music',
        type: 'text' as const,
        content: 'JULY 15-17, 2024\nCENTRAL PARK, NYC',
        x: 400, y: 500, width: 928, height: 120,
        fontSize: 32, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#ffffff', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'lineup-music',
        type: 'text' as const,
        content: 'HEADLINERS:\nThe Electric Waves • Neon Dreams\nCosmic Vibes • Digital Harmony\nSunset Collective',
        x: 300, y: 700, width: 1128, height: 200,
        fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#ffffff', alignment: 'center' as const,
        backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 20, zIndex: 2
      },
      {
        id: 'tickets-music',
        type: 'text' as const,
        content: 'GET TICKETS\nwww.summerbeats.com',
        x: 600, y: 950, width: 528, height: 100,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#1f2937', alignment: 'center' as const,
        backgroundColor: '#fbbf24', borderRadius: 16, zIndex: 2
      }
    ],
    backgroundColor: '#1f2937'
  },
  {
    id: 'fashion-collection',
    name: 'Fashion Collection Launch',
    category: 'fashion',
    preview: 'https://images.pexels.com/photos/3184421/pexels-photo-3184421.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    downloads: 1765,
    size: 'banner',
    elements: [
      {
        id: 'bg-fashion',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3184421/pexels-photo-3184421.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 1920, height: 1080, opacity: 0.3, zIndex: 0
      },
      {
        id: 'title-fashion',
        type: 'text' as const,
        content: 'SPRING COLLECTION',
        x: 100, y: 200, width: 800, height: 100,
        fontSize: 64, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#be185d', alignment: 'left' as const, zIndex: 2
      },
      {
        id: 'subtitle-fashion',
        type: 'text' as const,
        content: 'Elegance Redefined',
        x: 100, y: 320, width: 600, height: 80,
        fontSize: 36, fontFamily: 'Inter, sans-serif', fontWeight: '300',
        color: '#9d174d', alignment: 'left' as const, zIndex: 2
      },
      {
        id: 'description-fashion',
        type: 'text' as const,
        content: 'Discover our latest collection featuring\nsustainable fabrics and timeless designs\nthat celebrate modern femininity.',
        x: 100, y: 420, width: 700, height: 150,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#831843', alignment: 'left' as const, zIndex: 2
      },
      {
        id: 'cta-fashion',
        type: 'text' as const,
        content: 'SHOP NOW',
        x: 100, y: 600, width: 200, height: 60,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'center' as const,
        backgroundColor: '#be185d', borderRadius: 30, zIndex: 2
      },
      {
        id: 'features-fashion',
        type: 'text' as const,
        content: 'NEW ARRIVALS\n\n• Sustainable Materials\n• Limited Edition Pieces\n• Free Worldwide Shipping\n• 30-Day Returns',
        x: 1200, y: 300, width: 600, height: 300,
        fontSize: 22, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#1f2937', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, zIndex: 2
      }
    ],
    backgroundColor: '#fdf2f8'
  },
  {
    id: 'travel-destination',
    name: 'Travel Destination Guide',
    category: 'travel',
    preview: 'https://images.pexels.com/photos/3184410/pexels-photo-3184410.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    downloads: 2198,
    size: 'a4',
    elements: [
      {
        id: 'bg-travel',
        type: 'image' as const,
        content: 'https://images.pexels.com/photos/3184410/pexels-photo-3184410.jpeg?auto=compress&cs=tinysrgb&w=800',
        x: 0, y: 0, width: 595, height: 400, opacity: 0.6, zIndex: 0
      },
      {
        id: 'title-travel',
        type: 'text' as const,
        content: 'DISCOVER SANTORINI',
        x: 50, y: 80, width: 495, height: 100,
        fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#ffffff', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'subtitle-travel',
        type: 'text' as const,
        content: 'Greece\'s Most Beautiful Island',
        x: 100, y: 200, width: 395, height: 60,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: '500',
        color: '#ffffff', alignment: 'center' as const, textShadow: true, zIndex: 2
      },
      {
        id: 'highlights-travel',
        type: 'text' as const,
        content: 'TOP ATTRACTIONS\n\n🏛️ Ancient Akrotiri Ruins\n🌅 Oia Sunset Views\n🍷 Local Wineries\n🏖️ Red Beach\n⛪ Blue Dome Churches',
        x: 50, y: 300, width: 240, height: 250,
        fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#1f2937', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, zIndex: 2
      },
      {
        id: 'info-travel',
        type: 'text' as const,
        content: 'TRAVEL TIPS\n\n• Best time: April-October\n• Currency: Euro (€)\n• Language: Greek\n• Getting around: Rental car\n• Must try: Fresh seafood',
        x: 305, y: 300, width: 240, height: 250,
        fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#1f2937', alignment: 'left' as const,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, zIndex: 2
      },
      {
        id: 'booking-travel',
        type: 'text' as const,
        content: 'Book your dream vacation today!\nwww.santorinitravel.com',
        x: 50, y: 570, width: 495, height: 80,
        fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '600',
        color: '#0c4a6e', alignment: 'center' as const,
        backgroundColor: '#e0f2fe', borderRadius: 12, zIndex: 2
      }
    ],
    backgroundColor: '#0c4a6e'
  }
];

const categories = [
  { id: 'all', name: 'All Templates', count: templates.length },
  { id: 'business', name: 'Business', count: templates.filter(t => t.category === 'business').length },
  { id: 'event', name: 'Events', count: templates.filter(t => t.category === 'event').length },
  { id: 'marketing', name: 'Marketing', count: templates.filter(t => t.category === 'marketing').length },
  { id: 'education', name: 'Education', count: templates.filter(t => t.category === 'education').length },
  { id: 'food', name: 'Food & Dining', count: templates.filter(t => t.category === 'food').length },
  { id: 'health', name: 'Health & Fitness', count: templates.filter(t => t.category === 'health').length },
  { id: 'real-estate', name: 'Real Estate', count: templates.filter(t => t.category === 'real-estate').length },
  { id: 'music', name: 'Music & Arts', count: templates.filter(t => t.category === 'music').length },
  { id: 'fashion', name: 'Fashion', count: templates.filter(t => t.category === 'fashion').length },
  { id: 'travel', name: 'Travel', count: templates.filter(t => t.category === 'travel').length }
];

export const PremadeTemplates: React.FC<PremadeTemplatesProps> = ({
  isOpen,
  onClose,
  onTemplateSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (template: typeof templates[0]) => {
    onTemplateSelect({
      template: template.id,
      size: template.size,
      elements: template.elements as PosterElement[],
      backgroundColor: template.backgroundColor
    });
  };

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
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-200/50 dark:border-slate-700/50">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Professional Templates
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Choose from {templates.length} professionally designed templates</p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-3 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Search and Filters */}
            <div className="p-8 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {categories.slice(0, 6).map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-slate-100/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-600/50 backdrop-blur-sm'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20'
                          : 'bg-slate-200/50 dark:bg-slate-600/50'
                      }`}>
                        {category.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white/70 dark:bg-slate-700/70 backdrop-blur-xl rounded-2xl p-4 group hover:shadow-2xl transition-all cursor-pointer border border-slate-200/50 dark:border-slate-600/50"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {/* Template Preview */}
                    <div className="aspect-[3/4] bg-slate-200/50 dark:bg-slate-600/50 rounded-xl overflow-hidden mb-4 relative">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Size Badge */}
                      <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {template.size.toUpperCase()}
                      </div>
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Preview functionality
                            }}
                          >
                            <Eye className="w-5 h-5 text-slate-700" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTemplateSelect(template);
                            }}
                          >
                            <Download className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{template.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{template.category.replace('-', ' ')}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{template.rating}</span>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{template.downloads.toLocaleString()} uses</span>
                      </div>
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
                  <div className="w-16 h-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">No templates found</h3>
                  <p className="text-slate-500 dark:text-slate-500">Try adjusting your search or filter criteria</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};