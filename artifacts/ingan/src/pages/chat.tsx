import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Send, User as UserIcon, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { useChat, ChatMessage } from "@/hooks/use-assessment";

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { mutate: sendMessage, isPending } = useChat();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "coach",
      text: "설문하시느라 고생 많으셨어요! 결과를 분석하기 전에 한 가지만 여쭤볼게요. 스트레스를 받을 때 보통 어떻게 대처하시는 편인가요?"
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    sendMessage(input, {
      onSuccess: (reply) => {
        setMessages(prev => [...prev, reply]);
      }
    });
  };

  const isComplete = messages.length >= 5;

  return (
    <Layout showNav={false}>
      <div className="max-w-2xl mx-auto w-full flex flex-col" style={{ height: "calc(100dvh - 3.5rem)" }}>

        {/* Header */}
        <div className="bg-background border-b border-border/50 px-4 py-3 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-primary leading-tight">AI 코치와의 대화</h2>
            <p className="text-xs text-muted-foreground">당신을 더 깊이 이해하는 중입니다</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <SparklesIcon />
          </div>
        </div>

        {/* Chat messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-muted/20"
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {msg.role === 'coach' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mb-0.5">
                  <SparklesIcon />
                </div>
              )}

              <div
                className={`
                  max-w-[78%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-foreground text-background rounded-br-sm'
                    : 'bg-card border border-border shadow-sm text-foreground rounded-bl-sm'
                  }
                `}
              >
                {msg.text}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mb-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}

          {isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <SparklesIcon />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-border shadow-sm flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {isComplete && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 pb-2 text-center"
            >
              <p className="text-sm text-muted-foreground mb-3">대화가 완료되었습니다. 리포트를 확인해보세요.</p>
              <button
                onClick={() => setLocation("/report")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                결과 리포트 보기
                <ArrowRight className="w-4 h-4" />
              </button>
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
              placeholder={isComplete ? "대화가 완료되었습니다" : "자유롭게 답변해주세요..."}
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
