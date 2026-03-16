import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, BookOpen, Smile } from "lucide-react";
import { Layout } from "@/components/layout";

export default function SurveyIntro() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-10 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
            <Smile className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            준비되셨나요?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            나를 돌아보는 조용하고 편안한 시간입니다.<br className="hidden md:block" />
            정답은 없으니 떠오르는 대로 자연스럽게 답해주세요.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">총 100문항</h4>
                <p className="text-sm text-muted-foreground">다양한 상황에 대한 질문</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">소요 시간</h4>
                <p className="text-sm text-muted-foreground">약 10분 ~ 15분</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <Link 
            href="/survey" 
            className="w-full block text-center py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            설문 시작하기
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
