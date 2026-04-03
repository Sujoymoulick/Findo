import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Chrome, Mail, Lock, User, ArrowRight, Smartphone, Key } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../assets/findo_logo.png';

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
      // Ensure E.164 format (defaults to India +91 if no plus is provided)
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setPhone(formattedPhone); // Save formatted phone for verification
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -6 }}
            className="w-20 h-20 relative"
          >
            <img src={logoImage} alt="Findo Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </motion.div>
        </div>
        <h2 className="text-center text-4xl font-black text-slate-900 dark:text-white tracking-widest uppercase">
          Findo
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-4">
          The future of your financial management
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl py-12 px-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] sm:rounded-[3rem] sm:px-12 border border-white dark:border-slate-800 transition-all duration-300">

          <AnimatePresence mode="wait">
            {/* --- EMAIL AUTHENTICATION FORM --- */}
            {authMode === 'email' && (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
                onSubmit={handleEmailSubmit}
              >
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-12 pr-6 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-bold"
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
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-12 pr-6 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-bold"
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
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-12 pr-6 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-bold"
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
                    className="w-full flex justify-center items-center gap-3 py-5 px-6 border border-transparent rounded-[1.5rem] shadow-xl shadow-brand-primary/20 text-lg font-black text-white bg-brand-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.95]"
                  >
                    {loading ? 'Setting up...' : (
                      <>
                        Initialize Account
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* --- PHONE AUTHENTICATION FORM --- */}
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
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <input
                        type="tel"
                        required
                        className="block w-full pl-12 pr-6 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-bold tracking-wider"
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
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                        <Key className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="block w-full pl-12 pr-6 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-black tracking-[0.5em] text-center text-xl"
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
                    className="w-full flex justify-center items-center gap-3 py-5 px-6 border border-transparent rounded-[1.5rem] shadow-xl shadow-brand-primary/20 text-lg font-black text-white bg-brand-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.95]"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        {otpSent ? 'Verify & Login' : 'Send Verification Code'}
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      Wrong number? Go back
                    </button>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* --- ALTERNATIVE LOGIN METHODS --- */}
          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center pb-0.5">
                <div className="w-full border-t-2 border-slate-50 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 px-4 bg-white dark:bg-slate-900 inline-block mx-auto w-fit">
                Fast Sign Up
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-4 py-5 px-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800 text-base font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                <Chrome className="h-7 w-7 text-red-500" />
                <span>Continue with Google</span>
              </button>

              {authMode === 'email' ? (
                <button
                  type="button"
                  onClick={() => setAuthMode('phone')}
                  className="w-full flex justify-center items-center gap-4 py-5 px-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800 text-base font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all hover:shadow-lg active:scale-[0.98]"
                >
                  <Smartphone className="h-7 w-7 text-brand-primary dark:text-emerald-400" />
                  <span>Continue with Mobile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email');
                    setOtpSent(false); // Reset phone flow if they switch back
                  }}
                  className="w-full flex justify-center items-center gap-4 py-5 px-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800 text-base font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all hover:shadow-lg active:scale-[0.98]"
                >
                  <Mail className="h-7 w-7 text-brand-primary dark:text-emerald-400" />
                  <span>Continue with Email</span>
                </button>
              )}
            </div>
          </div>

          <p className="mt-10 text-center text-sm font-bold text-slate-400 dark:text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-brand-primary hover:text-emerald-400 transition-colors border-b-2 border-brand-primary/20 hover:border-brand-primary pb-0.5">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}