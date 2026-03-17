import { ReactNode, useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { APP_NAME } from "@/constants";

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
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary transition-opacity hover:opacity-75"
              onClick={() => setMenuOpen(false)}
            >
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-display text-lg font-bold tracking-tight sm:text-xl">{APP_NAME}</span>
            </Link>

            <nav className="hidden items-center gap-5 sm:flex">
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
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5"
              >
                무료로 시작하기
              </Link>
            </nav>

            <button
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="메뉴"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen && (
            <div className="flex flex-col gap-1 border-t border-border/40 bg-background px-4 py-3 sm:hidden">
              <Link
                href="/start"
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                분석 시작하기
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                요금제 · 심층 분석
              </Link>
              <Link
                href="/report"
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                리포트 보기
              </Link>
              <Link
                href="/chat"
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                AI 코치 상담
              </Link>
              <div className="my-1 h-px bg-border" />
              <Link
                href="/admin"
                className="rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                관리자 페이지
              </Link>
            </div>
          )}
        </header>
      )}

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10 md:py-12">
        {children}
      </main>
    </div>
  );
}
