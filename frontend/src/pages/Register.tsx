import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Chrome, Mail, Lock, User, ArrowRight, Smartphone, Key, ChevronLeft } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GridHero } from '../components/ui/grid-hero-animated';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../../Assets/logo.png';
import { TextColor } from '../components/ui/text-color';

export default function Register() {
  // Common State
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const navigate = useNavigate();

  // Email Auth State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone Auth State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // --- HANDLERS ---

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name },
        },
      });

      if (error) throw error;

      toast.success('Account created! Welcome to Findo.');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) throw error;
      setPhone(formattedPhone);
      setOtpSent(true);
      toast.success('Code sent! Check your messages.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      toast.success('Phone verified successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: (import.meta.env.VITE_SITE_URL || window.location.origin) + '/dashboard'
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
        className="relative z-10 w-full max-w-6xl bg-white/30 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden border border-white/40 dark:border-white/10 flex flex-col lg:flex-row min-h-[600px] lg:h-[850px]"
      >
        {/* Left Side: Illustration (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden border-r border-white/20 dark:border-white/5">
          <div className="absolute top-12 left-12 flex items-center gap-3 z-20">
            <img src={logoImage} alt="Findo Logo" className="w-10 h-10 object-contain drop-shadow-xl" />
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase">FINDO</span>
          </div>
          
          <TextColor 
            text1="Manage." 
            text2="Analyze." 
            text3="Thrive." 
          />
          
          <div className="mt-12 text-center space-y-4 relative z-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Start Your Journey
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed font-medium">
              Create an account and discover why Findo is the preferred choice for modern financial management.
            </p>
          </div>

          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
        </div>

        {/* Right Side: Register Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 relative overflow-y-auto">
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
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Create Account</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Join Findo and take control today.</p>
            </div>

            <AnimatePresence mode="wait">
              {authMode === 'email' && (
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                  onSubmit={handleEmailSubmit}
                >
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        className="block w-full pl-11 pr-4 py-3 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

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
                        className="block w-full pl-11 pr-4 py-3 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
                      Create Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type="password"
                        required
                        className="block w-full pl-11 pr-4 py-3 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-500/20 text-sm font-black uppercase tracking-widest text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? 'Initializing...' : (
                        <>
                          Create Account
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {authMode === 'phone' && (
                <motion.form
                  key="phone-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                  onSubmit={otpSent ? handleVerifyOtp : handlePhoneSubmit}
                >
                  {!otpSent ? (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
                        Mobile Number
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <input
                          type="tel"
                          required
                          className="block w-full pl-11 pr-4 py-4 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
                        Enter 6-Digit OTP
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                          <Key className="h-5 w-5" />
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          className="block w-full pl-11 pr-4 py-4 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 font-black tracking-[0.5em] text-center"
                          placeholder="••••••"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-500/20 text-sm font-black uppercase tracking-widest text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? 'Processing...' : (
                        <>
                          {otpSent ? 'Verify & Register' : 'Send Verification Code'}
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="w-full mt-4 text-[10px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest text-center"
                      >
                        Wrong number? Go back
                      </button>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* --- ALTERNATIVE METHODS --- */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="px-4 text-slate-400">
                    Or use alternative
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center gap-3 py-3 px-4 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/30 dark:bg-white/[0.05] text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-white/[0.1] transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  <Chrome className="h-5 w-5 text-red-500" />
                  <span>Google Account</span>
                </button>

                {authMode === 'email' ? (
                  <button
                    type="button"
                    onClick={() => setAuthMode('phone')}
                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/30 dark:bg-white/[0.05] text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-white/[0.1] transition-all active:scale-[0.98] uppercase tracking-widest"
                  >
                    <Smartphone className="h-5 w-5 text-blue-500" />
                    <span>Mobile Number</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthMode('email')}
                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border-2 border-white/10 dark:border-white/5 rounded-2xl bg-white/30 dark:bg-white/[0.05] text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-white/[0.1] transition-all active:scale-[0.98] uppercase tracking-widest"
                  >
                    <Mail className="h-5 w-5 text-blue-500" />
                    <span>Email Address</span>
                  </button>
                )}
              </div>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Already a member?{' '}
              <Link to="/login" className="text-blue-500 font-black hover:text-blue-400 transition-colors uppercase tracking-widest ml-1">
                Sign in
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
