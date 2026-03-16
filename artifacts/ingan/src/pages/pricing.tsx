import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, Lock, Star, ArrowRight, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout";
import { useAssessment } from "@/context/assessment-context";

const FREE_FEATURES = [
  "Big Five 설문 100문항",
  "AI 코치 맞춤형 상담 대화",
  "기본 성향 리포트 (레이더 차트)",
  "강점 · 성장 포인트 요약",
  "소통 스타일 가이드",
  "타인 분석 초대 링크",
];

const PREMIUM_FEATURES = [
  "무료 기능 전체 포함",
  "챗봇 대화 통합 종합 심층 리포트",
  "일상 맞춤 행동 가이드 (실천 팁 10가지+)",
  "코치의 편지 (AI가 쓴 개인 메시지)",
  "변화 추적 리포트 (재이용 시 비교)",
  "나 ↔ 타인 성향 비교 분석",
  "상세 리포트 PDF 다운로드",
  "향후 업데이트 기능 무료 이용",
];

const TESTIMONIALS = [
  { name: "김지수", role: "직장인 28세", text: "단순 테스트가 아니라 진짜 나를 이해하는 느낌이었어요. 코치의 편지 보고 눈물 났어요." },
  { name: "박민준", role: "대학원생 25세", text: "행동 가이드가 너무 구체적이어서 바로 실천할 수 있었어요. 9,900원이 아깝지 않았어요." },
  { name: "이소연", role: "프리랜서 32세", text: "파트너랑 비교 분석 해봤는데, 서로 이해하는 데 엄청 도움됐어요." },
];

export default function Pricing() {
  const { setIsPremium, isPremium } = useAssessment();

  const handleUpgrade = () => {
    // In a real app this would go through a payment flow
    setIsPremium(true);
    window.location.href = window.location.origin + "/premium-report";
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full py-6 sm:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            나를 더 깊이 이해하고 싶다면
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-bold mb-4 text-balance">
            기본 분석으로 시작하고,<br className="hidden sm:block" />
            <span className="text-primary">심층 분석으로 완성하세요</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto text-balance">
            무료 서비스만으로도 충분히 의미 있는 경험을 드립니다. 더 깊이 알고 싶다면 언제든지 업그레이드할 수 있어요.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-14">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col"
          >
            <div className="mb-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">무료</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl sm:text-4xl font-display font-bold">₩0</span>
              </div>
              <p className="text-sm text-muted-foreground">언제나 무료로 이용하세요</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/survey/intro"
              className="block text-center py-3.5 rounded-xl border-2 border-border text-sm font-semibold hover:border-foreground/30 hover:bg-muted transition-colors"
            >
              무료로 시작하기
            </Link>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="relative bg-foreground text-background rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col shadow-xl"
          >
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              추천
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold text-background/60 uppercase tracking-widest mb-2">심층 분석</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl sm:text-4xl font-display font-bold">₩9,900</span>
                <span className="text-background/60 text-sm mb-1">/ 1회</span>
              </div>
              <p className="text-sm text-background/60">또는 월 구독으로 이용</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {PREMIUM_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Star className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className={i === 0 ? "text-background/60" : ""}>{f}</span>
                </li>
              ))}
            </ul>

            {isPremium ? (
              <Link
                href="/premium-report"
                className="block text-center py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
              >
                심층 리포트 보러가기 →
              </Link>
            ) : (
              <button
                onClick={handleUpgrade}
                className="py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                지금 업그레이드하기
                <span className="ml-2 text-xs opacity-75">(데모: 바로 활성화)</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Feature comparison hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 border border-primary/15 rounded-2xl p-5 sm:p-7 mb-14"
        >
          <h3 className="font-display font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            심층 분석에서만 볼 수 있는 것들
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "🧠", title: "대화 통합 리포트", desc: "설문 + AI 상담 내용을 합쳐 한층 더 깊은 해석" },
              { icon: "📋", title: "행동 가이드", desc: "내 성향에 맞는 일상 실천법 10가지 이상" },
              { icon: "💌", title: "코치의 편지", desc: "AI가 직접 쓴 나만을 위한 한 장의 편지" },
              { icon: "📈", title: "변화 추적", desc: "다음번 분석 시 이전 결과와 비교하는 리포트" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-background border border-border/50">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="font-display font-bold text-center text-base sm:text-xl mb-6">실제 이용자 후기</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}
