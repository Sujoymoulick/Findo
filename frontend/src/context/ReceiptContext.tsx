import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Receipt {
  id: string;
  user_id: string;
  image_url: string;
  public_id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  amount: number;
  currency: string;
  merchant: string;
  date: string;
  category: string;
  items: any[];
  ocr_text: string;
  confidence: string;
  note: string;
  is_converted: boolean;
  created_at: string;
}

interface ReceiptContextType {
  receipts: Receipt[];
  loading: boolean;
  fetchReceipts: () => Promise<void>;
  deleteReceipt: (id: string, publicId: string) => Promise<void>;
  markAsConverted: (id: string) => Promise<void>;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const ReceiptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  const fetchReceipts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
    } catch (err) {
      console.error('Error fetching receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteReceipt = async (id: string, publicId: string) => {
    try {
      // 1. Delete from Cloudinary via Backend
      await axios.post('/api/upload/delete', { public_id: publicId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Delete from DB
      const { error } = await supabase.from('receipts').delete().eq('id', id);
      if (error) throw error;

      setReceipts(prev => prev.filter(r => r.id !== id));
      toast.success('Receipt removed');
    } catch (err: any) {
      toast.error('Failed to delete receipt');
      console.error(err);
    }
  };

  const markAsConverted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('receipts')
        .update({ is_converted: true })
        .eq('id', id);
      if (error) throw error;
      setReceipts(prev => prev.map(r => r.id === id ? { ...r, is_converted: true } : r));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReceipts();

      // Real-time listener
      const channel = supabase
        .channel('receipts_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'receipts', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setReceipts(prev => [payload.new as Receipt, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setReceipts(prev => prev.map(r => r.id === payload.new.id ? payload.new as Receipt : r));
            } else if (payload.eventType === 'DELETE') {
              setReceipts(prev => prev.filter(r => r.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return (
    <ReceiptContext.Provider value={{ receipts, loading, fetchReceipts, deleteReceipt, markAsConverted }}>
      {children}
    </ReceiptContext.Provider>
  );
};

export const useReceipts = () => {
  const context = useContext(ReceiptContext);
  if (!context) throw new Error('useReceipts must be used within a ReceiptProvider');
  return context;
};
