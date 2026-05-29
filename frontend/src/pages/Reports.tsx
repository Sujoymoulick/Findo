import React, { useEffect, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import axios from 'axios';
import { BrainCircuit, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { generatePDFReport } from '../lib/pdfGenerator';

export default function Reports() {
  const { expenses, budget } = useExpense();
  const { user, token } = useAuth();
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (expenses.length === 0) return;
      setLoadingInsights(true);
      try {
        const res = await axios.post('/api/ai/insights', 
          { expenses, budget },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInsights(res.data);
      } catch (err) {
        console.error('Failed to fetch insights', err);
      } finally {
        setLoadingInsights(false);
      }
    };
    if (token) fetchInsights();
  }, [expenses, budget, token]);

  // Monthly trend data (last 6 months)
  const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), i)).reverse();
  const monthlyTrendData = last6Months.map(date => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    });
    return {
      month: format(date, 'MMM yyyy'),
      amount: monthExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  });

  // Category breakdown
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Category breakdown logic: Show any category that has spent money OR has a budget limit
  const activeCategories = Array.from(new Set([
    ...Object.keys(budget?.categories || {}),
    ...currentMonthExpenses.map(e => e.category)
  ]));

  const categoryBreakdown = activeCategories.map(cat => {
    const allocated = budget?.categories?.[cat] || 0;
    const spent = currentMonthExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    const remaining = allocated - spent;
    return { category: cat, allocated, spent, remaining };
  }).filter(c => c.allocated > 0 || c.spent > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Insights</h1>
        <button
          onClick={() => generatePDFReport(expenses, user, budget)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-xl"
        >
          <Download size={18} />
          <span>Full Report PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly Spending Trend (Last 6 Months)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis fontSize={12} tickFormatter={(value) => formatCurrency(value, budget.currency)} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => formatCurrency(value, budget.currency)} 
                  />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Category Breakdown (Current Month)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium text-right">Allocated</th>
                    <th className="pb-3 font-medium text-right">Spent</th>
                    <th className="pb-3 font-medium text-right">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {categoryBreakdown.map((row) => (
                    <tr key={row.category} className={row.remaining < 0 ? 'bg-red-50/50 dark:bg-red-900/20' : ''}>
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{row.category}</td>
                      <td className="py-3 text-right text-gray-600 dark:text-gray-300">{formatCurrency(row.allocated, budget.currency)}</td>
                      <td className="py-3 text-right text-gray-900 dark:text-white font-medium">{formatCurrency(row.spent, budget.currency)}</td>
                      <td className={`py-3 text-right font-bold ${row.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {row.remaining > 0 ? '+' : ''}{formatCurrency(row.remaining, budget.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden relative border border-white/5 font-outfit">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <BrainCircuit size={160} />
            </div>
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-2 mb-6">
                <BrainCircuit className="text-indigo-200" size={24} />
                <h3 className="text-xl font-bold">AI Insights</h3>
              </div>

              {loadingInsights ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-4 bg-white/20 rounded w-5/6"></div>
                  <div className="h-4 bg-white/20 rounded w-2/3"></div>
                </div>
              ) : insights ? (
                <div className="space-y-6">
                  <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Discipline Rating</p>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${insights.disciplineRating === 'Excellent' || insights.disciplineRating === 'Good' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {insights.disciplineRating === 'Excellent' || insights.disciplineRating === 'Good' ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <AlertCircle size={24} />
                        )}
                      </div>
                      <span className="text-3xl font-black italic tracking-tighter">{insights.disciplineRating}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-indigo-200 text-sm flex items-center"><TrendingUp size={14} className="mr-1" /> Top Overspent</p>
                      <p className="font-semibold text-lg">{insights.topOverspentCategory || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-indigo-200 text-sm flex items-center"><TrendingDown size={14} className="mr-1" /> Projected Total</p>
                      <p className="font-semibold text-lg">{formatCurrency(insights.projectedTotal || 0, budget.currency)}</p>
                    </div>
                    <div>
                      <p className="text-indigo-200 text-sm">Peak Spending Day</p>
                      <p className="font-semibold text-lg">{insights.peakSpendingDay || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20">
                    <p className="text-indigo-200 text-sm mb-3">Actionable Tips</p>
                    <ul className="space-y-3">
                      {insights.savingsTips?.map((tip: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2 text-sm bg-white/5 p-3 rounded-lg">
                          <span className="text-indigo-300 font-bold mt-0.5">•</span>
                          <span className="leading-snug">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-indigo-200">Not enough data to generate insights yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
