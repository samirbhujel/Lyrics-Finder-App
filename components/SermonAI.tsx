import React, { useState, useRef, useEffect, memo } from 'react';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Sparkles } from 'lucide-react';

// PERFORMANCE OPTIMIZATION:
// Memoized component to prevent re-rendering historical messages
// every time the AI streams a new character chunk.
const MessageBubble = memo(({ msg }: { msg: ChatMessage }) => (
  <div 
    className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
  >
    {/* Avatar */}
    <div className={`
      w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
      ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white text-indigo-600'}
    `}>
      {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
    </div>
    
    {/* Bubble */}
    <div className={`
      max-w-[85%] sm:max-w-[75%] px-5 py-3 shadow-sm text-[15px] leading-relaxed
      ${msg.role === 'user' 
        ? 'bg-slate-800 text-white rounded-2xl rounded-tr-sm' 
        : 'bg-white/80 backdrop-blur-sm text-slate-800 border border-white/50 rounded-2xl rounded-tl-sm'}
    `}>
      <div className="whitespace-pre-wrap">
        {msg.text || <div className="flex space-x-1 pt-2 pb-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div></div>}
      </div>
    </div>
  </div>
));

const SermonAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Namaste! I am Anugrah AI. I can help you with Roman Nepali Bible verses, theological questions, or sermon prep. How can I serve you today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]); // Only scroll on new messages or typing status change

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const stream = streamChatResponse(history, userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        // Functional state update ensures we don't lose previous messages
        // but we need to be careful not to trigger excessive re-renders of the whole list.
        // The MessageBubble memoization handles the heavy lifting here.
        setMessages(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { 
            ...newHistory[newHistory.length - 1], 
            text: fullText 
          };
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I apologize, but I am having trouble connecting right now. Please try again later.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-white/50 overflow-hidden transform-gpu">
      {/* Glass Header */}
      <div className="bg-white/40 backdrop-blur-lg border-b border-white/30 p-5 flex items-center space-x-4 z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Pastoral Assistant</h3>
          <p className="text-xs font-medium text-slate-500">Powered by Anugrah AI</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/40 backdrop-blur-lg border-t border-white/30">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a theological question..."
            className="w-full pl-6 pr-12 py-4 rounded-[1.5rem] border border-white/60 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none bg-white/70 backdrop-blur-xl transition-all shadow-sm placeholder:text-slate-400 text-slate-800"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SermonAI;