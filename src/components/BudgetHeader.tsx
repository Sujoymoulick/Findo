import React from 'react';
import { Calendar, Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface BudgetHeaderProps {
  month: string;
  totalBudget: number;
  totalSpent: number;
  onMonthChange: (month: string) => void;
  onEditBudget: () => void;
  onQuickAdd: () => void;
}

export const BudgetHeader: React.FC<BudgetHeaderProps> = ({ 
  month, totalBudget, totalSpent, onMonthChange, onEditBudget, onQuickAdd
}) => {
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const isOver = totalSpent > totalBudget;

  const displayMonth = new Date(month + '-01').toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-2.5 bg-brand-primary/10 rounded-xl shadow-inner">
              <Calendar size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest uppercase">
              {displayMonth}
            </h1>
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-1">
            Monthly budget planning
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onQuickAdd}
            className="flex items-center gap-2 bg-brand-primary text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg hover:shadow-brand-primary/20 active:scale-95 group"
          >
            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 duration-500">
              <TrendingUp size={14} className="text-white" />
            </div>
            + Quick Spend
          </button>
          <input
            type="month"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-3 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary transition-all shadow-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budget Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group overflow-hidden relative"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500">
              <Wallet size={28} />
            </div>
            <button 
              onClick={onEditBudget}
              className="text-[10px] font-black text-brand-primary uppercase tracking-widest px-4 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              Update
            </button>
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Budget</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{totalBudget.toLocaleString()}</h2>
          <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-brand-primary/5 blur-3xl rounded-full" />
        </motion.div>

        {/* Total Spent Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group overflow-hidden relative"
        >
          <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500">
            <TrendingUp size={28} />
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Spent</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{totalSpent.toLocaleString()}</h2>
          <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-rose-500/5 blur-3xl rounded-full" />
        </motion.div>

        {/* Remaining Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group overflow-hidden relative"
        >
          <div className={`w-14 h-14 ${isOver ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500`}>
             {isOver ? <TrendingDown size={28} /> : <TrendingUp size={28} />}
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
             {isOver ? 'Debt' : 'Remaining'}
          </p>
          <h2 className={`text-3xl font-black tracking-tighter ${isOver ? 'text-amber-600' : 'text-emerald-500'}`}>
             ₹{Math.abs(remaining).toLocaleString()}
          </h2>
          <div className={`absolute -bottom-2 -left-2 w-24 h-24 ${isOver ? 'bg-amber-500/5' : 'bg-emerald-500/5'} blur-3xl rounded-full`} />
        </motion.div>
      </div>

      {/* Main Progress Bar */}
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative">
        <div className="flex justify-between items-end mb-6 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Overall Progress</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tracking monthly spending velocity</p>
          </div>
          <div className="text-right">
             <span className="text-4xl font-black text-brand-primary tracking-tighter">{Math.round(percentage)}%</span>
             <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Budget Used</p>
          </div>
        </div>
        
        <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${isOver ? 'from-amber-400 to-rose-500' : 'from-brand-primary to-brand-primary-light'} shadow-lg relative`}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse opacity-30" />
            <div className="absolute inset-0 overflow-hidden">
               <div className="absolute top-0 right-0 h-full w-20 bg-white/30 skew-x-[-20deg] translate-x-10" />
            </div>
          </motion.div>
        </div>
        
        {/* Subtle background pulse */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 -z-10" />
      </div>
    </div>
  );
};
