import { motion } from "framer-motion";
import { ArrowRight, Download, Lock, Sparkles, Star, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "wouter";
import { Layout } from "@/components/layouts/layout";
import { BigFiveScores, getDimensionLabel, getHighestDimension, getLowestDimension, useAssessment } from "@/contexts/assessment-context";

const DEMO_SCORES: BigFiveScores = { O: 82, C: 64, E: 54, A: 90, N: 48 };
const PREV_SCORES: BigFiveScores = { O: 74, C: 58, E: 50, A: 86, N: 58 };

const BEHAVIOR_GUIDES: Record<keyof BigFiveScores, string[]> = {
  O: [
    "새로운 프로젝트를 시작하기 전, 왜 이것이 중요한지 3줄로 적어보세요.",
    "아이디어 노트를 항상 가지고 다니며 떠오르는 생각을 기록해보세요.",
    "한 달에 한 번, 전혀 모르는 분야의 책이나 강의를 접해보세요.",
  ],
  C: [
    "하루 3가지 우선순위만 정하고, 나머지는 다음날로 미루는 연습을 해보세요.",
    "마감 전날 리뷰 시간을 미리 캘린더에 잡아두세요.",
    "완벽하지 않아도 충분히 좋은 결과를 수용하는 연습을 해보세요.",
  ],
  E: [
    "에너지가 높을 때 중요한 대화나 미팅을 배치해보세요.",
    "혼자 충전하는 시간을 주 2회 이상 의도적으로 확보하세요.",
    "소규모 모임이 더 만족스러울 수 있다는 점도 실험해보세요.",
  ],
  A: [
    "작은 일부터 거절하는 연습을 시작해보세요.",
    "타인을 돕기 전에 내 에너지 상태를 먼저 확인하는 습관을 들이세요.",
    "내가 원하는 것을 먼저 말하는 대화 패턴을 연습해보세요.",
  ],
  N: [
    "걱정이 생기면 통제 가능한 일과 불가능한 일을 나눠 적어보세요.",
    "하루 5분 정도의 호흡이나 짧은 산책 루틴을 만들어보세요.",
    "감정 일기를 짧게 써보면 패턴을 객관적으로 보기 쉬워집니다.",
  ],
};

export default function PremiumReport() {
  const { scores: contextScores, isPremium, chatSummary } = useAssessment();
  const scores = contextScores ?? DEMO_SCORES;
  const highest = getHighestDimension(scores);
  const lowest = getLowestDimension(scores);

  const radarData = (Object.entries(scores) as [keyof BigFiveScores, number][]).map(([key, value]) => ({
    subject: getDimensionLabel(key),
    score: value,
    prev: PREV_SCORES[key],
  }));

  const behaviourTips = [
    ...BEHAVIOR_GUIDES[highest].slice(0, 2),
    ...BEHAVIOR_GUIDES[lowest].slice(0, 2),
    "규칙적인 수면과 운동은 성향의 긍정적 발현에 큰 영향을 줍니다.",
  ];

  const coachLetter = `안녕하세요.

설문과 대화를 통해 당신을 조금 더 이해하게 되어 반가웠어요.

당신은 ${getDimensionLabel(highest)} 성향이 특히 강한 분이에요. 그 에너지 덕분에 주변 사람들에게 좋은 영향을 주고, 새로운 가능성을 만들어내는 힘이 있어요.

반대로 ${getDimensionLabel(lowest)} 쪽은 의식적으로 돌보면 훨씬 균형 잡힌 모습으로 성장할 수 있는 영역이에요. 약점이라기보다, 더 세심하게 관리할 수 있는 방향에 가깝습니다.

지금 이 순간, 자신을 이해하려고 시간을 낸 것 자체가 이미 변화의 시작이에요. 오늘의 이 작은 용기를 잊지 마세요.

따뜻하게,
Bodeum 코치 드림`;

  if (!isPremium) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">심층 리포트는 유료 기능입니다</h1>
          <p className="mt-4 text-muted-foreground">
            업그레이드를 완료하면 종합 분석, 행동 가이드, 코치의 편지까지 한 번에 열립니다.
          </p>
          <Link
            href="/pricing"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5"
          >
            업그레이드 보러가기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-8 py-6 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
            <Star className="h-3.5 w-3.5" />
            Premium report
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            {getDimensionLabel(highest)}과 {getDimensionLabel(lowest)} 사이의 패턴
          </h1>
          <p className="mt-3 text-muted-foreground">
            점수 변화, 행동 가이드, 코치 편지를 포함한 심층 분석입니다.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">현재 점수 vs 이전 기록</h2>
            <span className="rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground">compare</span>
          </div>
          <p className="text-xs text-muted-foreground">이전 분석과 현재 분석의 차이를 함께 보여줍니다.</p>

          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 25, bottom: 10, left: 25 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <Radar name="이전" dataKey="prev" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.28} />
                <Radar
                  name="현재"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip formatter={(value: number) => [`${value}점`, "score"]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(Object.entries(scores) as [keyof BigFiveScores, number][]).map(([key, value]) => {
              const diff = value - PREV_SCORES[key];

              return (
                <span
                  key={key}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${
                    diff > 0 ? "bg-emerald-50 text-emerald-700" : diff < 0 ? "bg-rose-50 text-rose-700" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  {getDimensionLabel(key)} {diff > 0 ? `+${diff}` : diff}
                </span>
              );
            })}
          </div>
        </motion.div>

        {chatSummary && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-7">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-display text-base font-bold">AI 상담 통합 인사이트</h2>
            </div>
            <p className="text-sm leading-relaxed">{chatSummary}</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 font-display text-xl font-bold">행동 가이드</h2>
          <div className="space-y-3">
            {behaviourTips.map((tip, index) => (
              <div key={tip} className="flex gap-3 rounded-2xl border border-border/50 bg-muted/40 p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl bg-foreground p-6 text-background sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">코치의 편지</h2>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-8 text-background/90">{coachLetter}</pre>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => alert("PDF export is not connected in this prototype.")}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            리포트 PDF 저장
          </button>
          <Link
            href="/report"
            className="flex items-center justify-center gap-2 rounded-xl bg-muted px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-muted/70"
          >
            기본 리포트 보기
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
