import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Download, Lightbulb, Lock, MessageCircle, Share2, Star } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Link } from "wouter";
import { Layout } from "@/components/layouts/layout";
import { BigFiveScores, getDimensionLabel, getHighestDimension, getLowestDimension, useAssessment } from "@/contexts/assessment-context";

const DEMO_SCORES: BigFiveScores = { O: 82, C: 64, E: 54, A: 90, N: 48 };

function buildRadarData(scores: BigFiveScores) {
  return (Object.entries(scores) as [keyof BigFiveScores, number][]).map(([key, value]) => ({
    subject: getDimensionLabel(key),
    score: value,
  }));
}

export default function Report() {
  const { scores: contextScores, chatSummary, isPremium } = useAssessment();
  const scores = contextScores ?? DEMO_SCORES;

  const highest = getHighestDimension(scores);
  const lowest = getLowestDimension(scores);
  const radarData = buildRadarData(scores);

  const strengths = [
    `${getDimensionLabel(highest)} 에너지가 높아 새로운 상황에도 유연하게 적응하는 편입니다.`,
    `${getDimensionLabel("A")} 점수가 높아 관계와 협업에서 자연스러운 강점을 보입니다.`,
  ];

  const growthAreas = [
    `${getDimensionLabel(lowest)} 영역은 의식적인 연습과 루틴을 통해 더 안정적으로 보완할 수 있습니다.`,
    "점수는 고정된 성격이 아니라 현재 패턴을 보여주는 참고값입니다.",
  ];

  const coachingTips = [
    "강점 영역은 더 자주 활용하고, 낮은 영역은 작은 실험으로 보완해보세요.",
    "한 주 동안의 생각과 감정을 짧게 기록하면 패턴이 더 명확하게 보입니다.",
    "대인관계나 업무가 많은 주에는 회복 시간을 일부러 비워두는 편이 좋습니다.",
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto w-full max-w-3xl space-y-6 pb-12">
        <div className="pt-4 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">basic report</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {getDimensionLabel(highest)} 중심의 성향 패턴
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            현재 점수 조합을 기반으로 강점과 보완 포인트를 요약했습니다.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-center font-display text-xl font-bold">Big Five Radar</h2>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            각 지표는 0-100 범위의 성향 강도를 보여줍니다.
          </p>

          <div className="mt-4 h-[280px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                <Radar
                  name="score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-primary/10 bg-primary/5 p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold">강점</h2>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed">
              {strengths.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-secondary/20 bg-secondary/5 p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-secondary" />
              <h2 className="font-display text-lg font-bold">보완 포인트</h2>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed">
              {growthAreas.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center gap-2.5">
            <MessageCircle className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold">대화 메모</h2>
          </div>
          <p className="rounded-2xl bg-muted/40 px-4 py-4 text-sm leading-relaxed text-muted-foreground">
            {chatSummary ?? "AI 코칭 대화를 완료하면 핵심 요약이 이 영역에 반영됩니다."}
          </p>

          <div className="mt-7">
            <div className="mb-4 flex items-center gap-2.5">
              <Lightbulb className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold">실행 가이드</h2>
            </div>
            <div className="space-y-3">
              {coachingTips.map((tip, index) => (
                <div key={tip} className="flex gap-3 rounded-2xl border border-border/50 p-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isPremium && (
          <div className="rounded-3xl bg-foreground p-6 text-background sm:p-8">
            <div className="mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">premium</span>
            </div>
            <h2 className="font-display text-2xl font-bold">더 깊은 해석이 필요하다면</h2>
            <p className="mt-3 text-sm leading-relaxed text-background/70">
              이전 점수와 비교한 변화 분석, 행동 가이드, 코치 편지까지 포함된 심층 리포트를 확인할 수 있습니다.
            </p>
            <Link
              href="/pricing"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
            >
              심층 분석 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => alert("PDF export is not connected in this prototype.")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <Download className="h-4 w-4" />
            PDF export
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied.");
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border px-6 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Share2 className="h-4 w-4" />
            Share link
          </button>
        </div>
      </motion.div>
    </Layout>
  );
}
