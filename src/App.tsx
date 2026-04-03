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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Landing from './pages/Landing';
import Budget from './pages/Budget';
import { BudgetProvider } from './context/BudgetContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <BudgetProvider>
            <Router>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
                </Route>
                {/* Redirect to /dashboard if logged in, or landing if not */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </BudgetProvider>
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
