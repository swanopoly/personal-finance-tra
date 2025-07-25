import { Expense, Budget, Category } from '@/lib/types';
import { formatCurrency, getCurrentMonth, getMonthExpenses, getCategoryTotal } from '@/lib/finance-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from '@phosphor-icons/react';

interface DashboardStatsProps {
  expenses: Expense[];
  budgets: Budget[];
  categories: Category[];
}

export function DashboardStats({ expenses, budgets, categories }: DashboardStatsProps) {
  const currentMonthExpenses = getMonthExpenses(expenses);
  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const budgetRemaining = totalBudget - totalSpent;

  // Calculate previous month for comparison
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
  const prevMonthExpenses = getMonthExpenses(expenses, prevMonthStr);
  const prevMonthTotal = prevMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyChange = totalSpent - prevMonthTotal;
  const monthlyChangePercent = prevMonthTotal > 0 ? (monthlyChange / prevMonthTotal) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent This Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {monthlyChange >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
            )}
            {monthlyChangePercent > 0 ? '+' : ''}{monthlyChangePercent.toFixed(1)}% from last month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(budgetRemaining)}</div>
          <div className="text-xs text-muted-foreground">
            {totalBudget > 0 ? `${((budgetRemaining / totalBudget) * 100).toFixed(1)}% of budget left` : 'No budgets set'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions This Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentMonthExpenses.length}</div>
          <div className="text-xs text-muted-foreground">
            {currentMonthExpenses.length > 0 ? 
              `Avg ${formatCurrency(totalSpent / currentMonthExpenses.length)} per transaction` : 
              'No transactions yet'
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {(() => {
            const categoryTotals = categories.map(cat => ({
              name: cat.name,
              total: getCategoryTotal(currentMonthExpenses, cat.name)
            })).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);
            
            const topCategory = categoryTotals[0];
            
            return topCategory ? (
              <>
                <div className="text-2xl font-bold">{formatCurrency(topCategory.total)}</div>
                <div className="text-xs text-muted-foreground">{topCategory.name}</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">-</div>
                <div className="text-xs text-muted-foreground">No expenses yet</div>
              </>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}