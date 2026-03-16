import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { useQuestions } from "@/hooks/use-assessment";

export default function Survey() {
  const [, setLocation] = useLocation();
  const { data: questions, isLoading } = useQuestions();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState(1);

  if (isLoading || !questions) {
    return (
      <Layout showNav={false}>
        <div className="flex flex-col items-center justify-center flex-1 h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">질문을 불러오는 중입니다...</p>
        </div>
      </Layout>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (isLast) {
      setLocation("/chat");
    } else {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSelect = (val: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
    // Auto advance after small delay
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <Layout showNav={false}>
      <div className="max-w-3xl mx-auto w-full pt-4 flex flex-col min-h-[75vh]">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              진행률
            </span>
            <span className="font-display font-bold text-primary">
              {currentIndex + 1} <span className="text-muted-foreground text-sm font-sans">/ {questions.length}</span>
            </span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full absolute"
            >
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-border text-center min-h-[300px] flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold leading-relaxed mb-12 text-balance">
                  {currentQ.text}
                </h2>

                <div className="w-full max-w-xl mx-auto">
                  <div className="flex justify-between items-center px-2 mb-4 text-sm font-medium text-muted-foreground">
                    <span>전혀 아니다</span>
                    <span>매우 그렇다</span>
                  </div>
                  
                  <div className="flex justify-between items-center w-full gap-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = answers[currentQ.id] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleSelect(val)}
                          className={`
                            relative flex items-center justify-center
                            w-12 h-12 md:w-16 md:h-16 rounded-full border-2 transition-all duration-200
                            ${isSelected 
                              ? 'border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20' 
                              : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-primary/5'}
                          `}
                        >
                          <span className="text-lg md:text-xl font-bold">{val}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-auto pt-8 flex justify-between items-center pb-8 z-10">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-5 h-5" />
            이전
          </button>
          
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium shadow-md hover:bg-foreground/90 transition-colors"
          >
            {isLast ? "완료" : "다음 건너뛰기"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
