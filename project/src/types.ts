export interface Note {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number;
  saved: boolean;
  category?: string;
  color?: string;
  priority?: 'low' | 'medium' | 'high';
  format?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export interface User {
  email: string;
  password: string;
  name: string;
}

export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';

export type Filter = 'all' | 'saved' | 'active';

export type SortOption = 'created' | 'expiry' | 'priority';

export const CATEGORIES = [
  'Personal',
  'Work',
  'Shopping',
  'Ideas',
  'Tasks',
  'Other'
] as const;

export const COLORS = [
  'default',
  'red',
  'yellow',
  'green',
  'blue',
  'purple'
] as const;

export type Category = typeof CATEGORIES[number];
export type Color = typeof COLORS[number];

export const MAX_CHARS = 500;