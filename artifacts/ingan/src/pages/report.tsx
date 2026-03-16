import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from "recharts";
import { Download, Share2, Star, AlertCircle, MessageCircle, Lightbulb, Sparkles, ArrowRight, Lock } from "lucide-react";
import { Layout } from "@/components/layout";
import { useReport } from "@/hooks/use-assessment";
import { useAssessment, getDimensionLabel, getHighestDimension, getLowestDimension } from "@/context/assessment-context";

export default function Report() {
  const { data: report, isLoading } = useReport();
  const { scores, isPremium } = useAssessment();

  if (isLoading || !report) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-5" />
          <h2 className="text-lg font-display font-bold mb-1">결과를 분석하고 있습니다...</h2>
          <p className="text-muted-foreground text-sm">수집된 데이터를 종합하여 리포트를 생성중입니다.</p>
        </div>
      </Layout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } }
  };

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto w-full space-y-5 sm:space-y-7 pb-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center pt-4 sm:pt-6">
          <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest mb-2 sm:mb-3">당신의 성향 리포트</p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold leading-tight mb-3 text-balance">
            {report.summary}
          </h1>
          <p className="text-sm text-muted-foreground">Big Five 성격 모델 기반 · 분석 완료</p>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border shadow-sm"
        >
          <h3 className="font-display font-bold text-base sm:text-xl mb-1 text-center">Big Five 성향 밸런스</h3>
          <p className="text-xs text-muted-foreground text-center mb-4">각 지표는 우열이 아닌 고유한 에너지의 방향을 보여줍니다.</p>

          {/* Radar chart — shorter on mobile */}
          <div className="w-full h-[260px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={report.radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
                />
                <Radar
                  name="성향"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.18}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {report.radarData.map((d) => (
              <div key={d.subject} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 rounded-full text-xs font-medium">
                <span className="text-muted-foreground">{d.subject}</span>
                <span className="text-primary font-bold">{d.score}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Strengths & Growth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <motion.div
            variants={itemVariants}
            className="bg-primary/5 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-primary/10"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg">빛나는 강점</h3>
            </div>
            <ul className="space-y-3">
              {report.strengths.map((text, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-secondary/5 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-secondary/20"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-secondary/15 text-secondary rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg">성장 포인트</h3>
            </div>
            <ul className="space-y-3">
              {report.growthAreas.map((text, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span className="text-secondary mt-0.5 shrink-0">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Communication + Coaching */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border shadow-sm space-y-7"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <MessageCircle className="w-5 h-5 text-foreground" />
              <h3 className="font-display font-bold text-base sm:text-lg">소통 스타일</h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed bg-muted/40 px-4 py-4 rounded-xl">
              {report.communicationStyle}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Lightbulb className="w-5 h-5 text-accent-foreground" />
              <h3 className="font-display font-bold text-base sm:text-lg">코치 AI의 조언</h3>
            </div>
            <div className="space-y-3">
              {report.coachingTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs sm:text-sm">
                    {i + 1}
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed pt-0.5">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Premium Upgrade CTA */}
        {!isPremium && (
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-foreground text-background rounded-2xl sm:rounded-3xl p-6 sm:p-8"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">심층 분석 · 유료</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold mb-2 text-balance">
                더 깊은 나를 발견하고 싶다면?
              </h3>
              <p className="text-sm text-background/70 leading-relaxed mb-5 text-balance">
                챗봇 대화까지 통합한 종합 심층 리포트, 나만의 행동 가이드, 코치의 편지를 받아보세요.
                변화 추적 리포트로 시간이 지나며 달라지는 나를 확인하세요.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["종합 심층 리포트", "행동 가이드 10가지+", "코치의 편지", "변화 추적", "PDF 저장"].map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-white/10 rounded-full">
                    <Sparkles className="w-3 h-3 text-primary" />
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/pricing"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
                >
                  ₩9,900으로 심층 분석 보기
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/chat"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 text-background font-medium text-sm hover:bg-white/20 transition-colors"
                >
                  AI 코치와 다시 대화하기
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {isPremium && (
          <motion.div variants={itemVariants}>
            <Link
              href="/premium-report"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              심층 리포트 보러가기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => alert("PDF 저장은 심층 분석(유료) 기능입니다.")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-foreground text-background font-medium text-sm sm:text-base hover:bg-foreground/90 transition-colors shadow-lg"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            PDF로 저장하기
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.origin); alert("링크가 복사되었습니다!"); }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-card border-2 border-border font-medium text-sm sm:text-base hover:border-foreground/20 hover:bg-muted/50 transition-colors"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            결과 링크 공유
          </button>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
