export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly'; // Currently only monthly
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Food & Dining', color: '#ef4444', icon: 'fork-knife' },
  { name: 'Transportation', color: '#3b82f6', icon: 'car' },
  { name: 'Shopping', color: '#8b5cf6', icon: 'shopping-bag' },
  { name: 'Entertainment', color: '#f59e0b', icon: 'film-strip' },
  { name: 'Bills & Utilities', color: '#10b981', icon: 'receipt' },
  { name: 'Healthcare', color: '#ec4899', icon: 'heart' },
  { name: 'Travel', color: '#06b6d4', icon: 'airplane' },
  { name: 'Other', color: '#6b7280', icon: 'dots-three' }
];