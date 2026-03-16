import { Link } from "wouter";
import { motion } from "framer-motion";
import { User, Users, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Start() {
  return (
    <Layout>
      <div className="flex flex-col items-center max-w-4xl mx-auto w-full py-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3">어떤 분석을 진행할까요?</h1>
          <p className="text-muted-foreground text-base sm:text-lg">나를 알아가거나, 소중한 사람을 더 깊이 이해해보세요.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          {/* Self Analysis */}
          <Link href="/survey/intro" className="block group">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full flex flex-col bg-card rounded-2xl sm:rounded-3xl border-2 border-border/50 shadow-sm hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110" />

              <div className="p-5 sm:p-8 flex flex-col flex-1 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <User className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="p-2 rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-bold mb-2 sm:mb-3">나의 성향 알아보기</h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  100개의 문항과 따뜻한 AI 코치와의 대화를 통해 내 안의 숨겨진 강점과 잠재력을 발견해보세요.
                </p>
              </div>

              {/* Image: smaller on mobile */}
              <div className="overflow-hidden h-36 sm:h-52 bg-muted/30 border-t border-border/40">
                <img
                  src={`${import.meta.env.BASE_URL}images/self-analysis.png`}
                  alt="자기 분석 일러스트"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>
            </motion.div>
          </Link>

          {/* Other Analysis */}
          <Link href="/invite" className="block group">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="h-full flex flex-col bg-card rounded-2xl sm:rounded-3xl border-2 border-border/50 shadow-sm hover:border-secondary/50 hover:shadow-lg hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/5 rounded-bl-full transition-transform group-hover:scale-110" />

              <div className="p-5 sm:p-8 flex flex-col flex-1 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
                    <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="p-2 rounded-full bg-muted text-muted-foreground group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-bold mb-2 sm:mb-3">타인 성향 알아보기</h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  연인, 가족, 동료에게 링크를 보내 그들의 진짜 모습을 더 깊이 이해하고 소통의 실마리를 찾아보세요.
                </p>
              </div>

              <div className="overflow-hidden h-36 sm:h-52 bg-muted/30 border-t border-border/40">
                <img
                  src={`${import.meta.env.BASE_URL}images/other-analysis.png`}
                  alt="타인 분석 일러스트"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
