import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Save, Settings as SettingsIcon, Moon, Sun, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileUpload from '../components/ProfileUpload';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Health', 'Utilities', 'Rent', 'Entertainment', 'Education', 'Other'];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'NetBanking'];

export default function Settings() {
  const { budget, updateBudget } = useExpense();
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile, updateUserLocal, logout } = useAuth();
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState('');
  const [formData, setFormData] = useState({
    currency: 'INR',
    paymentMethod: 'UPI'
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (budget) {
      setFormData({
        currency: budget.currency || 'INR',
        paymentMethod: budget.paymentMethod || 'UPI'
      });
    }
    if (user) {
      setProfileName(user.name || '');
    }
  }, [budget, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBudget({ 
        ...budget, 
        currency: formData.currency, 
        paymentMethod: formData.paymentMethod 
      });
      if (user && profileName !== user.name) {
        await updateProfile({ name: profileName });
      }
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setProfileName(newName);
    updateUserLocal({ name: newName });
  };

  const handleAvatarSuccess = async (url: string, publicId?: string) => {
    try {
      await updateProfile({ avatarUrl: url, avatarPublicId: publicId });
    } catch (err) {
      toast.error('Failed to update profile picture in database');
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await updateProfile({ avatarUrl: '', avatarPublicId: '' });
    } catch (err) {
      toast.error('Failed to remove profile picture from database');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center space-x-4 mb-2">
        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl shadow-lg shadow-emerald-500/10">
          <SettingsIcon className="text-brand-primary dark:text-emerald-400 w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Preferences & Account</p>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800 space-y-10 transition-all duration-300">
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 dark:text-white">Appearance</h3>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme for the application</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                theme === 'dark' ? 'bg-brand-primary text-white shadow-emerald-500/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 dark:text-white">Profile</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <ProfileUpload 
              onUploadSuccess={handleAvatarSuccess} 
              onDelete={handleAvatarDelete}
              currentImage={user?.avatarUrl} 
              publicId={user?.avatarPublicId}
            />
            <div className="flex-1 space-y-1 text-center md:text-left">
               <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Your Avatar</h4>
               <p className="text-sm font-bold text-slate-400 dark:text-slate-500">This will be shown in the navbar and your profile.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={handleNameChange}
                className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-bold"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-xs text-gray-400 font-normal">(Cannot be changed)</span></label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 bg-gray-100/50 dark:bg-slate-800/80 text-gray-500 dark:text-gray-400 rounded-2xl cursor-not-allowed font-medium opacity-70"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 dark:text-white">General Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Currency</label>
              <select
                value={formData.currency}
                onChange={e => setFormData({...formData, currency: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-bold"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Preferred Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-bold"
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-3 px-10 py-4 bg-brand-primary text-white rounded-[1.5rem] hover:bg-emerald-600 font-black text-lg shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={22} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
      </div>

      <div className="mt-8 md:hidden">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-500 hover:text-white rounded-[2rem] font-black text-lg transition-all duration-300 border-2 border-red-500/20 group"
        >
          <LogOut size={24} className="group-hover:scale-110 transition-transform" />
          <span>Log out of Findo</span>
        </button>
      </div>
    </div>
  );
}

