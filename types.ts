export enum AppView {
  DASHBOARD = 'DASHBOARD',
  BIBLE = 'BIBLE',
  LYRICS = 'LYRICS',
  SERMON_ASSISTANT = 'SERMON_ASSISTANT'
}

export interface BiblePassage {
  reference: string;
  text: string;
  translation: string;
  language: string;
  summary?: string;
}

export interface SongLyrics {
  title: string;
  artist: string;
  lyrics: string; // Stanzas separated by double newlines
  themes: string[];
  sources?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DailyDevotional {
  date: string;
  title: string;
  scripture: string;
  content: string;
  prayer: string;
}