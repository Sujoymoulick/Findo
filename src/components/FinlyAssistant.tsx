import React, { useEffect, useRef } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FinlyAssistant = () => {
  const { addExpense } = useExpense();
  const { user } = useAuth();
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if script is already added to prevent duplicates
    const scriptId = 'elevenlabs-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const handleToolCall = async (event: any) => {
      const { toolName, parameters } = event.detail;

      if (toolName === 'addTransaction') {
        try {
          const { amount, category, merchant, paymentMethod } = parameters;
          
          if (!amount) {
            event.detail.reject({ status: 'error', message: 'Amount is required' });
            return;
          }

          await addExpense({
            amount: Number(amount),
            category: category || 'Other',
            merchant: merchant || 'AI Assistant',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: paymentMethod || 'UPI',
            currency: 'INR',
            aiScanned: false,
            note: 'Logged via AI Voice Assistant'
          });

          toast.success(`AI Logged: ₹${amount} in ${category || 'Expenses'}`, {
            icon: '🤖',
            duration: 5000,
            style: {
              borderRadius: '20px',
              background: '#0f172a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '16px',
              fontWeight: 'bold'
            }
          });

          // Resolve the tool call for the AI agent so it can confirm to the user
          if (event.detail.resolve) {
            event.detail.resolve({ status: 'success', message: 'Transaction logged successfully' });
          }
        } catch (error: any) {
          console.error('AI Tool Error:', error);
          toast.error('AI failed to log transaction');
          if (event.detail.reject) {
            event.detail.reject({ status: 'error', message: error.message || 'Failed to log transaction' });
          }
        }
      }
    };

    const widget = widgetRef.current;
    if (widget) {
      widget.addEventListener('elevenlabs-convai:call', handleToolCall);
    }

    return () => {
      if (widget) {
        widget.removeEventListener('elevenlabs-convai:call', handleToolCall);
      }
    };
  }, [addExpense, user]);

  return (
    <>
      <style>{`
        elevenlabs-convai {
          position: fixed !important;
          z-index: 9999 !important;
          right: 24px !important;
          bottom: 110px !important; /* Above mobile navbar */
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          elevenlabs-convai {
            bottom: 24px !important; /* Normal bottom for desktop */
          }
        }
      `}</style>
      {/* @ts-ignore - custom web component */}
      <elevenlabs-convai 
        ref={widgetRef}
        agent-id={import.meta.env.VITE_ELEVENLABS_AGENT_ID}
      ></elevenlabs-convai>
    </>
  );
};

export default FinlyAssistant;
