import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Namaste! I am your AI Citizen Assistant. How can I help you today?', isMarkdown: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), type: 'user', text: input, isMarkdown: false };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      setIsTyping(false);
      let reply = "I can help you navigate government services, find schemes, or report complaints. Please provide more specific details.";
      
      const lowerInput = newMsg.text.toLowerCase();
      if (lowerInput.includes('passport')) {
        reply = "**Passport Application Steps:**\n1. Register on Passport Seva Portal\n2. Fill the application form online\n3. Pay fee & schedule appointment\n4. Visit PSK with original documents.";
      } else if (lowerInput.includes('complaint') || lowerInput.includes('issue')) {
        reply = "You can easily report an issue by navigating to the **Submit Complaint** page. Our AI will automatically detect the category from your photo!";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: reply, isMarkdown: true }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-brand text-white shadow-2xl flex items-center justify-center hover:shadow-brand-500/50 hover:scale-105 transition-all z-50 group"
          >
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
            <Bot className="w-8 h-8 group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 sm:w-[400px] w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gov-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center border-2 border-white/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">AI Citizen Assistant</h3>
                  <p className="text-xs text-brand-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${
                    msg.type === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-sm shadow-md' 
                      : 'bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100'
                  }`}>
                    {msg.isMarkdown ? (
                       <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 bg-slate-50 overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar border-t border-slate-100 shrink-0">
              {['How to apply for passport?', 'Check schemes', 'Emergency numbers'].map((qr, i) => (
                <button key={i} onClick={() => setInput(qr)} className="inline-block px-4 py-1.5 bg-white border border-slate-200 text-xs font-medium text-slate-600 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors">
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..." 
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm bg-slate-50"
                />
                <button type="submit" disabled={!input.trim() || isTyping} className="absolute right-2 p-2 text-brand-600 hover:bg-brand-50 rounded-lg disabled:opacity-50 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
