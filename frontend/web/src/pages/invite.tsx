import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Info, Mail } from "lucide-react";
import { Layout } from "@/components/layouts/layout";

export default function Invite() {
  return (
    <Layout showNav={false}>
      <div className="mx-auto flex min-h-[80vh] w-full max-w-lg items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/5 md:p-12"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-8 w-8" />
          </div>

          <div className="text-center">
            <h1 className="font-display text-3xl font-bold">초대 흐름 안내</h1>
            <p className="mt-3 text-base text-foreground">
              현재 프로토타입은 <span className="font-semibold text-primary">자기 분석</span> 플로우를
              중심으로 구성되어 있습니다.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              다른 사람 분석용 링크, 권한 관리, 결과 공유는 다음 단계에서 붙일 예정입니다.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border/60 bg-muted/40 p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Info className="h-5 w-5 text-secondary" />
              지금 가능한 흐름
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                기본 설문, AI 코칭, 리포트까지 전체 사용자 경험을 확인할 수 있습니다.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                Docker 배포 구조는 자기 분석 플로우를 기준으로 정리했습니다.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/survey/intro"
              className="rounded-xl bg-primary py-4 text-center text-lg font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              자기 분석으로 계속하기
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-secondary/10 py-4 text-center text-lg font-medium text-secondary-foreground transition-colors hover:bg-secondary/20"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
