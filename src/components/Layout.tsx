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
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 relative w-full overflow-x-hidden">
        <Outlet />
      </main>
      
      {/* Mobile Bottom Navigation - Floating Style */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="bg-slate-900/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/10 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl transition-colors duration-300">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-2xl transition-all min-w-[64px] ${
                  isActive ? 'text-brand-primary scale-110' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-bold tracking-tight">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => navigate('/dashboard/add')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl transition-all min-w-[64px] text-brand-primary"
          >
            <PlusCircle size={24} />
            <span className="text-[10px] mt-1 font-bold tracking-tight">Add</span>
          </button>
        </nav>
      </div>
      
      {/* AI Voice Assistant */}
      <FinlyAssistant />
    </div>
  );
};
