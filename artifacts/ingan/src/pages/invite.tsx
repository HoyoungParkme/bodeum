import { Link } from "wouter";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Info } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Invite() {
  return (
    <Layout showNav={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-lg mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-card rounded-3xl p-8 md:p-12 shadow-xl shadow-black/5 border border-border"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">
              초대장이 도착했습니다
            </h1>
            <p className="text-lg text-foreground mb-2">
              <span className="font-semibold text-primary">지민</span>님이 당신을 더 깊이 이해하고 싶어합니다.
            </p>
            <p className="text-muted-foreground">
              약 10분 정도의 간단한 설문으로 서로에 대해 알아가 보세요.
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-6 mb-8 border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-secondary" />
              진행 전 안내사항
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span>당신의 응답 결과는 요약된 리포트 형태로만 전달됩니다. 개별 문항에 대한 답변은 비공개로 유지됩니다.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span>솔직하고 편안하게 답변해주실 때 가장 정확한 결과가 나옵니다.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="/survey/intro" 
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-center"
            >
              동의하고 시작하기
            </Link>
            <Link 
              href="/" 
              className="w-full py-4 rounded-xl bg-secondary/10 text-secondary-foreground font-medium text-lg hover:bg-secondary/20 transition-all text-center"
            >
              다음에 하기
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
