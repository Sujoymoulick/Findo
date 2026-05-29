import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Wallet, Chrome, Mail, Lock, ArrowRight, BarChart3, ChevronLeft } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GridHero } from '../components/ui/grid-hero-animated';
import { motion } from 'framer-motion';
import logoImage from '../../Assets/logo.png';
import { TextColor } from '../components/ui/text-color';

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
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-1000">
      <AnimatedBackground />
      
      {/* Animated Grid Canvas Background */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-40 dark:opacity-60">
        <GridHero />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-6xl bg-white/30 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden border border-white/40 dark:border-white/10 flex flex-col lg:flex-row min-h-[600px] lg:h-[800px]"
      >
        {/* Left Side: Illustration (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden border-r border-white/20 dark:border-white/5">
          <div className="absolute top-12 left-12 flex items-center gap-3 z-20">
            <img src={logoImage} alt="Findo Logo" className="w-10 h-10 object-contain drop-shadow-xl" />
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase">FINDO</span>
          </div>
          
          <TextColor 
            text1="Track." 
            text2="Predict." 
            text3="Save." 
          />
          
          <div className="mt-12 text-center space-y-4 relative z-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Master Your Money
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed font-medium">
              Join 10,000+ users who have transformed their financial life with Findo's intelligent tracking and world-class design.
            </p>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 lg:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="max-w-sm mx-auto w-full">
            <div className="lg:hidden flex justify-center mb-8">
              <img src={logoImage} alt="Findo Logo" className="w-16 h-16 object-contain drop-shadow-xl" />
            </div>
            
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome Back</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-4 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-4 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-500/20 text-sm font-black uppercase tracking-widest text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign in to Account
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="px-4 text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center gap-3 py-4 px-4 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/30 dark:bg-white/[0.05] text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-white/[0.1] transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  <Chrome className="h-5 w-5 text-red-500" />
                  <span>Google Account</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              New to Findo?{' '}
              <Link to="/register" className="text-blue-500 font-black hover:text-blue-400 transition-colors uppercase tracking-widest ml-1">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Large Background "FINDO" Text */}
      <div className="fixed bottom-[-10%] left-[-5%] z-0 pointer-events-none select-none">
        <h2 className="text-[20rem] font-black text-slate-900/5 dark:text-white/5 tracking-tighter leading-none">
          FINDO
        </h2>
      </div>
    </div>
  );
}
