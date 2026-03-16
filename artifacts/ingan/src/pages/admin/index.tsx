import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, Users, CreditCard, Activity, Settings, TrendingUp, TrendingDown, AlertCircle, LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const ADMIN_PASSWORD = "admin123";

// ── Mock data ───────────────────────────────────────────────────────────────

const DAILY_SIGNUPS = [
  { date: "3/10", users: 12 }, { date: "3/11", users: 19 }, { date: "3/12", users: 8 },
  { date: "3/13", users: 24 }, { date: "3/14", users: 31 }, { date: "3/15", users: 27 },
  { date: "3/16", users: 14 },
];

const MONTHLY_REVENUE = [
  { month: "10월", revenue: 128700 }, { month: "11월", revenue: 247500 },
  { month: "12월", revenue: 312900 }, { month: "1월", revenue: 198000 },
  { month: "2월", revenue: 384900 }, { month: "3월", revenue: 267300 },
];

const USERS = [
  { id: "U001", name: "김지수", email: "jisu@example.com", type: "유료", joinDate: "2026-02-14", lastActive: "2026-03-15", usage: "리포트 3회, 상담 7회" },
  { id: "U002", name: "박민준", email: "minjun@example.com", type: "무료", joinDate: "2026-03-01", lastActive: "2026-03-16", usage: "리포트 1회, 상담 1회" },
  { id: "U003", name: "이소연", email: "soyeon@example.com", type: "유료", joinDate: "2026-01-20", lastActive: "2026-03-14", usage: "리포트 6회, 상담 18회" },
  { id: "U004", name: "최현우", email: "hyunwoo@example.com", type: "무료", joinDate: "2026-03-10", lastActive: "2026-03-12", usage: "리포트 1회" },
  { id: "U005", name: "강유진", email: "yujin@example.com", type: "유료", joinDate: "2026-02-28", lastActive: "2026-03-16", usage: "리포트 2회, 상담 5회" },
  { id: "U006", name: "정다은", email: "daeun@example.com", type: "무료", joinDate: "2026-03-15", lastActive: "2026-03-16", usage: "설문 완료 1회" },
];

const PAYMENTS = [
  { id: "PAY-0041", user: "강유진", amount: 9900, type: "1회 결제", date: "2026-03-16", status: "완료" },
  { id: "PAY-0040", user: "이소연", amount: 9900, type: "월정액 갱신", date: "2026-03-14", status: "완료" },
  { id: "PAY-0039", user: "김지수", amount: 9900, type: "월정액 갱신", date: "2026-03-10", status: "완료" },
  { id: "PAY-0038", user: "박민준", amount: 9900, type: "1회 결제", date: "2026-03-05", status: "환불" },
  { id: "PAY-0037", user: "이소연", amount: 9900, type: "월정액 갱신", date: "2026-02-14", status: "완료" },
];

const CHAT_USAGE = [
  { date: "3/10", sessions: 8, avgTurns: 3.2 }, { date: "3/11", sessions: 14, avgTurns: 3.8 },
  { date: "3/12", sessions: 6, avgTurns: 2.9 }, { date: "3/13", sessions: 19, avgTurns: 4.1 },
  { date: "3/14", sessions: 22, avgTurns: 4.4 }, { date: "3/15", sessions: 18, avgTurns: 3.9 },
  { date: "3/16", sessions: 9, avgTurns: 3.5 },
];

const DROP_POINTS = [
  { step: "랜딩 방문", users: 1240, pct: 100 },
  { step: "분석 유형 선택", users: 820, pct: 66 },
  { step: "설문 시작", users: 590, pct: 48 },
  { step: "설문 완료", users: 411, pct: 33 },
  { step: "챗봇 대화", users: 320, pct: 26 },
  { step: "리포트 열람", users: 298, pct: 24 },
  { step: "유료 전환", users: 54, pct: 4.4 },
];

// ── Sub-sections ─────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, trend }: { label: string; value: string; sub?: string; trend?: 'up' | 'down' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500" />}
        {trend === 'down' && <TrendingDown className="w-5 h-5 text-rose-500" />}
      </div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="오늘 신규 사용자" value="14명" sub="어제 대비 -48%" trend="down" />
        <StatCard label="이번 달 매출" value="₩267,300" sub="지난달 대비 +31%" trend="up" />
        <StatCard label="전체 사용자" value="1,240명" sub="유료 54명 (4.4%)" />
        <StatCard label="설문 완료율" value="69.7%" sub="시작 590명 → 완료 411명" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 text-gray-700">일별 신규 가입</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={DAILY_SIGNUPS} barSize={24}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="users" fill="hsl(25, 65%, 60%)" radius={[6, 6, 0, 0]} name="신규 가입" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 text-gray-700">월별 매출 추이</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
              <Tooltip formatter={(v: number) => [`₩${v.toLocaleString()}`]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(25, 65%, 55%)" strokeWidth={2.5} dot={{ fill: "hsl(25, 65%, 55%)", r: 4 }} name="매출" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-4 text-gray-700">이용자 이탈 분석</h3>
        <div className="space-y-2">
          {DROP_POINTS.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-28 shrink-0">{d.step}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                  style={{ width: `${d.pct}%`, background: `hsl(25, ${30 + d.pct * 0.4}%, ${55 + (100 - d.pct) * 0.3}%)` }}
                >
                  <span className="text-[10px] text-white font-bold">{d.pct}%</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-700 w-12 text-right">{d.users.toLocaleString()}명</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">운영 알림</p>
          <p className="text-xs text-amber-700 mt-1">설문 → 챗봇 단계에서 이탈률이 21%로 높습니다. 챗봇 첫 메시지 개선을 검토해보세요.</p>
        </div>
      </div>
    </div>
  );
}

function UsersSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">사용자 현황 ({USERS.length}명 표시 중)</h3>
        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-lg">전체 1,240명</span>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">ID</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">이름</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">유형</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">가입일</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">마지막 활동</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">이용 현황</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{u.id}</td>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.type === '유료' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                      {u.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.joinDate}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.lastActive}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentsSection() {
  const totalRevenue = PAYMENTS.filter(p => p.status === '완료').reduce((s, p) => s + p.amount, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="총 결제 수" value={`${PAYMENTS.length}건`} sub="이번 달" />
        <StatCard label="확인된 매출" value={`₩${totalRevenue.toLocaleString()}`} sub="이번 달 완료 기준" trend="up" />
        <StatCard label="환불 건수" value="1건" sub={`₩${(9900).toLocaleString()} 환불`} trend="down" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">결제 ID</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">사용자</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">금액</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">유형</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">날짜</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500">상태</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{p.id}</td>
                  <td className="px-4 py-3 font-medium">{p.user}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">₩{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.type}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.status === '완료' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsageSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="이번 주 상담 세션" value="96회" sub="일평균 13.7회" trend="up" />
        <StatCard label="평균 대화 턴 수" value="3.8회" sub="목표: 4턴 이상" />
        <StatCard label="챗봇 완료율" value="78.2%" sub="시작 후 끝까지" trend="up" />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-4 text-gray-700">일별 챗봇 세션 & 평균 턴수</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CHAT_USAGE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar yAxisId="left" dataKey="sessions" fill="hsl(25, 65%, 60%)" radius={[4, 4, 0, 0]} name="세션 수" />
            <Line yAxisId="right" type="monotone" dataKey="avgTurns" stroke="#64748b" strokeWidth={2} dot={{ r: 3 }} name="평균 턴수" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SettingsSection() {
  const [notices, setNotices] = useState({
    maintenance: false,
    newFeature: true,
    freeTrialBanner: true,
  });

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-gray-800 mb-2">공지 및 배너 설정</h3>
        {[
          { key: 'maintenance' as const, label: "점검 공지 배너", desc: "상단에 점검 예정 안내 표시" },
          { key: 'newFeature' as const, label: "신기능 배너", desc: "변화 추적 리포트 출시 안내" },
          { key: 'freeTrialBanner' as const, label: "무료 체험 유도 배너", desc: "리포트 페이지 하단 업그레이드 배너" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => setNotices(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${notices[item.key] ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notices[item.key] ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-4">유료 체험 설정</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm">신규 가입 무료 체험 기간</label>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
            <option>없음</option>
            <option>3일</option>
            <option selected>7일</option>
            <option>14일</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Login screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-lg">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <BarChart2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold">ingan.ai 관리자</h1>
          <p className="text-sm text-gray-500 mt-1">운영자 전용 공간입니다</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="관리자 비밀번호"
            className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${error ? 'border-rose-400 bg-rose-50' : 'border-gray-200 focus:border-primary/40'}`}
          />
          {error && <p className="text-xs text-rose-500">비밀번호가 올바르지 않습니다</p>}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all"
          >
            로그인
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">데모: 비밀번호 <code className="bg-gray-100 px-1.5 py-0.5 rounded">admin123</code></p>
      </div>
    </div>
  );
}

// ── Main Admin component ─────────────────────────────────────────────────────

const TABS = [
  { id: 'dashboard', label: '운영 현황', icon: BarChart2 },
  { id: 'users', label: '사용자', icon: Users },
  { id: 'payments', label: '결제 내역', icon: CreditCard },
  { id: 'usage', label: '이용 현황', icon: Activity },
  { id: 'settings', label: '운영 설정', icon: Settings },
];

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-sm">ingan.ai 관리자</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">오늘: 2026.03.16</span>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              로그아웃
            </button>
          </div>
        </div>
        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'users' && <UsersSection />}
          {activeTab === 'payments' && <PaymentsSection />}
          {activeTab === 'usage' && <UsageSection />}
          {activeTab === 'settings' && <SettingsSection />}
        </motion.div>
      </main>
    </div>
  );
}
