import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  EyeOff, 
  Eye, 
  Home as HomeIcon, 
  Wallet as WalletIcon, 
  Users, 
  FileText, 
  User,
  ArrowUpRight,
  ArrowDownLeft,
  UserPlus,
  Link as LinkIcon,
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
  FileBadge2
} from "lucide-react";

type Page = "login" | "home" | "wallet" | "team" | "records" | "profile" | "settings";

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextPage, setNextPage] = useState<Page | null>(null);

  const navigate = (page: Page) => {
    if (page === currentPage) return;
    setNextPage(page);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsAnimating(false);
      setNextPage(null);
    }, 200); // 0.2s transition
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans text-slate-800">
      <div className="w-[390px] h-[844px] bg-white overflow-hidden relative shadow-2xl rounded-[40px] border-[8px] border-slate-900">
        
        {/* Status Bar Placeholder */}
        <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-50 text-xs font-medium bg-transparent">
          <span>9:41</span>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-3 bg-current rounded-sm"></div>
            <div className="w-3 h-3 rounded-full border-2 border-current"></div>
            <div className="w-5 h-2.5 border border-current rounded-[3px] p-[1px]">
              <div className="w-3/4 h-full bg-current rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div 
          className={`w-full h-full pt-12 transition-opacity duration-200 ease-in-out ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          {currentPage === "login" && <LoginScreen onLogin={() => navigate("home")} />}
          {currentPage === "home" && <HomeScreen />}
          {currentPage === "wallet" && <WalletScreen />}
          {currentPage === "team" && <TeamScreen />}
          {currentPage === "records" && <RecordsScreen />}
          {currentPage === "profile" && <ProfileScreen onSettings={() => navigate("settings")} onLogout={() => navigate("login")} />}
          {currentPage === "settings" && <SettingsScreen onBack={() => navigate("profile")} onLogout={() => navigate("login")} />}
        </div>

        {/* Bottom Navigation */}
        {currentPage !== "login" && currentPage !== "settings" && (
          <div className="absolute bottom-0 w-full h-[90px] bg-white border-t border-gray-100 flex justify-between items-center px-6 pb-6 pt-2 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <NavItem 
              icon={HomeIcon} 
              label="Home" 
              isActive={currentPage === "home"} 
              onClick={() => navigate("home")} 
            />
            <NavItem 
              icon={WalletIcon} 
              label="Wallet" 
              isActive={currentPage === "wallet"} 
              onClick={() => navigate("wallet")} 
            />
            <NavItem 
              icon={Users} 
              label="Team" 
              isActive={currentPage === "team"} 
              onClick={() => navigate("team")} 
            />
            <NavItem 
              icon={FileText} 
              label="Records" 
              isActive={currentPage === "records"} 
              onClick={() => navigate("records")} 
            />
            <NavItem 
              icon={User} 
              label="Mine" 
              isActive={currentPage === "profile"} 
              onClick={() => navigate("profile")} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 w-14 transition-colors ${
        isActive ? "text-[#6d4c57]" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// --- Screens ---

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full px-6 flex flex-col pt-12">
      <div className="flex justify-end mb-12">
        <button className="flex items-center gap-1 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
          EN <ChevronDown size={14} />
        </button>
      </div>

      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-[#6d4c57] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#6d4c57]/20">
          <Shield className="text-white" size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
        <p className="text-sm text-gray-500 mt-2">Sign in to your private portfolio</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 ml-1 mb-1.5 block uppercase tracking-wider">Username</label>
          <input 
            type="text" 
            placeholder="Enter username" 
            className="w-full bg-gray-50 border border-gray-100 px-4 py-3.5 rounded-[12px] text-sm focus:outline-none focus:border-[#6d4c57] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 ml-1 mb-1.5 block uppercase tracking-wider">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter password" 
              className="w-full bg-gray-50 border border-gray-100 px-4 py-3.5 rounded-[12px] text-sm focus:outline-none focus:border-[#6d4c57] focus:bg-white transition-colors"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 ml-1 mb-1.5 block uppercase tracking-wider">Verification</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Code" 
              className="flex-1 bg-gray-50 border border-gray-100 px-4 py-3.5 rounded-[12px] text-sm focus:outline-none focus:border-[#6d4c57] focus:bg-white transition-colors"
            />
            <div className="w-24 bg-gray-100 rounded-[12px] flex items-center justify-center font-mono text-lg font-bold text-gray-600 tracking-widest border border-gray-200">
              8429
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6d4c57] focus:ring-[#6d4c57]" />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
      </div>

      <button 
        onClick={onLogin}
        className="w-full bg-[#6d4c57] text-white font-medium py-3.5 rounded-[12px] mt-8 shadow-md shadow-[#6d4c57]/20 hover:bg-[#5a3e48] transition-colors"
      >
        Sign In
      </button>

      <div className="mt-8 text-center">
        <span className="text-sm text-gray-500">Don't have an account? </span>
        <button className="text-sm text-[#6d4c57] font-semibold hover:underline">Register</button>
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="h-full overflow-y-auto pb-[100px] scrollbar-hide">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Balance</p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">$124,592.50</h2>
        </div>
        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
          <Bell size={20} />
        </button>
      </div>

      <div className="px-6 mt-2 mb-6">
        <div className="w-full h-36 bg-gradient-to-br from-[#6d4c57] to-[#8a6370] rounded-[16px] p-5 relative overflow-hidden shadow-lg shadow-[#6d4c57]/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10 text-white">
            <h3 className="font-semibold text-lg mb-1">Premium Tier</h3>
            <p className="text-white/80 text-sm w-2/3 leading-snug">Enjoy zero fees on all withdrawals for the next 30 days.</p>
            <button className="mt-4 bg-white text-[#6d4c57] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
              Claim Now
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: ArrowDownLeft, label: "Deposit", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: ArrowUpRight, label: "Withdraw", color: "text-rose-600", bg: "bg-rose-50" },
          { icon: Users, label: "Team", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: UserPlus, label: "Invite", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((action, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <button className={`w-12 h-12 rounded-[12px] flex items-center justify-center ${action.bg}`}>
              <action.icon size={22} className={action.color} strokeWidth={2} />
            </button>
            <span className="text-[11px] font-medium text-gray-600">{action.label}</span>
          </div>
        ))}
      </div>

      <div className="px-6 mb-8">
        <div className="flex items-center bg-gray-50 rounded-[12px] p-3 border border-gray-100">
          <div className="text-[#6d4c57] mr-3 font-semibold text-xs border-r border-gray-200 pr-3">NEWS</div>
          <p className="text-xs text-gray-600 truncate flex-1">System upgrade scheduled for 02:00 AM UTC.</p>
        </div>
      </div>

      <div className="px-6 mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Platform Info</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Info, label: "Profile", desc: "About us" },
            { icon: FileBadge2, label: "Rules", desc: "Terms of use" },
            { icon: BookOpen, label: "Coop", desc: "Partnerships" },
            { icon: HelpCircle, label: "Guide", desc: "How to use" },
          ].map((item, i) => (
            <div key={i} className="bg-[#fafafa] p-4 rounded-[16px] border border-gray-100 flex gap-3 items-center">
              <div className="bg-white p-2 rounded-[10px] shadow-sm text-[#6d4c57]">
                <item.icon size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                <div className="text-[10px] text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { title: "Deposit BTC", date: "Today, 14:20", amount: "+0.045 BTC", type: "in", status: "Completed" },
            { title: "Withdraw USDT", date: "Yesterday, 09:12", amount: "-1,200.00 USDT", type: "out", status: "Completed" },
            { title: "Commission", date: "12 Oct, 18:40", amount: "+45.50 USDT", type: "in", status: "Completed" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-[12px] bg-white border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === "in" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}>
                  {item.type === "in" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-[11px] text-gray-500">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${item.type === "in" ? "text-emerald-600" : "text-gray-900"}`}>
                  {item.amount}
                </p>
                <p className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase font-medium inline-block mt-1">
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WalletScreen() {
  return (
    <div className="h-full overflow-y-auto pb-[100px] bg-gray-50 scrollbar-hide">
      <div className="bg-white px-6 pb-6 pt-4 rounded-b-[24px] shadow-sm border-b border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">My Assets</h2>
        
        <div className="text-center mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Total Estimated Value</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-xl text-gray-400 font-medium">$</span>
            <span className="text-4xl font-bold tracking-tight text-gray-900">124,592</span>
            <span className="text-xl text-gray-400 font-medium">.50</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-[#6d4c57] text-white py-3 rounded-[12px] font-semibold text-sm shadow-md shadow-[#6d4c57]/20 hover:bg-[#5a3e48] transition-colors">
            Deposit
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-[12px] font-semibold text-sm hover:bg-gray-200 transition-colors">
            Withdraw
          </button>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-[16px] border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Income</p>
            <p className="text-lg font-bold text-gray-900">+$8,450.00</p>
          </div>
          <div className="bg-white p-4 rounded-[16px] border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Withdrawn</p>
            <p className="text-lg font-bold text-gray-900">$12,200.00</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Asset List</h3>
        <div className="space-y-3">
          {[
            { symbol: "BTC", name: "Bitcoin", amount: "1.4500", val: "$84,245.00", color: "bg-[#F7931A]/10 text-[#F7931A]" },
            { symbol: "ETH", name: "Ethereum", amount: "12.8000", val: "$32,150.00", color: "bg-[#627EEA]/10 text-[#627EEA]" },
            { symbol: "USDT", name: "Tether", amount: "8,197.50", val: "$8,197.50", color: "bg-[#26A17B]/10 text-[#26A17B]" },
          ].map((asset, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-[16px] bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${asset.color}`}>
                  {asset.symbol}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{asset.symbol}</p>
                  <p className="text-[11px] text-gray-500">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{asset.amount}</p>
                <p className="text-[11px] text-gray-500">≈ {asset.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamScreen() {
  return (
    <div className="h-full overflow-y-auto pb-[100px] bg-white scrollbar-hide">
      <div className="px-6 pt-4 pb-2">
        <h2 className="text-lg font-bold text-gray-900 mb-6">My Team</h2>
        
        <div className="bg-[#fafafa] rounded-[16px] p-5 border border-gray-100 mb-6 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Members</p>
            <p className="text-3xl font-bold text-[#6d4c57]">124</p>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Active</p>
            <p className="text-3xl font-bold text-emerald-600">89</p>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-3">Invitation Link</h3>
        <div className="flex gap-2 mb-8">
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-[12px] px-3 py-3 flex items-center text-sm text-gray-500 truncate">
            https://app.crypto.co/ref/8X9A21
          </div>
          <button className="w-12 h-12 bg-[#6d4c57] rounded-[12px] flex items-center justify-center text-white shadow-sm hover:bg-[#5a3e48]">
            <Copy size={18} />
          </button>
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-4">Commission</h3>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-emerald-50/50 p-4 rounded-[16px] border border-emerald-100/50">
            <p className="text-xs text-gray-500 mb-1">Today's Profit</p>
            <p className="text-lg font-bold text-emerald-700">+$124.50</p>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-[16px] border border-blue-100/50">
            <p className="text-xs text-gray-500 mb-1">Total Profit</p>
            <p className="text-lg font-bold text-blue-700">$4,592.00</p>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-4">Direct Members</h3>
        <div className="space-y-3">
          {[
            { id: "User8492", level: "L1", profit: "$450.00", date: "2023-10-12" },
            { id: "CryptoKing", level: "L1", profit: "$210.00", date: "2023-10-15" },
            { id: "InvestPro", level: "L1", profit: "$125.50", date: "2023-10-18" },
          ].map((member, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-[12px] border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={18} className="text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{member.id}</p>
                    <span className="text-[9px] bg-[#6d4c57]/10 text-[#6d4c57] px-1.5 py-0.5 rounded font-bold">{member.level}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Joined: {member.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">{member.profit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecordsScreen() {
  const [tab, setTab] = useState("all");

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white px-6 pt-4 pb-3 shadow-sm border-b border-gray-100 z-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Records</h2>
        
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by transaction ID or amount" 
            className="w-full bg-gray-50 border border-gray-100 pl-9 pr-4 py-2.5 rounded-[10px] text-sm focus:outline-none focus:border-[#6d4c57] transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {["all", "deposit", "withdraw"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${
                tab === t ? "bg-[#6d4c57] text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 pb-[100px] scrollbar-hide">
        <div className="space-y-3">
          {[
            { id: "TXN-849201", type: "deposit", amount: "+5,000.00 USDT", date: "Oct 24, 14:20", status: "completed" },
            { id: "TXN-392812", type: "withdraw", amount: "-1,200.00 USDT", date: "Oct 22, 09:12", status: "completed" },
            { id: "TXN-102948", type: "withdraw", amount: "-450.00 USDT", date: "Oct 21, 16:45", status: "processing" },
            { id: "TXN-593021", type: "deposit", amount: "+1,000.00 USDT", date: "Oct 18, 11:30", status: "completed" },
            { id: "TXN-849222", type: "deposit", amount: "+2,500.00 USDT", date: "Oct 15, 08:15", status: "pending" },
            { id: "TXN-112993", type: "withdraw", amount: "-800.00 USDT", date: "Oct 10, 19:20", status: "completed" },
          ].filter(item => tab === "all" || item.type === tab).map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-[16px] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.type === "deposit" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {item.type === "deposit" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{item.type}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{item.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${item.type === "deposit" ? "text-emerald-600" : "text-gray-900"}`}>
                    {item.amount}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                <p className="text-[11px] text-gray-400">{item.date}</p>
                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  item.status === "completed" ? "bg-emerald-50 text-emerald-600" : 
                  item.status === "processing" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                }`}>
                  {item.status === "completed" ? <CheckCircle2 size={12} /> : 
                   item.status === "processing" ? <CircleDashed size={12} className="animate-spin" /> : <Clock size={12} />}
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ onSettings, onLogout }: { onSettings: () => void, onLogout: () => void }) {
  return (
    <div className="h-full overflow-y-auto pb-[100px] bg-gray-50 scrollbar-hide">
      <div className="bg-[#6d4c57] px-6 pt-8 pb-12 rounded-b-[32px] text-white relative shadow-lg shadow-[#6d4c57]/10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xl font-bold backdrop-blur-sm">
              JW
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">John Wealth</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/80 font-mono">ID: 8492019</span>
                <button className="text-white/60 hover:text-white"><Copy size={12} /></button>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-600 px-2 py-0.5 rounded text-[10px] font-bold text-amber-950 uppercase tracking-wider">
                <Shield size={10} /> VIP Gold
              </div>
            </div>
          </div>
          <button onClick={onSettings} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <SettingsIcon size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-20 mb-8">
        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex justify-around">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 mb-0.5">3</p>
            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Cards</p>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 mb-0.5">L2</p>
            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Level</p>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 mb-0.5">99%</p>
            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Trust</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-sm">
          {[
            { icon: Shield, label: "Security Center" },
            { icon: FileText, label: "Transaction Logs" },
            { icon: Users, label: "My Referrals" },
          ].map((item, i, arr) => (
            <div key={i} className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${i !== arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="text-gray-400"><item.icon size={20} /></div>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-sm">
          {[
            { icon: Globe, label: "Language", value: "English" },
            { icon: HelpCircle, label: "Support" },
            { icon: Info, label: "About Us", value: "v2.1.0" },
          ].map((item, i, arr) => (
            <div key={i} className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${i !== arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="text-gray-400"><item.icon size={20} /></div>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="text-xs text-gray-400">{item.value}</span>}
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold text-rose-500 bg-white rounded-[20px] border border-rose-100 shadow-sm hover:bg-rose-50 transition-colors"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}

function SettingsScreen({ onBack, onLogout }: { onBack: () => void, onLogout: () => void }) {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white px-6 pt-4 pb-4 shadow-sm border-b border-gray-100 flex items-center gap-4 z-10">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h2 className="text-lg font-bold text-gray-900">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Preferences</h3>
          <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-700">Language</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">English</span>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-700">Currency</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">USD</span>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold text-gray-700">Push Notifications</span>
              <div className="w-10 h-6 bg-[#6d4c57] rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Security</h3>
          <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-700">Login Password</span>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-700">Fund Password</span>
              <span className="text-xs text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded">Not Set</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold text-gray-700">Face ID / Touch ID</span>
              <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-rose-500 text-white font-semibold py-3.5 rounded-[12px] shadow-sm hover:bg-rose-600 transition-colors mt-4"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}