import { Link } from "wouter";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Start() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">어떤 분석을 진행할까요?</h1>
          <p className="text-muted-foreground text-lg">나를 알아가거나, 소중한 사람을 더 깊이 이해해보세요.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Self Analysis Card */}
          <Link href="/survey/intro" className="block group">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full flex flex-col bg-card rounded-3xl p-8 border-2 border-border/50 shadow-sm hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 relative z-10">
                <User className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-display font-bold mb-3 relative z-10">나의 성향 알아보기</h2>
              <p className="text-muted-foreground leading-relaxed flex-1 relative z-10">
                100개의 문항과 따뜻한 AI 코치와의 대화를 통해 내 안의 숨겨진 빛나는 강점과 잠재력을 발견해보세요.
              </p>
              
              <div className="mt-8 rounded-xl overflow-hidden border border-border/50 bg-muted/30 aspect-square">
                <img 
                  src={`${import.meta.env.BASE_URL}images/self-analysis.png`} 
                  alt="자기 분석 일러스트" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
          </Link>

          {/* Other Analysis Card */}
          <Link href="/invite" className="block group">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="h-full flex flex-col bg-card rounded-3xl p-8 border-2 border-border/50 shadow-sm hover:border-secondary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              
              <div className="w-16 h-16 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-6 relative z-10">
                <Users className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-display font-bold mb-3 relative z-10">타인 성향 알아보기</h2>
              <p className="text-muted-foreground leading-relaxed flex-1 relative z-10">
                연인, 가족, 동료에게 링크를 보내 그들의 진짜 모습을 더 깊이 이해하고 소통의 실마리를 찾아보세요.
              </p>
              
              <div className="mt-8 rounded-xl overflow-hidden border border-border/50 bg-muted/30 aspect-square">
                <img 
                  src={`${import.meta.env.BASE_URL}images/other-analysis.png`} 
                  alt="타인 분석 일러스트" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
