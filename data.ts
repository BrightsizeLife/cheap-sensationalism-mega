
import React from 'react';
import { Album, CellItem, SocialPost } from './types';
import { 
  SketchPencil, 
  SketchBolt, 
  SketchBook, 
  SketchEye, 
  SketchKnobs, 
  SketchTape, 
  SketchCircuit, 
  SketchScreen 
} from './components/SketchIcons';

const generateTracks = (albumId: string, count: number) => {
  const themes = ['Neon', 'Acid', 'Raw', 'Slop', 'Glitch', 'Organic', 'Plastic', 'Static', 'Wired', 'Lush', 'Lost', 'Vivid'];
  const nouns = ['System', 'Waste', 'Flesh', 'Circuit', 'Dream', 'Shadow', 'Signal', 'Voice', 'Code', 'River', 'Void', 'Light'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `${albumId}-${i + 1}`,
    title: `${themes[i % themes.length]} ${nouns[i % nouns.length]}`,
    duration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 50) + 10}`,
    lyrics: `[Verse 1]\nProcessing the ${themes[i % themes.length].toLowerCase()} input\nFeeding the ${nouns[i % nouns.length].toLowerCase()} machine\nIt's a beautiful kind of sludge\nThe cleanest slop you've ever seen...\n\n[Chorus]\nEverything is ${nouns[i % nouns.length].toLowerCase()}\nIn the ${themes[i % themes.length].toLowerCase()} afterlife\nCut through the noise\nWith a digital knife.`,
    chords: `Intro: E - A - D (Distorted)\nVerse: G#m - F# - E\nChorus: B - F# - E - Em`,
    links: {
      spotify: '#',
      appleMusic: '#',
      youtubeMusic: '#'
    }
  }));
};

export const ALBUMS: Album[] = [
  {
    id: '1',
    title: 'Slop',
    year: '2024',
    coverUrl: 'https://images.unsplash.com/photo-1634157703702-3c124b455499?auto=format&fit=crop&q=80&w=800',
    description: 'A chaotic, unrefined exploration of sonic debris and digital excess. Our most honest work to date.',
    songs: generateTracks('1', 12)
  },
  {
    id: '2',
    title: 'Philadelphia Freedom',
    year: '2023',
    coverUrl: 'https://images.unsplash.com/photo-1542208998-f6dbbb27a72f?auto=format&fit=crop&q=80&w=800',
    description: 'Gritty, historic, and revolutionary. A soundscape of the city that never sleeps, only dreams.',
    songs: generateTracks('2', 10)
  },
  {
    id: '3',
    title: 'Cheap Sensationalism',
    year: '2022',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    description: 'Exaggerated hooks, fluorescent production, and the absolute pursuit of the immediate.',
    songs: generateTracks('3', 12)
  }
];

export const THOUGHTS: CellItem[] = [
  {
    id: 't1',
    title: 'The Substack',
    description: 'Weekly meditations on the death of context and the birth of the hyper-niche.',
    link: 'https://substack.com',
    icon: React.createElement(SketchPencil)
  },
  {
    id: 't2',
    title: 'Manifesto',
    description: 'Why we make noise in an era of silence. The core philosophy of Cheap Sensationalism.',
    link: '#',
    icon: React.createElement(SketchBolt)
  },
  {
    id: 't3',
    title: 'Field Notes',
    description: 'Observations from the road, the studio, and the spaces in between.',
    link: '#',
    icon: React.createElement(SketchBook)
  },
  {
    id: 't4',
    title: 'Visual Archives',
    description: 'A collection of visual inspirations that drive our sonic palette.',
    link: '#',
    icon: React.createElement(SketchEye)
  }
];

export const TOOLS: CellItem[] = [
  {
    id: 'm1',
    title: 'The Modular Wall',
    description: 'Our custom-built Eurorack system used for 90% of "Slop".',
    link: '#',
    icon: React.createElement(SketchKnobs)
  },
  {
    id: 'm2',
    title: 'Tape Loops',
    description: 'Degraded magnetic memories. How we process time.',
    link: '#',
    icon: React.createElement(SketchTape)
  },
  {
    id: 'm3',
    title: 'Circuit Bending',
    description: 'Breaking toys to make new worlds. The ethos of destruction as creation.',
    link: '#',
    icon: React.createElement(SketchCircuit)
  },
  {
    id: 'm4',
    title: 'Software',
    description: 'The digital glue that holds the analog chaos together.',
    link: '#',
    icon: React.createElement(SketchScreen)
  }
];

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 's1',
    platform: 'instagram',
    content: 'Feeding the machine. Today we sampled the sound of a failing hard drive. Pure slop. 💾',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
    date: '1h ago'
  },
  {
    id: 's2',
    platform: 'twitter',
    content: 'Why wait for the truth when you can have a cheap sensation right now?',
    date: '3h ago'
  },
  {
    id: 's3',
    platform: 'instagram',
    content: 'Studio A is currently a mess of wires and half-eaten sandwiches. Peak productivity.',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400',
    date: '1d ago'
  }
];
