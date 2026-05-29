import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt as ReceiptIcon, 
  Trash2, 
  PlusCircle, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  Maximize2,
  X,
  FileText,
  Building2,
  Calendar,
  Wallet
} from 'lucide-react';
import { useReceipts } from '../context/ReceiptContext';
import { useExpense } from '../context/ExpenseContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { formatCurrency } from '../lib/utils';

export default function ReceiptsManager() {
  const { receipts, loading, deleteReceipt, markAsConverted } = useReceipts();
  const { addExpense } = useExpense();
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const handleConvertToTransaction = async (receipt: any) => {
    try {
      await addExpense({
        amount: Number(receipt.amount),
        category: receipt.category || 'Other',
        merchant: receipt.merchant || 'Unknown Merchant',
        date: receipt.date || new Date().toISOString().split('T')[0],
        paymentMethod: 'Card', // Default to Card if unknown
        currency: receipt.currency || 'INR',
        aiScanned: true,
        receiptImage: receipt.image_url,
        receiptPublicId: receipt.public_id,
        note: `Auto-converted from receipt scan. ${receipt.note || ''}`
      });

      await markAsConverted(receipt.id);
      toast.success('Added to transactions!', { icon: '💰' });
    } catch (err: any) {
      toast.error('Failed to convert: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Receipt Hub</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage and convert your AI-scanned receipts</p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard/add'}
          className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <PlusCircle size={18} />
          Scan New Receipt
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading vault...</p>
        </div>
      ) : receipts.length === 0 ? (
        <div className="bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-20 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ReceiptIcon size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No receipts found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Your scanned receipts will appear here once you start using the AI Scan feature.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {receipts.map((receipt, idx) => (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-500/5 flex flex-col"
              >
                {/* Image Preview */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={receipt.image_url} alt="Receipt" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => setSelectedReceipt(receipt)}
                      className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-xl text-white transition-all shadow-lg"
                    >
                      <Maximize2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteReceipt(receipt.id, receipt.public_id)}
                      className="p-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-white transition-all shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-6">
                    <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-0.5">Merchant</p>
                    <h4 className="text-white font-black tracking-tight">{receipt.merchant || 'Unknown'}</h4>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">
                        {formatCurrency(receipt.amount || 0, receipt.currency || 'INR')}
                      </h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      receipt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {receipt.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-700 dark:text-slate-300">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-xs font-bold">{receipt.date ? format(new Date(receipt.date), 'MMM dd, yyyy') : 'N/A'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-700 dark:text-slate-300">
                        <FileText size={12} className="text-slate-400" />
                        <span className="text-xs font-bold">{receipt.category || 'Other'}</span>
                      </div>
                    </div>
                  </div>

                  {receipt.is_converted ? (
                    <div className="flex items-center justify-center gap-2 py-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Added to Transactions</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConvertToTransaction(receipt)}
                      className="w-full py-4 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Convert to Transaction
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Image Modal View */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              className="relative w-full max-w-5xl h-full flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-6 right-6 z-50 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
              >
                <X size={24} />
              </button>

              {/* View Left: Image */}
              <div className="flex-1 bg-black flex items-center justify-center p-4">
                <img src={selectedReceipt.image_url} alt="Receipt" className="max-w-full max-h-full object-contain shadow-2xl" />
              </div>

              {/* View Right: AI Insights */}
              <div className="w-full lg:w-96 flex flex-col p-10 bg-slate-50 dark:bg-slate-900/50 border-l border-white/5">
                <div className="mb-8">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 text-blue-500">
                    <AlertCircle size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">AI EXTRACTION</h2>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Confidence: {selectedReceipt.confidence}</p>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-white/10 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">Items Detected</p>
                    <div className="space-y-3">
                      {selectedReceipt.items && selectedReceipt.items.length > 0 ? (
                        selectedReceipt.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                            <span className="font-black text-slate-900 dark:text-white">{formatCurrency(item.price || 0, selectedReceipt.currency)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">No specific items extracted.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                       <Building2 size={18} className="text-slate-400 mt-1" />
                       <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Merchant</p>
                         <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedReceipt.merchant || 'Unknown'}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <Clock size={18} className="text-slate-400 mt-1" />
                       <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Scanned On</p>
                         <p className="text-sm font-bold text-slate-900 dark:text-white">{format(new Date(selectedReceipt.created_at), 'MMM dd, yyyy HH:mm')}</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  {!selectedReceipt.is_converted && (
                    <button
                      onClick={() => {
                        handleConvertToTransaction(selectedReceipt);
                        setSelectedReceipt(null);
                      }}
                      className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <Wallet size={18} />
                      Log as Expense
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
