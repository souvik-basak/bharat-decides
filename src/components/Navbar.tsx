"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-500 ease-in-out
        ${scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3' 
          : 'bg-transparent py-5'}
      `}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-xl flex items-center justify-center font-black font-heading text-xl group-hover:scale-105 transition-all shadow-lg overflow-hidden border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9933] via-card to-[#138808] opacity-90" />
              <div className="absolute inset-[1px] rounded-[9px] bg-background/10 backdrop-blur-sm" />
              <span className="relative z-10 text-foreground drop-shadow-md">I</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tighter leading-none">
                Bharat <span className="text-primary">Decides</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-muted-foreground">Citizen Hub</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50 mr-2">
            <Link href="/" className="px-4 py-1.5 text-xs font-bold rounded-full bg-background text-foreground shadow-sm">
              Home
            </Link>
            <Link href="#timeline" className="px-4 py-1.5 text-xs font-bold rounded-full text-muted-foreground hover:text-foreground transition-colors">
              How to Vote
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
