import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center flex-1 py-6 sm:py-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-5 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Big Five 기반 성향 분석
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-foreground leading-[1.2] mb-5 sm:mb-6 text-balance">
            나를 이해하는{" "}
            <span className="text-primary relative inline-block">
              가장 따뜻한 시간
              <svg className="absolute w-full h-2.5 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
              </svg>
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 text-balance leading-relaxed max-w-xl mx-auto">
            과학적인 심리 모델과 따뜻한 AI 코치의 대화를 통해 당신도 몰랐던 진짜 모습을 발견해보세요.
          </p>

          <Link
            href="/start"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-base sm:text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            분석 시작하기
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full mt-10 sm:mt-14 max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-border/50"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/hero-abstract.png`}
            alt="따뜻한 추상적 배경"
            className="w-full h-auto object-cover aspect-[16/9] sm:aspect-[16/7]"
          />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-14 sm:mt-20 w-full"
        >
          {[
            {
              icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
              bg: "bg-secondary/15 text-secondary",
              title: "과학적인 검증",
              desc: "세계적으로 가장 신뢰받는 심리학 모델인 'Big Five'를 바탕으로 분석합니다."
            },
            {
              icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
              bg: "bg-primary/15 text-primary",
              title: "따뜻한 AI 코치",
              desc: "딱딱한 결과지가 아닌, 나를 이해해주는 코치와의 대화로 진행됩니다."
            },
            {
              icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
              bg: "bg-accent text-accent-foreground",
              title: "입체적인 이해",
              desc: "나의 응답과 타인의 평가를 결합하여 나를 360도로 이해할 수 있습니다."
            }
          ].map((f, i) => (
            <div key={i} className="flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-0 p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center sm:mb-4 ${f.bg}`}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg mb-1 sm:mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </Layout>
  );
}
