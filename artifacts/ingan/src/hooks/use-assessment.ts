import { useQuery, useMutation } from "@tanstack/react-query";

export interface Question {
  id: number;
  text: string;
  category: 'O' | 'C' | 'E' | 'A' | 'N';
  categoryLabel: string;
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

const MOCK_QUESTIONS: Question[] = [
  // 개방성 (Openness) - O - 20문항
  { id: 1, text: "새로운 아이디어나 개념을 탐구하는 것을 즐긴다.", category: 'O', categoryLabel: '개방성' },
  { id: 2, text: "예술 작품이나 자연의 아름다움에 깊이 감동받는다.", category: 'O', categoryLabel: '개방성' },
  { id: 3, text: "상상 속의 세계나 추상적인 개념에 매력을 느낀다.", category: 'O', categoryLabel: '개방성' },
  { id: 4, text: "다양한 관점으로 문제를 바라보는 것을 즐긴다.", category: 'O', categoryLabel: '개방성' },
  { id: 5, text: "새로운 음식이나 문화를 경험하는 것이 설렌다.", category: 'O', categoryLabel: '개방성' },
  { id: 6, text: "철학적이거나 깊은 주제로 대화하는 것을 즐긴다.", category: 'O', categoryLabel: '개방성' },
  { id: 7, text: "창의적인 활동(글쓰기, 그림 등)에 흥미를 느낀다.", category: 'O', categoryLabel: '개방성' },
  { id: 8, text: "색다른 방식으로 일을 시도해보고 싶다고 생각한다.", category: 'O', categoryLabel: '개방성' },
  { id: 9, text: "음악, 영화, 책 등 다양한 장르를 두루 즐긴다.", category: 'O', categoryLabel: '개방성' },
  { id: 10, text: "현실보다 가능성에 더 관심이 많다.", category: 'O', categoryLabel: '개방성' },
  { id: 11, text: "상상력이 풍부하다는 말을 자주 듣는다.", category: 'O', categoryLabel: '개방성' },
  { id: 12, text: "낯선 환경에서도 금방 흥미로운 점을 찾아낸다.", category: 'O', categoryLabel: '개방성' },
  { id: 13, text: "과거보다 미래의 변화를 기대하는 편이다.", category: 'O', categoryLabel: '개방성' },
  { id: 14, text: "정해진 답보다 열린 토론을 선호한다.", category: 'O', categoryLabel: '개방성' },
  { id: 15, text: "낯선 사람의 인생 이야기를 듣는 것이 흥미롭다.", category: 'O', categoryLabel: '개방성' },
  { id: 16, text: "기존 관념이나 고정관념에 의문을 품는다.", category: 'O', categoryLabel: '개방성' },
  { id: 17, text: "예술적 표현 방식이 다양할수록 더 좋다고 생각한다.", category: 'O', categoryLabel: '개방성' },
  { id: 18, text: "한 가지 일만 하는 것보다 다양한 일을 해보고 싶다.", category: 'O', categoryLabel: '개방성' },
  { id: 19, text: "새로운 지식을 배우면 활기가 생기는 느낌이다.", category: 'O', categoryLabel: '개방성' },
  { id: 20, text: "깊이 생각해야 하는 문제가 오히려 즐겁다.", category: 'O', categoryLabel: '개방성' },

  // 성실성 (Conscientiousness) - C - 20문항
  { id: 21, text: "계획을 세우고 이를 끝까지 실천하는 편이다.", category: 'C', categoryLabel: '성실성' },
  { id: 22, text: "물건을 항상 제자리에 두고 정리정돈을 중요하게 여긴다.", category: 'C', categoryLabel: '성실성' },
  { id: 23, text: "마감 기한 전에 일을 미리 끝내두는 편이다.", category: 'C', categoryLabel: '성실성' },
  { id: 24, text: "한 번 결정하면 흔들리지 않고 실행에 옮긴다.", category: 'C', categoryLabel: '성실성' },
  { id: 25, text: "해야 할 일이 남아있으면 쉽게 쉬지 못한다.", category: 'C', categoryLabel: '성실성' },
  { id: 26, text: "약속을 어기는 것이 매우 불편하다.", category: 'C', categoryLabel: '성실성' },
  { id: 27, text: "꼼꼼하게 일하는 편이라 실수가 적다.", category: 'C', categoryLabel: '성실성' },
  { id: 28, text: "장기 목표를 세우고 꾸준히 실천하는 편이다.", category: 'C', categoryLabel: '성실성' },
  { id: 29, text: "매일 같은 시간에 일어나고 자는 규칙적인 생활을 한다.", category: 'C', categoryLabel: '성실성' },
  { id: 30, text: "준비 없이 즉흥적으로 행동하는 것이 불안하다.", category: 'C', categoryLabel: '성실성' },
  { id: 31, text: "일을 끝내기 전에 중간에 포기하는 경우가 거의 없다.", category: 'C', categoryLabel: '성실성' },
  { id: 32, text: "할 일 목록을 만들고 하나씩 지워가는 것이 만족스럽다.", category: 'C', categoryLabel: '성실성' },
  { id: 33, text: "책임감이 강해서 맡은 일은 반드시 마무리한다.", category: 'C', categoryLabel: '성실성' },
  { id: 34, text: "중요한 결정 전에 충분히 조사하고 검토한다.", category: 'C', categoryLabel: '성실성' },
  { id: 35, text: "시간 낭비라고 느끼면 참기 힘들다.", category: 'C', categoryLabel: '성실성' },
  { id: 36, text: "자기 관리를 철저하게 하는 편이다.", category: 'C', categoryLabel: '성실성' },
  { id: 37, text: "우선순위를 명확히 하고 집중하는 편이다.", category: 'C', categoryLabel: '성실성' },
  { id: 38, text: "세부사항까지 놓치지 않으려고 노력한다.", category: 'C', categoryLabel: '성실성' },
  { id: 39, text: "성과에 대한 기준이 높고 그것을 지키려 한다.", category: 'C', categoryLabel: '성실성' },
  { id: 40, text: "충동적인 결정보다 신중한 결정을 선호한다.", category: 'C', categoryLabel: '성실성' },

  // 외향성 (Extraversion) - E - 20문항
  { id: 41, text: "사람들이 많은 모임에서 에너지를 얻는다.", category: 'E', categoryLabel: '외향성' },
  { id: 42, text: "낯선 사람과도 금방 편하게 이야기할 수 있다.", category: 'E', categoryLabel: '외향성' },
  { id: 43, text: "파티나 사교 모임에 참석하는 것을 좋아한다.", category: 'E', categoryLabel: '외향성' },
  { id: 44, text: "혼자보다 여럿이 함께 있을 때 더 신나고 활기차다.", category: 'E', categoryLabel: '외향성' },
  { id: 45, text: "새로운 사람을 사귀는 것이 자연스럽다.", category: 'E', categoryLabel: '외향성' },
  { id: 46, text: "여러 사람 앞에서 말하는 것이 어렵지 않다.", category: 'E', categoryLabel: '외향성' },
  { id: 47, text: "조용한 곳보다 활기찬 환경이 더 편안하다.", category: 'E', categoryLabel: '외향성' },
  { id: 48, text: "대화를 먼저 시작하는 편이다.", category: 'E', categoryLabel: '외향성' },
  { id: 49, text: "혼자 있는 시간이 길어지면 심심하고 지루하다.", category: 'E', categoryLabel: '외향성' },
  { id: 50, text: "즉흥적으로 외출하거나 친구를 만나는 것이 즐겁다.", category: 'E', categoryLabel: '외향성' },
  { id: 51, text: "유머 감각이 좋다는 말을 자주 듣는다.", category: 'E', categoryLabel: '외향성' },
  { id: 52, text: "다양한 사람들과 어울리는 것이 스트레스 해소가 된다.", category: 'E', categoryLabel: '외향성' },
  { id: 53, text: "의견을 적극적으로 표현하는 편이다.", category: 'E', categoryLabel: '외향성' },
  { id: 54, text: "그룹 활동이나 팀 작업을 혼자 하는 것보다 선호한다.", category: 'E', categoryLabel: '외향성' },
  { id: 55, text: "오랫동안 연락 안 했던 사람에게 먼저 연락하는 편이다.", category: 'E', categoryLabel: '외향성' },
  { id: 56, text: "사람들의 관심을 받는 것이 불편하지 않다.", category: 'E', categoryLabel: '외향성' },
  { id: 57, text: "여러 사람이 있으면 자연스럽게 중심이 된다.", category: 'E', categoryLabel: '외향성' },
  { id: 58, text: "기분이 밝고 활기차다는 말을 자주 듣는다.", category: 'E', categoryLabel: '외향성' },
  { id: 59, text: "사람을 만난 후 기운이 충전되는 느낌이다.", category: 'E', categoryLabel: '외향성' },
  { id: 60, text: "혼자서 긴 시간을 보내는 것이 힘들다.", category: 'E', categoryLabel: '외향성' },

  // 친화성 (Agreeableness) - A - 20문항
  { id: 61, text: "다른 사람의 감정에 쉽게 공감하고 배려한다.", category: 'A', categoryLabel: '친화성' },
  { id: 62, text: "상대방의 입장에서 생각하려고 노력한다.", category: 'A', categoryLabel: '친화성' },
  { id: 63, text: "갈등 상황에서 타협점을 찾으려 한다.", category: 'A', categoryLabel: '친화성' },
  { id: 64, text: "타인을 위해 내 시간과 에너지를 기꺼이 나눈다.", category: 'A', categoryLabel: '친화성' },
  { id: 65, text: "다른 사람이 어려울 때 돕고 싶은 마음이 자연스럽게 생긴다.", category: 'A', categoryLabel: '친화성' },
  { id: 66, text: "주변 사람들과 따뜻한 관계를 유지하는 것이 중요하다.", category: 'A', categoryLabel: '친화성' },
  { id: 67, text: "화가 나도 상대를 먼저 배려하려고 노력한다.", category: 'A', categoryLabel: '친화성' },
  { id: 68, text: "약자나 소외된 사람에게 마음이 쓰인다.", category: 'A', categoryLabel: '친화성' },
  { id: 69, text: "남의 부탁을 거절하는 것이 힘들다.", category: 'A', categoryLabel: '친화성' },
  { id: 70, text: "사람들이 나에게 고민을 자주 털어놓는 편이다.", category: 'A', categoryLabel: '친화성' },
  { id: 71, text: "경쟁보다 협력을 더 선호한다.", category: 'A', categoryLabel: '친화성' },
  { id: 72, text: "거짓말이나 속임수를 매우 싫어한다.", category: 'A', categoryLabel: '친화성' },
  { id: 73, text: "누군가를 도왔을 때 뿌듯함을 크게 느낀다.", category: 'A', categoryLabel: '친화성' },
  { id: 74, text: "상대의 기분을 맞춰주기 위해 노력하는 편이다.", category: 'A', categoryLabel: '친화성' },
  { id: 75, text: "타인의 실수를 쉽게 용서하는 편이다.", category: 'A', categoryLabel: '친화성' },
  { id: 76, text: "팀 분위기를 좋게 만드는 역할을 자주 한다.", category: 'A', categoryLabel: '친화성' },
  { id: 77, text: "인간관계에서 신의와 믿음을 가장 중요하게 여긴다.", category: 'A', categoryLabel: '친화성' },
  { id: 78, text: "상대가 상처받을까봐 솔직한 말을 아끼는 편이다.", category: 'A', categoryLabel: '친화성' },
  { id: 79, text: "모든 사람이 공평하게 대우받아야 한다고 생각한다.", category: 'A', categoryLabel: '친화성' },
  { id: 80, text: "주변 사람들이 행복해야 나도 편안하다.", category: 'A', categoryLabel: '친화성' },

  // 신경성 (Neuroticism) - N - 20문항
  { id: 81, text: "예상치 못한 상황에서 스트레스를 크게 받는다.", category: 'N', categoryLabel: '신경성' },
  { id: 82, text: "기분이 자주 바뀌는 편이다.", category: 'N', categoryLabel: '신경성' },
  { id: 83, text: "별거 아닌 일에도 걱정이 많아지는 편이다.", category: 'N', categoryLabel: '신경성' },
  { id: 84, text: "비판을 받으면 필요 이상으로 상처를 받는다.", category: 'N', categoryLabel: '신경성' },
  { id: 85, text: "결정을 내린 후에도 다시 고민하는 경우가 많다.", category: 'N', categoryLabel: '신경성' },
  { id: 86, text: "중요한 일 전날에는 긴장해서 잠을 잘 못 잔다.", category: 'N', categoryLabel: '신경성' },
  { id: 87, text: "사람들이 나를 어떻게 생각할지 신경이 많이 쓰인다.", category: 'N', categoryLabel: '신경성' },
  { id: 88, text: "작은 실수도 오래 마음에 담아두는 편이다.", category: 'N', categoryLabel: '신경성' },
  { id: 89, text: "이유 없이 불안함을 느끼는 날이 종종 있다.", category: 'N', categoryLabel: '신경성' },
  { id: 90, text: "스트레스를 받으면 신체적으로도 피로함을 느낀다.", category: 'N', categoryLabel: '신경성' },
  { id: 91, text: "감정 기복이 심한 편이다.", category: 'N', categoryLabel: '신경성' },
  { id: 92, text: "일이 잘못될 가능성을 먼저 생각하는 편이다.", category: 'N', categoryLabel: '신경성' },
  { id: 93, text: "짜증이나 분노가 갑자기 올라오는 경우가 있다.", category: 'N', categoryLabel: '신경성' },
  { id: 94, text: "부정적인 감정을 빨리 떨쳐내기 어렵다.", category: 'N', categoryLabel: '신경성' },
  { id: 95, text: "앞으로 일어날 일들에 대해 자주 걱정한다.", category: 'N', categoryLabel: '신경성' },
  { id: 96, text: "극도로 긴장하거나 패닉 상태가 되는 경우가 있다.", category: 'N', categoryLabel: '신경성' },
  { id: 97, text: "기분이 좋지 않으면 집중하기 어렵다.", category: 'N', categoryLabel: '신경성' },
  { id: 98, text: "다른 사람의 말 한마디가 하루 종일 마음에 걸릴 때가 있다.", category: 'N', categoryLabel: '신경성' },
  { id: 99, text: "자신에 대한 자신감이 상황에 따라 크게 달라진다.", category: 'N', categoryLabel: '신경성' },
  { id: 100, text: "감정을 조절하는 것이 때로 힘들다.", category: 'N', categoryLabel: '신경성' },
];

export const QUESTIONS_PER_PAGE = 5;
export const TOTAL_PAGES = Math.ceil(MOCK_QUESTIONS.length / QUESTIONS_PER_PAGE);

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
    mutationFn: async (_message: string): Promise<ChatMessage> => {
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
          { subject: '개방성', score: 85, fullMark: 100 },
          { subject: '성실성', score: 65, fullMark: 100 },
          { subject: '외향성', score: 55, fullMark: 100 },
          { subject: '친화성', score: 92, fullMark: 100 },
          { subject: '신경성', score: 45, fullMark: 100 },
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
