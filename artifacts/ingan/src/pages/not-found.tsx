import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          요청하신 페이지가 사라졌거나 잘못된 경로입니다. 홈으로 돌아가 다시 시작해보세요.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </Layout>
  );
}
