import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Trash2, 
  PlusCircle, 
  Copy, 
  Check, 
  Bot, 
  User as UserIcon, 
  Sparkles,
  ArrowRight,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Analyze my spending habits",
  "Help me create a monthly budget",
  "How can I save more money?",
  "Explain personal finance basics",
  "Track my financial goals"
];

export default function AIAssistant() {
  const { user } = useAuth();
  const { expenses, addExpense } = useExpense();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.name || ''}! I'm FINDO AI Assistant. I can help you understand expenses, budgets, financial planning, spending habits, and answer your finance-related questions.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLElement>(null);

  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

  // ElevenLabs Widget Integration
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
    const widget = widgetRef.current;
    if (!widget) return;

    const handleToolCall = (event: any) => {
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
              note: 'Logged via dedicated AI Assistant page'
            });
            return { status: 'success', message: 'Transaction logged successfully' };
          } catch (error: any) {
            return { status: 'error', message: error.message };
          }
        }
      };
    };

    const handleOpen = () => setIsVoiceActive(true);
    const handleClose = () => setIsVoiceActive(false);

    widget.addEventListener('elevenlabs-convai:call', handleToolCall);
    widget.addEventListener('elevenlabs-convai:open', handleOpen);
    widget.addEventListener('elevenlabs-convai:close', handleClose);

    return () => {
      widget.removeEventListener('elevenlabs-convai:call', handleToolCall);
      widget.removeEventListener('elevenlabs-convai:open', handleOpen);
      widget.removeEventListener('elevenlabs-convai:close', handleClose);
    };
  }, [addExpense]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleVoiceAssistant = () => {
    const widget = widgetRef.current;
    if (widget) {
      const shadow = widget.shadowRoot;
      const btn = shadow?.querySelector('button') || shadow?.querySelector('[role="button"]');
      if (btn) {
        (btn as HTMLElement).click();
      } else {
        // Fallback for some widget versions
        widget.click();
      }
    } else {
      toast.error('AI Widget not loaded yet');
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Mock AI response logic - Integration with real text backend would happen here
    setTimeout(() => {
      let response = "I'm here to help!";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('spending') || lowerText.includes('analyze')) {
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        response = `You've spent ₹${total.toLocaleString()} so far. Your largest expense was at ${expenses[0]?.merchant || 'Unknown'}.`;
      } else if (lowerText.includes('save')) {
        response = "Try setting aside 20% of your income. I can help you track that goal.";
      } else if (lowerText.includes('budget')) {
        response = "I can help you build a budget based on your last 30 days of spending. Want to start?";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)] w-full max-w-5xl mx-auto bg-white/40 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/20 dark:border-white/10 overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="h-20 px-8 flex items-center justify-between border-b border-white/10 shrink-0 relative z-10 bg-white/5 dark:bg-black/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
            <Bot className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">Findo AI Assistant</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isVoiceActive ? 'bg-emerald-500 animate-ping' : 'bg-emerald-500 opacity-60'}`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isVoiceActive ? 'Listening...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleVoiceAssistant}
            className={`p-3 rounded-2xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${
              isVoiceActive 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
              : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
            }`}
          >
            {isVoiceActive ? <MicOff size={18} /> : <Mic size={18} />}
            <span className="hidden sm:inline">{isVoiceActive ? 'Stop Voice' : 'Voice Mode'}</span>
          </button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-2xl transition-all"
            title="New Chat"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar relative">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-900 dark:bg-white text-white dark:text-black'
                }`}>
                  {msg.role === 'user' ? <UserIcon size={18} /> : <Sparkles size={18} />}
                </div>

                <div className="space-y-2">
                  <div className={`p-5 rounded-[1.5rem] text-sm md:text-base leading-relaxed shadow-sm relative group ${
                    msg.role === 'user'
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 text-slate-900 dark:text-white rounded-tr-none border border-blue-500/20'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 rounded-tl-none border border-white/10 dark:border-white/5'
                  }`}>
                    {msg.content}
                    
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content);
                          setCopiedId(msg.id);
                          setTimeout(() => setCopiedId(null), 2000);
                          toast.success('Copied');
                        }}
                        className="absolute -right-12 top-0 p-2 text-slate-400 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        {copiedId === msg.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>
                  <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length < 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mt-12">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="p-4 text-left rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-white/10 hover:border-blue-500/50 hover:bg-white/80 dark:hover:bg-white/[0.05] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{prompt}</span>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/40 dark:bg-white/[0.03] p-4 rounded-2xl flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Generating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-10 shrink-0 bg-white/20 dark:bg-black/20 backdrop-blur-xl border-t border-white/10 relative z-20">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
          className="relative max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] py-5 pl-8 pr-28 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all shadow-2xl dark:text-white"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              disabled={!input.trim() || isLoading}
              className="p-3.5 bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/40 hover:bg-blue-600 disabled:opacity-30 disabled:scale-95 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-[0.2em] font-black opacity-40">
          Powered by ElevenLabs AI
        </p>
      </div>

      {/* ElevenLabs Widget - Off-screen but active */}
      <div className="fixed -bottom-full -left-full pointer-events-none opacity-0 invisible">
        {/* @ts-ignore */}
        <elevenlabs-convai 
          ref={widgetRef}
          agent-id={agentId}
        ></elevenlabs-convai>
      </div>
    </div>
  );
}
