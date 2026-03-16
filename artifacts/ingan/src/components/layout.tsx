import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Leaf, Menu, X } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {showNav && (
        <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:opacity-75 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight">ingan.ai</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-5">
              <Link
                href="/start"
                className={`text-sm font-medium transition-colors ${
                  location === "/start" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                분석 시작
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-medium transition-colors ${
                  location === "/pricing" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                요금제
              </Link>
              <Link
                href="/start"
                className="text-sm font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:-translate-y-0.5 transition-all shadow-sm"
              >
                무료로 시작하기
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="메뉴"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {menuOpen && (
            <div className="sm:hidden border-t border-border/40 bg-background px-4 py-3 flex flex-col gap-1">
              <Link href="/start" className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors" onClick={() => setMenuOpen(false)}>
                분석 시작하기
              </Link>
              <Link href="/pricing" className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors" onClick={() => setMenuOpen(false)}>
                요금제 · 심층 분석
              </Link>
              <Link href="/report" className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors" onClick={() => setMenuOpen(false)}>
                리포트 보기
              </Link>
              <Link href="/chat" className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors" onClick={() => setMenuOpen(false)}>
                AI 코치 상담
              </Link>
              <div className="my-1 h-px bg-border" />
              <Link href="/admin" className="flex items-center px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors" onClick={() => setMenuOpen(false)}>
                관리자 페이지
              </Link>
            </div>
          )}
        </header>
      )}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-12 flex flex-col">
        {children}
      </main>
    </div>
  );
}
