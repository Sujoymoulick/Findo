/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';
import ReceiptsManager from './pages/ReceiptsManager';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Landing from './pages/Landing';
import Budget from './pages/Budget';
import { BudgetProvider } from './context/BudgetContext';
import { CookieProvider } from './context/CookieContext';
import { ReceiptProvider } from './context/ReceiptContext';
import { CookieConsent } from './components/CookieConsent';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <CookieProvider>
        <AuthProvider>
          <ReceiptProvider>
            <ExpenseProvider>
              <BudgetProvider>
                <Router>
                  <Toaster position="top-right" />
                  <CookieConsent />
                  <Routes>
                    <Route path="/" element={<RedirectIfAuthenticated><Landing /></RedirectIfAuthenticated>} />
                    <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
                    <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<Dashboard />} />
                      <Route path="add" element={<AddExpense />} />
                      <Route path="edit/:id" element={<AddExpense />} />
                      <Route path="budget" element={<Budget />} />
                      <Route path="transactions" element={<Transactions />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="ai-assistant" element={<AIAssistant />} />
                      <Route path="receipts" element={<ReceiptsManager />} />
                    </Route>
                    {/* Redirect to /dashboard if logged in, or landing if not */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </BudgetProvider>
            </ExpenseProvider>
          </ReceiptProvider>
        </AuthProvider>
      </CookieProvider>
    </ThemeProvider>
  );
}
