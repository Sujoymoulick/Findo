import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, BarChart3, Target, Settings2, ChevronRight } from 'lucide-react';
import { useCookies } from '../context/CookieContext';

export const CookieConsent = () => {
  const { hasConsented, acceptAll, rejectAll, updatePreferences } = useCookies();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [tempPrefs, setTempPrefs] = useState({
    analytics: false,
    marketing: false,
    functional: false,
  });

  if (hasConsented) return null;

  const categories = [
    { 
      id: 'essential', 
      name: 'Essential', 
      icon: Shield, 
      desc: 'Required for basic site functionality (login, security, preferences).', 
      required: true 
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      desc: 'Help us understand how you use Findo to improve the experience.', 
      required: false 
    },
    { 
      id: 'functional', 
      name: 'Functional', 
      icon: Settings2, 
      desc: 'Remember your settings and personalization choices.', 
      required: false 
    },
    { 
      id: 'marketing', 
      name: 'Marketing', 
      icon: Target, 
      desc: 'Used to provide more relevant suggestions and offers.', 
      required: false 
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[100]"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-white/10 px-6 py-4 md:px-12">
          {!showCustomizer ? (
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Cookie className="text-blue-500" size={20} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cookie Preferences</h3>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                    Findo uses cookies to enhance your experience, ensure security, and analyze our traffic. 
                    Choose how you want to manage your data.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase hover:bg-slate-50 dark:hover:bg-white/5 transition-all whitespace-nowrap"
                >
                  Customize
                </button>
                <button
                  onClick={rejectAll}
                  className="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase hover:bg-slate-50 dark:hover:bg-white/5 transition-all whitespace-nowrap"
                >
                  Essential Only
                </button>
                <button
                  onClick={acceptAll}
                  className="px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-black text-[10px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowCustomizer(false)}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={18} className="rotate-180" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customize Preferences</h3>
                </div>
                <button 
                  onClick={() => setShowCustomizer(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                      <cat.icon size={18} className={cat.required ? "text-blue-500" : "text-slate-400"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</span>
                        {cat.required ? (
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Required</span>
                        ) : (
                          <button
                            onClick={() => setTempPrefs(prev => ({ ...prev, [cat.id]: !prev[cat.id as keyof typeof tempPrefs] }))}
                            className={`w-10 h-5 rounded-full transition-colors relative ${tempPrefs[cat.id as keyof typeof tempPrefs] ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                          >
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${tempPrefs[cat.id as keyof typeof tempPrefs] ? 'right-1' : 'left-1'}`} />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => updatePreferences(tempPrefs)}
                className="w-full py-4 px-6 rounded-2xl bg-blue-500 text-white font-black text-[10px] tracking-[0.2em] uppercase hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
