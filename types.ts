import React from 'react';

export interface Song {
  id: string;
  title: string;
  duration: string;
  lyrics: string;
  chords: string;
  links: {
    spotify: string;
    appleMusic: string;
    youtubeMusic: string;
  };
}

export interface Album {
  id: string;
  title: string;
  year: string;
  coverUrl: string;
  description: string;
  songs: Song[];
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook';
  content: string;
  imageUrl?: string;
  date: string;
}

export interface CellItem {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

export interface CollectionItem {
  type: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  color?: string;
}