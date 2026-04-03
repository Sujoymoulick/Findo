import React, { useState } from 'react';
import { X, Plus, Hash } from 'lucide-react';

interface AddCategoryModalProps {
  onClose: () => void;
  onAdd: (category: any) => Promise<void>;
  initialData?: any;
}

const DEFAULT_ICONS = ['🍔', '🚗', '🛍️', '🎬', '🏥', '🎓', '🏠', '💡', '📦'];
const DEFAULT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#A855F7', '#EC4899', '#6B7280'];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    limit_amount: initialData?.limit_amount || '',
    icon: initialData?.icon || '📦',
    color: initialData?.color || '#3B82F6'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAdd(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {initialData ? 'Edit Category' : 'Add category'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Category Name</label>
            <input
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary transition-all shadow-inner"
              placeholder="e.g. Food"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Monthly Limit (₹)</label>
            <input
              required
              type="number"
              value={formData.limit_amount}
              onChange={e => setFormData({ ...formData, limit_amount: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary transition-all shadow-inner"
              placeholder="e.g. 5000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Select Icon</label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl shadow-inner max-h-32 overflow-y-auto">
                {DEFAULT_ICONS.map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: i })}
                    className={`text-2xl p-2 rounded-xl transition-all ${formData.icon === i ? 'bg-brand-primary scale-110 shadow-lg' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Theme Color</label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl shadow-inner max-h-32 overflow-y-auto">
                {DEFAULT_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: c, outline: formData.color === c ? '2px solid #3B82F6' : 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : (initialData ? 'Update Category' : 'Save Category')}
          </button>
        </form>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => <div className={`w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ${className}`} />;
