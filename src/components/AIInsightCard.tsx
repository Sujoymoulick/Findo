import React from 'react';
import { Sparkles, AlertCircle, Lightbulb, TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIInsightCardProps {
  insights: any;
  loading: boolean;
  onGenerate: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insights, loading, onGenerate }) => {
  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[400px] flex flex-col items-center justify-center gap-6 overflow-hidden relative">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center relative">
          <Sparkles className="text-brand-primary w-10 h-10 animate-pulse" />
          <div className="absolute inset-0 bg-brand-primary/20 rounded-3xl animate-ping opacity-20" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Consulting AI Advisor</h3>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">Analyzing your spending behavior...</p>
        </div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-primary/5 blur-3xl rounded-full" />
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[400px] flex flex-col items-center justify-center gap-6 overflow-hidden relative text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400">
           <Sparkles size={40} />
        </div>
        <div className="space-y-4 max-w-sm">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">Get AI Insights</h3>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
             FINDO uses GPT-4o to analyze your budget and provide personalized saving strategies.
          </p>
          <button 
            onClick={onGenerate}
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-xs"
          >
            Generate My Advice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Savings Score */}
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-slate-800 shadow-xl h-full flex flex-col items-center justify-center gap-4 text-center relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Your Savings Efficiency</p>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-100 dark:text-slate-800"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * insights.savingsScore) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="text-brand-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{insights.savingsScore}</span>
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Score</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-brand-primary/20 group-hover:rotate-12 transition-transform duration-500">
             <Sparkles size={40} />
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-brand-primary text-white rounded-[2.5rem] p-10 shadow-2xl shadow-brand-primary/30 flex flex-col justify-center gap-6 relative overflow-hidden group">
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                 <Info size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">AI Monthly Summary</h3>
           </div>
           <p className="text-2xl font-bold leading-tight tracking-tight">
              "{insights.summary}"
           </p>
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Alerts Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <AlertCircle className="text-rose-500" size={20} />
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Action Required</h4>
           </div>
           {insights.alerts.map((alert: string, idx: number) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="bg-rose-50 dark:bg-rose-900/10 p-5 rounded-3xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-4 shadow-sm"
             >
                <div className="p-2 bg-rose-500 rounded-lg text-white shadow-lg shadow-rose-500/30 shrink-0">
                   <TrendingUp size={14} className="rotate-45" />
                </div>
                <p className="text-sm font-bold text-rose-700 dark:text-rose-400 leading-relaxed">{alert}</p>
             </motion.div>
           ))}
        </div>

        {/* Suggestions Section */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <Lightbulb className="text-amber-400" size={20} />
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">AI Smart Tips</h4>
           </div>
           {insights.suggestions.map((tip: string, idx: number) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-4 shadow-sm"
             >
                <div className="p-2 bg-amber-400 rounded-lg text-white shadow-lg shadow-amber-400/30 shrink-0">
                   <Sparkles size={14} />
                </div>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400 leading-relaxed">{tip}</p>
             </motion.div>
           ))}
        </div>
      </div>
      
      {/* Recommended Next Month */}
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-slate-800 shadow-xl">
         <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 ml-2">Recommended Next Month Budget</h4>
         <div className="flex flex-wrap gap-4">
            {Object.entries(insights.nextMonthBudget || {}).map(([cat, val]: [string, any], idx) => (
              <div key={cat} className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 shadow-inner min-w-[140px]">
                 <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{cat}</span>
                 <span className="text-lg font-black text-slate-900 dark:text-white tracking-widest">₹{val.toLocaleString()}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
