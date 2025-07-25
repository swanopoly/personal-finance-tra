import { useState } from 'react';
import { Budget, Category } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
  categories: Category[];
  existingBudgets: Budget[];
}

export function AddBudgetDialog({ open, onOpenChange, onAddBudget, categories, existingBudgets }: AddBudgetDialogProps) {
  const [limit, setLimit] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out categories that already have budgets
  const availableCategories = categories.filter(cat => 
    !existingBudgets.some(budget => budget.category === cat.name)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!limit || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const limitNum = parseFloat(limit);
    if (isNaN(limitNum) || limitNum <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    // Check if budget already exists for this category
    if (existingBudgets.some(budget => budget.category === category)) {
      toast.error('A budget already exists for this category');
      return;
    }

    setIsSubmitting(true);

    try {
      onAddBudget({
        category,
        limit: limitNum,
        period: 'monthly',
      });

      // Reset form
      setLimit('');
      setCategory('');
      
      toast.success('Budget created successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
        
        {availableCategories.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">
              All categories already have budgets. Delete an existing budget to create a new one.
            </p>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Monthly Budget Limit *</Label>
              <Input
                id="limit"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                This budget will track your monthly spending for the selected category. 
                You'll be notified when you approach or exceed the limit.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Budget'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}