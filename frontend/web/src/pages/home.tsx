import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Layout } from "@/components/layouts/layout";

const FEATURES = [
  {
    title: "Big Five 기반 성향 분석",
    description: "100개 문항으로 성향의 균형을 빠르게 확인합니다.",
    icon: ShieldCheck,
  },
  {
    title: "AI 코칭 대화",
    description: "점수만 보여주는 대신 실제 생활 맥락까지 함께 정리합니다.",
    icon: Sparkles,
  },
  {
    title: "실행 가능한 리포트",
    description: "강점, 주의 포인트, 행동 가이드를 한 화면에서 확인합니다.",
    icon: HeartHandshake,
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center justify-center py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Self insight for real conversations
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            내 성향을 숫자보다
            <span className="block text-primary">맥락으로 이해하는 리포트</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Big Five 점수, AI 코칭, 프리미엄 리포트를 하나의 흐름으로 연결했습니다.
            먼저 기본 분석을 완료하고 필요하면 더 깊은 해석으로 확장할 수 있습니다.
          </p>

          <Link
            href="/start"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            시작하기
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 w-full max-w-4xl overflow-hidden rounded-3xl border border-border/50 shadow-2xl shadow-black/5"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/hero-abstract.png`}
            alt="서비스 대표 이미지"
            className="aspect-[16/8] w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-14 grid w-full grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {FEATURES.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="font-display text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
