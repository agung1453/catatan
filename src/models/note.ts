export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'work' | 'idea' | 'todo';
  createdAt: number;
  updatedAt: number;
}