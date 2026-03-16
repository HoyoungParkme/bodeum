import { createContext, useContext, useState, ReactNode } from "react";

export type Category = 'O' | 'C' | 'E' | 'A' | 'N';

export interface BigFiveScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export interface AssessmentState {
  answers: Record<number, number>;
  scores: BigFiveScores | null;
  isPremium: boolean;
  chatSummary: string | null;
}

interface AssessmentContextValue extends AssessmentState {
  setAnswers: (answers: Record<number, number>) => void;
  computeScores: (answers: Record<number, number>) => BigFiveScores;
  setIsPremium: (v: boolean) => void;
  setChatSummary: (summary: string) => void;
  reset: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

const CATEGORY_QUESTION_RANGES: Record<Category, [number, number]> = {
  O: [1, 20],
  C: [21, 40],
  E: [41, 60],
  A: [61, 80],
  N: [81, 100],
};

function computeScoresFromAnswers(answers: Record<number, number>): BigFiveScores {
  const cats: Category[] = ['O', 'C', 'E', 'A', 'N'];
  const scores: Partial<BigFiveScores> = {};
  for (const cat of cats) {
    const [start, end] = CATEGORY_QUESTION_RANGES[cat];
    let total = 0;
    let count = 0;
    for (let i = start; i <= end; i++) {
      if (answers[i] !== undefined) {
        total += answers[i];
        count++;
      }
    }
    scores[cat] = count > 0 ? Math.round((total / count) * 20) : 60;
  }
  return scores as BigFiveScores;
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>({
    answers: {},
    scores: null,
    isPremium: false,
    chatSummary: null,
  });

  const setAnswers = (answers: Record<number, number>) => {
    const scores = computeScoresFromAnswers(answers);
    setState(prev => ({ ...prev, answers, scores }));
  };

  const computeScores = (answers: Record<number, number>) => {
    return computeScoresFromAnswers(answers);
  };

  const setIsPremium = (v: boolean) => {
    setState(prev => ({ ...prev, isPremium: v }));
  };

  const setChatSummary = (chatSummary: string) => {
    setState(prev => ({ ...prev, chatSummary }));
  };

  const reset = () => {
    setState({ answers: {}, scores: null, isPremium: false, chatSummary: null });
  };

  return (
    <AssessmentContext.Provider value={{ ...state, setAnswers, computeScores, setIsPremium, setChatSummary, reset }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}

// Helpers to interpret scores
export function getDimensionLabel(cat: Category): string {
  const labels: Record<Category, string> = {
    O: '개방성', C: '성실성', E: '외향성', A: '친화성', N: '신경성'
  };
  return labels[cat];
}

export function getHighestDimension(scores: BigFiveScores): Category {
  return (Object.entries(scores) as [Category, number][])
    .reduce((a, b) => b[1] > a[1] ? b : a)[0];
}

export function getLowestDimension(scores: BigFiveScores): Category {
  return (Object.entries(scores) as [Category, number][])
    .reduce((a, b) => b[1] < a[1] ? b : a)[0];
}

export function generateChatOpening(scores: BigFiveScores): string {
  const highest = getHighestDimension(scores);
  const lowest = getLowestDimension(scores);

  const highLabel = getDimensionLabel(highest);
  const lowLabel = getDimensionLabel(lowest);

  const openings: Record<Category, string> = {
    O: `설문 결과를 살펴보니, 새로운 아이디어와 경험에 매우 열려있는 분이시네요. ${highLabel} 지표가 특히 높게 나왔어요.`,
    C: `설문 결과를 보니, 계획을 세우고 꼼꼼하게 실행하는 걸 중요하게 생각하시는 분이시네요. ${highLabel} 지표가 두드러지게 높았어요.`,
    E: `결과를 보니 사람들과 함께할 때 에너지를 얻는 분이시네요. ${highLabel} 지표가 가장 높게 나왔어요.`,
    A: `결과를 살펴보니, 타인을 배려하고 조화를 중요하게 여기시는 분이시네요. ${highLabel} 지표가 특히 높았어요.`,
    N: `설문 결과에서 감정 변화나 스트레스에 민감하게 반응하는 경향이 보였어요. ${highLabel} 지표에 주목하게 됐어요.`,
  };

  const followUps: Record<Category, string> = {
    O: `반면 ${lowLabel} 쪽은 조금 낮게 나왔는데, 정해진 루틴이나 꾸준함보다는 다양성과 변화를 더 선호하시는 편인가요?`,
    C: `${lowLabel} 쪽이 상대적으로 낮게 나왔는데, 요즘 감정적으로 에너지가 많이 소모되는 일이 있으셨나요?`,
    E: `${lowLabel} 지표가 조금 낮았는데, 혼자만의 시간도 의도적으로 챙기시는 편인가요?`,
    A: `${lowLabel} 쪽이 낮게 나왔어요. 요즘 자신을 위한 시간을 충분히 갖고 계신지 궁금하네요.`,
    N: `${lowLabel} 쪽이 상대적으로 낮게 나왔는데, 이런 감정들이 일상에서 어떤 방식으로 표현되시나요?`,
  };

  return `${openings[highest]} ${followUps[lowest]} 오늘 편하게 이야기 나눠봐요.`;
}

export function generateFollowUpQuestions(scores: BigFiveScores): string[] {
  const N = scores.N;
  const A = scores.A;
  const O = scores.O;
  const C = scores.C;
  const E = scores.E;

  const questions: string[] = [];

  if (N >= 70) {
    questions.push("걱정이나 불안이 특히 심해지는 상황이 있으신가요? 어떤 순간에 가장 많이 느끼시나요?");
  } else if (N <= 40) {
    questions.push("스트레스 상황에서 자신만의 회복 방식이 있으신가요? 어떤 방법이 가장 도움이 되시나요?");
  }

  if (A >= 75) {
    questions.push("다른 사람을 많이 배려하시는 편인데, 그러다 정작 자신의 감정을 뒤로 미루신 적은 없으신가요?");
  }

  if (O >= 75 && C <= 50) {
    questions.push("새로운 것에 끌리는 반면, 한 가지를 끝까지 밀고 나가는 게 어렵다고 느낀 적이 있으신가요?");
  }

  if (E <= 40) {
    questions.push("혼자 있는 시간이 충전이 되시나요, 아니면 외로움으로 느껴지시나요?");
  }

  if (C >= 75) {
    questions.push("계획이 뜻대로 안 풀렸을 때 어떻게 반응하시는 편인가요? 많이 힘드신 편인가요?");
  }

  if (questions.length === 0) {
    questions.push("최근 일상에서 가장 에너지를 많이 쓰는 부분이 어디인지 이야기해주실 수 있나요?");
  }

  questions.push("지금 이 시점에서 자신에 대해 가장 궁금한 부분이 있다면 무엇인가요?");

  return questions.slice(0, 3);
}
