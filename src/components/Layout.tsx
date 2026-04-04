import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, List, BarChart2, Settings, LogOut, User, Wallet } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import FinlyAssistant from './FinlyAssistant';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Home' },
  { to: '/dashboard/budget', icon: <Wallet size={22} />, label: 'Budget' },
  { to: '/dashboard/transactions', icon: <List size={22} />, label: 'History' },
  { to: '/dashboard/reports', icon: <BarChart2 size={22} />, label: 'Report' },
  { to: '/dashboard/settings', icon: <Settings size={22} />, label: 'Settings' },
];

const mobileNavItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Home' },
  { to: '/dashboard/budget', icon: <Wallet size={22} />, label: 'Budget' },
  { to: '/dashboard/transactions', icon: <List size={22} />, label: 'History' },
  { to: '/dashboard/reports', icon: <BarChart2 size={22} />, label: 'Report' },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="hidden md:flex w-72 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 h-screen flex-col fixed left-0 top-0 transition-all duration-300 z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <BarChart2 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Findo</h1>
        </div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Finance Manager</p>
      </div>
      
      <div className="px-4 mb-6">
        <button
          onClick={() => navigate('/dashboard/add')}
          className="flex items-center justify-center space-x-3 w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <PlusCircle size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-brand-primary'
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="text-sm tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-primary/10 border-2 border-brand-primary/20 shadow-inner flex items-center justify-center">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-brand-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{user?.name}</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-2xl transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export const Layout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-transparent transition-colors duration-300">
      <AnimatedBackground />
      <Sidebar />
      
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/10 dark:border-slate-800/50 z-40 flex items-center justify-between px-6 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <BarChart2 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Findo</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard/settings')}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-all active:scale-90"
        >
          <Settings size={20} />
        </button>
      </div>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 pb-28 md:pb-8 relative w-full overflow-x-hidden">
        <Outlet />
      </main>
      
      {/* Mobile Bottom Navigation - Floating Style */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/10 flex justify-between items-center px-4 py-2 rounded-[2rem] shadow-2xl transition-colors duration-300">
          {mobileNavItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-2xl transition-all min-w-[50px] ${
                  isActive ? 'text-brand-primary scale-110' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <div className="transition-transform group-active:scale-95">{item.icon}</div>
              <span className="text-[10px] mt-1 font-bold tracking-tight">{item.label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={() => navigate('/dashboard/add')}
            className="flex items-center justify-center -translate-y-8 w-16 h-16 bg-brand-primary text-white rounded-full shadow-xl shadow-brand-primary/40 border-4 border-slate-900 dark:border-slate-800 active:scale-90 transition-all group"
          >
            <PlusCircle size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          {mobileNavItems.slice(2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-2xl transition-all min-w-[50px] ${
                  isActive ? 'text-brand-primary scale-110' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <div className="transition-transform group-active:scale-95">{item.icon}</div>
              <span className="text-[10px] mt-1 font-bold tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* AI Voice Assistant */}
      <FinlyAssistant />
    </div>
  );
};
