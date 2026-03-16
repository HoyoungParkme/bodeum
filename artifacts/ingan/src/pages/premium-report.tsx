import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Download, ArrowRight, Lock, Star, Sparkles, TrendingUp } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { Layout } from "@/components/layout";
import {
  useAssessment,
  getDimensionLabel,
  getHighestDimension,
  getLowestDimension,
  BigFiveScores,
} from "@/context/assessment-context";

const DEMO_SCORES: BigFiveScores = { O: 82, C: 64, E: 54, A: 90, N: 48 };

const BEHAVIOR_GUIDES: Record<string, string[]> = {
  O: [
    "새로운 프로젝트를 시작하기 전 '왜 이것이 중요한가' 를 3줄로 적어두세요.",
    "아이디어 노트를 항상 가지고 다니며 떠오르는 생각을 기록해보세요.",
    "한 달에 한 번, 전혀 모르는 분야의 강의나 책을 접해보세요.",
  ],
  C: [
    "하루 3가지 우선순위만 정하고, 나머지는 다음날로 미루는 연습을 해보세요.",
    "마감 전날 리뷰 시간을 미리 캘린더에 잡아두세요.",
    "완벽하지 않아도 '충분히 좋은 결과'를 수용하는 연습을 해보세요.",
  ],
  E: [
    "에너지가 높을 때 중요한 대화나 미팅을 배치해보세요.",
    "혼자 충전하는 시간을 주 2회 이상 의도적으로 확보하세요.",
    "소규모 모임(3~5명)을 자주 갖는 것이 큰 모임보다 더 만족스러울 수 있어요.",
  ],
  A: [
    "'아니오'라고 말하는 연습을 소소한 것부터 시작해보세요.",
    "타인을 돕기 전에 내 에너지 상태를 먼저 확인하는 습관을 들이세요.",
    "내가 원하는 것을 먼저 말하는 대화 패턴을 연습해보세요.",
  ],
  N: [
    "걱정이 생기면 종이에 '통제 가능 / 불가능'으로 나눠 적어보세요.",
    "하루 5분, 호흡이나 짧은 산책으로 감정을 리셋하는 루틴을 만들어보세요.",
    "감정 일기를 짧게 쓰면 감정 패턴을 객관적으로 볼 수 있어요.",
  ],
};

const PREV_SCORES: BigFiveScores = { O: 74, C: 58, E: 50, A: 86, N: 58 };

