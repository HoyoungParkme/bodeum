import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Send, User as UserIcon } from "lucide-react";
import { Layout } from "@/components/layout";
import { useChat, ChatMessage } from "@/hooks/use-assessment";

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

  const isComplete = messages.length >= 3;

  return (
    <Layout showNav={false}>
      <div className="max-w-2xl mx-auto w-full flex flex-col h-[85vh] bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary/5 border-b border-border/50 p-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display font-bold text-lg text-primary">AI 코치와의 대화</h2>
            <p className="text-xs text-muted-foreground">당신을 더 깊이 이해하는 중입니다</p>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-accent/20"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {msg.role === 'coach' && (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <SparklesIcon />
                  </div>
                )}
                
                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}

                <div 
                  className={`
                    p-4 rounded-2xl text-[15px] leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-foreground text-background rounded-tr-sm' 
                      : 'bg-card border border-border shadow-sm text-foreground rounded-tl-sm'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <SparklesIcon />
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}

          {isComplete && !isPending && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-6 pb-2 text-center">
                <button
                  onClick={() => setLocation("/report")}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  결과 리포트 보기
                </button>
             </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t border-border">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending || isComplete}
              placeholder="자유롭게 답변해주세요..."
              className="w-full bg-muted/50 border-2 border-transparent focus:border-primary/30 focus:bg-background focus:outline-none rounded-2xl px-6 py-4 pr-16 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending || isComplete}
              className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
