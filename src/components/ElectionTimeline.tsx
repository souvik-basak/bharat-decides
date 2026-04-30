"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, AlertCircle, ShieldCheck, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz, Question } from "./Quiz";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ELECTION_STAGES = [
  {
    id: "registration",
    title: "Voters Registration",
    description: "The foundation of democracy",
    details: "As per Article 326 of the Constitution, every citizen aged 18+ is entitled to be registered. Form 6 is the primary application. Once verified by the Booth Level Officer (BLO), your name is added to the Electoral Roll and you receive an EPIC card.",
    proTip: "Use the 'Voter Helpline App' to track your application status in real-time.",
    myth: "You can vote just by having an Aadhaar card.",
    fact: "You MUST be on the Electoral Roll to vote. An Aadhaar is only an ID proof, not a permit to vote.",
    quiz: {
      id: "quiz-registration",
      title: "Registration Intelligence",
      questions: [
        {
          id: "q1",
          text: "Which form is used for first-time voter registration?",
          options: ["Form 7", "Form 8", "Form 6", "Form 12"],
          correctOptionIndex: 2,
          explanation: "Form 6 is for first-time voters. Form 7 is for deletions, and Form 8 is for corrections."
        },
        {
          id: "q1-2",
          text: "Who is the primary official responsible for verifying voter applications at the local level?",
          options: ["District Magistrate", "Booth Level Officer (BLO)", "Chief Minister", "Police Inspector"],
          correctOptionIndex: 1,
          explanation: "The BLO is the ground-level official who conducts physical verification of your residence."
        }
      ] as Question[]
    }
  },
  {
    id: "nomination",
    title: "Candidate Nomination",
    description: "The battle for representation",
    details: "Candidates must file nomination papers (Form 2A/2B) before the Returning Officer. Under the RPA 1951, they must also file an Affidavit (Form 26) disclosing criminal records, assets, liabilities, and educational qualifications.",
    proTip: "You can check any candidate's criminal records and assets on the 'KYC-ECI' app.",
    myth: "Only rich people can contest elections.",
    fact: "The security deposit is ₹25,000 for Lok Sabha (₹12,500 for SC/ST). This is to ensure only serious candidates apply.",
    quiz: {
      id: "quiz-nomination",
      title: "Nomination Rules",
      questions: [
        {
          id: "q2",
          text: "Which document must a candidate file to disclose their assets and criminal records?",
          options: ["Form 6", "Form 26 Affidavit", "Passport", "Voter ID"],
          correctOptionIndex: 1,
          explanation: "Form 26 is a mandatory affidavit where candidates disclose their full background to the public."
        }
      ] as Question[]
    }
  },
  {
    id: "scrutiny",
    title: "Scrutiny & Withdrawal",
    description: "Ensuring candidate eligibility",
    details: "The Returning Officer (RO) examines all nomination papers to ensure they are valid. If a candidate's papers have major errors or they are disqualified, their nomination is rejected. Candidates can then choose to withdraw their name within a 2-day window.",
    proTip: "The list of validly nominated candidates is published in 'Form 4'.",
    myth: "Once nominated, you cannot back out.",
    fact: "The law provides a specific 'Withdrawal Period' (usually 2 days) after scrutiny is complete.",
    quiz: null
  },
  {
    id: "campaigning",
    title: "Campaigning & Silence",
    description: "Reaching the people",
    details: "Political parties use rallies, manifestos, and media to campaign. This is strictly regulated by the ECI to prevent bribery or hate speech. A 'Silence Period' begins 48 hours before the close of polls, during which all public campaigning must stop.",
    proTip: "Report MCC violations like illegal posters or bribery via the 'cVIGIL' app.",
    myth: "Campaigning happens until the moment voting starts.",
    fact: "Section 126 of the RPA prohibits public meetings and campaigning 48 hours before the poll ends.",
    quiz: {
      id: "quiz-campaigning",
      title: "Campaign Laws",
      questions: [
        {
          id: "q3",
          text: "What is the duration of the 'Silence Period' before polling concludes?",
          options: ["12 hours", "24 hours", "48 hours", "72 hours"],
          correctOptionIndex: 2,
          explanation: "The 48-hour window allows voters to deliberate without external influence from rallies or media ads."
        }
      ] as Question[]
    }
  },
  {
    id: "voting",
    title: "Voting & Technology",
    description: "EVM, VVPAT & Your Vote",
    details: "India uses Electronic Voting Machines (EVM) for speed and accuracy. Since 2019, every EVM is attached to a VVPAT (Voter Verifiable Paper Audit Trail). When you vote, a slip is visible for 7 seconds behind a glass window to confirm your choice.",
    proTip: "Always check the VVPAT slip! It should show the Serial Number, Name, and Symbol of your chosen candidate.",
    myth: "EVMs can be hacked via Bluetooth or WiFi.",
    fact: "EVMs are standalone machines with NO wireless communication capabilities. They are 'one-time programmable' (OTP) chips.",
    quiz: {
      id: "quiz-voting",
      title: "Tech at the Booth",
      questions: [
        {
          id: "q4",
          text: "How long is the VVPAT slip visible to the voter?",
          options: ["2 seconds", "7 seconds", "15 seconds", "Until the next voter comes"],
          correctOptionIndex: 1,
          explanation: "The slip appears for exactly 7 seconds before automatically dropping into the sealed ballot box."
        }
      ] as Question[]
    }
  },
  {
    id: "counting",
    title: "Counting & Results",
    description: "The declaration of the mandate",
    details: "Counting is done under CCTV surveillance in the presence of 'Counting Agents' from all political parties. VVPAT slips from 5 randomly selected polling stations in every assembly segment are physically counted to verify the EVM results.",
    proTip: "Live results are officially published on 'results.eci.gov.in'.",
    myth: "Results can be changed after the EVMs are stored.",
    fact: "EVMs are stored in 'Strong Rooms' with double locks and 24/7 CAPF (Central Armed Police Forces) security.",
    quiz: null
  }
];

