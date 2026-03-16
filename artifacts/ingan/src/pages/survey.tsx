import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { useQuestions, QUESTIONS_PER_PAGE, TOTAL_PAGES } from "@/hooks/use-assessment";

const LIKERT_LABELS = ["전혀\n아니다", "아니다", "보통", "그렇다", "매우\n그렇다"];
const CATEGORY_COLORS: Record<string, string> = {
  O: "text-amber-600 bg-amber-50",
  C: "text-blue-600 bg-blue-50",
  E: "text-rose-600 bg-rose-50",
  A: "text-emerald-600 bg-emerald-50",
  N: "text-violet-600 bg-violet-50",
};

export default function Survey() {
  const [, setLocation] = useLocation();
  const { data: questions, isLoading } = useQuestions();

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState(1);

  if (isLoading || !questions) {
    return (
      <Layout showNav={false}>
        <div className="flex flex-col items-center justify-center flex-1 h-[60vh]">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">질문을 불러오는 중입니다...</p>
        </div>
      </Layout>
    );
  }

  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE
  );

  const answeredOnPage = pageQuestions.filter(q => answers[q.id] !== undefined).length;
  const allAnsweredOnPage = answeredOnPage === pageQuestions.length;
  const isLastPage = currentPage === TOTAL_PAGES - 1;

  const startQ = currentPage * QUESTIONS_PER_PAGE + 1;
  const endQ = Math.min(startQ + QUESTIONS_PER_PAGE - 1, questions.length);
  const progressPct = (currentPage / TOTAL_PAGES) * 100;

  const handleAnswer = (questionId: number, val: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleNext = () => {
    if (isLastPage) {
      setLocation("/chat");
    } else {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
  };

  return (
    <Layout showNav={false}>
      <div className="max-w-2xl mx-auto w-full flex flex-col min-h-screen pb-8">

        {/* Sticky Progress Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm pt-4 pb-3 mb-6 border-b border-border/40">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none py-1 px-2 -ml-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">이전</span>
            </button>

            <div className="text-center">
              <span className="text-sm font-bold text-foreground">
                {startQ}–{endQ}
              </span>
              <span className="text-sm text-muted-foreground"> / 100문항</span>
            </div>

            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {currentPage + 1} / {TOTAL_PAGES} 페이지
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Category label for this page */}
        <div className="mb-5 flex items-center gap-2">
          {pageQuestions[0] && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[pageQuestions[0].category]}`}>
              {pageQuestions[0].categoryLabel} 파트
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {answeredOnPage}/{pageQuestions.length}개 응답
          </span>
        </div>

        {/* Questions */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className="flex flex-col gap-4 flex-1"
          >
            {pageQuestions.map((q, idx) => {
              const selected = answers[q.id];
              return (
                <div
                  key={q.id}
                  className={`bg-card border rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
                    selected !== undefined
                      ? "border-primary/25 shadow-sm shadow-primary/5"
                      : "border-border"
                  }`}
                >
                  {/* Question text */}
                  <div className="flex gap-3 mb-5">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                      {startQ + idx}
                    </span>
                    <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                      {q.text}
                    </p>
                  </div>

                  {/* Likert scale */}
                  <div className="flex items-end justify-between gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = selected === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAnswer(q.id, val)}
                          className={`flex-1 flex flex-col items-center gap-1.5 group transition-all duration-150`}
                        >
                          <div
                            className={`
                              w-full h-11 sm:h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all duration-150
                              ${isSelected
                                ? "border-primary bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/20"
                                : "border-border bg-background text-muted-foreground group-hover:border-primary/40 group-hover:bg-primary/5 group-active:scale-95"
                              }
                            `}
                          >
                            {val}
                          </div>
                          <span className="text-[10px] sm:text-xs text-muted-foreground text-center leading-tight whitespace-pre-line hidden sm:block">
                            {LIKERT_LABELS[val - 1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile: show labels below extreme values only */}
                  <div className="flex justify-between mt-1 sm:hidden">
                    <span className="text-[10px] text-muted-foreground">전혀 아니다</span>
                    <span className="text-[10px] text-muted-foreground">매우 그렇다</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Nav */}
        <div className="mt-8 flex flex-col gap-3">
          {!allAnsweredOnPage && (
            <p className="text-center text-xs text-muted-foreground">
              이 페이지의 모든 문항에 답하면 다음으로 이동할 수 있습니다.
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4" />
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={!allAnsweredOnPage}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                allAnsweredOnPage
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isLastPage ? "설문 완료" : "다음 페이지"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
