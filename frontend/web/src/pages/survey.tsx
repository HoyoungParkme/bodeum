import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layouts/layout";
import { useQuestions, QUESTIONS_PER_PAGE, TOTAL_PAGES, Question } from "@/hooks/use-assessment";
import { Category, useAssessment } from "@/contexts/assessment-context";

const LIKERT_LABELS = [
  "전혀 아니다",
  "그렇지 않은 편",
  "보통이다",
  "그런 편이다",
  "매우 그렇다",
];

const CATEGORY_COLORS: Record<Category, string> = {
  O: "text-amber-700 bg-amber-50",
  C: "text-blue-700 bg-blue-50",
  E: "text-rose-700 bg-rose-50",
  A: "text-emerald-700 bg-emerald-50",
  N: "text-violet-700 bg-violet-50",
};

const CATEGORY_LABELS: Record<Category, string> = {
  O: "개방성",
  C: "성실성",
  E: "외향성",
  A: "친화성",
  N: "정서 민감성",
};

const QUESTION_COPY: Record<Category, string[]> = {
  O: [
    "새로운 아이디어를 탐색하는 일이 즐겁다.",
    "낯선 경험이 내 시야를 넓혀 준다고 느낀다.",
    "익숙한 방식보다 다른 관점을 시도해 보고 싶다.",
    "예술, 문화, 디자인 같은 자극에 민감하게 반응한다.",
    "추상적인 주제를 생각하는 시간이 흥미롭다.",
    "새로운 도구나 방식이 나오면 직접 써 보고 싶다.",
    "한 가지 정답보다 여러 가능성을 떠올리는 편이다.",
    "변화가 생기면 불편함보다 호기심이 먼저 든다.",
    "새로운 사람이나 환경에서 배울 점을 찾는다.",
    "기존 규칙을 조금 다르게 해석하는 편이다.",
  ],
  C: [
    "일정을 세우면 가능한 한 지키려고 한다.",
    "마감은 미리 챙겨 두어야 마음이 편하다.",
    "정리된 환경에서 집중이 더 잘된다.",
    "우선순위를 나눠 일하는 편이다.",
    "즉흥적으로 움직이기보다 계획을 선호한다.",
    "한번 맡은 일은 끝까지 책임지려 한다.",
    "실수를 줄이기 위해 다시 확인하는 편이다.",
    "해야 할 일을 메모하거나 목록으로 관리한다.",
    "예상치 못한 변수에도 구조를 다시 세우려 한다.",
    "큰 목표를 작은 단계로 나누는 편이다.",
  ],
  E: [
    "사람들과 이야기하면 에너지가 생긴다.",
    "새로운 모임에 들어가는 일이 크게 부담되지 않는다.",
    "내 생각을 먼저 꺼내는 편이다.",
    "여럿이 함께 있을 때 존재감이 커진다.",
    "혼자보다 함께 움직일 때 동기부여가 된다.",
    "분위기를 이끄는 역할을 맡아도 괜찮다.",
    "낯선 사람과도 금방 대화를 시작할 수 있다.",
    "행동으로 먼저 옮기며 리듬을 만든다.",
    "즉흥적인 제안에도 비교적 열려 있다.",
    "혼자만의 시간보다 교류하는 시간이 더 충전된다.",
  ],
  A: [
    "상대의 입장을 먼저 이해하려고 한다.",
    "갈등이 생기면 조율점을 찾으려 한다.",
    "다른 사람의 감정을 쉽게 눈치채는 편이다.",
    "협력하는 환경이 경쟁하는 환경보다 편하다.",
    "누군가 힘들어 보이면 도와주고 싶다.",
    "강하게 주장하기보다 부드럽게 설득하는 편이다.",
    "관계를 오래 유지하는 것을 중요하게 생각한다.",
    "상대가 편안하도록 표현 방식을 조정한다.",
    "내가 조금 양보하면 상황이 좋아질 때가 많다.",
    "차가운 피드백보다 따뜻한 피드백을 선호한다.",
  ],
  N: [
    "압박이 높아지면 감정 기복이 커지는 편이다.",
    "사소한 일에도 오래 신경이 쓰일 때가 있다.",
    "실수 가능성을 먼저 떠올리는 편이다.",
    "스트레스가 쌓이면 몸도 쉽게 피곤해진다.",
    "예상과 다른 일이 생기면 흔들리는 편이다.",
    "타인의 반응을 지나치게 곱씹을 때가 있다.",
    "걱정이 많아지면 집중력이 떨어진다.",
    "긴장이 오래 지속되면 회복에 시간이 걸린다.",
    "감정이 예민해지는 시기를 자주 경험한다.",
    "불확실성이 커지면 불안도 같이 커진다.",
  ],
};

