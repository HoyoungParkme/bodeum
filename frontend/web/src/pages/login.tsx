import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Layout } from "@/components/layouts/layout";
import { useAuth } from "@/contexts/auth-context";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

const ERROR_MESSAGES: Record<string, string> = {
  kakao_failed: "카카오 로그인에 실패했습니다. 다시 시도해주세요.",
  google_failed: "구글 로그인에 실패했습니다. 다시 시도해주세요.",
};

export default function Login() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const errorKey = searchParams.get("error");
  const errorMessage = errorKey ? (ERROR_MESSAGES[errorKey] ?? "로그인 중 문제가 발생했습니다.") : null;

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE}/auth/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <Layout showNav={false}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold">시작하기</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              소셜 계정으로 간편하게 로그인하세요.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleKakaoLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-5 py-3.5 text-sm font-semibold text-[#191919] transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              <KakaoIcon />
              카카오로 시작하기
            </button>

            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-border bg-background px-5 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-muted/50"
            >
              <GoogleIcon />
              Google로 시작하기
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0.75C4.44 0.75 0.75 3.69 0.75 7.32c0 2.34 1.56 4.38 3.9 5.55l-.99 3.69c-.09.33.27.6.57.42l4.29-2.85c.15.03.3.03.48.03 4.56 0 8.25-2.94 8.25-6.57C17.25 3.69 13.56.75 9 .75z"
        fill="#191919"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
