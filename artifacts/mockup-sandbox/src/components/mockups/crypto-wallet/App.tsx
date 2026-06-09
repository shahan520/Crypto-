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
  Wifi,
  Signal,
  ChevronLeft,
  Lock,
  Bell as BellIcon,
  Fingerprint,
  CreditCard,
  FileText,
  Link as LinkIcon,
  Gift,
  SlidersHorizontal,
  Award,
  CalendarDays,
  Star,
  X,
  AlertCircle,
  CheckCheck,
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
    <div className="min-h-screen bg-[#e0dde0] flex items-center justify-center font-sans">
      <div
        className="w-[390px] h-[844px] bg-white overflow-hidden relative flex flex-col"
        style={{
          borderRadius: "44px",
          border: "10px solid #1a1a1a",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Status Bar */}
        <div className="w-full flex justify-between items-center px-7 pt-3 pb-1 shrink-0 z-50 relative">
          <span className="text-[13px] font-semibold text-gray-900 tabular-nums">9:41</span>
          <div className="w-28 h-7 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5" />
          <div className="flex items-center gap-1.5">
            <Signal size={14} className="text-gray-900" strokeWidth={2.5} />
            <Wifi size={14} className="text-gray-900" strokeWidth={2.5} />
            <div className="w-[22px] h-[11px] rounded-[3px] border-[1.5px] border-gray-700 relative p-[1.5px] flex items-center">
              <div className="w-[60%] h-full bg-gray-800 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div
          className="flex-1 overflow-hidden"
          style={{ opacity: isAnimating ? 0 : 1, transition: "opacity 0.18s ease" }}
        >
          {currentPage === "login"   && <LoginScreen   onLogin={() => navigate("home")} />}
          {currentPage === "home"    && <HomeScreen    onNavigate={navigate} />}
          {currentPage === "service" && <WalletScreen  />}
          {currentPage === "menu"    && <TeamScreen    />}
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

/* ─────────────────────────────── Bottom Nav ─────────────────────────────── */

const NAV_ITEMS: { id: Page; icon: React.ComponentType<any>; label: string }[] = [
  { id: "home",    icon: HomeIcon,     label: "Home"    },
  { id: "service", icon: Briefcase,    label: "Service" },
  { id: "menu",    icon: Grid3X3,      label: "Menu"    },
  { id: "records", icon: ClipboardList,label: "Record"  },
  { id: "profile", icon: User,         label: "Mine"    },
];

function BottomNav({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  return (
    <div
      className="w-full bg-white shrink-0 flex justify-around items-end pt-2 pb-6 px-2"
      style={{ borderTop: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 -8px 24px rgba(0,0,0,0.04)" }}
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
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} color={active ? "#6d4c57" : "#9ca3af"} />
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

/* ─────────────────────────────── Login ─────────────────────────────── */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full overflow-y-auto px-6 pt-4 pb-10 flex flex-col" style={{ scrollbarWidth: "none" }}>
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
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Welcome Back</h1>
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
        <button className="text-[13px] font-bold" style={{ color: "#6d4c57" }}>Register</button>
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

/* ─────────────────────────────── Home ─────────────────────────────── */

function HomeScreen({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="h-full overflow-y-auto flex flex-col" style={{ scrollbarWidth: "none", paddingBottom: "96px" }}>
      {/* Header */}
      <div className="px-6 pt-2 pb-4 flex justify-between items-center shrink-0">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-0.5">Good morning,</p>
          <h2 className="text-[20px] font-bold text-gray-900 leading-tight">John Wealth</h2>
        </div>
        <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center relative">
          <Bell size={18} className="text-gray-600" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "#6d4c57" }} />
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
              <span className="text-[32px] font-bold text-white tracking-tight leading-none">124,592</span>
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
              className="flex-1 border border-white/20 text-white text-[13px] font-semibold py-2.5 rounded-[10px] transition-all"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              Deposit
            </button>
            <button
              onClick={() => onNavigate("service")}
              className="flex-1 border border-white/15 text-white/80 text-[13px] font-semibold py-2.5 rounded-[10px] transition-all"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-5 shrink-0">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: ArrowDownLeft, label: "Deposit",  page: "service" as Page },
            { icon: ArrowUpRight,  label: "Withdraw", page: "service" as Page },
            { icon: Users,         label: "Team",     page: "menu"    as Page },
            { icon: UserPlus,      label: "Invite",   page: "menu"    as Page },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => onNavigate(action.page)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                style={{ background: "rgba(109,76,87,0.09)", border: "1px solid rgba(109,76,87,0.12)" }}
              >
                <action.icon size={20} color="#6d4c57" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold text-gray-600">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Announcement Section — burgundy-tinted, matches design system */}
      <div className="px-5 mb-5 shrink-0">
        <SectionHeader title="Announcements" />
        <div className="space-y-2">
          {[
            { tag: "Notice", text: "System upgrade scheduled for 02:00 AM UTC tonight.", dot: true },
            { tag: "Update", text: "New withdrawal limits take effect Nov 1, 2024.", dot: false },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-[12px] px-3 py-2.5"
              style={{ background: "rgba(109,76,87,0.05)", border: "1px solid rgba(109,76,87,0.10)" }}
            >
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                {item.dot && (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#6d4c57" }} />
                )}
                <div
                  className="rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: "rgba(109,76,87,0.12)", color: "#6d4c57" }}
                >
                  {item.tag}
                </div>
              </div>
              <p className="text-[12px] text-gray-600 leading-snug flex-1">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Info Cards */}
      <div className="px-5 mb-5 shrink-0">
        <SectionHeader title="Platform Info" />
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: Info,       label: "Platform Profile",  desc: "About us"      },
            { icon: FileBadge2, label: "Platform Rules",    desc: "Terms of use"  },
            { icon: BookOpen,   label: "Cooperation",       desc: "Partnerships"  },
            { icon: HelpCircle, label: "User Guide",        desc: "How to start"  },
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
                <div className="text-[12px] font-bold text-gray-800 leading-tight truncate">{item.label}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity — varied statuses */}
      <div className="px-5 shrink-0">
        <SectionHeader title="Recent Activity" actionLabel="View All" />
        <div className="space-y-2.5">
          {[
            { title: "Deposit BTC",       date: "Today · 14:20",      amount: "+0.0450 BTC",  type: "in",  status: "completed"  },
            { title: "Withdraw USDT",     date: "Yesterday · 09:12",  amount: "-1,200 USDT",  type: "out", status: "processing" },
            { title: "Commission Earned", date: "Oct 12 · 18:40",     amount: "+45.50 USDT",  type: "in",  status: "completed"  },
            { title: "Deposit ETH",       date: "Oct 10 · 11:05",     amount: "+0.5000 ETH",  type: "in",  status: "pending"    },
          ].map((item, i) => {
            const statusMap: Record<string, { label: string; color: string; bg: string }> = {
              completed:  { label: "Done",       color: "#059669", bg: "rgba(5,150,105,0.09)"   },
              processing: { label: "Processing", color: "#3b82f6", bg: "rgba(59,130,246,0.09)"  },
              pending:    { label: "Pending",    color: "#d97706", bg: "rgba(217,119,6,0.09)"   },
            };
            const s = statusMap[item.status];
            return (
              <div
                key={i}
                className="flex items-center justify-between px-3.5 py-3 rounded-[14px] bg-white"
                style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: item.type === "in" ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.08)" }}
                  >
                    {item.type === "in"
                      ? <ArrowDownLeft size={16} color="#10b981" />
                      : <ArrowUpRight  size={16} color="#f43f5e" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900 leading-tight">{item.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold" style={{ color: item.type === "in" ? "#10b981" : "#374151" }}>
                    {item.amount}
                  </p>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] mt-0.5 inline-block"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Promotional Banners */}
      <div className="px-5 mt-5 shrink-0 space-y-3">
        <div
          className="w-full h-[80px] rounded-[16px] flex items-center px-5 overflow-hidden relative"
          style={{ background: "linear-gradient(120deg, #f9f0f3 0%, #ede0e5 100%)", border: "1px solid rgba(109,76,87,0.1)" }}
        >
          <div className="absolute right-0 top-0 h-full w-32" style={{ background: "radial-gradient(circle, rgba(109,76,87,0.15) 0%, transparent 70%)" }} />
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
        <div
          className="w-full h-[72px] rounded-[16px] flex items-center px-5 overflow-hidden relative"
          style={{ background: "linear-gradient(120deg, #f0f4ff 0%, #e5eaff 100%)", border: "1px solid rgba(99,102,241,0.12)" }}
        >
          <Gift size={20} className="text-indigo-400 mr-3 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-indigo-700">Refer a Friend</p>
            <p className="text-[11px] text-indigo-400">Earn 10 USDT per successful referral</p>
          </div>
          <ChevronRight size={16} className="ml-auto text-indigo-300 shrink-0" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Wallet (Service) ─────────────────────────────── */

const DEMO_TRC20_ADDRESS = "TDqfQ6tLFGGArRERHvvR3z3JF5QKekUvM1";

function WalletScreen() {
  const [showDeposit, setShowDeposit] = useState(false);

  return (
    <div className="h-full relative bg-[#f8f8f8]">
      {/* Scrollable content */}
      <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none", paddingBottom: "96px" }}>
        {/* Header panel */}
        <div
          className="bg-white px-6 pt-3 pb-6"
          style={{ borderRadius: "0 0 24px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[18px] font-bold text-gray-900">My Wallet</h2>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-gray-500"
              style={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.07)" }}
            >
              USD <ChevronDown size={13} />
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
              Available Balance
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-[17px] font-semibold text-gray-400">$</span>
              <span className="text-[38px] font-bold text-gray-900 tracking-tight leading-none">124,592</span>
              <span className="text-[17px] font-semibold text-gray-400">.50</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <TrendingUp size={13} className="text-emerald-500" />
              <span className="text-[12px] text-emerald-600 font-semibold">+$2,840 this month</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeposit(true)}
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
              style={{ background: "#f5f5f5", color: "#374151", border: "1px solid rgba(0,0,0,0.07)" }}
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-5 mt-4 mb-4">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Total Income",    value: "+$8,450",  color: "#10b981", bg: "rgba(16,185,129,0.07)",  border: "rgba(16,185,129,0.15)"  },
              { label: "Total Deposits",  value: "$20,650",  color: "#6d4c57", bg: "rgba(109,76,87,0.07)",   border: "rgba(109,76,87,0.15)"   },
              { label: "Total Withdrawn", value: "$12,200",  color: "#f43f5e", bg: "rgba(244,63,94,0.07)",   border: "rgba(244,63,94,0.15)"   },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-[14px] p-3 text-center"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <p className="text-[11px] text-gray-500 font-medium leading-tight mb-1">{s.label}</p>
                <p className="text-[14px] font-bold leading-tight" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Asset List */}
        <div className="px-5">
          <SectionHeader title="My Assets" />
          <div className="space-y-2.5">
            {[
              { symbol: "BTC",  name: "Bitcoin",  amount: "1.4500",   val: "$84,245.00", change: "+3.2%", up: true,  color: "#F7931A", bg: "rgba(247,147,26,0.10)"  },
              { symbol: "ETH",  name: "Ethereum", amount: "12.8000",  val: "$32,150.00", change: "+1.8%", up: true,  color: "#627EEA", bg: "rgba(98,126,234,0.10)"  },
              { symbol: "USDT", name: "Tether",   amount: "8,197.50", val: "$8,197.50",  change: "0.00%", up: true,  color: "#26A17B", bg: "rgba(38,161,123,0.10)"  },
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
                  <p className="text-[11px] text-gray-400 mt-0.5">≈ {asset.val}</p>
                  <div
                    className="text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded-[4px]"
                    style={{
                      color:      asset.up ? "#10b981" : "#f43f5e",
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

      {/* Deposit modal overlay */}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </div>
  );
}

/* ─────────────────────────────── QR Code ─────────────────────────────── */

function QRCode({ size = 148 }: { size?: number }) {
  const N = 21;
  const cell = (size - 12) / N; // 6px padding each side

  // Finder pattern: returns true=black, false=white, null=not finder
  const finder = (r: number, c: number, dr: number, dc: number): boolean => {
    const lr = r - dr, lc = c - dc;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
    return false;
  };

  const cellValue = (r: number, c: number): boolean => {
    // Separator quiet zone (1px white border around each finder)
    const inSep =
      (r <= 7 && c === 7) || (r === 7 && c <= 7) ||
      (r <= 7 && c === N - 8) || (r === 7 && c >= N - 8) ||
      (r >= N - 8 && c === 7) || (r === N - 7 && c <= 7);
    if (inSep) return false;

    // Top-left finder
    if (r < 7 && c < 7) return finder(r, c, 0, 0);
    // Top-right finder
    if (r < 7 && c >= N - 7) return finder(r, c, 0, N - 7);
    // Bottom-left finder
    if (r >= N - 7 && c < 7) return finder(r, c, N - 7, 0);

    // Timing strips
    if (r === 6 && c >= 8 && c <= N - 9) return c % 2 === 0;
    if (c === 6 && r >= 8 && r <= N - 9) return r % 2 === 0;

    // Alignment pattern (centre at r=16,c=16 for version 1 extended)
    if (r >= 14 && r <= 18 && c >= 14 && c <= 18) {
      if (r === 14 || r === 18 || c === 14 || c === 18) return true;
      if (r === 16 && c === 16) return true;
      return false;
    }

    // Data modules — deterministic pseudo-random
    const h = ((r * 1103515245 + c * 1664525 + 1013904223) >>> 0) % 1000;
    return h < 470;
  };

  const rows: React.ReactNode[] = [];
  for (let r = 0; r < N; r++) {
    const cells: React.ReactNode[] = [];
    for (let c = 0; c < N; c++) {
      cells.push(
        <div
          key={c}
          style={{
            width: cell,
            height: cell,
            background: cellValue(r, c) ? "#1a1a1a" : "transparent",
            borderRadius: cellValue(r, c) ? 1 : 0,
          }}
        />
      );
    }
    rows.push(
      <div key={r} style={{ display: "flex" }}>{cells}</div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "white",
        padding: 6,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
      }}
    >
      {rows}
    </div>
  );
}

/* ─────────────────────────────── Deposit Modal ─────────────────────────────── */

function DepositModal({ onClose }: { onClose: () => void }) {
  const [network,  setNetwork]  = useState<"TRC20" | "ERC20" | "BEP20">("TRC20");
  const [copied,   setCopied]   = useState(false);

  const addresses: Record<string, string> = {
    TRC20: DEMO_TRC20_ADDRESS,
    ERC20: "0x4A3b8C9D1e2F5a6B7c8D9E0f1A2b3C4d5E6f7A8b",
    BEP20: "bnb1qp6f4qzge8p2j0l9mvqk4v2t5n8xr3hyd4qwu",
  };

  const address = addresses[network];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const networkColors: Record<string, { bg: string; color: string; border: string }> = {
    TRC20: { bg: "rgba(239,68,68,0.08)",  color: "#dc2626", border: "rgba(239,68,68,0.20)"  },
    ERC20: { bg: "rgba(98,126,234,0.08)", color: "#627EEA", border: "rgba(98,126,234,0.20)" },
    BEP20: { bg: "rgba(245,158,11,0.08)", color: "#d97706", border: "rgba(245,158,11,0.20)" },
  };

  return (
    /* Backdrop */
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.50)" }}
      onClick={onClose}
    >
      {/* Sheet */}
      <div
        className="bg-white w-full flex flex-col"
        style={{ borderRadius: "24px 24px 0 0", maxHeight: "88%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h3 className="text-[17px] font-bold text-gray-900">Deposit USDT</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Send only USDT to this address</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-8" style={{ scrollbarWidth: "none" }}>
          {/* Network selector */}
          <div className="mb-5">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Select Network
            </p>
            <div className="flex gap-2">
              {(["TRC20", "ERC20", "BEP20"] as const).map((n) => {
                const active = network === n;
                const nc = networkColors[n];
                return (
                  <button
                    key={n}
                    onClick={() => setNetwork(n)}
                    className="flex-1 py-2.5 rounded-[12px] text-[13px] font-bold transition-all"
                    style={{
                      background: active ? nc.bg : "#f5f5f5",
                      color:      active ? nc.color : "#9ca3af",
                      border:     active ? `1px solid ${nc.border}` : "1px solid transparent",
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QR code */}
          <div className="flex justify-center mb-5">
            <div className="flex flex-col items-center gap-3">
              <div
                className="p-3 rounded-[18px]"
                style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <QRCode size={148} />
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                style={{ background: networkColors[network].bg, color: networkColors[network].color }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: networkColors[network].color }} />
                {network} Network
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Wallet Address
            </p>
            <div
              className="flex items-center gap-3 p-3.5 rounded-[14px]"
              style={{ background: "#f8f8f8", border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <p
                className="flex-1 text-[12px] font-mono text-gray-700 break-all leading-relaxed"
              >
                {address}
              </p>
              <button
                onClick={handleCopy}
                className="shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center transition-all"
                style={{
                  background: copied ? "rgba(16,185,129,0.10)" : "rgba(109,76,87,0.08)",
                  border:     copied ? "1px solid rgba(16,185,129,0.20)" : "1px solid rgba(109,76,87,0.12)",
                }}
              >
                {copied
                  ? <CheckCheck size={15} color="#10b981" />
                  : <Copy size={15} color="#6d4c57" />}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 text-center">
                Address copied to clipboard
              </p>
            )}
          </div>

          {/* Important notices */}
          <div
            className="rounded-[14px] p-4 space-y-2.5"
            style={{ background: "rgba(109,76,87,0.04)", border: "1px solid rgba(109,76,87,0.10)" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#6d4c57" }}>
              Important
            </p>
            {[
              `Only send USDT via the ${network} network to this address.`,
              "Minimum deposit: 10 USDT · Confirmations required: 20",
              "Sending any other asset will result in permanent loss.",
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: "#6d4c57" }} />
                <p className="text-[12px] text-gray-600 leading-snug">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Team (Menu) ─────────────────────────────── */

// Consistent avatar colors drawn from the burgundy / warm palette
const AVATAR_PALETTE = ["#6d4c57", "#8a6370", "#7e5865", "#9a7585", "#5a3e48"];

function TeamScreen() {
  return (
    <div className="h-full overflow-y-auto bg-[#f8f8f8]" style={{ scrollbarWidth: "none", paddingBottom: "96px" }}>
      <div className="px-5 pt-3">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-bold text-gray-900">My Team</h2>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{ background: "rgba(109,76,87,0.08)", color: "#6d4c57" }}
          >
            <Star size={11} fill="#6d4c57" />
            VIP Gold
          </div>
        </div>

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
            {[
              { value: "124", label: "Total Members" },
              { value: "89",  label: "Active"        },
              { value: "3",   label: "Levels"        },
            ].map((s, i, arr) => (
              <React.Fragment key={i}>
                <div className="text-center">
                  <p className="text-[28px] font-bold text-white leading-tight">{s.value}</p>
                  <p className="text-[11px] text-white/70 mt-1 font-medium">{s.label}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px bg-white/20" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Invite Link */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Invitation Link
          </label>
          <div className="flex gap-2">
            <div
              className="flex-1 bg-white px-3 py-3.5 rounded-[13px] flex items-center min-w-0"
              style={{ border: "1px solid rgba(0,0,0,0.07)" }}
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

        {/* Commission Overview — all burgundy-family */}
        <div className="mb-5">
          <SectionHeader title="Commission Overview" />
          <div className="grid grid-cols-2 gap-2.5">
            <div
              className="p-4 rounded-[16px] bg-white"
              style={{ border: "1px solid rgba(109,76,87,0.14)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <p className="text-[11px] text-gray-400 font-medium mb-1.5">Today's Profit</p>
              <p className="text-[18px] font-bold" style={{ color: "#6d4c57" }}>+$124.50</p>
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp size={11} color="#6d4c57" />
                <span className="text-[11px] font-semibold text-gray-400">+8% vs yesterday</span>
              </div>
            </div>
            <div
              className="p-4 rounded-[16px] bg-white"
              style={{ border: "1px solid rgba(109,76,87,0.10)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <p className="text-[11px] text-gray-400 font-medium mb-1.5">Total Profit</p>
              <p className="text-[18px] font-bold text-gray-900">$4,592.00</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Award size={11} className="text-gray-400" />
                <span className="text-[11px] font-semibold text-gray-400">All time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Breakdown */}
        <div className="mb-5">
          <SectionHeader title="Referral Structure" />
          <div
            className="bg-white rounded-[16px] overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {[
              { level: "Level 1", count: 8,  commission: "10%", members: "8 members"  },
              { level: "Level 2", count: 31, commission: "5%",  members: "31 members" },
              { level: "Level 3", count: 85, commission: "2%",  members: "85 members" },
            ].map((row, i, arr) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: AVATAR_PALETTE[i] }}
                  >
                    L{i + 1}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{row.level}</p>
                    <p className="text-[11px] text-gray-400">{row.members}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold" style={{ color: "#6d4c57" }}>{row.commission}</p>
                  <p className="text-[11px] text-gray-400">commission</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Members */}
        <div className="mb-3">
          <SectionHeader title="Direct Members" />
          <div className="space-y-2.5">
            {[
              { id: "User8492",   level: "L1", profit: "+$450.00", date: "Oct 12, 2023" },
              { id: "CryptoKing", level: "L1", profit: "+$210.00", date: "Oct 15, 2023" },
              { id: "InvestPro",  level: "L1", profit: "+$125.50", date: "Oct 18, 2023" },
              { id: "TradeMaster",level: "L2", profit: "+$88.00",  date: "Oct 22, 2023" },
            ].map((member, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3.5 py-3 rounded-[14px] bg-white"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 text-white"
                    style={{ background: AVATAR_PALETTE[i % AVATAR_PALETTE.length] }}
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
                <p className="text-[13px] font-bold" style={{ color: "#6d4c57" }}>{member.profit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Records ─────────────────────────────── */

const ALL_RECORDS = [
  { id: "TXN-849201", type: "deposit",    label: "Deposit",    asset: "USDT", amount: "+5,000.00", date: "Oct 24 · 14:20", status: "completed"  },
  { id: "TXN-392812", type: "withdraw",   label: "Withdraw",   asset: "USDT", amount: "-1,200.00", date: "Oct 22 · 09:12", status: "completed"  },
  { id: "TXN-102948", type: "withdraw",   label: "Withdraw",   asset: "USDT", amount: "-450.00",   date: "Oct 21 · 16:45", status: "processing" },
  { id: "TXN-593021", type: "deposit",    label: "Deposit",    asset: "BTC",  amount: "+0.0450",   date: "Oct 18 · 11:30", status: "completed"  },
  { id: "TXN-849222", type: "deposit",    label: "Deposit",    asset: "ETH",  amount: "+0.5000",   date: "Oct 15 · 08:15", status: "pending"    },
  { id: "TXN-112993", type: "withdraw",   label: "Withdraw",   asset: "USDT", amount: "-800.00",   date: "Oct 10 · 19:20", status: "completed"  },
  { id: "CMM-229031", type: "commission", label: "Commission", asset: "USDT", amount: "+45.50",    date: "Oct 09 · 14:00", status: "completed"  },
  { id: "CMM-119845", type: "commission", label: "Commission", asset: "USDT", amount: "+28.00",    date: "Oct 06 · 10:30", status: "completed"  },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<any> }> = {
  completed:  { label: "Completed",  color: "#059669", bg: "rgba(5,150,105,0.09)",  icon: CheckCircle2   },
  processing: { label: "Processing", color: "#3b82f6", bg: "rgba(59,130,246,0.09)", icon: CircleDashed   },
  pending:    { label: "Pending",    color: "#d97706", bg: "rgba(217,119,6,0.09)",  icon: Clock          },
};

function RecordsScreen() {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all"
    ? ALL_RECORDS
    : ALL_RECORDS.filter((r) => r.type === tab);

  return (
    <div className="h-full flex flex-col bg-[#f8f8f8]">
      {/* Sticky Header */}
      <div
        className="bg-white px-5 pt-3 pb-4 shrink-0"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[18px] font-bold text-gray-900">Records</h2>
          <button
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: "rgba(109,76,87,0.07)", border: "1px solid rgba(109,76,87,0.12)" }}
          >
            <SlidersHorizontal size={16} color="#6d4c57" />
          </button>
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

        {/* Tabs — 4 options now */}
        <div className="flex gap-1 p-1 rounded-[12px]" style={{ background: "#f3f3f3" }}>
          {[
            { key: "all",        label: "All"        },
            { key: "deposit",    label: "Deposit"    },
            { key: "withdraw",   label: "Withdraw"   },
            { key: "commission", label: "Commission" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-2 text-[11px] font-semibold rounded-[9px] transition-all"
              style={{
                background:  tab === t.key ? "#6d4c57" : "transparent",
                color:       tab === t.key ? "white" : "#9ca3af",
                boxShadow:   tab === t.key ? "0 2px 8px rgba(109,76,87,0.25)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-[100px] space-y-2.5" style={{ scrollbarWidth: "none" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(109,76,87,0.08)" }}
            >
              <ClipboardList size={24} color="#6d4c57" />
            </div>
            <p className="text-[14px] font-semibold text-gray-500">No records found</p>
            <p className="text-[12px] text-gray-400 mt-1">Try a different filter</p>
          </div>
        ) : (
          filtered.map((item, i) => {
            const s = STATUS_MAP[item.status];
            const StatusIcon = s.icon;
            const isDeposit    = item.type === "deposit";
            const isCommission = item.type === "commission";

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
                        background: isDeposit || isCommission
                          ? "rgba(16,185,129,0.10)"
                          : "rgba(244,63,94,0.08)",
                      }}
                    >
                      {isDeposit    && <ArrowDownLeft size={16} color="#10b981" />}
                      {isCommission && <Gift          size={15} color="#10b981" />}
                      {!isDeposit && !isCommission && <ArrowUpRight size={16} color="#f43f5e" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">{item.label}</p>
                      <p className="text-[11px] font-mono mt-0.5" style={{ color: "#9ca3af" }}>{item.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-[14px] font-bold"
                      style={{ color: (isDeposit || isCommission) ? "#10b981" : "#374151" }}
                    >
                      {item.amount} {item.asset}
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center justify-between mt-3 pt-3"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <CalendarDays size={12} />
                    <p className="text-[11px] font-medium">{item.date}</p>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                    style={{ background: s.bg, color: s.color }}
                  >
                    <StatusIcon
                      size={11}
                      className={item.status === "processing" ? "animate-spin" : ""}
                    />
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Profile ─────────────────────────────── */

function ProfileScreen({ onSettings, onLogout }: { onSettings: () => void; onLogout: () => void }) {
  return (
    <div className="h-full overflow-y-auto bg-[#f8f8f8]" style={{ scrollbarWidth: "none", paddingBottom: "96px" }}>
      {/* Compact burgundy header */}
      <div
        className="px-6 pt-5 pb-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #6d4c57 0%, #5a3e48 100%)" }}
      >
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-[20px] font-bold text-white shrink-0"
              style={{ background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.25)" }}
            >
              JW
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-white leading-tight">John Wealth</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[12px] text-white/70 font-mono">ID: 8492019</span>
                <button className="text-white/50"><Copy size={11} /></button>
              </div>
              <div
                className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px]"
                style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)" }}
              >
                <Shield size={10} className="text-amber-950" />
                <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wide">VIP Gold</span>
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

      {/* Float Stats Card */}
      <div className="px-5 -mt-7 relative z-20 mb-5">
        <div
          className="bg-white rounded-[20px] p-4 flex justify-around"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
          {[
            { value: "3",   label: "Assets" },
            { value: "L2",  label: "Level"  },
            { value: "124", label: "Team"   },
            { value: "99%", label: "Trust"  },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="text-center">
                <p className="text-[17px] font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mt-0.5">{s.label}</p>
              </div>
              {i < arr.length - 1 && <div className="w-px bg-gray-100" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Menu Groups */}
      <div className="px-5 space-y-4">
        <MenuGroup
          items={[
            { icon: Shield,   label: "Security Center"  },
            { icon: FileText, label: "Transaction Logs" },
            { icon: Users,    label: "My Referrals"     },
          ]}
        />
        <MenuGroup
          items={[
            { icon: Globe,      label: "Language", value: "English" },
            { icon: HelpCircle, label: "Support"                    },
            { icon: Info,       label: "About",    value: "v2.1.0"  },
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

function MenuGroup({ items }: { items: { icon: React.ComponentType<any>; label: string; value?: string }[] }) {
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
              <item.icon size={15} color="#6d4c57" />
            </div>
            <span className="text-[14px] font-semibold text-gray-700">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.value && <span className="text-[12px] text-gray-400 font-medium">{item.value}</span>}
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── Settings ─────────────────────────────── */

function SettingsScreen({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const [notifOn,   setNotifOn]   = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode,  setDarkMode]  = useState(false);

  return (
    <div className="h-full bg-[#f8f8f8] flex flex-col">
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

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" style={{ scrollbarWidth: "none", paddingBottom: "24px" }}>
        <SettingsGroup
          title="Preferences"
          items={[
            {
              icon: Globe,
              label: "Language",
              right: <RightChevron value="English" />,
            },
            {
              icon: CreditCard,
              label: "Currency",
              right: <RightChevron value="USD" />,
            },
            {
              icon: BellIcon,
              label: "Push Notifications",
              right: <Toggle value={notifOn} onChange={setNotifOn} />,
            },
            {
              icon: SettingsIcon,
              label: "Dark Mode",
              right: <Toggle value={darkMode} onChange={setDarkMode} />,
            },
          ]}
        />

        <SettingsGroup
          title="Security"
          items={[
            { icon: Lock,        label: "Login Password", right: <RightChevron /> },
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
              right: <Toggle value={biometric} onChange={setBiometric} />,
            },
          ]}
        />

        <SettingsGroup
          title="Account"
          items={[
            { icon: User,       label: "Profile Settings", right: <RightChevron /> },
            { icon: HelpCircle, label: "Help & Support",   right: <RightChevron /> },
            { icon: Info,       label: "Privacy Policy",   right: <RightChevron /> },
            {
              icon: FileText,
              label: "App Version",
              right: <span className="text-[12px] text-gray-400 font-medium">v2.1.0</span>,
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

function RightChevron({ value }: { value?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {value && <span className="text-[13px] text-gray-400">{value}</span>}
      <ChevronRight size={15} className="text-gray-300" />
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

/* Toggle with smooth CSS transition on thumb */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full relative shrink-0"
      style={{ background: value ? "#6d4c57" : "#d1d5db", transition: "background 0.2s ease" }}
    >
      <div
        className="w-[18px] h-[18px] bg-white rounded-full absolute top-[3px] shadow-sm"
        style={{
          left: value ? "calc(100% - 21px)" : "3px",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}

/* ─────────────────────────────── Shared Helpers ─────────────────────────────── */

function SectionHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
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
