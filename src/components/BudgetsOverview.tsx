import { Expense, Budget, Category } from '@/lib/types';
import { formatCurrency, getBudgetProgress } from '@/lib/finance-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, AlertTriangle } from '@phosphor-icons/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BudgetsOverviewProps {
  budgets: Budget[];
  expenses: Expense[];
  categories: Category[];
  onAddBudget: () => void;
  onDeleteBudget: (id: string) => void;
}

export function BudgetsOverview({ budgets, expenses, categories, onAddBudget, onDeleteBudget }: BudgetsOverviewProps) {
  if (budgets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No budgets set</h3>
            <p className="text-muted-foreground mb-4">Create budgets to track your spending goals.</p>
            <Button onClick={onAddBudget} className="flex items-center gap-2">
              <Plus size={18} />
              Add Your First Budget
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Monthly Budgets</h2>
        <Button onClick={onAddBudget} variant="outline" className="flex items-center gap-2">
          <Plus size={18} />
          Add Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {budgets.map((budget) => {
          const progress = getBudgetProgress(expenses, budget);
          const category = categories.find(cat => cat.name === budget.category);
          
          return (
            <Card key={budget.id} className={`transition-colors ${progress.isOverBudget ? 'border-destructive' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category?.color || '#6b7280' }}
                    />
                    {budget.category}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {progress.isOverBudget && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this budget? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteBudget(budget.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">{formatCurrency(progress.spent)}</span>
                </div>
                
                <Progress 
                  value={progress.percentage} 
                  className={`h-2 ${progress.isOverBudget ? '[&>[data-state=complete]]:bg-destructive' : ''}`}
                />
                
                <div className="flex justify-between items-end">
                  <div className="text-sm">
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-medium">{formatCurrency(budget.limit)}</div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={progress.isOverBudget ? "destructive" : progress.percentage > 80 ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {progress.percentage.toFixed(0)}% used
                    </Badge>
                    {progress.isOverBudget ? (
                      <div className="text-xs text-destructive mt-1">
                        Over by {formatCurrency(Math.abs(progress.remaining))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(progress.remaining)} remaining
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}