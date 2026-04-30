"use client";

import React, { useState } from "react";
import { ElectionTimeline } from "@/components/ElectionTimeline";
import { ConstituencyMap } from "@/components/ConstituencyMap";
import { BoothFinderModal } from "@/components/BoothFinderModal";
import { motion } from "framer-motion";
import { MapPin, Bot, CheckCircle2, Zap, Cloud } from "lucide-react";
import { useQuizStore } from "@/store/useQuizStore";

export default function Home() {
  const { completedQuizzes } = useQuizStore();
  const [isBoothModalOpen, setIsBoothModalOpen] = useState(false);
  const progressPercent = (completedQuizzes.length / 6) * 100;

  return (
    <div className="flex flex-col flex-1 items-center justify-start pb-20 pt-24 px-4 md:px-8 overflow-x-hidden">
      {/* Narrative Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl w-full text-center mb-20 space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border text-foreground text-xs font-bold tracking-widest uppercase mb-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-tricolor-line opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9933] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9933]"></span>
          </span>
          Live 2026 Voter Hub
        </div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight leading-[1.1] mb-6">
          Every Vote <span className="text-[#FF9933]">Counts</span>. <br/>
          Every Voice <span className="text-[#138808]">Matters</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          Welcome to your simple guide to voting in India. Clear, easy, and made for every citizen of Bharat.
        </p>

        {/* Friendly Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-primary text-white rounded-full font-black text-base shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            How to Vote
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBoothModalOpen(true)}
            className="px-8 py-4 bg-card border border-border rounded-full font-black text-base text-foreground hover:bg-muted/50 transition-all shadow-sm cursor-pointer"
          >
            Find My Booth
          </motion.button>
        </div>
      </motion.div>

      {/* Map Section */}
      <div className="w-full max-w-6xl mb-32">
        <ConstituencyMap />
      </div>

      {/* Narrative Steps section */}
      <div id="timeline" className="w-full max-w-6xl">
        <ElectionTimeline />
      </div>

      <BoothFinderModal 
        isOpen={isBoothModalOpen} 
        onClose={() => setIsBoothModalOpen(false)} 
      />
    </div>
  );
}
