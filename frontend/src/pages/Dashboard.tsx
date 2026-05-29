import React, { useEffect, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
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

  const summaryCards = [
    { 
      label: 'Total Budget', 
      value: summary.budget, 
      icon: <Wallet className="text-emerald-500" />, 
      color: 'bg-emerald-500/10' 
    },
    { 
      label: 'Total Expense', 
      value: summary.totalSpent, 
      icon: <TrendingUp className="text-rose-500" />, 
      color: 'bg-rose-500/10' 
    },
    { 
      label: 'Remaining', 
      value: summary.remaining, 
      icon: <CreditCard className="text-blue-500" />, 
      color: 'bg-blue-500/10' 
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-[2rem] flex items-center gap-6 shadow-xl shadow-indigo-500/5 group hover:scale-[1.02] transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              {React.cloneElement(card.icon as React.ReactElement, { size: 28 })}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(card.value, budgetPlan?.currency || 'INR')}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/5"
        >
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-8">Expense By Category</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={10} 
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
                    borderRadius: '16px', 
                    border: 'none',
                    color: '#fff',
                    padding: '12px 16px'
                  }} 
                  formatter={(value: number) => [`${formatCurrency(value, budgetPlan?.currency || 'INR')}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {formatCurrency(summary.totalSpent, budgetPlan?.currency || 'INR')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {categoryData.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.name] || DEFAULT_COLOR }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{cat.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/5"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Spending Trends</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Expense</span>
              </div>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} 
                  dy={15}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderRadius: '16px', 
                    border: 'none',
                    color: '#fff',
                    padding: '12px 16px'
                  }} 
                  formatter={(value: number) => [`${formatCurrency(value, budgetPlan?.currency || 'INR')}`, 'Spent']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/5">
        <div className="flex justify-between items-center mb-8 px-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Recent Transactions</h3>
          <button onClick={() => navigate('/dashboard/transactions')} className="text-xs font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {expenses.slice(0, 6).map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/40 dark:bg-white/[0.02] p-4 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg bg-blue-500/10 text-blue-500">
                    {tx.merchant.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tx.merchant}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 dark:text-white">
                    -{formatCurrency(tx.amount, budgetPlan?.currency || 'INR')}
                  </p>
                  <p className="text-[9px] text-slate-500 font-medium">{format(new Date(tx.date), 'MMM dd')}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
