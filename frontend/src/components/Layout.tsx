import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  BarChart2, 
  Settings, 
  LogOut, 
  Wallet, 
  Search, 
  Bell, 
  MessageSquare, 
  Menu, 
  X as CloseIcon,
  Receipt as ReceiptIcon,
  MoreHorizontal
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { GridHero } from './ui/grid-hero-animated';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', category: 'GENERAL' },
  { to: '/dashboard/budget', icon: <Wallet size={20} />, label: 'Categories', category: 'GENERAL' },
  { to: '/dashboard/transactions', icon: <List size={20} />, label: 'Transactions', category: 'GENERAL' },
  { to: '/dashboard/receipts', icon: <ReceiptIcon size={20} />, label: 'Receipts', category: 'GENERAL' },
  { to: '/dashboard/ai-assistant', icon: <MessageSquare size={20} />, label: 'AI Assistant', category: 'AI AGENT', isAi: true },
  { to: '/dashboard/reports', icon: <BarChart2 size={20} />, label: 'Reports', category: 'EXTRAS' },
  { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings', category: 'EXTRAS' },
];

const Sidebar = ({ isOpen, onClose, onLogoutRequest }: { isOpen: boolean; onClose: () => void; onLogoutRequest: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const groupedNavItems = navItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <>
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`fixed left-0 top-0 h-screen bg-slate-900/90 dark:bg-black/90 backdrop-blur-3xl border-r border-white/10 flex flex-col transition-transform duration-500 z-[70] w-72 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wallet className="text-white w-6 h-6" />
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
              <CloseIcon size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 mb-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff&size=128`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Wallet App</p>
              <p className="text-[10px] text-slate-400 truncate uppercase tracking-widest">{user?.name}</p>
            </div>
          </div>

          <button
            onClick={() => {
              navigate('/dashboard/add');
              onClose();
            }}
            className="flex items-center justify-center gap-3 w-full py-4 mb-8 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <PlusCircle size={18} />
            <span>Add Transaction</span>
          </button>

          <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar pr-2">
            {Object.entries(groupedNavItems).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h3 className={`text-[10px] font-black tracking-[0.2em] px-2 ${category === 'AI AGENT' ? 'text-blue-500' : 'text-emerald-500'}`}>{category}</h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group w-full ${
                          isActive 
                          ? 'bg-white/10 text-white font-bold' 
                          : 'text-slate-400 hover:text-white'
                        }`
                      }
                    >
                      <span className={`transition-transform group-hover:scale-110 ${item.isAi ? 'text-blue-500' : ''}`}>{item.icon}</span>
                      <span className="text-sm tracking-tight">{item.label}</span>
                      {item.isAi && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button
            onClick={onLogoutRequest}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-slate-400 hover:text-rose-400 transition-all duration-300 group"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <LogOut size={120} className="rotate-12" />
            </div>

            <div className="relative z-10 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-2">
                <LogOut size={40} className="text-rose-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Sign Out?</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to exit your session? You'll need to log back in to access your dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={onConfirm}
                  className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all"
                >
                  Yes, Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-black transition-colors duration-1000 font-outfit text-slate-900 dark:text-white">
      <AnimatedBackground />
      
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-40 dark:opacity-60">
        <GridHero />
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogoutRequest={() => {
          setLogoutModalOpen(true);
          setSidebarOpen(false);
        }}
      />

      <LogoutConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
      
      <div className="flex-1 lg:ml-72 relative z-10 flex flex-col min-h-screen">
        <header className="h-20 lg:h-24 flex items-center justify-between px-4 md:px-12 bg-white/10 dark:bg-black/10 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl shadow-lg active:scale-90 transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="relative group max-w-md w-full hidden md:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-slate-900 dark:text-white pl-8 w-full text-sm font-medium"
              />
            </div>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Wallet className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight">Findo</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all relative hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hidden sm:block">
              <MessageSquare size={20} />
            </button>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white/20 dark:border-white/10 shadow-lg">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff&size=128`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </header>

        <main className="p-4 md:p-12 pt-6 pb-28 lg:pb-12 w-full flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation - Modern Edge-to-Edge Style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <nav className="flex justify-around items-center h-20 px-2">
          {navItems.filter(i => i.category === 'GENERAL').slice(0, 2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-full transition-all gap-1.5 ${
                  isActive ? 'text-emerald-500 font-bold' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-emerald-500/10' : ''}`}>{item.icon}</div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Central Add Button */}
          <div className="relative w-20 flex flex-col items-center -mt-8">
            <button 
              onClick={() => navigate('/dashboard/add')}
              className="w-14 h-14 bg-emerald-500 rounded-full shadow-[0_8px_30px_rgb(16,185,129,0.4)] flex items-center justify-center text-white active:scale-90 transition-all border-[6px] border-white dark:border-slate-950"
            >
              <PlusCircle size={28} />
            </button>
            <span className="text-[10px] font-bold text-slate-500 mt-2">Add</span>
          </div>

          {/* AI Assistant in Bottom Nav */}
          <NavLink
            to="/dashboard/ai-assistant"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-all gap-1.5 ${
                isActive ? 'text-blue-500 font-bold' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-blue-500/10' : ''}`}>
                  <MessageSquare size={20} />
                </div>
                <span className="text-[10px] font-medium">Assistant</span>
              </>
            )}
          </NavLink>

          {/* More Options / Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center w-16 h-full transition-all gap-1.5 text-slate-400"
          >
            <div className="p-2 rounded-xl transition-all">
              <MoreHorizontal size={20} />
            </div>
            <span className="text-[10px] font-medium">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
