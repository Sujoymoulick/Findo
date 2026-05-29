import React, { useEffect, useRef, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FinlyAssistant = () => {
  const { addExpense } = useExpense();
  const { user } = useAuth();
  const widgetRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
    const handleTrigger = () => {
      console.log('[AI Assistant] Trigger event received');
      const widget = widgetRef.current;
      if (widget) {
        // Try to find the button in shadow root
        const shadow = widget.shadowRoot;
        const btn = shadow?.querySelector('button') || shadow?.querySelector('[role="button"]');
        
        if (btn) {
          console.log('[AI Assistant] Found trigger button, clicking...');
          (btn as HTMLElement).click();
          setIsOpen(true);
        } else {
          console.warn('[AI Assistant] Trigger button not found in shadow DOM. Initializing click on host.');
          widget.click();
          setIsOpen(true);
        }
      } else {
        console.error('[AI Assistant] Widget reference is missing');
      }
    };

    window.addEventListener('trigger-finly', handleTrigger);
    return () => window.removeEventListener('trigger-finly', handleTrigger);
  }, []);

  useEffect(() => {
    const widget = widgetRef.current;
    
    const handleToolCall = (event: any) => {
      // ... existing tool call logic ...
      event.detail.config.clientTools = {
        addTransaction: async (parameters: any) => {
          const { amount, category, merchant } = parameters;
          if (!amount) return { status: 'error', message: 'Amount is required' };
          try {
            await addExpense({
              amount: Number(amount),
              category: category || 'Other',
              merchant: merchant || 'AI Assistant',
              date: new Date().toISOString().split('T')[0],
              paymentMethod: 'UPI',
              currency: 'INR',
              aiScanned: false,
              note: 'Logged via AI Voice Assistant'
            });
            toast.success(`AI Logged: ₹${amount}`, { icon: '🤖' });
            return { status: 'success', message: 'Transaction logged successfully' };
          } catch (error: any) {
            return { status: 'error', message: error.message || 'Failed to log transaction' };
          }
        }
      };
    };

    // ElevenLabs widget fires events when its state changes
    const onOpen = () => {
      console.log('[AI Assistant] Chat window opened');
      setIsOpen(true);
    };
    
    const onClose = () => {
      console.log('[AI Assistant] Chat window closed');
      setIsOpen(false);
    };

    if (widget) {
      widget.addEventListener('elevenlabs-convai:call', handleToolCall);
      widget.addEventListener('elevenlabs-convai:open', onOpen);
      widget.addEventListener('elevenlabs-convai:close', onClose);
    }

    return () => {
      if (widget) {
        widget.removeEventListener('elevenlabs-convai:call', handleToolCall);
        widget.removeEventListener('elevenlabs-convai:open', onOpen);
        widget.removeEventListener('elevenlabs-convai:close', onClose);
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
          bottom: 24px !important;
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: ${isOpen ? '1' : '0'} !important;
          pointer-events: ${isOpen ? 'auto' : 'none'} !important;
          transform: ${isOpen ? 'translateY(0)' : 'translateY(20px)'} !important;
          width: ${isOpen ? '400px' : '0px'} !important;
          height: ${isOpen ? '600px' : '0px'} !important;
          overflow: hidden !important;
        }
      `}</style>
      {/* @ts-ignore */}
      <elevenlabs-convai 
        ref={widgetRef}
        agent-id={import.meta.env.VITE_ELEVENLABS_AGENT_ID}
      ></elevenlabs-convai>
    </>
  );
};

export default FinlyAssistant;
