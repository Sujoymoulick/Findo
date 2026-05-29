import React from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  limit: number;
  spent: number;
  icon: string;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  name, limit, spent, icon, color, onEdit, onDelete 
}) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;
  const remaining = limit - spent;

  const getProgressColor = () => {
    if (percentage < 70) return 'bg-emerald-500';
    if (percentage < 90) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  const statusText = isOver ? 'Exceeded' : 'Remaining';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-5">
          <div 
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{name}</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Category Budget</p>
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
          <button 
            onClick={onEdit}
            className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-brand-primary rounded-2xl transition-all shadow-sm"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="p-3 bg-red-50 dark:bg-red-900/20 text-red-400 hover:text-red-500 rounded-2xl transition-all shadow-sm"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{statusText}</span>
            <p className={`text-xl font-black tracking-tighter ${isOver ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
              ₹{Math.abs(remaining).toLocaleString()}
            </p>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Spent</span>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}</p>
          </div>
        </div>

        <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-full rounded-full ${getProgressColor()} shadow-lg relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Decorative accent */}
      <div 
        className="absolute -bottom-1 -right-1 w-24 h-24 blur-3xl opacity-10 rounded-full"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};
