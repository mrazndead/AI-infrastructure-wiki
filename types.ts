export enum ViewState {
  HOME = 'HOME',
  WIKI = 'WIKI',
  BLOG = 'BLOG',
  YOUTUBE = 'YOUTUBE',
  NVIDIA = 'NVIDIA'
}

export interface NavItem {
  label: string;
  view: ViewState;
  icon?: any;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  readTime: string;
  excerpt: string;
  content: string; // Markdown content
  image?: string;
  date: string;
  tags: string[];
  relatedIds?: string[];
  chartData?: any; // For embedded charts
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'comparison' | 'architecture';
  title: string;
  data: { 
    label: string; 
    value: number; 
    value2?: number;
    items?: string[]; // List of technologies in this layer
  }[];
  yAxisLabel?: string;
  seriesLabels?: [string, string];
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  views: string;
  duration: string;
  description: string;
  tags: string[];
}

export type CategoryMap = Record<string, Article[]>;