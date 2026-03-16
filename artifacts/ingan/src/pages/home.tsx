import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center flex-1 py-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Big Five 기반 성향 분석
          </span>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-[1.2] mb-6 text-balance">
            나를 이해하는 <br className="hidden sm:block" />
            <span className="text-primary relative">
              가장 따뜻한 시간
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 text-balance leading-relaxed">
            과학적인 심리 모델과 따뜻한 AI 코치의 대화를 통해<br className="hidden md:block" />
            당신도 몰랐던 진짜 모습을 발견해보세요.
          </p>
          
          <Link 
            href="/start" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            분석 시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full mt-16 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-border/50"
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-abstract.png`} 
            alt="따뜻한 추상적 배경" 
            className="w-full h-auto object-cover aspect-[16/9]"
          />
        </motion.div>

        {/* Features / Trust Signals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full"
        >
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">과학적인 검증</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              세계적으로 가장 신뢰받는 심리학 모델인 'Big Five'를 바탕으로 분석합니다.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">따뜻한 AI 코치</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              딱딱한 결과지가 아닌, 나를 진심으로 이해해주는 코치와의 대화로 진행됩니다.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">입체적인 이해</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              나의 응답과 타인의 평가를 결합하여 나를 360도로 이해할 수 있습니다.
            </p>
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}
