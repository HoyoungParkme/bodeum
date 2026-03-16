import { useQuery, useMutation } from "@tanstack/react-query";

// Mock Data Types
export interface Question {
  id: number;
  text: string;
  category: 'O' | 'C' | 'E' | 'A' | 'N';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  text: string;
}

export interface ReportData {
  summary: string;
  radarData: Array<{ subject: string; score: number; fullMark: number }>;
  strengths: string[];
  growthAreas: string[];
  communicationStyle: string;
  coachingTips: string[];
}

// Mock Questions (Subset for prototype — representative of 100Q Big Five)
const MOCK_QUESTIONS: Question[] = [
  { id: 1, text: "새로운 아이디어나 개념을 탐구하는 것을 즐긴다.", category: 'O' },
  { id: 2, text: "계획을 세우고 이를 끝까지 실천하는 편이다.", category: 'C' },
  { id: 3, text: "사람들이 많은 모임에서 에너지를 얻는다.", category: 'E' },
  { id: 4, text: "다른 사람의 감정에 쉽게 공감하고 배려한다.", category: 'A' },
  { id: 5, text: "예상치 못한 상황에서 스트레스를 크게 받는다.", category: 'N' },
  { id: 6, text: "예술 작품이나 자연의 아름다움에 깊이 감동받는다.", category: 'O' },
  { id: 7, text: "물건을 항상 제자리에 두고 정리정돈을 중요하게 여긴다.", category: 'C' },
  { id: 8, text: "낯선 사람과도 금방 편하게 이야기할 수 있다.", category: 'E' },
  { id: 9, text: "상대방의 입장에서 생각하려고 노력한다.", category: 'A' },
  { id: 10, text: "기분이 자주 바뀌는 편이다.", category: 'N' },
  { id: 11, text: "상상 속의 세계나 추상적인 개념에 매력을 느낀다.", category: 'O' },
  { id: 12, text: "마감 기한 전에 일을 미리 끝내두는 편이다.", category: 'C' },
  { id: 13, text: "파티나 사교 모임에 참석하는 것을 좋아한다.", category: 'E' },
  { id: 14, text: "갈등 상황에서 타협점을 찾으려 한다.", category: 'A' },
  { id: 15, text: "별거 아닌 일에도 걱정이 많아지는 편이다.", category: 'N' },
  { id: 16, text: "다양한 관점으로 문제를 바라보는 것을 즐긴다.", category: 'O' },
  { id: 17, text: "한 번 결정하면 흔들리지 않고 실행에 옮긴다.", category: 'C' },
  { id: 18, text: "혼자보다 여럿이 함께 있을 때 더 신나고 활기차다.", category: 'E' },
  { id: 19, text: "타인을 위해 내 시간과 에너지를 기꺼이 나눈다.", category: 'A' },
  { id: 20, text: "비판을 받으면 필요 이상으로 상처를 받는다.", category: 'N' },
];

export function useQuestions() {
  return useQuery({
    queryKey: ['questions'],
    queryFn: async (): Promise<Question[]> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return MOCK_QUESTIONS;
    }
  });
}

export function useChat() {
  return useMutation({
    mutationFn: async (message: string): Promise<ChatMessage> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        id: Math.random().toString(),
        role: 'coach',
        text: "솔직한 답변 감사합니다. 스스로를 꽤 잘 이해하고 계신 것 같네요. 마지막으로, 당신이 가장 몰입하게 되는 순간은 언제인가요?"
      };
    }
  });
}

export function useReport() {
  return useQuery({
    queryKey: ['report'],
    queryFn: async (): Promise<ReportData> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        summary: "따뜻한 공감능력과 호기심을 겸비한 탐험가",
        radarData: [
          { subject: '개방성 (O)', score: 85, fullMark: 100 },
          { subject: '성실성 (C)', score: 65, fullMark: 100 },
          { subject: '외향성 (E)', score: 55, fullMark: 100 },
          { subject: '친화성 (A)', score: 92, fullMark: 100 },
          { subject: '신경성 (N)', score: 45, fullMark: 100 },
        ],
        strengths: [
          "타인의 감정을 깊이 이해하고 편안하게 만들어주는 능력이 탁월합니다.",
          "새로운 경험이나 예술적 영감을 흡수하는 데 열려있습니다.",
          "갈등을 피하고 조화로운 관계를 유지하는 데 강점이 있습니다."
        ],
        growthAreas: [
          "때로는 타인을 배려하느라 자신의 진짜 감정을 억누를 수 있어요.",
          "계획이 틀어졌을 때 조금 더 유연하게 대처하는 연습이 필요합니다."
        ],
        communicationStyle: "상대방의 말을 끝까지 경청하며, 부드럽고 수용적인 언어를 주로 사용합니다. 주도하기보다는 협력하는 대화를 선호합니다.",
        coachingTips: [
          "스스로의 감정을 1순위로 두는 '나만의 시간'을 하루 30분씩 가져보세요.",
          "거절하는 것도 상대를 존중하는 하나의 방법임을 기억하세요.",
          "창의적인 취미 활동이 스트레스 해소에 큰 도움이 될 거예요."
        ]
      };
    }
  });
}
