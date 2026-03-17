import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Send, Sparkles, User as UserIcon } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layouts/layout";
import {
  BigFiveScores,
  generateChatOpening,
  generateFollowUpQuestions,
  getDimensionLabel,
  getHighestDimension,
  getLowestDimension,
  useAssessment,
} from "@/contexts/assessment-context";

const DEMO_SCORES: BigFiveScores = { O: 82, C: 64, E: 54, A: 90, N: 48 };

interface Message {
  id: string;
  role: "user" | "coach";
  text: string;
}

function CoachAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Sparkles className="h-4 w-4" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <UserIcon className="h-4 w-4" />
    </div>
  );
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { scores: contextScores, setChatSummary } = useAssessment();
  const scores = contextScores ?? DEMO_SCORES;
  const highest = getHighestDimension(scores);
  const lowest = getLowestDimension(scores);
  const followUps = generateFollowUpQuestions(scores);

  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "coach", text: generateChatOpening(scores) },
  ]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const getCoachReply = (turn: number) => {
    if (turn < followUps.length) {
      return followUps[turn];
    }

    const summary = `${getDimensionLabel(highest)} 성향 강점 · ${getDimensionLabel(lowest)} 영역 성장 가능성 · 개인 맞춤 코칭 준비 완료`;
    setChatSummary(summary);

    return `오늘 나눈 이야기 잘 들었어요. ${getDimensionLabel(highest)} 성향이 강하신 만큼, 그에 맞는 방식으로 에너지를 관리하시는 게 중요할 것 같아요. ${getDimensionLabel(lowest)} 쪽도 조금씩 의식적으로 신경 써주시면 더 균형 잡힌 모습을 느끼실 수 있을 거예요. 아래에 오늘 대화 요약을 정리해드렸어요.`;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!input.trim() || isPending || isComplete) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      { id: Date.now().toString(), role: "user", text: input.trim() },
    ]);
    setInput("");
    setIsPending(true);

    const currentTurn = turnCount;

    window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        { id: `${Date.now()}-reply`, role: "coach", text: getCoachReply(currentTurn) },
      ]);
      setTurnCount((previous) => previous + 1);
      setIsPending(false);

      if (currentTurn >= followUps.length) {
        setIsComplete(true);
      }
    }, 900);
  };

  return (
    <Layout showNav={false}>
      <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col">
        <div className="shrink-0 border-b border-border/50 bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-lg font-bold text-primary">AI 코치와의 상담</h1>
              <p className="text-xs text-muted-foreground">설문 결과를 바탕으로 대화를 이어갑니다.</p>
            </div>
            <CoachAvatar />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-muted/15 px-4 py-5">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "coach" && <CoachAvatar />}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-base ${
                  message.role === "user"
                    ? "rounded-br-sm bg-foreground text-background"
                    : "rounded-bl-sm border border-border bg-card text-foreground shadow-sm"
                }`}
              >
                {message.text}
              </div>
              {message.role === "user" && <UserAvatar />}
            </motion.div>
          ))}

          {isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <CoachAvatar />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 shadow-sm">
                {[0, 0.15, 0.3].map((delay) => (
                  <span key={delay} className="h-2 w-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: `${delay}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {isComplete && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-primary/20 bg-card p-5 shadow-sm"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">오늘의 상담 요약</p>
              <div className="space-y-2 text-sm">
                <p>가장 두드러진 성향: <strong>{getDimensionLabel(highest)}</strong></p>
                <p>성장 가능성이 높은 영역: <strong>{getDimensionLabel(lowest)}</strong></p>
                <p>대화 턴 수: <strong>{turnCount}</strong></p>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setLocation("/report")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:-translate-y-0.5"
                >
                  기본 리포트 보기
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLocation("/pricing")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary/30 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  심층 리포트 보기
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="shrink-0 border-t border-border/50 bg-background px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isPending || isComplete}
              placeholder={isComplete ? "상담이 완료되었습니다." : "자유롭게 답변해주세요."}
              className="flex-1 rounded-2xl border-2 border-transparent bg-muted/60 px-4 py-3 text-sm transition-all placeholder:text-muted-foreground/60 focus:border-primary/30 focus:bg-background focus:outline-none disabled:opacity-50 sm:text-base"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending || isComplete}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-colors disabled:bg-muted disabled:text-muted-foreground"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
