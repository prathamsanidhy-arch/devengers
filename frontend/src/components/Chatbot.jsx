import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, ChevronDown, Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Namaste! I am your AI Citizen Assistant. How can I help you today?', isMarkdown: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Speech Recognition Setup
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Default to Indian English

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        // Handle permission denial
        if (event.error === 'not-allowed') {
          alert("Microphone access denied. Please allow microphone permissions in your browser.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Microphone start error:", e);
      }
    }
  };

  // Text to Speech
  const speak = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    
    // Remove markdown and navigation tags before speaking
    const cleanText = text.replace(/\[NAVIGATE:.*?\]/g, '')
                          .replace(/\*\*(.*?)\*\*/g, '$1')
                          .replace(/\*(.*?)\*/g, '$1')
                          .replace(/#/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.cancel(); // Stop any current speech
    window.speechSynthesis.speak(utterance);
  };

  const toggleTts = () => {
    setTtsEnabled(!ttsEnabled);
    if (!ttsEnabled) {
      // Just turning it on doesn't speak anything immediately
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async (textToSend = input) => {
    const userText = textToSend.trim();
    if (!userText) return;
    
    const newMsg = { id: Date.now(), type: 'user', text: userText, isMarkdown: false };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userText,
        history: messages
      });

      setIsTyping(false);

      if (response.data.success) {
        const fullResponse = response.data.data.text;
        
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          type: 'bot', 
          text: fullResponse, 
          isMarkdown: true 
        }]);

        // Process final response for actions
        processResponseActions(fullResponse);
        
        // Speak final response
        if (ttsEnabled) {
            speak(fullResponse);
        }
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          type: 'bot', 
          text: response.data.message || 'Sorry, I encountered an error. Please try again.', 
          isMarkdown: false 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage = error.response?.data?.message || 'Sorry, I encountered an error connecting to the server. Please try again.';
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: errorMessage, 
        isMarkdown: false 
      }]);
    }
  };

  const processResponseActions = (text) => {
    const navMatch = text.match(/\[NAVIGATE:\s*(.*?)\s*\]/);
    if (navMatch && navMatch[1]) {
      const path = navMatch[1];
      setTimeout(() => {
        navigate(path);
      }, 1500); // Give user a moment to read before navigating
    }
  };

  // Format bot text to hide commands and parse markdown
  const formatBotText = (text) => {
    let display = text.replace(/\[NAVIGATE:.*?\]/g, '');
    
    // simple markdown parser for bold and line breaks
    const html = display
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');
        
    return { __html: html };
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
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center border-2 border-white relative">
                  <Bot className="w-6 h-6" />
                  {isSpeaking && (
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    AI Citizen Assistant
                    <button 
                      onClick={toggleTts} 
                      className={`p-1.5 rounded-full transition-colors ${ttsEnabled ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      title={ttsEnabled ? "Text-to-Speech ON" : "Text-to-Speech OFF"}
                    >
                      {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>
                  </h3>
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
                       <div dangerouslySetInnerHTML={formatBotText(msg.text)} />
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
              {['Open Dashboard', 'Track Complaints', 'Find Schemes'].map((qr, i) => (
                <button key={i} onClick={() => { setInput(qr); handleSend(qr); }} className="inline-block px-4 py-1.5 bg-white border border-slate-200 text-xs font-medium text-slate-600 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors">
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2">
                <button 
                  type="button"
                  onClick={toggleListening}
                  title="Voice Input"
                  className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Ask anything..."} 
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm bg-slate-50"
                  />
                  <button type="submit" disabled={!input.trim() || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-600 hover:bg-brand-50 rounded-lg disabled:opacity-50 transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
