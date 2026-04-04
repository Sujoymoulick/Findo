import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ReceiptUpload from '../components/ReceiptUpload';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Health', 'Utilities', 'Rent', 'Entertainment', 'Education', 'Other'];
const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'NetBanking'];

import { CategoryRadial } from '../components/CategoryRadial';

export default function AddExpense() {
  const [mode, setMode] = useState<'manual' | 'scan' | 'quick'>('quick');
  const { addExpense, updateExpense, expenses } = useExpense();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
    merchant: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    paymentMethod: 'UPI',
    description: '',
    note: '',
    items: [] as string[],
    receiptImage: '',
    receiptPublicId: '',
    aiScanned: false,
    confidence: ''
  });

  useEffect(() => {
    if (id) {
      const expenseToEdit = expenses.find(e => e.id === id);
      if (expenseToEdit) {
        setFormData({
          amount: expenseToEdit.amount.toString(),
          currency: expenseToEdit.currency || 'INR',
          merchant: expenseToEdit.merchant || '',
          date: expenseToEdit.date ? new Date(expenseToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: expenseToEdit.category || 'Food',
          paymentMethod: expenseToEdit.paymentMethod || 'UPI',
          description: expenseToEdit.description || '',
          note: expenseToEdit.note || '',
          items: expenseToEdit.items || [],
          receiptImage: expenseToEdit.receiptImage || '',
          receiptPublicId: expenseToEdit.receiptPublicId || '',
          aiScanned: expenseToEdit.aiScanned || false,
          confidence: expenseToEdit.confidence || ''
        });
        setMode('manual');
      }
    }
  }, [id, expenses]);

  const handleUploadSuccess = (data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      amount: data.amount || prev.amount,
      aiScanned: true
    }));
    // Stay in scan mode to show results, or switch if preferred. 
    // The user wants it "in scan recept option".
  };

  const handleReceiptDelete = () => {
    setFormData(prev => ({
      ...prev,
      receiptImage: '',
      receiptPublicId: '',
      aiScanned: false,
      confidence: '',
      items: []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateExpense(id, {
          ...formData,
          amount: Number(formData.amount)
        });
        toast.success('Expense updated successfully!');
      } else {
        await addExpense({
          ...formData,
          amount: Number(formData.amount)
        });
        toast.success('Expense added successfully!');
      }
      navigate('/dashboard/transactions');
    } catch (err: any) {
      const message = err.message || (id ? 'Failed to update expense' : 'Failed to add expense');
      toast.error(message);
      console.error('Submit Error:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-widest uppercase">
          {id ? 'Edit Expense' : 'Add Expense'}
        </h1>
        <div className="flex w-full sm:w-auto p-1 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-inner border border-white/10">
          <button
            onClick={() => setMode('quick')}
            className={`flex-1 sm:px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${mode === 'quick' ? 'bg-white dark:bg-slate-700 shadow-xl text-brand-primary scale-[1.02]' : 'text-slate-400 dark:text-slate-500'}`}
          >
            QUICK
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 sm:px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${mode === 'manual' ? 'bg-white dark:bg-slate-700 shadow-xl text-brand-primary scale-[1.02]' : 'text-slate-400 dark:text-slate-500'}`}
          >
            MANUAL
          </button>
          <button
            onClick={() => setMode('scan')}
            className={`flex-1 sm:px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${mode === 'scan' ? 'bg-white dark:bg-slate-700 shadow-xl text-brand-primary scale-[1.02]' : 'text-slate-400 dark:text-slate-500'}`}
          >
            SCAN
          </button>
        </div>
      </div>

      {mode === 'scan' ? (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center transition-colors duration-300">
          <div className="max-w-md mx-auto space-y-6">
            <ReceiptUpload 
              onUploadSuccess={handleUploadSuccess} 
              onDelete={handleReceiptDelete}
              currentImage={formData.receiptImage} 
              publicId={formData.receiptPublicId}
            />
            
            {formData.aiScanned ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800 space-y-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-emerald-100 dark:bg-emerald-800 p-1.5 rounded-full text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">AI Scan Complete</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Extracted Amount</label>
                    <input 
                      type="number"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-white dark:bg-gray-800 border-none rounded-xl p-3 font-bold text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={2}
                    placeholder="Small description box..."
                    className="w-full bg-white dark:bg-gray-800 border-none rounded-xl p-3 font-medium text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 bg-emerald-500 text-white font-black py-3 rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all uppercase tracking-widest text-xs"
                  >
                    Confirm & Save
                  </button>
                  <button 
                    onClick={() => setMode('manual')}
                    className="px-6 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold py-3 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 text-xs"
                  >
                    Edit More
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cloudinary AI Scan</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Snap a photo or upload a receipt. Cloudinary's AI will automatically extract amount, merchant, and categorize it for you.
                </p>
              </>
            )}
          </div>
        </div>
      ) : mode === 'manual' ? (
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 space-y-10 transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest pl-2">Amount (₹)</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl p-5 font-black text-slate-900 dark:text-white text-2xl focus:ring-4 focus:ring-brand-primary/20 shadow-inner"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">Merchant</label>
              <input
                type="text"
                value={formData.merchant}
                onChange={e => setFormData({...formData, merchant: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl p-5 font-bold text-slate-900 dark:text-white text-lg focus:ring-4 focus:ring-brand-primary/20 shadow-inner"
                placeholder="e.g. Amazon"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl p-5 font-bold text-slate-900 dark:text-white text-lg focus:ring-4 focus:ring-brand-primary/20 shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl p-5 font-bold text-slate-900 dark:text-white text-lg focus:ring-4 focus:ring-brand-primary/20 shadow-inner"
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 py-4">
             <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Select Category</label>
             <CategoryRadial 
                selectedCategory={formData.category}
                onSelect={(cat) => setFormData({...formData, category: cat})}
             />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl p-5 font-medium text-slate-900 dark:text-white text-sm focus:ring-4 focus:ring-brand-primary/20 shadow-inner"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-brand-primary text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm">
              {id ? 'Update' : 'Save'} Expense
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 text-center transition-all duration-300">
           <div className="max-w-md mx-auto space-y-10">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Amount (₹)</label>
                 <input 
                   type="number"
                   value={formData.amount}
                   onChange={e => setFormData({...formData, amount: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl p-6 font-black text-slate-900 dark:text-white text-4xl text-center focus:ring-4 focus:ring-brand-primary/20 shadow-inner"
                   placeholder="0.00"
                   autoFocus
                 />
              </div>

              <div className="flex flex-col items-center gap-6">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Pick Category</label>
                 <CategoryRadial 
                    selectedCategory={formData.category}
                    onSelect={(cat) => setFormData({...formData, category: cat})}
                 />
              </div>

              <div className="pt-4">
                 <button 
                   onClick={handleSubmit}
                   className="w-full bg-brand-primary text-white py-5 rounded-3xl font-black shadow-xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
                 >
                    Log Quick Transaction
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