export default function ElectionTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState("learn");

  const handleStepChange = (index: number) => {
    setActiveStep(index);
    setActiveTab("learn");
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 flex flex-col md:flex-row gap-12 relative">
      {/* Narrative Stepper */}
      <div className="md:w-1/3 lg:w-1/4 space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-heading font-extrabold tracking-tight">The <span className="text-gradient">Journey</span></h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From the initial voter registration to the declaration of results, follow each critical phase of the democratic process.
          </p>
        </div>

        <div className="flex flex-col gap-8 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[1.4rem] top-6 bottom-6 w-0.5 bg-border overflow-hidden rounded-full">
            <motion.div 
              className="w-full bg-gradient-to-b from-primary to-orange-500"
              initial={{ height: 0 }}
              animate={{ height: `${(activeStep / (ELECTION_STAGES.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {ELECTION_STAGES.map((stage, index) => {
            const isActive = index === activeStep;
            const isPast = index < activeStep;
            
            return (
              <motion.div 
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center gap-6 group cursor-pointer"
                onClick={() => handleStepChange(index)}
              >
                <div className={`
                  relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-300
                  ${isActive ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-md' : isPast ? 'bg-secondary border-secondary text-white' : 'bg-card border-border'}
                `}>
                  {isPast ? <CheckCircle2 className="w-6 h-6 text-white fill-white/20" /> : <span className={`text-sm font-bold ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{index + 1}</span>}
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isActive ? 'text-primary' : 'text-muted-foreground/50'}`}>Stage {index + 1}</span>
                  <h3 className={`text-sm font-bold transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>{stage.title}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:w-2/3 lg:w-3/4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-border shadow-sm rounded-[2rem] overflow-hidden"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border bg-muted/5">
                <TabsList className="bg-muted p-1.5 rounded-2xl border border-border flex relative">
                  <TabsTrigger 
                    value="learn" 
                    className="relative rounded-xl px-8 py-2.5 text-sm font-bold transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary z-10"
                  >
                    {activeTab === "learn" && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-card rounded-xl shadow-sm border border-border/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-20">Analysis</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="quiz" 
                    disabled={!ELECTION_STAGES[activeStep].quiz}
                    className="relative rounded-xl px-8 py-2.5 text-sm font-bold transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary disabled:opacity-30 z-10"
                  >
                    {activeTab === "quiz" && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-card rounded-xl shadow-sm border border-border/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-20 flex items-center gap-2">
                      Quiz {ELECTION_STAGES[activeStep].quiz && '💡'}
                    </span>
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">Stage {activeStep + 1} of {ELECTION_STAGES.length}</span>
                </div>
              </div>

              <AnimatePresence>
                <TabsContent value="learn" key={`${activeStep}-learn`} className="mt-0 p-6 md:p-8 min-h-[400px]">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full space-y-6"
                  >
                    <div className="space-y-3">
                      <h2 className="text-2xl md:text-4xl font-heading font-black tracking-tight text-foreground">
                        {ELECTION_STAGES[activeStep].title}
                      </h2>
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-4">
                        "{ELECTION_STAGES[activeStep].description}"
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
                        <h4 className="font-bold text-base mb-2 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Intelligence Briefing
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">{ELECTION_STAGES[activeStep].details}</p>
                      </div>

                      <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                          <ShieldCheck className="w-12 h-12 text-primary" />
                        </div>
                        <h4 className="font-bold text-base mb-2 flex items-center gap-2 text-primary">
                          <ShieldCheck className="w-5 h-5" />
                          Pro-Tip
                        </h4>
                        <p className="text-sm font-medium leading-relaxed text-foreground/80">{ELECTION_STAGES[activeStep].proTip}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/10">
                          <div className="flex items-center text-red-500 font-bold mb-2 gap-2 text-xs uppercase tracking-wider">
                            <AlertCircle className="w-4 h-4" /> Common Myth
                          </div>
                          <p className="text-sm leading-relaxed opacity-90">{ELECTION_STAGES[activeStep].myth}</p>
                        </div>
                        <div className="bg-secondary/5 rounded-2xl p-6 border border-secondary/10">
                          <div className="flex items-center text-secondary font-bold mb-2 gap-2 text-xs uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4" /> Verified Fact
                          </div>
                          <p className="text-sm leading-relaxed opacity-90">{ELECTION_STAGES[activeStep].fact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-between items-center border-t border-border">
                      <button
                        onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
                        disabled={activeStep === 0}
                        className="px-6 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => handleStepChange(Math.min(ELECTION_STAGES.length - 1, activeStep + 1))}
                        disabled={activeStep === ELECTION_STAGES.length - 1}
                        className="px-8 py-3 bg-muted/50 hover:bg-muted border border-border rounded-xl text-sm font-bold transition-all disabled:opacity-30"
                      >
                        Continue to Stage 0{activeStep + 2} →
                      </button>
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="quiz" key={`${activeStep}-quiz`} className="mt-0 p-6 md:p-10 min-h-[400px]">
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {ELECTION_STAGES[activeStep].quiz && (
                      <Quiz 
                        quizId={ELECTION_STAGES[activeStep].quiz!.id}
                        title={ELECTION_STAGES[activeStep].quiz!.title}
                        questions={ELECTION_STAGES[activeStep].quiz!.questions}
                      />
                    )}
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export { ElectionTimeline };

