import { ReactNode } from "react";
import { Link } from "wouter";
import { Leaf } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {showNav && (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
              <Leaf className="w-6 h-6" />
              <span className="font-display font-bold text-xl tracking-tight">ingan.ai</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/start" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                분석 시작하기
              </Link>
              <Link href="/invite" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                초대 확인
              </Link>
            </nav>
          </div>
        </header>
      )}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col">
        {children}
      </main>
    </div>
  );
}
