import React, { useEffect, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  CreditCard, 
  Send, 
  MoreHorizontal,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS: Record<string, string> = {
  'Food': '#10b981',
  'Shopping': '#8b5cf6',
  'Transport': '#3b82f6',
  'Housing': '#f59e0b',
  'Entertainment': '#ec4899',
  'Health': '#ef4444',
  'Other': '#64748b'
};

const DEFAULT_COLOR = '#4f46e5';

import { useBudget } from '../context/BudgetContext';

export default function Dashboard() {
  const { expenses } = useExpense();
  const { budget: budgetPlan, fetchBudget } = useBudget();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ totalSpent: 0, remaining: 0, budget: 0, percentage: 0 });

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    fetchBudget(currentMonth);
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentMonthNum = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonthNum && d.getFullYear() === currentYear;
    });

    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlyBudget = budgetPlan?.total_budget || 0;
    
    setSummary({
      totalSpent,
      remaining: monthlyBudget - totalSpent < 0 ? 0 : monthlyBudget - totalSpent,
      budget: monthlyBudget,
      percentage: monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0
    });
  }, [expenses, budgetPlan]);

  const categoryData = expenses.reduce((acc: any[], exp) => {
    const existing = acc.find(item => item.name === exp.category);
    if (existing) {
      existing.value += exp.amount;
    } else {
      acc.push({ name: exp.category, value: exp.amount });
    }
    return acc;
  }, []);

  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayExpenses = expenses.filter(e => isSameDay(new Date(e.date), d));
    return {
      name: format(d, 'EEE'),
      amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  });

  const recentTransactions = expenses.slice(0, 5);

  let themeClass = 'from-indigo-600 via-indigo-700 to-brand-primary';
  let badgeClass = 'bg-white/20';
  let alertMessage = null;

  if (summary.percentage >= 100) {
    themeClass = 'from-rose-600 via-red-600 to-rose-400';
    badgeClass = 'bg-red-900/40 border border-red-200/20';
    alertMessage = "Over Budget!";
  } else if (summary.percentage >= 80) {
    themeClass = 'from-amber-500 via-orange-500 to-yellow-500';
    badgeClass = 'bg-orange-900/40 border border-orange-200/20';
    alertMessage = "Approaching Limit";
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      {/* Header with Real User Name & High Quality Avatar */}
      <div className="flex justify-between items-center px-6 pt-4">
        <div className="space-y-1">
          <p className="text-brand-primary dark:text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">Welcome Back</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {user?.name || 'User'}
          </h1>
        </div>
        <div className="relative group">
          <div className="w-16 h-16 rounded-3xl border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden transform group-hover:rotate-6 transition-transform duration-500">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff&size=128&semibold=true`} 
              className="w-full h-full object-cover" 
              alt="avatar" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
        </div>
      </div>

      {/* Modern Wallet Card - Dynamic Smart Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4"
      >
        <div className={`bg-gradient-to-br ${themeClass} p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group transition-all duration-500`}>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/80 text-sm font-medium">Remaining Budget</p>
                {alertMessage && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass} backdrop-blur-md flex items-center gap-1 animate-pulse`}>
                    <AlertTriangle className="w-3 h-3" /> {alertMessage}
                  </span>
                )}
              </div>
              <h3 className="text-4xl font-extrabold tracking-tight mb-4">
                {formatCurrency(summary.remaining, budgetPlan?.currency || 'INR')}
              </h3>
            </div>
            <div className={`p-2 rounded-xl backdrop-blur-md ${badgeClass}`}>
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mt-4 relative z-10">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="opacity-80">Spent: {formatCurrency(summary.totalSpent, budgetPlan?.currency || 'INR')}</span>
              <span className="opacity-80">{summary.percentage.toFixed(0)}% Utilized</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(summary.percentage, 100)}%` }}
              />
            </div>
          </div>


          {/* Decorative Orbs */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl animate-pulse" />
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="px-4 space-y-6">
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">This Week</h3>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderRadius: '12px', 
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }} 
                  formatter={(value: number) => [`${formatCurrency(value, budgetPlan?.currency || 'INR')}`, 'Spent']}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 6, 6]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Categories</h3>
          </div>
          
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLOR} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderRadius: '12px', 
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold'
                  }} 
                  formatter={(value: number) => [`${formatCurrency(value, budgetPlan?.currency || 'INR')}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-gray-400 text-xs font-medium">Spent</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                {formatCurrency(summary.totalSpent, budgetPlan?.currency || 'INR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {['Food', 'Shopping', 'Transport'].map((cat) => {
               const catSpent = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
               if (catSpent === 0) return null;
               return (
                <div key={cat} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                    <span className="text-[10px] font-bold text-gray-500 tracking-tighter">{cat}</span>
                  </div>
                  <p className="text-xs font-black text-gray-900 dark:text-white">
                    {formatCurrency(catSpent, budgetPlan?.currency || 'INR')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 pb-12">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transactions</h3>
          <button className="text-sm font-bold text-indigo-600">See All</button>
        </div>
        
        <div className="space-y-4">
          <AnimatePresence>
            {recentTransactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900/50 p-4 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
                    CATEGORY_COLORS[tx.category] ? 'bg-opacity-10' : 'bg-indigo-100'
                  }`} style={{ backgroundColor: `${CATEGORY_COLORS[tx.category]}20`, color: CATEGORY_COLORS[tx.category] || DEFAULT_COLOR }}>
                    {tx.merchant.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{tx.merchant}</h4>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter flex items-center gap-2 mt-0.5">
                      <span>{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span 
                        className="px-1.5 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1"
                        style={{ backgroundColor: `${CATEGORY_COLORS[tx.category]}15`, color: CATEGORY_COLORS[tx.category] || DEFAULT_COLOR }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[tx.category] || DEFAULT_COLOR }} />
                        {tx.category}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 dark:text-white text-lg">
                    -{formatCurrency(tx.amount, budgetPlan?.currency || 'INR')}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {recentTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Wallet className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p className="text-sm font-medium">Your wallet is waiting for its first transaction</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
