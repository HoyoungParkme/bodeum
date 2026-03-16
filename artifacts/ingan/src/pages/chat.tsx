import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Send, User as UserIcon, ArrowRight, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout";
import { ChatMessage } from "@/hooks/use-assessment";
import {
  useAssessment,
  generateChatOpening,
  generateFollowUpQuestions,
  getDimensionLabel,
  getHighestDimension,
  getLowestDimension,
  BigFiveScores,
} from "@/context/assessment-context";

// Mock scores for demo (when entering chat directly without survey)
const DEMO_SCORES: BigFiveScores = { O: 82, C: 64, E: 54, A: 90, N: 48 };

function CoachAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
      <Sparkles className="w-4 h-4" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
      <UserIcon className="w-4 h-4" />
    </div>
  );
}

interface Message {
  id: string;
  role: 'user' | 'coach';
  text: string;
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { scores: contextScores, setChatSummary } = useAssessment();
  const scores = contextScores ?? DEMO_SCORES;

  const opening = generateChatOpening(scores);
  const followUps = generateFollowUpQuestions(scores);
  const highest = getHighestDimension(scores);
  const lowest = getLowestDimension(scores);

  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "coach", text: opening }
  ]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const getCoachReply = (userText: string, turn: number): string => {
    if (turn < followUps.length) {
      return followUps[turn];
    }
    // Final closing message
    const summaryText = `오늘 나눈 이야기 잘 들었어요. ${getDimensionLabel(highest)} 성향이 강하신 만큼, 그에 맞는 방식으로 에너지를 관리하시는 게 중요할 것 같아요. ${getDimensionLabel(lowest)} 쪽도 조금씩 의식적으로 신경 써주시면 더 균형 잡힌 모습을 느끼실 수 있을 거예요. 오늘 편하게 이야기 나눠주셔서 감사해요. 아래에 오늘 대화 요약을 정리해드렸어요.`;
    
    // Save summary to context
    const summary = `${getDimensionLabel(highest)} 성향 강점 · ${getDimensionLabel(lowest)} 영역 성장 가능성 · 개인 맞춤 코칭 준비 완료`;
    setChatSummary(summary);
    
    return summaryText;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending || isComplete) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsPending(true);

    const currentTurn = turnCount;

    setTimeout(() => {
      const reply = getCoachReply(input, currentTurn);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "coach", text: reply }]);
      setIsPending(false);
      setTurnCount(t => t + 1);
      if (currentTurn >= followUps.length) {
        setIsComplete(true);
      }
    }, 1400);
  };

  // Score bar component
  const ScoreBar = ({ cat, score }: { cat: string; score: number }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-10 shrink-0">{cat}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-primary w-6 text-right">{score}</span>
    </div>
  );

  return (
    <Layout showNav={false}>
      <div className="max-w-2xl mx-auto w-full flex flex-col" style={{ height: "calc(100dvh - 3.5rem)" }}>

        {/* Header with score summary */}
        <div className="bg-background border-b border-border/50 px-4 py-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-primary leading-tight">AI 코치와의 상담</h2>
              <p className="text-xs text-muted-foreground">설문 결과를 바탕으로 대화합니다</p>
            </div>
            <CoachAvatar />
          </div>
          {/* Compact score display */}
          <div className="grid grid-cols-5 gap-1 mt-1">
            {(Object.entries(scores) as [string, number][]).map(([cat, score]) => (
              <ScoreBar key={cat} cat={getDimensionLabel(cat as any).slice(0, 2)} score={score} />
            ))}
          </div>
        </div>

        {/* Chat messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-muted/15">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {msg.role === 'coach' && <CoachAvatar />}
              <div className={`
                max-w-[78%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-foreground text-background rounded-br-sm'
                  : 'bg-card border border-border shadow-sm text-foreground rounded-bl-sm'
                }
              `}>
                {msg.text}
              </div>
              {msg.role === 'user' && <UserAvatar />}
            </motion.div>
          ))}

          {isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <CoachAvatar />
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-border shadow-sm flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: `${delay}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Completion card */}
          {isComplete && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-card border border-primary/20 rounded-2xl p-5 shadow-sm"
            >
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">오늘의 상담 요약</p>
              <div className="space-y-2 mb-5">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span>가장 두드러진 성향: <strong>{getDimensionLabel(highest)}</strong> ({scores[highest]}점)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span>성장 가능성 영역: <strong>{getDimensionLabel(lowest)}</strong> ({scores[lowest]}점)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span>대화 턴 수: {turnCount}회 · 맞춤 분석 준비 완료</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setLocation("/report")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-md hover:-translate-y-0.5 transition-all"
                >
                  기본 리포트 보기
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLocation("/pricing")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-card border-2 border-primary/30 text-primary font-medium text-sm hover:bg-primary/5 transition-all"
                >
                  심층 리포트 보기 ✦
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 bg-background border-t border-border/50 shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending || isComplete}
              placeholder={isComplete ? "상담이 완료되었습니다" : "자유롭게 답변해주세요..."}
              className="flex-1 bg-muted/60 border-2 border-transparent focus:border-primary/30 focus:bg-background focus:outline-none rounded-2xl px-4 py-3 text-sm sm:text-base transition-all disabled:opacity-50 placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending || isComplete}
              className="shrink-0 w-11 h-11 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:bg-muted disabled:text-muted-foreground"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