function getQuestionText(question: Question) {
  const prompts = QUESTION_COPY[question.category];
  return prompts[(question.id - 1) % prompts.length];
}

export default function Survey() {
  const [, setLocation] = useLocation();
  const { data: questions, isLoading } = useQuestions();
  const { setAnswers } = useAssessment();

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setLocalAnswers] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState(1);

  if (isLoading || !questions) {
    return (
      <Layout showNav={false}>
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">설문을 불러오는 중입니다...</p>
        </div>
      </Layout>
    );
  }

  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE,
  );
  const answeredOnPage = pageQuestions.filter((question) => answers[question.id] !== undefined).length;
  const allAnsweredOnPage = answeredOnPage === pageQuestions.length;
  const isLastPage = currentPage === TOTAL_PAGES - 1;
  const startQuestion = currentPage * QUESTIONS_PER_PAGE + 1;
  const endQuestion = Math.min(startQuestion + QUESTIONS_PER_PAGE - 1, questions.length);
  const progressPct = ((currentPage + 1) / TOTAL_PAGES) * 100;

  const handleAnswer = (questionId: number, value: number) => {
    setLocalAnswers((previous) => ({ ...previous, [questionId]: value }));
  };

  const handleNext = () => {
    if (isLastPage) {
      setAnswers(answers);
      setLocation("/chat");
      return;
    }

    setDirection(1);
    setCurrentPage((previous) => previous + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (currentPage === 0) {
      return;
    }

    setDirection(-1);
    setCurrentPage((previous) => previous - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout showNav={false}>
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col pb-8">
        <div className="sticky top-0 z-30 mb-6 border-b border-border/40 bg-background/95 pb-3 pt-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              이전
            </button>

            <div className="text-center">
              <span className="text-sm font-bold text-foreground">{startQuestion}-{endQuestion}</span>
              <span className="text-sm text-muted-foreground"> / 100</span>
            </div>

            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {currentPage + 1} / {TOTAL_PAGES}
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        {pageQuestions[0] && (
          <div className="mb-5 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[pageQuestions[0].category]}`}>
              {CATEGORY_LABELS[pageQuestions[0].category]}
            </span>
            <span className="text-xs text-muted-foreground">
              {answeredOnPage}/{pageQuestions.length} answered
            </span>
          </div>
        )}

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction < 0 ? 40 : -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className="flex flex-1 flex-col gap-4"
          >
            {pageQuestions.map((question, index) => {
              const selected = answers[question.id];

              return (
                <div
                  key={question.id}
                  className={`rounded-2xl border bg-card p-5 transition-all duration-200 sm:p-6 ${
                    selected !== undefined ? "border-primary/25 shadow-sm shadow-primary/5" : "border-border"
                  }`}
                >
                  <div className="mb-3 flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {startQuestion + index}
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Statement {question.id}
                      </p>
                      <p className="mt-1 text-base font-medium leading-relaxed text-foreground sm:text-lg">
                        {getQuestionText(question)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const isSelected = selected === value;

                      return (
                        <button
                          key={value}
                          onClick={() => handleAnswer(question.id, value)}
                          className="group flex flex-1 flex-col items-center gap-1.5 transition-all duration-150"
                        >
                          <div
                            className={`flex h-11 w-full items-center justify-center rounded-xl border-2 text-sm font-bold transition-all duration-150 sm:h-12 ${
                              isSelected
                                ? "scale-105 border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                : "border-border bg-background text-muted-foreground group-hover:border-primary/40 group-hover:bg-primary/5"
                            }`}
                          >
                            {value}
                          </div>
                          <span className="hidden text-center text-[10px] leading-tight text-muted-foreground sm:block sm:text-xs">
                            {LIKERT_LABELS[value - 1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-col gap-3">
          {!allAnsweredOnPage && (
            <p className="text-center text-xs text-muted-foreground">
              현재 페이지의 문항에 모두 응답해야 다음으로 이동할 수 있습니다.
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-5 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              이전
            </button>

            <button
              onClick={handleNext}
              disabled={!allAnsweredOnPage}
              className={`flex-1 rounded-xl py-3.5 text-sm font-semibold transition-all ${
                allAnsweredOnPage
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:-translate-y-0.5"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isLastPage ? "AI 코칭으로 이동" : "다음 페이지"}
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
