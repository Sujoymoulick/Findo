import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Wallet, Mail, ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password',
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-10 rounded-xl shadow-lg border border-white/20 dark:border-gray-800/50">
          <div className="text-center">
            <Wallet className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {!submitted ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? 'Sending link...' : 'Send reset link'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 text-center space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-400">
                  We've sent a password reset link to <span className="font-semibold">{email}</span>.
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition-colors"
              >
                Try another email
              </button>
            </div>
          )}

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
