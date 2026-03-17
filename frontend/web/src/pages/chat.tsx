import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Send, Sparkles, User as UserIcon } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layouts/layout";
import {
  BigFiveScores,
  generateChatOpening,
  getDimensionLabel,
  getHighestDimension,
  getLowestDimension,
  useAssessment,
} from "@/contexts/assessment-context";
import { requestCoachChat } from "@/services/api/endpoints/ml";

const DEMO_SCORES: BigFiveScores = { O: 82, C: 64, E: 54, A: 90, N: 48 };
const MAX_TURNS = 3;

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

  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "coach", text: generateChatOpening(scores) },
  ]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!input.trim() || isPending || isComplete) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setErrorText(null);
    setIsPending(true);

    try {
      const response = await requestCoachChat({
        scores,
        messages: nextMessages.map(({ role, text }) => ({ role, text })),
        turnCount,
      });

      const coachMessage: Message = {
        id: `${Date.now()}-reply`,
        role: "coach",
        text: response.reply,
      };
      const updatedTurnCount = turnCount + 1;

      setMessages([...nextMessages, coachMessage]);
      setChatSummary(response.summary);
      setTurnCount(updatedTurnCount);
      setIsComplete(updatedTurnCount >= MAX_TURNS);
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? "모델 응답을 가져오지 못했습니다. 잠시 후 다시 시도해주세요."
          : "알 수 없는 오류가 발생했습니다.";

      setErrorText(fallbackMessage);
      setMessages([
        ...nextMessages,
        {
          id: `${Date.now()}-error`,
          role: "coach",
          text: fallbackMessage,
        },
      ]);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Layout showNav={false}>
      <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col">
        <div className="shrink-0 border-b border-border/50 bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-lg font-bold text-primary">AI 코치 상담</h1>
              <p className="text-xs text-muted-foreground">
                설문 결과를 바탕으로 대화를 이어갑니다.
              </p>
            </div>
            <CoachAvatar />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto bg-muted/15 px-4 py-5"
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2"
            >
              <CoachAvatar />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 shadow-sm">
                {[0, 0.15, 0.3].map((delay) => (
                  <span
                    key={delay}
                    className="h-2 w-2 animate-bounce rounded-full bg-primary/50"
                    style={{ animationDelay: `${delay}s` }}
                  />
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
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                오늘의 상담 요약
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  가장 두드러진 성향: <strong>{getDimensionLabel(highest)}</strong>
                </p>
                <p>
                  보완 가능성이 큰 영역: <strong>{getDimensionLabel(lowest)}</strong>
                </p>
                <p>
                  진행한 대화 수: <strong>{turnCount}</strong>
                </p>
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
                  프리미엄 리포트 보기
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="shrink-0 border-t border-border/50 bg-background px-4 py-3">
          {errorText && <p className="mb-2 text-xs text-destructive">{errorText}</p>}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isPending || isComplete}
              placeholder={
                isComplete
                  ? "상담이 완료되었습니다."
                  : "지금 느끼는 점을 편하게 적어주세요."
              }
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
