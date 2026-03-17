import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, User, Users } from "lucide-react";
import { Layout } from "@/components/layouts/layout";

const OPTIONS = [
  {
    href: "/survey/intro",
    title: "나의 성향 분석",
    description: "직접 설문에 답하고 기본 리포트와 AI 코칭까지 이어집니다.",
    image: "self-analysis.png",
    icon: User,
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    href: "/invite",
    title: "초대 링크 안내",
    description: "다른 사람 분석 흐름을 준비하기 위한 안내 화면으로 이동합니다.",
    image: "other-analysis.png",
    icon: Users,
    iconClassName: "bg-secondary/15 text-secondary",
  },
];

export default function Start() {
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center py-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="font-display text-3xl font-bold sm:text-4xl">어떤 흐름으로 시작할까요?</h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            현재는 자기 분석 플로우를 중심으로 프로토타입이 구성되어 있습니다.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {OPTIONS.map(({ href, title, description, image, icon: Icon, iconClassName }, index) => (
            <Link key={title} href={href} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className="overflow-hidden rounded-3xl border-2 border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-6 sm:p-8">
                  <div className="mb-5 flex items-start justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconClassName}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="rounded-full bg-muted p-2 text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>

                  <h2 className="font-display text-2xl font-bold">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {description}
                  </p>
                </div>

                <div className="h-40 overflow-hidden border-t border-border/40 bg-muted/30">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${image}`}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
