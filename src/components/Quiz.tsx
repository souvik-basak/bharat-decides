"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/store/useQuizStore";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

interface QuizProps {
  quizId: string;
  title: string;
  questions: Question[];
}

export function Quiz({ quizId, title, questions }: QuizProps) {
  const { incrementScore, markQuizCompleted, completedQuizzes } = useQuizStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const isCompleted = completedQuizzes.includes(quizId);
  const currentQuestion = questions[currentQuestionIndex];
  
  if (isCompleted) {
    return (
      <Card className="w-full bg-secondary/5 border-secondary/20">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4 shadow-lg shadow-secondary/20">
            <CheckCircle2 className="w-8 h-8 text-white fill-white/20" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Knowledge Mastered!</h3>
          <p className="text-muted-foreground">You have successfully completed the &quot;{title}&quot; quiz.</p>
        </CardContent>
      </Card>
    );
  }

  const handleOptionClick = (index: number) => {
    if (showExplanation) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === currentQuestion.correctOptionIndex) {
      incrementScore(quizId);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      markQuizCompleted(quizId);
    }
  };

  return (
    <Card className="w-full border-border bg-card/50">
      <CardHeader className="py-4">
        <CardTitle className="text-base flex justify-between items-center font-bold text-foreground/80">
          <span>{title}</span>
          <span className="text-[10px] font-black tracking-widest uppercase opacity-50">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-6">
        <h4 className="font-bold text-base leading-snug mb-2 text-foreground">{currentQuestion.text}</h4>
        
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctOptionIndex;
            const shouldShowResult = showExplanation;
            
            let statusClasses = "border-border/60 hover:border-primary/40 hover:bg-primary/5 bg-background/50";
            let icon = null;

            if (shouldShowResult) {
              if (isCorrect) {
                statusClasses = "bg-green-500 border-green-600 text-white shadow-md shadow-green-500/20";
                icon = <CheckCircle2 className="w-4 h-4 mr-2.5 shrink-0" />;
              } else if (isSelected) {
                statusClasses = "bg-red-500 border-red-600 text-white shadow-md shadow-red-500/20";
                icon = <XCircle className="w-4 h-4 mr-2.5 shrink-0" />;
              } else {
                statusClasses = "opacity-30 border-border bg-muted/10 grayscale-[0.5]";
              }
            } else if (isSelected) {
              statusClasses = "border-primary bg-primary/5 ring-1 ring-primary/20";
            }

            return (
              <motion.button
                key={index}
                whileHover={!shouldShowResult ? { scale: 1.005 } : {}}
                whileTap={!shouldShowResult ? { scale: 0.995 } : {}}
                onClick={() => handleOptionClick(index)}
                disabled={shouldShowResult}
                className={`w-full flex items-center justify-start h-auto py-3 px-4 rounded-xl border text-sm text-left transition-all duration-200 ${statusClasses}`}
              >
                {icon}
                <span className="flex-1 font-medium">{option}</span>
              </motion.button>
            );
          })}
        </div>

        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 overflow-hidden rounded-xl border-l-4 shadow-sm ${
              selectedOption === currentQuestion.correctOptionIndex 
                ? 'bg-green-500/5 border-green-500' 
                : 'bg-red-500/5 border-red-500'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <p className={`font-black uppercase tracking-widest text-[10px] ${
                  selectedOption === currentQuestion.correctOptionIndex ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedOption === currentQuestion.correctOptionIndex ? "Correct Intelligence" : "Correction Needed"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
      {showExplanation && (
        <CardFooter className="pb-6 px-6 justify-end">
          <Button 
            onClick={handleNext}
            className="rounded-lg px-6 py-2 h-auto text-sm font-black uppercase shadow-lg shadow-primary/10 font-semibold"
          >
            {currentQuestionIndex < questions.length - 1 ? "Next Briefing" : "Finish Mission"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