export default function PremiumReport() {
  const { scores: contextScores, isPremium, chatSummary } = useAssessment();
  const scores = contextScores ?? DEMO_SCORES;

  const highest = getHighestDimension(scores);
  const lowest = getLowestDimension(scores);

  const radarData = (Object.entries(scores) as [string, number][]).map(([k, v]) => ({
    subject: getDimensionLabel(k as any),
    score: v,
    prev: PREV_SCORES[k as keyof BigFiveScores],
  }));

  const behaviourTips = [
    ...BEHAVIOR_GUIDES[highest].slice(0, 2),
    ...BEHAVIOR_GUIDES[lowest].slice(0, 2),
    "규칙적인 수면과 운동이 성향의 긍정적 발현에 가장 큰 영향을 미칩니다.",
  ];

  const coachLetter = `안녕하세요.

설문과 대화를 통해 당신을 조금 알아가게 되어 반가웠어요.

당신은 ${getDimensionLabel(highest)} 성향이 특히 강한 분이에요. 그 에너지 덕분에 주변 사람들에게 영향을 주고, 새로운 가능성을 만들어내는 힘이 있어요. 하지만 때로는 그 강점이 부담이 되기도 하죠.

${getDimensionLabel(lowest)} 쪽이 조금 낮게 나왔는데, 이것은 약점이 아니에요. 오히려 그 방향으로 의식적으로 에너지를 쏟으면 훨씬 균형 잡힌 모습으로 성장할 수 있어요.

지금 이 순간, 당신이 자신을 이해하려고 시간을 낸 것 자체가 이미 변화의 시작이에요. 오늘의 이 작은 용기를 잊지 마세요.

따뜻하게,
ingan.ai 코치 드림`;

  if (!isPremium) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-16 sm:py-24 px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-4">심층 리포트는 유료 기능입니다</h1>
          <p className="text-muted-foreground mb-8 text-balance">
            9,900원으로 챗봇 대화까지 통합한 종합 심층 리포트, 행동 가이드, 코치의 편지를 받아보세요.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm hover:-translate-y-0.5 transition-all shadow-md">
            업그레이드 보러가기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-6 sm:py-12 space-y-8 sm:space-y-12">

        {/* Premium badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-4">
            <Star className="w-3.5 h-3.5" />
            심층 분석 · 프리미엄 리포트
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-bold mb-2">
            {getDimensionLabel(highest)}과 {getDimensionLabel(lowest)}의 사이
          </h1>
          <p className="text-muted-foreground">설문 결과와 AI 상담을 통합한 종합 분석입니다</p>
        </motion.div>

        {/* Combined Radar with previous comparison */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-bold text-base sm:text-lg">성향 변화 추적</h2>
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-lg">이전 vs 현재</span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">이전 분석(회색)과 현재 분석(주황)을 비교합니다</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 10, right: 25, bottom: 10, left: 25 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <Radar name="이전" dataKey="prev" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.3} />
              <Radar name="현재" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip formatter={(v: number) => [`${v}점`]} />
            </RadarChart>
          </ResponsiveContainer>
          {/* Score change pills */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {(Object.entries(scores) as [string, number][]).map(([cat, score]) => {
              const prev = PREV_SCORES[cat as keyof BigFiveScores];
              const diff = score - prev;
              return (
                <span key={cat} className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium ${diff > 0 ? 'bg-emerald-50 text-emerald-700' : diff < 0 ? 'bg-rose-50 text-rose-700' : 'bg-muted text-muted-foreground'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {getDimensionLabel(cat as any)} {diff > 0 ? '+' : ''}{diff}
                </span>
              );
            })}
          </div>
        </motion.div>

        {/* Chat summary integration */}
        {chatSummary && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="bg-primary/5 border border-primary/15 rounded-2xl p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-base">AI 상담 통합 인사이트</h2>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              오늘 코치와의 대화에서 나눈 내용을 분석 결과에 반영했어요.
              <strong> {chatSummary}</strong>
            </p>
          </motion.div>
        )}

        {/* Deep interpretation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <h2 className="font-display font-bold text-base sm:text-xl mb-5">심층 성향 해석</h2>
          <div className="space-y-5">
            {(Object.entries(scores) as [string, number][]).map(([cat, score]) => {
              const label = getDimensionLabel(cat as any);
              const isHigh = score >= 70;
              const interpretation = {
                O: isHigh ? "호기심이 많고 창의적이며 새로운 아이디어에 열려있어요. 변화를 즐기는 편입니다." : "검증된 방식을 선호하고 실용적인 접근을 좋아해요. 안정성을 중시합니다.",
                C: isHigh ? "목표 지향적이고 꼼꼼하게 계획을 실행해요. 책임감이 강한 편입니다." : "유연하고 즉흥적인 편이에요. 완벽주의보다는 흐름을 따르는 성향입니다.",
                E: isHigh ? "사람들과의 교류에서 에너지를 얻어요. 표현력이 풍부하고 사교적입니다." : "혼자만의 시간을 통해 충전해요. 깊은 관계를 선호하는 편입니다.",
                A: isHigh ? "공감 능력이 뛰어나고 협력적이에요. 갈등을 피하고 조화를 중요시합니다." : "논리와 객관성을 중요시해요. 타인의 감정보다 사실에 집중하는 편입니다.",
                N: isHigh ? "감정에 민감하게 반응해요. 스트레스 상황에서 불안이나 걱정이 커질 수 있습니다." : "감정적으로 안정적이에요. 스트레스 상황에서도 비교적 차분한 편입니다.",
              }[cat] ?? "";
              return (
                <div key={cat} className="flex gap-4">
                  <div className="shrink-0 flex flex-col items-center pt-1">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div className="w-px flex-1 bg-border mt-1.5" />
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{score}점</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{interpretation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Behavior Guide */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <h2 className="font-display font-bold text-base sm:text-xl mb-2">나만의 행동 가이드</h2>
          <p className="text-sm text-muted-foreground mb-6">내 성향에 맞춰 바로 실천할 수 있는 팁을 선별했어요</p>
          <div className="space-y-3">
            {behaviourTips.map((tip, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Coach's Letter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-foreground text-background rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-base sm:text-xl">코치의 편지</h2>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-8 font-sans text-background/90">{coachLetter}</pre>
        </motion.div>

        {/* PDF Download (UI only for prototype) */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => alert("PDF 다운로드 기능은 실제 서비스에서 제공됩니다.")}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-border text-sm font-semibold hover:border-foreground/30 hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />
            리포트 PDF 저장
          </button>
          <Link
            href="/report"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-muted/70 transition-colors"
          >
            기본 리포트 보기
          </Link>
        </motion.div>

      </div>
    </Layout>
  );
}
