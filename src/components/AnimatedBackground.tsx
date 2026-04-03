import React from 'react';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-700 bg-slate-50 dark:bg-[#0B1120]">
      {/* Light Mode Holographic Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300/40 blur-[100px] mix-blend-multiply animate-blob dark:opacity-0 transition-opacity duration-700" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-300/40 blur-[100px] mix-blend-multiply animate-blob dark:opacity-0 transition-opacity duration-700" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[-20%] left-[10%] w-[70%] h-[70%] rounded-full bg-purple-300/40 blur-[100px] mix-blend-multiply animate-blob dark:opacity-0 transition-opacity duration-700" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-[10%] right-[20%] w-[50%] h-[50%] rounded-full bg-emerald-200/40 blur-[100px] mix-blend-multiply animate-blob dark:opacity-0 transition-opacity duration-700" style={{ animationDelay: '6s' }} />

      {/* Dark Mode Holographic Gradient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-900/50 blur-[120px] mix-blend-screen animate-blob opacity-0 dark:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-fuchsia-900/40 blur-[120px] mix-blend-screen animate-blob opacity-0 dark:opacity-100 transition-opacity duration-700" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] rounded-full bg-blue-900/40 blur-[120px] mix-blend-screen animate-blob opacity-0 dark:opacity-100 transition-opacity duration-700" style={{ animationDelay: '5s' }} />
    </div>
  );
};
