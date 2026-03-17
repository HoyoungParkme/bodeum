import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Layout } from "@/components/layouts/layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mb-4 font-display text-3xl font-bold">페이지를 찾을 수 없습니다</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          주소가 잘못되었거나 이동된 화면입니다. 홈으로 돌아가서 다시 시작해 주세요.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          홈으로 이동
        </Link>
      </div>
    </Layout>
  );
}
