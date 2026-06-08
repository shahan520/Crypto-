import React, { useState } from "react";
import {
  ChevronDown,
  EyeOff,
  Eye,
  Home as HomeIcon,
  Briefcase,
  Grid3X3,
  ClipboardList,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  UserPlus,
  Bell,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  CircleDashed,
  Settings as SettingsIcon,
  Shield,
  Globe,
  LogOut,
  Copy,
  Info,
  BookOpen,
  HelpCircle,
  FileBadge2,
  Users,
  TrendingUp,
  TrendingDown,
  Wifi,
  Battery,
  Signal,
  ChevronLeft,
  Lock,
  Bell as BellIcon,
  Fingerprint,
  CreditCard,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

type Page = "login" | "home" | "service" | "menu" | "records" | "profile" | "settings";

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = (page: Page) => {
    if (page === currentPage) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsAnimating(false);
    }, 180);
  };

  const isLoggedIn = currentPage !== "login";

  return (
    <div className="min-h-screen bg-[#e8e8e8] flex items-center justify-center font-sans">
      <div
        className="w-[390px] h-[844px] bg-white overflow-hidden relative flex flex-col"
        style={{
          borderRadius: "44px",
          border: "10px solid #1a1a1a",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Status Bar */}
        <div className="w-full flex justify-between items-center px-7 pt-3 pb-1 shrink-0 z-50 relative bg-transparent">
          <span className="text-[13px] font-semibold text-gray-900 tabular-nums">9:41</span>
          <div className="w-28 h-7 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5" />
          <div className="flex items-center gap-1.5">
            <Signal size={14} className="text-gray-900" strokeWidth={2.5} />
            <Wifi size={14} className="text-gray-900" strokeWidth={2.5} />
            <div className="flex items-center gap-0.5">
              <div className="w-[22px] h-[11px] rounded-[3px] border-[1.5px] border-gray-700 relative p-[1.5px] flex items-center">
                <div className="w-[60%] h-full bg-gray-800 rounded-[1px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div
          className="flex-1 overflow-hidden"
          style={{
            opacity: isAnimating ? 0 : 1,
            transition: "opacity 0.18s ease",
          }}
        >
          {currentPage === "login" && <LoginScreen onLogin={() => navigate("home")} />}
          {currentPage === "home" && <HomeScreen onNavigate={navigate} />}
          {currentPage === "service" && <WalletScreen />}
          {currentPage === "menu" && <TeamScreen />}
          {currentPage === "records" && <RecordsScreen />}
          {currentPage === "profile" && (
            <ProfileScreen
              onSettings={() => navigate("settings")}
              onLogout={() => navigate("login")}
            />
          )}
          {currentPage === "settings" && (
            <SettingsScreen
              onBack={() => navigate("profile")}
              onLogout={() => navigate("login")}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        {isLoggedIn && currentPage !== "settings" && (
          <BottomNav currentPage={currentPage} onNavigate={navigate} />
        )}
      </div>
    </div>
  );
}

/* ──────────────────────── Bottom Nav ──────────────────────── */

const NAV_ITEMS: { id: Page; icon: React.ComponentType<any>; label: string }[] = [
  { id: "home", icon: HomeIcon, label: "Home" },
  { id: "service", icon: Briefcase, label: "Service" },
  { id: "menu", icon: Grid3X3, label: "Menu" },
  { id: "records", icon: ClipboardList, label: "Record" },
  { id: "profile", icon: User, label: "Mine" },
];

function BottomNav({
  currentPage,
  onNavigate,
}: {
  currentPage: Page;
  onNavigate: (p: Page) => void;
}) {
  return (
    <div
      className="w-full bg-white shrink-0 flex justify-around items-end pt-2 pb-6 px-2"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.04)",
      }}
    >
      {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
        const active = currentPage === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="flex flex-col items-center gap-1 w-16 relative pt-1"
          >
            {active && (
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full"
                style={{ background: "#6d4c57" }}
              />
            )}
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.8}
              color={active ? "#6d4c57" : "#9ca3af"}
            />
            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: active ? "#6d4c57" : "#9ca3af" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────── Login ──────────────────────── */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full overflow-y-auto px-6 pt-4 pb-8 flex flex-col" style={{ scrollbarWidth: "none" }}>
      <div className="flex justify-end mb-8">
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          <Globe size={13} className="text-gray-400" />
          EN
          <ChevronDown size={12} className="text-gray-400" />
        </button>
      </div>

      <div className="mb-10 text-center">
        <div
          className="w-[68px] h-[68px] mx-auto mb-5 rounded-[20px] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #6d4c57 0%, #8a6370 100%)",
            boxShadow: "0 12px 32px rgba(109,76,87,0.30)",
          }}
        >
          <Shield className="text-white" size={30} strokeWidth={1.5} />
        </div>
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight leading-tight">
          Welcome Back
        </h1>
        <p className="text-[13px] text-gray-400 mt-1.5">Sign in to your private portfolio</p>
      </div>

      <div className="space-y-4">
        <FormField label="Username">
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full bg-gray-50 border border-gray-100 px-4 py-3.5 rounded-[14px] text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6d4c57] focus:bg-white transition-all"
          />
        </FormField>

        <FormField label="Password">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-gray-50 border border-gray-100 px-4 py-3.5 pr-12 rounded-[14px] text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6d4c57] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </FormField>

        <FormField label="Verification Code">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter code"
              className="flex-1 bg-gray-50 border border-gray-100 px-4 py-3.5 rounded-[14px] text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6d4c57] focus:bg-white transition-all"
            />
            <div
              className="w-[88px] rounded-[14px] flex items-center justify-center font-mono text-[20px] font-bold tracking-[4px] select-none shrink-0"
              style={{
                background: "linear-gradient(135deg, #f5f0f2 0%, #ede5e8 100%)",
                color: "#6d4c57",
                border: "1px solid rgba(109,76,87,0.15)",
              }}
            >
              8429
            </div>
          </div>
        </FormField>
      </div>

      <div className="flex items-center mt-5">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0"
            style={{ background: "#6d4c57" }}
          >
            <CheckCircle2 size={12} className="text-white" />
          </div>
          <span className="text-[13px] text-gray-600 font-medium">Remember password</span>
        </label>
      </div>

      <button
        onClick={onLogin}
        className="w-full text-white font-semibold py-4 rounded-[14px] mt-8 text-[15px] tracking-wide transition-all active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #6d4c57 0%, #7e5865 100%)",
          boxShadow: "0 8px 24px rgba(109,76,87,0.32)",
        }}
      >
        Sign In
      </button>

      <div className="mt-7 text-center">
        <span className="text-[13px] text-gray-400">Don't have an account? </span>
        <button className="text-[13px] font-bold" style={{ color: "#6d4c57" }}>
          Register
        </button>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ──────────────────────── Home ──────────────────────── */

