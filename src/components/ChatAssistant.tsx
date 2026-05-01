"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! I'm Vani, your personal election guide. How can I help you be a part of India's democracy today?" }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Placeholder typing animation
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const PLACEHOLDERS = [
    "Inquire about the democratic process...",
    "लोकतांत्रिक प्रक्रिया के बारे में पूछें...",
    "গণতান্ত্রিক প্রক্রিয়া সম্পর্কে জিজ্ঞাসা করুন...",
    "ஜனநாயக செயல்முறை பற்றி கேளுங்கள்...",
    "ప్రజాస్వామ్య ప్రక్రియ గురించి అడగండి...",
    "लोकशाही प्रक्रियेबद्दल विचारा..."
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = PLACEHOLDERS[placeholderIndex];
    
    if (isTyping) {
      if (placeholder.length < currentText.length) {
        timeout = setTimeout(() => {
          setPlaceholder(currentText.slice(0, placeholder.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (placeholder.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(placeholder.slice(0, -1));
        }, 50);
      } else {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setIsTyping(true);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [placeholder, isTyping, placeholderIndex]);

  const OFFICIAL_LANGUAGES = [
    "English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", 
    "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", "Assamese", 
    "Maithili", "Santali", "Kashmiri", "Nepali", "Konkani", "Sindhi", 
    "Dogri", "Manipuri", "Bodo", "Sanskrit"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, language })
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      // Handle Streaming Response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error("No reader available");

      // Add empty assistant message to start streaming into
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      
      let accumulatedResponse = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        
        // Update the last message (the assistant one) with accumulated text
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { 
            role: "assistant", 
            content: accumulatedResponse 
          };
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm so sorry, I'm having a bit of trouble connecting right now. Could you please try again in a moment?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Label for Chat */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-[110px] right-8 z-[110] bg-white dark:bg-card border border-border px-5 py-3 rounded-2xl shadow-2xl pointer-events-none flex items-center gap-3 border-primary/20"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase text-black dark:text-white whitespace-nowrap">Chat with Vani</span>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-card border-r border-b border-border rotate-45 border-primary/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Trigger / Close Toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-[110] h-16 w-16 rounded-[2rem] bg-primary text-primary-foreground shadow-2xl flex items-center justify-center group overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              className="flex items-center justify-center"
            >
              <MessageCircle className="h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Immersive Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-28 right-8 z-[100] w-[420px] max-w-[calc(100vw-2rem)] h-[550px] glass-panel rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-primary/10"
          >
            {/* Header with Vani Branding & Language Selector */}
            <div className="p-6 border-b border-border/50 flex flex-col gap-5 bg-card/95 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-sm">
                         <span className="text-2xl font-black text-primary tracking-tighter">V</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-4 border-background shadow-sm" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-xl text-foreground tracking-tight leading-none mb-1">Vani</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground opacity-70">Your Personal Assistant</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between bg-muted/30 p-2 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 pl-2">
                  <MessageCircle className="w-3.5 h-3.5 text-primary opacity-70" />
                  <span className="text-[13px] text-muted-foreground">Choose your language</span>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-background/80 backdrop-blur-md border border-border/50 rounded-lg text-[11px] font-bold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-background transition-all"
                >
                  {OFFICIAL_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-gradient-to-b from-transparent to-muted/5">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10, x: isUser ? 10 : -10 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border font-black text-xs ${
                      isUser 
                        ? "bg-orange-500 border-orange-600 text-white" 
                        : "bg-emerald-500 border-emerald-600 text-white"
                    }`}>
                      {isUser ? <User className="h-4 w-4" /> : "V"}
                    </div>
                    <div className={`px-5 py-3 rounded-3xl text-[13px] leading-relaxed max-w-[85%] shadow-sm border transition-all whitespace-pre-wrap ${
                      isUser 
                        ? "bg-orange-500/5 border-orange-500/20 rounded-tr-none text-foreground" 
                        : "bg-emerald-500/5 border-emerald-500/20 rounded-tl-none text-foreground"
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                );
              })}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <div className="h-9 w-9 rounded-xl bg-emerald-500 border border-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md font-black text-xs">
                    V
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 px-5 py-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                    <div className="flex gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <span className="text-xs text-muted-foreground">Thinking</span>
                  </div>
                </motion.div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-border/50 bg-card/95 backdrop-blur-2xl">
              <form onSubmit={sendMessage} className="relative group">
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-2xl p-4 h-auto text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all pr-14 shadow-inner"
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg active:scale-90 transition-all flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export { ChatAssistant };
