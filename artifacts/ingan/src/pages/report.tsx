import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Download, Share2, Star, AlertCircle, MessageCircle, Lightbulb } from "lucide-react";
import { Layout } from "@/components/layout";
import { useReport } from "@/hooks/use-assessment";

export default function Report() {
  const { data: report, isLoading } = useReport();

  if (isLoading || !report) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
          <h2 className="text-xl font-display font-bold mb-2">결과를 분석하고 있습니다...</h2>
          <p className="text-muted-foreground text-sm">수집된 데이터를 종합하여 리포트를 생성중입니다.</p>
        </div>
      </Layout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Layout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto w-full space-y-8 pb-12"
      >
        {/* Header / Summary */}
        <motion.div variants={itemVariants} className="text-center py-6">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">당신의 성향 리포트</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4 text-balance">
            {report.summary}
          </h1>
        </motion.div>

        {/* Radar Chart Section */}
        <motion.div variants={itemVariants} className="bg-card rounded-3xl p-6 md:p-10 border border-border shadow-sm flex flex-col items-center">
          <h3 className="font-display font-bold text-xl mb-6 text-center w-full">Big Five 성향 밸런스</h3>
          <div className="w-full h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.radarData}>
                <PolarGrid stroke="#e5e2db" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }} 
                />
                <Radar 
                  name="성향" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full mt-6 pt-6 border-t border-border/50 text-sm text-muted-foreground text-center">
            각 지표는 우열이 아닌 당신이 가진 고유한 에너지의 방향을 보여줍니다.
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl">빛나는 강점</h3>
            </div>
            <ul className="space-y-4">
              {report.strengths.map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-secondary/5 rounded-3xl p-8 border border-secondary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary/15 text-secondary rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl">성장 포인트</h3>
            </div>
            <ul className="space-y-4">
              {report.growthAreas.map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-secondary mt-1">•</span>
                  <span className="text-foreground leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Communication & Tips */}
        <motion.div variants={itemVariants} className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-sm">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-foreground" />
              <h3 className="font-display font-bold text-xl">소통 스타일</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg bg-muted/30 p-6 rounded-2xl">
              {report.communicationStyle}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-accent-foreground" />
              <h3 className="font-display font-bold text-xl">코치 AI의 조언</h3>
            </div>
            <div className="space-y-4">
              {report.coachingTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-border/50 hover:bg-muted/20 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-foreground leading-relaxed pt-1">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors shadow-lg">
            <Download className="w-5 h-5" />
            PDF로 저장하기
          </button>
          <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-card border-2 border-border font-medium hover:border-foreground/20 hover:bg-muted/50 transition-colors">
            <Share2 className="w-5 h-5" />
            결과 링크 공유
          </button>
        </motion.div>

      </motion.div>
    </Layout>
  );
}
