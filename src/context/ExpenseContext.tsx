import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  merchant: string;
  date: string;
  category: string;
  items: string[];
  paymentMethod: string;
  receiptImage?: string;
  aiScanned: boolean;
  confidence?: string;
  transactionId?: string;
  userId: string;
  createdAt: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  budget: any;
  addExpense: (expense: any) => Promise<void>;
  updateExpense: (id: string, expense: any) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateBudget: (budget: any) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<any>({
    monthly: 50000,
    currency: 'INR',
    paymentMethod: 'UPI',
    categories: {}
  });
  const { user, isAuthenticated } = useAuth();

  const fetchExpenses = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) console.error('Error fetching expenses:', error);
    else {
      // Map snake_case database columns back to camelCase for the UI
      const mappedExpenses = (data || []).map(exp => ({
        ...exp,
        paymentMethod: exp.payment_method || exp.paymentMethod,
        receiptImage: exp.receipt_image || exp.receiptImage,
        aiScanned: exp.ai_scanned || exp.aiScanned,
        transactionId: exp.id, // Map the primary key 'id' to 'transactionId'
        userId: exp.user_id || exp.userId
      }));
      setExpenses(mappedExpenses);
    }
  };

  const fetchBudget = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching budget:', error);
    } else if (data) {
      setBudget(data);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setExpenses([]);
      return;
    }

    fetchExpenses();
    fetchBudget();

    // Set up real-time subscription for expenses
    const expensesSubscription = supabase
      .channel('expenses_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${user.id}` },
        () => {
          fetchExpenses();
        }
      )
      .subscribe((status) => {
        console.log(`Real-time: Budget Subscription status: ${status}`);
      });

    // Set up real-time subscription for budget
    const budgetSubscription = supabase
      .channel('budget_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'budgets', filter: `user_id=eq.${user.id}` },
        () => {
          fetchBudget();
        }
      )
      .subscribe((status) => {
        console.log(`Real-time: Expenses Subscription status: ${status}`);
      });

    return () => {
      supabase.removeChannel(expensesSubscription);
      supabase.removeChannel(budgetSubscription);
    };
  }, [isAuthenticated, user]);

  const addExpense = async (expense: any) => {
    if (!user) return;
    const { error } = await supabase
      .from('expenses')
      .insert([{
        amount: Number(expense.amount),
        currency: expense.currency,
        merchant: expense.merchant,
        date: expense.date,
        category: expense.category,
        payment_method: expense.paymentMethod, // Map to snake_case
        receipt_image: expense.receiptImage,   // Map to snake_case
        ai_scanned: expense.aiScanned,         // Map to snake_case
        confidence: expense.confidence,
        note: expense.note,
        items: expense.items,
        user_id: user.id
      }]);

    if (error) {
      console.error('CRITICAL: Supabase Insert Error:', error);
      throw error;
    }
  };

  const updateExpense = async (id: string, expense: any) => {
    const { error } = await supabase
      .from('expenses')
      .update({
        amount: Number(expense.amount),
        currency: expense.currency,
        merchant: expense.merchant,
        date: expense.date,
        category: expense.category,
        payment_method: expense.paymentMethod, // Map to snake_case
        receipt_image: expense.receiptImage,   // Map to snake_case
        ai_scanned: expense.aiScanned,         // Map to snake_case
        confidence: expense.confidence,
        note: expense.note,
        items: expense.items
      })
      .eq('id', id);

    if (error) {
      console.error('CRITICAL: Supabase Update Error:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    // Optimistic Update: Immediately remove from local state
    const previousExpenses = [...expenses];
    setExpenses(prev => prev.filter(e => e.id !== id));

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      // Rollback on error
      setExpenses(previousExpenses);
      throw error;
    }
  };

  const updateBudget = async (newBudget: any) => {
    if (!user) return;
    const { error } = await supabase
      .from('budgets')
      .upsert({
        monthly: Number(newBudget.monthly),
        currency: newBudget.currency,
        payment_method: newBudget.paymentMethod, // Map to snake_case
        categories: newBudget.categories,
        user_id: user.id
      });

    if (error) {
      console.error('CRITICAL: Supabase Budget Error:', error);
      throw error;
    }

    // Optimistically update the local state for immediate reflected UI on Dashboard
    setBudget({
      monthly: Number(newBudget.monthly),
      currency: newBudget.currency,
      paymentMethod: newBudget.paymentMethod,
      categories: newBudget.categories
    });
  };

  return (
    <ExpenseContext.Provider value={{ expenses, budget, addExpense, updateExpense, deleteExpense, updateBudget }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
