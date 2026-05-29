import React, { useState, useEffect } from 'react';
import { Plus, Target, Sparkles, AlertCircle, Info, X, TrendingUp, ChevronRight } from 'lucide-react';
import { CategoryRadial } from '../components/CategoryRadial';
import { useBudget } from '../context/BudgetContext';
import { useExpense } from '../context/ExpenseContext';
import { BudgetHeader } from '../components/BudgetHeader';
import { CategoryCard } from '../components/CategoryCard';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { AIInsightCard } from '../components/AIInsightCard';
import { BudgetCharts } from '../components/BudgetCharts';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Budget() {
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const { budget, insights, loading, fetchBudget, createBudget, addCategory, updateCategory, deleteCategory, generateInsights } = useBudget();
  const { expenses } = useExpense();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  const { addExpense } = useExpense();

  useEffect(() => {
    fetchBudget(currentMonth);
  }, [currentMonth]);

  const handleUpdateBudget = async () => {
    if (newBudgetAmount) {
      try {
        await createBudget(currentMonth, Number(newBudgetAmount));
        toast.success('Budget updated!');
        setIsSetBudgetOpen(false);
        setNewBudgetAmount('');
      } catch (err) {
        toast.error('Failed to update budget');
      }
    }
  };

  const handleQuickAdd = async (data: { amount: string; category: string; merchant: string }) => {
    try {
      await addExpense({
        amount: Number(data.amount),
        category: data.category,
        merchant: data.merchant || 'Quick Log',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        currency: 'INR'
      });
      toast.success('Transaction added!');
      setIsQuickAddOpen(false);
    } catch (err) {
      toast.error('Failed to add transaction');
    }
  };

  const handleAddCategory = async (data: any) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success('Category updated');
      } else {
        await addCategory(data);
        toast.success('Category added');
      }
      setIsAddModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast.success('Category removed');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getCategorySpent = (categoryName: string) => {
    return monthlyExpenses
      .filter(e => e.category.toLowerCase().trim() === categoryName.toLowerCase().trim())
      .reduce((sum, e) => sum + e.amount, 0);
  };

  if (!budget) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center text-brand-primary mb-8 animate-bounce">
           <Target size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-tight max-w-md uppercase tracking-widest">
           No budget plan for <span className="text-brand-primary">{new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm font-bold uppercase tracking-widest text-xs">
           Start your financial journey by setting a monthly goal.
        </p>
        <button 
          onClick={() => setIsSetBudgetOpen(true)}
          className="bg-brand-primary text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-brand-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 uppercase tracking-widest text-sm flex items-center gap-3"
        >
          <Plus size={20} />
          Create Monthly Budget
        </button>

        <AnimatePresence>
          {isSetBudgetOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSetBudgetOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] border border-white/20 dark:border-slate-800 shadow-2xl p-10 md:p-12"
              >
                <div className="space-y-10">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center text-brand-primary mx-auto mb-6">
                      <Target size={40} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Monthly Target</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2">Set your total spend limit</p>
                  </div>

                  <div className="relative group">
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="text-3xl font-black">₹</span>
                    </div>
                    <input
                      autoFocus
                      type="number"
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50/50 dark:bg-slate-800/30 border-2 border-transparent focus:border-brand-primary/30 rounded-[2rem] py-10 pl-16 pr-8 text-5xl font-black text-slate-900 dark:text-white text-center outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={handleUpdateBudget}
                    className="w-full bg-brand-primary text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Set Budget
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <BudgetHeader 
        month={currentMonth}
        totalBudget={budget.total_budget}
        totalSpent={totalSpent}
        onMonthChange={setCurrentMonth}
        onEditBudget={() => {
          setNewBudgetAmount(budget.total_budget.toString());
          setIsSetBudgetOpen(true);
        }}
        onQuickAdd={() => setIsQuickAddOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Categories Section */}
        <div className="lg:col-span-12 space-y-8">
           <div className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Budget Categories</h2>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Managing category-wise limits</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="p-4 bg-brand-primary text-white rounded-3xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
              >
                 <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none">Add Category</span>
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {budget.budget_categories?.map((cat) => (
                  <CategoryCard 
                    key={cat.id}
                    name={cat.name}
                    limit={cat.limit_amount}
                    spent={getCategorySpent(cat.name)}
                    icon={cat.icon}
                    color={cat.color}
                    onEdit={() => {
                        setEditingCategory(cat);
                        setIsAddModalOpen(true);
                    }}
                    onDelete={() => handleDeleteCategory(cat.id)}
                  />
                ))}
              </AnimatePresence>
           </div>
        </div>

        {/* Charts & AI Section */}
        <div className="lg:col-span-12 space-y-12">
            <div className="px-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase mb-1">Financial Analytics</h2>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Visualizing your monthly velocity</p>
            </div>
            
            <BudgetCharts 
               categories={budget.budget_categories || []}
               expenses={expenses.filter(e => e.date.startsWith(currentMonth))}
            />

            <div className="px-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase mb-1">AI Financial Advisor</h2>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Personalized GPT-4o insights powered by FINDO</p>
            </div>
            
            <AIInsightCard 
               insights={insights}
               loading={loading}
               onGenerate={() => generateInsights(currentMonth)}
            />
        </div>
      </div>

      {isAddModalOpen && (
        <AddCategoryModal 
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingCategory(null);
          }}
          onAdd={handleAddCategory}
          initialData={editingCategory}
        />
      )}

      {/* Quick Add Modal */}
      <AnimatePresence>
        {isQuickAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickAddOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] border border-white/20 dark:border-slate-800 shadow-2xl p-8 md:p-12 overflow-hidden"
            >
              <button 
                onClick={() => setIsQuickAddOpen(false)}
                className="absolute top-6 right-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-3 text-brand-primary mb-2">
                    <TrendingUp size={24} />
                    <h2 className="text-2xl font-black uppercase tracking-widest">Quick Spend</h2>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Log a transaction instantly</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                      <span className="text-2xl font-black">₹</span>
                    </div>
                    <input
                      id="quick-amount"
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-slate-50/50 dark:bg-slate-800/30 border-2 border-transparent focus:border-brand-primary/30 rounded-3xl py-6 pl-14 pr-6 text-3xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none transition-all shadow-inner"
                    />
                  </div>

                  <input
                    id="quick-merchant"
                    type="text"
                    placeholder="Where did you spend?"
                    className="w-full bg-slate-50/50 dark:bg-slate-800/30 border-2 border-transparent focus:border-brand-primary/30 rounded-2xl py-4 px-6 font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none transition-all"
                  />
                </div>

                <div className="flex justify-center py-4">
                  <CategoryRadial 
                    onSelect={(cat) => {
                      (window as any).selectedQuickCategory = cat;
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    const amountInput = document.getElementById('quick-amount') as HTMLInputElement;
                    const merchantInput = document.getElementById('quick-merchant') as HTMLInputElement;
                    const category = (window as any).selectedQuickCategory || 'Other';
                    if (amountInput.value) {
                      handleQuickAdd({ 
                        amount: amountInput.value, 
                        merchant: merchantInput.value, 
                        category 
                      });
                    } else {
                      toast.error('Please enter an amount');
                    }
                  }}
                  className="w-full bg-brand-primary text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all flex items-center justify-center gap-3 group active:scale-95"
                >
                  Save Transaction
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Set Budget Modal */}
      <AnimatePresence>
        {isSetBudgetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSetBudgetOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] border border-white/20 dark:border-slate-800 shadow-2xl p-10 md:p-12"
            >
              <button 
                onClick={() => setIsSetBudgetOpen(false)}
                className="absolute top-6 right-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="space-y-10">
                <div className="text-center">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center text-brand-primary mx-auto mb-6">
                    <Target size={40} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Monthly Target</h2>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2">Adjust your total spend limit</p>
                </div>

                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                    <span className="text-3xl font-black">₹</span>
                  </div>
                  <input
                    autoFocus
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="0.00"
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateBudget()}
                    className="w-full bg-slate-50/50 dark:bg-slate-800/30 border-2 border-transparent focus:border-brand-primary/30 rounded-[2rem] py-10 pl-16 pr-8 text-5xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none transition-all shadow-inner text-center"
                  />
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleUpdateBudget}
                    className="w-full bg-brand-primary text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    Save Budget
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={() => setIsSetBudgetOpen(false)}
                    className="w-full py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-600 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
