import { Expense, Budget, Category } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDateShort = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthExpenses = (expenses: Expense[], month?: string): Expense[] => {
  const targetMonth = month || getCurrentMonth();
  return expenses.filter(expense => {
    const expenseMonth = expense.date.substring(0, 7); // YYYY-MM
    return expenseMonth === targetMonth;
  });
};

export const getCategoryTotal = (expenses: Expense[], category: string): number => {
  return expenses
    .filter(expense => expense.category === category)
    .reduce((total, expense) => total + expense.amount, 0);
};

export const getBudgetProgress = (expenses: Expense[], budget: Budget): {
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
} => {
  const monthExpenses = getMonthExpenses(expenses);
  const spent = getCategoryTotal(monthExpenses, budget.category);
  const remaining = budget.limit - spent;
  const percentage = (spent / budget.limit) * 100;
  const isOverBudget = spent > budget.limit;

  return {
    spent,
    remaining,
    percentage: Math.min(percentage, 100),
    isOverBudget,
  };
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};