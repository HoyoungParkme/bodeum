import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Clock, Smile } from "lucide-react";
import { Layout } from "@/components/layouts/layout";

export default function SurveyIntro() {
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-10 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Smile className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">설문을 시작합니다</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            가볍게 선택해도 충분합니다. 지금의 나와 가장 가까운 응답을 고르면 됩니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-10 w-full rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">총 100문항</h2>
                <p className="text-sm text-muted-foreground">Big Five 다섯 영역을 고르게 확인합니다.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">약 10분</h2>
                <p className="text-sm text-muted-foreground">한 페이지에 5개 문항씩 차례대로 진행됩니다.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8 w-full">
          <Link
            href="/survey"
            className="block w-full rounded-2xl bg-primary py-4 text-center text-lg font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            설문 시작하기
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
