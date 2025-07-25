import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Expense, Budget, Category, DEFAULT_CATEGORIES } from '@/lib/types';
import { generateId } from '@/lib/finance-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpensesList } from '@/components/ExpensesList';
import { BudgetsOverview } from '@/components/BudgetsOverview';
import { TrendsChart } from '@/components/TrendsChart';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { AddBudgetDialog } from '@/components/AddBudgetDialog';
import { DashboardStats } from '@/components/DashboardStats';
import { Wallet, TrendingUp, Receipt, Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [expenses, setExpenses] = useKV<Expense[]>('expenses', []);
  const [budgets, setBudgets] = useKV<Budget[]>('budgets', []);
  const [categories, setCategories] = useKV<Category[]>('categories', []);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  // Initialize default categories if none exist
  if (categories.length === 0) {
    const defaultCategories = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));
    setCategories(defaultCategories);
  }

  const handleAddExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setExpenses(current => [...current, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(current => current.filter(expense => expense.id !== id));
  };

  const handleAddBudget = (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setBudgets(current => [...current, newBudget]);
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(current => current.filter(budget => budget.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Finance Tracker</h1>
            <p className="text-muted-foreground">Take control of your spending</p>
          </div>
          <Button 
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Expense
          </Button>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats expenses={expenses} budgets={budgets} categories={categories} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="expenses" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Receipt size={18} />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <Wallet size={18} />
              Budgets
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp size={18} />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-6">
            <ExpensesList 
              expenses={expenses} 
              categories={categories}
              onDeleteExpense={handleDeleteExpense}
            />
          </TabsContent>

          <TabsContent value="budgets" className="mt-6">
            <BudgetsOverview 
              budgets={budgets}
              expenses={expenses}
              categories={categories}
              onAddBudget={() => setIsAddBudgetOpen(true)}
              onDeleteBudget={handleDeleteBudget}
            />
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <TrendsChart expenses={expenses} categories={categories} />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddExpenseDialog
          open={isAddExpenseOpen}
          onOpenChange={setIsAddExpenseOpen}
          onAddExpense={handleAddExpense}
          categories={categories}
        />

        <AddBudgetDialog
          open={isAddBudgetOpen}
          onOpenChange={setIsAddBudgetOpen}
          onAddBudget={handleAddBudget}
          categories={categories}
          existingBudgets={budgets}
        />
      </div>
      <Toaster />
    </div>
  );
}

export default App;