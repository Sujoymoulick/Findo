import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useExpense } from './ExpenseContext';
import { supabase } from '../lib/supabase';

interface BudgetCategory {
  id: string;
  budget_id: string;
  name: string;
  limit_amount: number;
  spent: number;
  icon: string;
  color: string;
}

interface Budget {
  id: string;
  user_id: string;
  month: string;
  total_budget: number;
  budget_categories: BudgetCategory[];
}

interface BudgetInsight {
  summary: string;
  alerts: string[];
  suggestions: string[];
  nextMonthBudget: Record<string, number>;
  savingsScore: number;
}

interface BudgetContextType {
  budget: Budget | null;
  insights: BudgetInsight | null;
  loading: boolean;
  fetchBudget: (month: string) => Promise<void>;
  createBudget: (month: string, total_budget: number) => Promise<void>;
  addCategory: (category: Omit<BudgetCategory, 'id' | 'spent'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<BudgetCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  generateInsights: (month: string) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [insights, setInsights] = useState<BudgetInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const { expenses } = useExpense();

  const fetchBudget = async (month: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*, budget_categories(*)')
        .eq('user_id', user?.id)
        .eq('month', month)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setBudget(data || null);
    } catch (err) {
      console.error('Fetch budget error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (month: string, total_budget: number) => {
    if (!token || !user) return;
    try {
      const { data, error } = await supabase
        .from('budgets')
        .upsert({ month, total_budget, user_id: user?.id }, { onConflict: 'user_id, month' })
        .select()
        .single();

      if (error) throw error;
      setBudget(data);
    } catch (err) {
      console.error('Create budget error:', err);
      throw err;
    }
  };

  const addCategory = async (category: Omit<BudgetCategory, 'id' | 'spent'>) => {
    if (!token || !budget) return;
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .insert([{ ...category, budget_id: budget.id }])
        .select()
        .single();

      if (error) throw error;
      setBudget(prev => prev ? {
        ...prev,
        budget_categories: [...(prev.budget_categories || []), data]
      } : null);
    } catch (err) {
      console.error('Add category error:', err);
      throw err;
    }
  };

  const updateCategory = async (id: string, data: Partial<BudgetCategory>) => {
    if (!token) return;
    try {
      const { data: updated, error } = await supabase
        .from('budget_categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setBudget(prev => prev ? {
        ...prev,
        budget_categories: prev.budget_categories.map(c => c.id === id ? updated : c)
      } : null);
    } catch (err) {
      console.error('Update category error:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!token) return;
    try {
      const { error } = await supabase
        .from('budget_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBudget(prev => prev ? {
        ...prev,
        budget_categories: prev.budget_categories.filter(c => c.id !== id)
      } : null);
    } catch (err) {
      console.error('Delete category error:', err);
      throw err;
    }
  };

  const generateInsights = async (month: string) => {
    if (!token || !budget) return;
    setLoading(true);
    try {
      const response = await axios.post(`/api/budget/${month}/insights`, { budgetData: budget }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsights(response.data);
    } catch (err) {
      console.error('Generate insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync category spending with expenses
  useEffect(() => {
    if (!budget || !expenses.length) return;

    const syncSpending = async () => {
      console.log('--- SYNC SPENDING START ---');
      console.log('Budget Month:', budget.month);
      console.log('Total Expenses:', expenses.length);

      let needsStateUpdate = false;
      const updatedCategories = budget.budget_categories.map(cat => {
        const matchingExpenses = expenses.filter(exp => {
          const hasSameMonth = exp.date.startsWith(budget.month);
          const hasSameCategory = exp.category.toLowerCase().trim() === cat.name.toLowerCase().trim();
          return hasSameMonth && hasSameCategory;
        });

        const spent = matchingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        console.log(`Category: ${cat.name} | Spent: ${spent} | Found: ${matchingExpenses.length}`);

        if (cat.spent !== spent) {
          needsStateUpdate = true;
          updateCategory(cat.id, { spent });
          return { ...cat, spent };
        }
        return cat;
      });

      if (needsStateUpdate) {
        console.log('--- SPENDING UPDATED ---');
        setBudget(prev => prev ? { ...prev, budget_categories: updatedCategories } : null);
      }
    };

    syncSpending();
  }, [expenses, budget?.id, budget?.month]);

  return (
    <BudgetContext.Provider value={{
      budget, insights, loading,
      fetchBudget, createBudget,
      addCategory, updateCategory, deleteCategory,
      generateInsights
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
