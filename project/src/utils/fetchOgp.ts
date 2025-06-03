// This is a client-side implementation for fetching OGP data
// In a production environment, you would use a server-side solution to avoid CORS issues

import { BookmarkItem } from '../types';

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

// Function to extract OGP data using a proxy service (to avoid CORS issues)
export const fetchOgpData = async (url: string): Promise<Partial<BookmarkItem['ogpData']>> => {
  try {
    // For demo purposes, this simulates OGP fetching
    // In production, you would use a proper proxy service or backend API
    // Example: const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    
    // Simulated delay to mimic network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Parse domain for automatic tags
    const domain = new URL(url).hostname.replace('www.', '');
    const domainParts = domain.split('.');
    const mainDomain = domainParts[0];
    
    // Generate dummy OGP data based on URL
    let title = `Page on ${domain}`;
    let description = `This is a page from ${domain} that was bookmarked for future reference.`;
    let image = FALLBACK_IMAGE;
    let siteName = domain;
    
    // Simulate different OGP data based on common domains
    if (domain.includes('github')) {
      title = 'GitHub Repository';
      description = 'A code repository hosted on GitHub, the world\'s leading developer platform.';
      image = 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
      siteName = 'GitHub';
    } else if (domain.includes('youtube')) {
      title = 'YouTube Video';
      description = 'A video shared on YouTube, the world\'s largest video sharing platform.';
      image = 'https://images.pexels.com/photos/1716158/pexels-photo-1716158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
      siteName = 'YouTube';
    } else if (domain.includes('medium')) {
      title = 'Medium Article';
      description = 'An article published on Medium, a platform where ideas are shared.';
      image = 'https://images.pexels.com/photos/4132335/pexels-photo-4132335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
      siteName = 'Medium';
    }
    
    return {
      title,
      description,
      image,
      siteName
    };
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    return {
      title: 'Could not fetch title',
      description: 'Description could not be retrieved',
      image: FALLBACK_IMAGE,
      siteName: 'Unknown'
    };
  }
};

// Helper function to generate automatic tags based on URL
export const generateAutoTags = (url: string): string[] => {
  const tags: string[] = [];
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    // Add domain-based tag
    const domainParts = domain.split('.');
    const mainDomain = domainParts[0];
    tags.push(mainDomain);
    
    // Add category-based tags (simplified example)
    if (['github', 'gitlab', 'bitbucket'].some(d => domain.includes(d))) {
      tags.push('tech');
      tags.push('code');
    } else if (['youtube', 'vimeo', 'dailymotion'].some(d => domain.includes(d))) {
      tags.push('video');
    } else if (['medium', 'dev.to', 'hashnode'].some(d => domain.includes(d))) {
      tags.push('article');
      tags.push('tech');
    } else if (['twitter', 'facebook', 'instagram'].some(d => domain.includes(d))) {
      tags.push('social');
    }
    
    return tags.map(tag => tag.toLowerCase());
  } catch (error) {
    console.error('Error generating tags:', error);
    return [];
  }
};

// Parse tags from user input
export const parseTagsFromInput = (input: string): string[] => {
  // Handle both comma-separated and hash-prefixed tags
  let tags: string[] = [];
  
  // Split by commas
  const commaSplit = input.split(',').map(tag => tag.trim());
  
  commaSplit.forEach(item => {
    // For each comma-split item, check if it contains hashtags
    if (item.includes('#')) {
      // Extract hashtags
      const hashTags = item.match(/#[a-zA-Z0-9_]+/g) || [];
      tags = [...tags, ...hashTags.map(tag => tag.slice(1))]; // Remove # prefix
    } else if (item) {
      // If no hashtag but has content, add as is
      tags.push(item);
    }
  });
  
  // Filter out empty tags and duplicates
  return [...new Set(tags.filter(tag => tag.length > 0))];
};