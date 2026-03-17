import { motion } from "framer-motion";
import { Check, Lock, Sparkles, Star } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layouts/layout";
import { useAssessment } from "@/contexts/assessment-context";

const FREE_FEATURES = [
  "Big Five 100문항 설문",
  "기본 레이더 차트",
  "핵심 강점과 보완 포인트",
  "AI 코칭 대화 요약",
];

const PREMIUM_FEATURES = [
  "이전 점수와 비교한 변화 보기",
  "행동 가이드 4개 이상",
  "프리미엄 코치 노트",
  "확장형 리포트 섹션",
  "추후 PDF export 연결 대비 구조",
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { isPremium, setIsPremium } = useAssessment();

  const handleUpgrade = () => {
    setIsPremium(true);
    setLocation("/premium-report");
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl py-6 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Premium upgrade
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
            기본 리포트에서 멈추지 않고
            <span className="block text-primary">더 깊게 해석하는 단계</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            현재 프로토타입은 결제 연동 대신 업그레이드 플래그를 활성화해 프리미엄 리포트 흐름을 확인하는 방식입니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-card p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">free</p>
            <div className="mt-3 text-4xl font-display font-bold">0원</div>
            <p className="mt-2 text-sm text-muted-foreground">기본 분석 플로우 전체 확인</p>

            <ul className="mt-8 space-y-3 text-sm">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="relative rounded-3xl bg-foreground p-8 text-background shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
              추천
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-background/60">premium</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-display font-bold">9,900원</span>
              <span className="pb-1 text-sm text-background/60">one-time demo</span>
            </div>
            <p className="mt-2 text-sm text-background/60">심화 해석과 행동 가이드 포함</p>

            <ul className="mt-8 space-y-3 text-sm">
              {PREMIUM_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5"
            >
              {isPremium ? "프리미엄 리포트로 이동" : "프리미엄 체험 열기"}
            </button>
          </motion.div>
        </div>

        <div className="mt-10 rounded-3xl border border-primary/15 bg-primary/5 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold">현재 결제 상태</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            실 결제 연동은 아직 없습니다. 이 화면은 배포 전 사용자 흐름과 Docker 배포 구조를 확인하기 위한 프로토타입입니다.
          </p>
        </div>
      </div>
    </Layout>
  );
}