function HomeScreen({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div
      className="h-full overflow-y-auto flex flex-col"
      style={{ scrollbarWidth: "none", paddingBottom: "8px" }}
    >
      {/* Header */}
      <div className="px-6 pt-2 pb-4 flex justify-between items-center shrink-0">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-0.5">Good morning,</p>
          <h2 className="text-[20px] font-bold text-gray-900 leading-tight">John Wealth</h2>
        </div>
        <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center relative">
          <Bell size={18} className="text-gray-600" />
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: "#6d4c57" }}
          />
        </button>
      </div>

      {/* Balance Hero Card */}
      <div className="px-5 mb-5 shrink-0">
        <div
          className="w-full rounded-[20px] p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #6d4c57 0%, #7e5865 60%, #5a3e48 100%)",
            boxShadow: "0 12px 40px rgba(109,76,87,0.30)",
          }}
        >
          <div className="absolute top-0 right-0 w-52 h-52 bg-white/5 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-black/10 rounded-full -ml-10 -mb-14" />
          <div className="relative z-10">
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-3">
              Total Portfolio Value
            </p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-white/70 text-[16px] font-medium">$</span>
              <span className="text-[32px] font-bold text-white tracking-tight leading-none">
                124,592
              </span>
              <span className="text-white/70 text-[16px] font-medium">.50</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp size={13} className="text-emerald-300" />
              <span className="text-emerald-300 text-[12px] font-semibold">+2.4% today</span>
            </div>
          </div>
          <div className="relative z-10 flex gap-3 mt-5">
            <button
              onClick={() => onNavigate("service")}
              className="flex-1 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[13px] font-semibold py-2.5 rounded-[10px] hover:bg-white/25 transition-all"
            >
              Deposit
            </button>
            <button
              onClick={() => onNavigate("service")}
              className="flex-1 bg-white/10 border border-white/15 text-white/80 text-[13px] font-semibold py-2.5 rounded-[10px] hover:bg-white/20 transition-all"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6 shrink-0">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: ArrowDownLeft, label: "Deposit", page: "service" as Page },
            { icon: ArrowUpRight, label: "Withdraw", page: "service" as Page },
            { icon: Users, label: "Team", page: "menu" as Page },
            { icon: UserPlus, label: "Invite", page: "menu" as Page },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => onNavigate(action.page)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                style={{ background: "rgba(109,76,87,0.08)" }}
              >
                <action.icon size={20} color="#6d4c57" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold text-gray-600">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Announcement Ticker */}
      <div className="px-5 mb-5 shrink-0">
        <div
          className="flex items-center bg-amber-50 rounded-[12px] px-3 py-2.5 gap-3"
          style={{ border: "1px solid rgba(245,158,11,0.2)" }}
        >
          <div className="bg-amber-100 rounded-[6px] px-2 py-0.5 shrink-0">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">News</span>
          </div>
          <p className="text-[12px] text-amber-800 truncate flex-1 font-medium">
            System upgrade scheduled for 02:00 AM UTC tonight.
          </p>
        </div>
      </div>

      {/* Platform Info Cards */}
      <div className="px-5 mb-6 shrink-0">
        <SectionHeader title="Platform Info" />
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: Info, label: "Platform Profile", desc: "About us" },
            { icon: FileBadge2, label: "Platform Rules", desc: "Terms of use" },
            { icon: BookOpen, label: "Cooperation", desc: "Partnerships" },
            { icon: HelpCircle, label: "User Guide", desc: "How to start" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3.5 rounded-[16px] flex items-center gap-3 cursor-pointer active:opacity-70"
              style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <div
                className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center"
                style={{ background: "rgba(109,76,87,0.08)" }}
              >
                <item.icon size={16} color="#6d4c57" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-gray-800 leading-tight truncate">
                  {item.label}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-5 shrink-0">
        <SectionHeader title="Recent Activity" actionLabel="View All" />
        <div className="space-y-2.5">
          {[
            { title: "Deposit BTC", date: "Today · 14:20", amount: "+0.0450 BTC", type: "in", status: "Completed" },
            { title: "Withdraw USDT", date: "Yesterday · 09:12", amount: "-1,200 USDT", type: "out", status: "Completed" },
            { title: "Commission Earned", date: "Oct 12 · 18:40", amount: "+45.50 USDT", type: "in", status: "Completed" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3.5 py-3 rounded-[14px] bg-white"
              style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: item.type === "in" ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.08)",
                  }}
                >
                  {item.type === "in" ? (
                    <ArrowDownLeft size={16} color="#10b981" />
                  ) : (
                    <ArrowUpRight size={16} color="#f43f5e" />
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className="text-[13px] font-bold"
                  style={{ color: item.type === "in" ? "#10b981" : "#374151" }}
                >
                  {item.amount}
                </p>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-[4px] mt-0.5 inline-block"
                  style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-5 mt-5 mb-3 shrink-0">
        <div
          className="w-full h-[80px] rounded-[16px] flex items-center px-5 overflow-hidden relative"
          style={{ background: "linear-gradient(120deg, #f9f0f3 0%, #ede0e5 100%)", border: "1px solid rgba(109,76,87,0.1)" }}
        >
          <div className="absolute right-0 top-0 h-full w-32 opacity-20"
            style={{ background: "radial-gradient(circle, #6d4c57 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <p className="text-[12px] font-bold text-[#6d4c57] mb-0.5">Premium Tier Active</p>
            <p className="text-[11px] text-gray-500">Zero fees on withdrawals · 28 days left</p>
          </div>
          <button
            className="ml-auto shrink-0 text-[11px] font-bold text-white px-3 py-1.5 rounded-[8px] relative z-10"
            style={{ background: "#6d4c57" }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Wallet (Service) ──────────────────────── */

function WalletScreen() {
  return (
    <div
      className="h-full overflow-y-auto bg-[#f8f8f8]"
      style={{ scrollbarWidth: "none", paddingBottom: "8px" }}
    >
      {/* Header with balance */}
      <div
        className="bg-white px-6 pt-3 pb-6"
        style={{ borderRadius: "0 0 24px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-bold text-gray-900">My Wallet</h2>
          <button className="text-[12px] font-semibold text-gray-400 flex items-center gap-1">
            USD <ChevronDown size={13} />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
            Available Balance
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-[17px] font-semibold text-gray-400">$</span>
            <span className="text-[38px] font-bold text-gray-900 tracking-tight leading-none">
              124,592
            </span>
            <span className="text-[17px] font-semibold text-gray-400">.50</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <TrendingUp size={13} className="text-emerald-500" />
            <span className="text-[12px] text-emerald-600 font-semibold">+$2,840 this month</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 text-white font-semibold text-[14px] py-3 rounded-[13px] transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #6d4c57 0%, #7e5865 100%)",
              boxShadow: "0 6px 20px rgba(109,76,87,0.28)",
            }}
          >
            Deposit
          </button>
          <button
            className="flex-1 font-semibold text-[14px] py-3 rounded-[13px] transition-all active:scale-[0.98]"
            style={{
              background: "#f5f5f5",
              color: "#374151",
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-5 mt-4 mb-4">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Total Income", value: "+$8,450", color: "#10b981", bg: "rgba(16,185,129,0.07)" },
            { label: "Total Deposits", value: "$20,650", color: "#6d4c57", bg: "rgba(109,76,87,0.07)" },
            { label: "Total Withdrawn", value: "$12,200", color: "#f43f5e", bg: "rgba(244,63,94,0.07)" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-[14px] p-3 text-center"
              style={{ background: s.bg, border: `1px solid ${s.color}22` }}
            >
              <p className="text-[10px] text-gray-500 font-medium leading-tight mb-1">{s.label}</p>
              <p className="text-[14px] font-bold leading-tight" style={{ color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Asset List */}
      <div className="px-5">
        <SectionHeader title="My Assets" />
        <div className="space-y-2.5">
          {[
            {
              symbol: "BTC",
              name: "Bitcoin",
              amount: "1.4500",
              val: "$84,245.00",
              change: "+3.2%",
              up: true,
              color: "#F7931A",
              bg: "rgba(247,147,26,0.10)",
            },
            {
              symbol: "ETH",
              name: "Ethereum",
              amount: "12.8000",
              val: "$32,150.00",
              change: "+1.8%",
              up: true,
              color: "#627EEA",
              bg: "rgba(98,126,234,0.10)",
            },
            {
              symbol: "USDT",
              name: "Tether",
              amount: "8,197.50",
              val: "$8,197.50",
              change: "0.00%",
              up: true,
              color: "#26A17B",
              bg: "rgba(38,161,123,0.10)",
            },
          ].map((asset, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-[16px] bg-white"
              style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0"
                  style={{ background: asset.bg, color: asset.color }}
                >
                  {asset.symbol}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900 leading-tight">{asset.symbol}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-bold text-gray-900">{asset.amount}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <p className="text-[11px] text-gray-400">≈ {asset.val}</p>
                </div>
                <div
                  className="text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded-[4px]"
                  style={{
                    color: asset.up ? "#10b981" : "#f43f5e",
                    background: asset.up ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
                  }}
                >
                  {asset.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Team (Menu) ──────────────────────── */

function TeamScreen() {
  return (
    <div
      className="h-full overflow-y-auto bg-white"
      style={{ scrollbarWidth: "none", paddingBottom: "8px" }}
    >
      <div className="px-5 pt-3">
        <h2 className="text-[18px] font-bold text-gray-900 mb-5">My Team</h2>

        {/* Stats Banner */}
        <div
          className="w-full rounded-[20px] p-5 mb-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #6d4c57 0%, #7e5865 100%)",
            boxShadow: "0 8px 28px rgba(109,76,87,0.25)",
          }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10 flex justify-around">
            <div className="text-center">
              <p className="text-[28px] font-bold text-white leading-tight">124</p>
              <p className="text-[11px] text-white/70 mt-1 font-medium">Total Members</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-[28px] font-bold text-white leading-tight">89</p>
              <p className="text-[11px] text-white/70 mt-1 font-medium">Active</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-[28px] font-bold text-white leading-tight">3</p>
              <p className="text-[11px] text-white/70 mt-1 font-medium">Levels</p>
            </div>
          </div>
        </div>

        {/* Invite Link */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Invitation Link
          </label>
          <div className="flex gap-2">
            <div
              className="flex-1 bg-gray-50 px-3 py-3.5 rounded-[13px] flex items-center min-w-0"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <LinkIcon size={14} className="text-gray-400 shrink-0 mr-2" />
              <span className="text-[12px] text-gray-500 truncate font-mono">
                https://app.crypto.co/ref/8X9A21
              </span>
            </div>
            <button
              className="w-12 h-12 rounded-[13px] flex items-center justify-center shrink-0 text-white"
              style={{ background: "#6d4c57", boxShadow: "0 4px 12px rgba(109,76,87,0.25)" }}
            >
              <Copy size={17} />
            </button>
          </div>
        </div>

        {/* Commission Cards */}
        <div className="mb-5">
          <SectionHeader title="Commission Overview" />
          <div className="grid grid-cols-2 gap-2.5">
            <div
              className="p-4 rounded-[16px]"
              style={{ background: "rgba(109,76,87,0.06)", border: "1px solid rgba(109,76,87,0.12)" }}
            >
              <p className="text-[11px] text-gray-500 font-medium mb-1.5">Today's Profit</p>
              <p className="text-[18px] font-bold" style={{ color: "#6d4c57" }}>+$124.50</p>
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp size={11} color="#6d4c57" />
                <span className="text-[10px] font-semibold text-gray-400">+8% vs yesterday</span>
              </div>
            </div>
            <div
              className="p-4 rounded-[16px]"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}
            >
              <p className="text-[11px] text-gray-500 font-medium mb-1.5">Total Profit</p>
              <p className="text-[18px] font-bold text-emerald-600">$4,592.00</p>
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp size={11} className="text-emerald-500" />
                <span className="text-[10px] font-semibold text-gray-400">All time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="mb-3">
          <SectionHeader title="Direct Members" />
          <div className="space-y-2.5">
            {[
              { id: "User8492", level: "L1", profit: "+$450.00", date: "Oct 12, 2023" },
              { id: "CryptoKing", level: "L1", profit: "+$210.00", date: "Oct 15, 2023" },
              { id: "InvestPro", level: "L1", profit: "+$125.50", date: "Oct 18, 2023" },
              { id: "TradeMaster", level: "L2", profit: "+$88.00", date: "Oct 22, 2023" },
            ].map((member, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3.5 py-3 rounded-[14px] bg-white"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 text-white"
                    style={{ background: `hsl(${i * 60 + 330}, 40%, 55%)` }}
                  >
                    {member.id.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-gray-900">{member.id}</p>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-[5px] font-bold"
                        style={{ background: "rgba(109,76,87,0.1)", color: "#6d4c57" }}
                      >
                        {member.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Joined {member.date}</p>
                  </div>
                </div>
                <p className="text-[13px] font-bold text-emerald-600">{member.profit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Records ──────────────────────── */

function RecordsScreen() {
  const [tab, setTab] = useState("all");

  const allRecords = [
    { id: "TXN-849201", type: "deposit", amount: "+5,000.00 USDT", date: "Oct 24 · 14:20", status: "completed" },
    { id: "TXN-392812", type: "withdraw", amount: "-1,200.00 USDT", date: "Oct 22 · 09:12", status: "completed" },
    { id: "TXN-102948", type: "withdraw", amount: "-450.00 USDT", date: "Oct 21 · 16:45", status: "processing" },
    { id: "TXN-593021", type: "deposit", amount: "+1,000.00 USDT", date: "Oct 18 · 11:30", status: "completed" },
    { id: "TXN-849222", type: "deposit", amount: "+2,500.00 USDT", date: "Oct 15 · 08:15", status: "pending" },
    { id: "TXN-112993", type: "withdraw", amount: "-800.00 USDT", date: "Oct 10 · 19:20", status: "completed" },
  ];

  const filtered = tab === "all" ? allRecords : allRecords.filter((r) => r.type === tab);

  return (
    <div className="h-full flex flex-col bg-[#f8f8f8]">
      {/* Sticky Header */}
      <div
        className="bg-white px-5 pt-3 pb-4 shrink-0"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[18px] font-bold text-gray-900">Records</h2>
        </div>

        <div className="relative mb-3.5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or amount"
            className="w-full bg-gray-50 pl-9 pr-4 py-2.5 rounded-[11px] text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
            style={{ border: "1px solid rgba(0,0,0,0.07)" }}
          />
        </div>

        <div
          className="flex gap-1 p-1 rounded-[12px]"
          style={{ background: "#f3f3f3" }}
        >
          {["all", "deposit", "withdraw"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 text-[12px] font-semibold capitalize rounded-[9px] transition-all"
              style={{
                background: tab === t ? "#6d4c57" : "transparent",
                color: tab === t ? "white" : "#9ca3af",
                boxShadow: tab === t ? "0 2px 8px rgba(109,76,87,0.25)" : "none",
              }}
            >
              {t === "all" ? "All" : t === "deposit" ? "Deposit" : "Withdraw"}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 pb-4" style={{ scrollbarWidth: "none" }}>
        {filtered.map((item, i) => {
          const statusConfig = {
            completed: { label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.10)" },
            processing: { label: "Processing", color: "#3b82f6", bg: "rgba(59,130,246,0.10)" },
            pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
          }[item.status]!;

          return (
            <div
              key={i}
              className="bg-white p-4 rounded-[16px]"
              style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background:
                        item.type === "deposit"
                          ? "rgba(16,185,129,0.10)"
                          : "rgba(244,63,94,0.08)",
                    }}
                  >
                    {item.type === "deposit" ? (
                      <ArrowDownLeft size={16} color="#10b981" />
                    ) : (
                      <ArrowUpRight size={16} color="#f43f5e" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 capitalize">{item.type}</p>
                    <p
                      className="text-[11px] font-mono mt-0.5"
                      style={{ color: "#9ca3af" }}
                    >
                      {item.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="text-[14px] font-bold"
                    style={{ color: item.type === "deposit" ? "#10b981" : "#374151" }}
                  >
                    {item.amount}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center justify-between mt-3 pt-3"
                style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
              >
                <p className="text-[11px] text-gray-400 font-medium">{item.date}</p>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: statusConfig.bg, color: statusConfig.color }}
                >
                  {item.status === "completed" && <CheckCircle2 size={11} />}
                  {item.status === "processing" && (
                    <CircleDashed size={11} className="animate-spin" />
                  )}
                  {item.status === "pending" && <Clock size={11} />}
                  {statusConfig.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────── Profile ──────────────────────── */

function ProfileScreen({
  onSettings,
  onLogout,
}: {
  onSettings: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      className="h-full overflow-y-auto bg-[#f8f8f8]"
      style={{ scrollbarWidth: "none", paddingBottom: "8px" }}
    >
      {/* Profile Header */}
      <div
        className="px-6 pt-5 pb-14 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #6d4c57 0%, #5a3e48 100%)" }}
      >
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-[20px] font-bold text-white shrink-0"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "2px solid rgba(255,255,255,0.25)",
              }}
            >
              JW
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-white leading-tight">John Wealth</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[12px] text-white/70 font-mono">ID: 8492019</span>
                <button className="text-white/50">
                  <Copy size={11} />
                </button>
              </div>
              <div
                className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px]"
                style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)" }}
              >
                <Shield size={10} className="text-amber-950" />
                <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wide">
                  VIP Gold
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onSettings}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <SettingsIcon size={17} className="text-white" />
          </button>
        </div>
      </div>

      {/* Stats Float Card */}
      <div className="px-5 -mt-8 relative z-20 mb-5">
        <div
          className="bg-white rounded-[20px] p-4 flex justify-around"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
          {[
            { value: "3", label: "Assets" },
            { value: "L2", label: "Level" },
            { value: "124", label: "Team" },
            { value: "99%", label: "Trust" },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="text-center">
                <p className="text-[17px] font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mt-0.5">
                  {s.label}
                </p>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px bg-gray-100" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Menu Groups */}
      <div className="px-5 space-y-4">
        <MenuGroup
          items={[
            { icon: Shield, label: "Security Center", color: "#6d4c57" },
            { icon: FileText, label: "Transaction Logs", color: "#6d4c57" },
            { icon: Users, label: "My Referrals", color: "#6d4c57" },
          ]}
        />
        <MenuGroup
          items={[
            { icon: Globe, label: "Language", value: "English", color: "#6d4c57" },
            { icon: HelpCircle, label: "Support", color: "#6d4c57" },
            { icon: Info, label: "About", value: "v2.1.0", color: "#6d4c57" },
          ]}
        />

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[16px] text-[14px] font-semibold text-rose-500 bg-white transition-all active:opacity-70"
          style={{ border: "1px solid rgba(244,63,94,0.15)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function MenuGroup({
  items,
}: {
  items: { icon: React.ComponentType<any>; label: string; value?: string; color: string }[];
}) {
  return (
    <div
      className="bg-white rounded-[18px] overflow-hidden"
      style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50"
          style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(109,76,87,0.08)" }}
            >
              <item.icon size={15} color={item.color} />
            </div>
            <span className="text-[14px] font-semibold text-gray-700">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.value && (
              <span className="text-[12px] text-gray-400 font-medium">{item.value}</span>
            )}
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────── Settings ──────────────────────── */

function SettingsScreen({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const [notifOn, setNotifOn] = useState(true);
  const [biometricOn, setBiometricOn] = useState(false);

  return (
    <div className="h-full bg-[#f8f8f8] flex flex-col">
      {/* Header */}
      <div
        className="bg-white px-5 pt-3 pb-4 flex items-center gap-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50"
          style={{ border: "1px solid rgba(0,0,0,0.07)" }}
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <h2 className="text-[18px] font-bold text-gray-900">Settings</h2>
      </div>

      <div
        className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Preferences */}
        <SettingsGroup
          title="Preferences"
          items={[
            {
              icon: Globe,
              label: "Language",
              right: (
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] text-gray-400">English</span>
                  <ChevronRight size={15} className="text-gray-300" />
                </div>
              ),
            },
            {
              icon: CreditCard,
              label: "Currency",
              right: (
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] text-gray-400">USD</span>
                  <ChevronRight size={15} className="text-gray-300" />
                </div>
              ),
            },
            {
              icon: BellIcon,
              label: "Push Notifications",
              right: (
                <Toggle value={notifOn} onChange={setNotifOn} />
              ),
            },
          ]}
        />

        {/* Security */}
        <SettingsGroup
          title="Security"
          items={[
            {
              icon: Lock,
              label: "Login Password",
              right: <ChevronRight size={15} className="text-gray-300" />,
            },
            {
              icon: Shield,
              label: "Fund Password",
              right: (
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-[6px]"
                  style={{ background: "rgba(245,158,11,0.12)", color: "#d97706" }}
                >
                  Not Set
                </span>
              ),
            },
            {
              icon: Fingerprint,
              label: "Face ID / Touch ID",
              right: (
                <Toggle value={biometricOn} onChange={setBiometricOn} />
              ),
            },
          ]}
        />

        {/* Account */}
        <SettingsGroup
          title="Account"
          items={[
            {
              icon: User,
              label: "Profile Settings",
              right: <ChevronRight size={15} className="text-gray-300" />,
            },
            {
              icon: HelpCircle,
              label: "Help & Support",
              right: <ChevronRight size={15} className="text-gray-300" />,
            },
          ]}
        />

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-4 text-[14px] font-bold text-white rounded-[14px] transition-all active:opacity-80"
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            boxShadow: "0 6px 18px rgba(239,68,68,0.30)",
          }}
        >
          <LogOut size={17} />
          Log Out
        </button>
      </div>
    </div>
  );
}

function SettingsGroup({
  title,
  items,
}: {
  title: string;
  items: { icon: React.ComponentType<any>; label: string; right: React.ReactNode }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
        {title}
      </p>
      <div
        className="bg-white rounded-[16px] overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50"
            style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
                style={{ background: "rgba(109,76,87,0.08)" }}
              >
                <item.icon size={15} color="#6d4c57" />
              </div>
              <span className="text-[14px] font-semibold text-gray-700">{item.label}</span>
            </div>
            {item.right}
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full relative transition-all"
      style={{ background: value ? "#6d4c57" : "#d1d5db" }}
    >
      <div
        className="w-[18px] h-[18px] bg-white rounded-full absolute top-[3px] transition-all shadow-sm"
        style={{ left: value ? "calc(100% - 21px)" : "3px" }}
      />
    </button>
  );
}

/* ──────────────────────── Shared ──────────────────────── */

function SectionHeader({
  title,
  actionLabel,
}: {
  title: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[14px] font-bold text-gray-900">{title}</h3>
      {actionLabel && (
        <button className="text-[12px] font-semibold" style={{ color: "#6d4c57" }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
