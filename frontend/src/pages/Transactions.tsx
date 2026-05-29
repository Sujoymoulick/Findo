import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { Trash2, Search, Filter, Image as ImageIcon, Edit2, ChevronDown, ChevronRight, Calendar, CreditCard, RefreshCw, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { generatePDFReport } from '../lib/pdfGenerator';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Health', 'Utilities', 'Rent', 'Entertainment', 'Education', 'Other'];
const PAYMENT_METHODS = ['All', 'UPI', 'Cash', 'Card', 'NetBanking'];

export default function Transactions() {
  const { expenses, deleteExpense, budget, fetchExpenses } = useExpense();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.merchant.toLowerCase().includes(search.toLowerCase()) || 
                          (e.description && e.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesPayment = paymentFilter === 'All' || e.paymentMethod === paymentFilter;
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(e.date) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate = matchesDate && new Date(e.date) <= new Date(endDate);
    }
    
    return matchesSearch && matchesCategory && matchesPayment && matchesDate;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted');
      } catch (err) {
        toast.error('Failed to delete expense');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-sm">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white px-4">Transactions</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                setIsRefreshing(true);
                await fetchExpenses();
                setIsRefreshing(false);
                toast.success('Synced with database');
              }}
              disabled={isRefreshing}
              className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-all ${isRefreshing ? 'animate-spin opacity-50' : ''}`}
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => generatePDFReport(filteredExpenses, user, budget, { start: startDate, end: endDate })}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-brand-primary/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search merchants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary w-full transition-all"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary appearance-none transition-all w-full"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary appearance-none transition-all w-full"
            >
              <option value="All">All Payment Modes</option>
              {PAYMENT_METHODS.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="pl-8 pr-2 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary w-full transition-all text-xs"
                title="Start Date"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="pl-8 pr-2 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary w-full transition-all text-xs"
                title="End Date"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Merchant</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Payment</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Amount</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredExpenses.map((tx) => (
                <React.Fragment key={tx.id}>
                  <tr 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {expandedId === tx.id ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronRight size={16} className="text-gray-400"/>}
                        <span>{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{tx.merchant}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {tx.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 text-right whitespace-nowrap">
                      {formatCurrency(tx.amount, budget.currency)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/edit/${tx.id}`); }}
                          className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(tx.id); }}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === tx.id && (
                    <tr className="bg-gray-50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                      <td colSpan={6} className="px-4 sm:px-14 py-6">
                        <div className="flex flex-col lg:flex-row gap-8 text-sm">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tx.description && (
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{tx.description}</p>
                              </div>
                            )}
                            {tx.note && (
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Note:</span>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{tx.note}</p>
                              </div>
                            )}
                            {tx.aiScanned && (
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">AI Scan Confidence:</span>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">{tx.confidence || 'N/A'}</p>
                              </div>
                            )}
                            {tx.items && tx.items.length > 0 && (
                              <div className="sm:col-span-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Extracted Items:</span>
                                <ul className="list-disc pl-5 mt-1 text-gray-600 dark:text-gray-400">
                                  {tx.items.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                            {!tx.description && !tx.note && !tx.aiScanned && (!tx.items || tx.items.length === 0) && (
                              <div className="text-gray-500 dark:text-gray-500 italic">No additional details available.</div>
                            )}
                          </div>
                          
                          <div className="lg:w-1/3 flex flex-col pt-4 lg:pt-0 lg:border-l border-gray-200 dark:border-gray-700 lg:pl-8">
                             <div className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
                               <span>Receipt Vault</span>
                               <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Storage</span>
                             </div>
                             {tx.receiptImage ? (
                               <div className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-800 h-48 sm:h-56">
                                  <img src={tx.receiptImage} alt="Receipt Thumbnail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                     <button 
                                      onClick={() => window.open(tx.receiptImage, '_blank')} 
                                      className="bg-white text-brand-primary px-5 py-2.5 rounded-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all w-full flex items-center justify-center gap-2"
                                     >
                                      <ImageIcon size={18} /> View Authentic
                                     </button>
                                  </div>
                               </div>
                             ) : (
                               <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 h-48 sm:h-56 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                                  <ImageIcon className="w-8 h-8 mb-3 opacity-30" />
                                  <span className="text-xs font-medium text-gray-500">No original receipt attached to this record.</span>
                               </div>
                             )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative mb-6">
                        <Search className="w-16 h-16 text-gray-200 dark:text-gray-800" />
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute inset-0 bg-brand-primary/10 rounded-full blur-xl"
                        />
                      </div>
                      <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">No Transactions Found</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs text-center">
                        It looks like you haven't recorded any expenses yet or the filters don't match.
                      </p>
                      <button
                        onClick={() => navigate('/dashboard/add')}
                        className="mt-6 px-6 py-3 bg-brand-primary text-white rounded-[1.2rem] font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Add Your First Transaction
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
