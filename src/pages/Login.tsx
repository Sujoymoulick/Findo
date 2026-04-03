import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Wallet, Chrome, Mail, Lock, ArrowRight, BarChart3 } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { motion } from 'framer-motion';
import logoImage from '../assets/findo_logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#0B1120] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimatedBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-16 h-16 relative"
          >
            <img src={logoImage} alt="Findo Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </motion.div>
        </div>
        <h2 className="text-center text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome to Findo
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Sign in to manage your financial journey
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-10 px-4 shadow-2xl shadow-indigo-500/10 sm:rounded-[2.5rem] sm:px-10 border border-white dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-brand-primary hover:text-emerald-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-brand-primary/20 text-lg font-black text-white bg-brand-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign in to Account
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white dark:bg-slate-900 text-slate-400 uppercase font-bold tracking-widest">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-3 py-4 px-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-[0.98]"
              >
                <Chrome className="h-6 w-6 text-red-500" />
                <span>Google Account</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            New to Findo?{' '}
            <Link to="/register" className="text-brand-primary font-bold hover:text-emerald-400 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
