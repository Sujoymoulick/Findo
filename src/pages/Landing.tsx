import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight, Star } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import logoImage from '../assets/findo_logo.png';
import Spline from '@splinetool/react-spline';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Account', to: '/dashboard' },
    { name: 'Product', to: '/dashboard/reports' },
    { name: 'Service', to: '/dashboard/transactions' },
    { name: 'Contact', to: '/dashboard/settings' },
    { name: 'Manage', to: '/dashboard' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Findo Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg" />
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Findo</span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.to} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-slate-900 dark:text-white px-4 py-2 hover:opacity-70 transition-opacity">
              Log in
            </Link>
            <Link to="/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform">
              Sign up
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 dark:text-white p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 px-6 py-8 space-y-6">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.to} className="block text-lg font-bold text-slate-900 dark:text-white">
              {link.name}
            </Link>
          ))}
          <div className="pt-6 flex flex-col gap-4">
            <Link to="/login" className="w-full text-center py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-bold">Log in</Link>
            <Link to="/register" className="w-full text-center py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold">Sign up</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const FeatureBar = () => (
  <div className="bg-slate-900/90 dark:bg-slate-900/50 backdrop-blur-2xl text-white rounded-[3rem] p-10 md:p-14 mt-20 relative overflow-hidden border border-white/10 shadow-2xl group transition-all duration-500 hover:shadow-brand-primary/10">
    <div className="relative z-10">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/20 border border-brand-primary/30 rounded-full text-brand-primary text-xs font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
            Introduction
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Welcome to <span className="text-brand-primary italic">Findo!</span> 🚀
          </h2>
          <p className="text-lg text-slate-400 font-bold leading-relaxed">
            We are thrilled to have you here. Managing money shouldn't feel like a chore, so we built Findo to be your smart, pocket-sized financial advisor.
          </p>
        </div>

        <div className="md:w-1/2 grid grid-cols-1 gap-6">
          <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">How to get started</p>
          
          <div className="flex gap-4 group/item">
            <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center font-black text-brand-primary border border-white/10 group-hover/item:bg-brand-primary group-hover/item:text-slate-900 transition-colors">1</div>
            <div>
              <h4 className="font-bold text-white mb-1">Set your monthly goal</h4>
              <p className="text-sm text-slate-400">Head to Settings to tell us your target budget.</p>
            </div>
          </div>

          <div className="flex gap-4 group/item">
            <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center font-black text-brand-primary border border-white/10 group-hover/item:bg-brand-primary group-hover/item:text-slate-900 transition-colors">2</div>
            <div>
              <h4 className="font-bold text-white mb-1">Log your first expense</h4>
              <p className="text-sm text-slate-400">Click "Add Expense" and try out the AI Receipt Scanner!</p>
            </div>
          </div>

          <div className="flex gap-4 group/item">
            <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center font-black text-brand-primary border border-white/10 group-hover/item:bg-brand-primary group-hover/item:text-slate-900 transition-colors">3</div>
            <div>
              <h4 className="font-bold text-white mb-1">Track your progress</h4>
              <p className="text-sm text-slate-400">Watch your dashboard update in real-time to keep you on track.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-brand-primary font-black italic text-lg text-center sm:text-left">Let's make your money work for you.</p>
        <div className="flex -space-x-3">
          {[1,2,3,4].map(i => (
            <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" alt="user" />
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-brand-primary flex items-center justify-center text-[10px] font-black text-slate-900">+2k</div>
        </div>
      </div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
  </div>
);

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[#F0F4FF] dark:bg-[#050810] overflow-x-hidden selection:bg-brand-primary/30 font-outfit transition-colors duration-700">
      <AnimatedBackground />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Hero Content */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8 relative z-10">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[1.1] md:leading-[1] tracking-tighter">
              Most Easiest way <span className="inline-block"><Star className="text-brand-primary fill-brand-primary w-8 h-8 md:w-12 md:h-12 -mt-4 md:-mt-8" /></span><br/>
              to Manage <span className="italic text-brand-primary">Finances</span>
            </h1>
            <div className="flex items-start gap-4 max-w-lg">
              <div className="w-12 h-6 bg-brand-primary rounded-full mt-1.5 shrink-0" />
              <p className="text-lg font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                Experience the next generation of 3D financial management. Interactive, immersive, and incredibly simple.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <Link to="/register" className="group bg-[#D9F99D] text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-lime-500/30 flex items-center gap-3 active:scale-95 leading-none">
                Start Today
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Spline 3D Scene Visual */}
          <div className="relative h-[500px] md:h-[650px] w-full group">
            {/* Background Glow */}
            <div className="absolute inset-x-0 inset-y-20 bg-gradient-to-tr from-brand-primary/20 via-purple-500/10 to-blue-500/20 rounded-[10rem] blur-[120px] opacity-70 group-hover:scale-110 transition-transform duration-1000" />
            
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <div className="w-full h-full relative z-20">
                <Spline 
                  scene="https://prod.spline.design/2CoXyMxE0LO3Odgb/scene.splinecode" 
                  className="w-full h-full"
                />
              </div>
            </Suspense>

            {/* Top Interactive Hint */}
            <div className="absolute top-10 right-10 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                  Interact with 3D model
               </div>
            </div>
          </div>
        </div>

        {/* Feature Bar */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
          <FeatureBar />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200/30 dark:border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Findo Logo" className="w-8 h-8 object-contain rounded-lg opacity-50" />
            <span className="text-lg font-black text-slate-400 dark:text-slate-600 tracking-tighter">Findo</span>
          </div>
          
          <div className="text-center sm:text-right flex-1">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Created by <span className="text-slate-900 dark:text-white font-black italic">Sujoy</span> and <span className="text-slate-900 dark:text-white font-black italic">Arnab</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-60 w-[800px] h-[800px] bg-emerald-400/10 rounded-full blur-[250px] pointer-events-none" />
    </div>
  );
}
