import React, { useState, useEffect } from "react";
import {
  Home, Headphones, ShoppingBag, ClipboardList, User,
  ChevronRight, ChevronLeft, Copy, Check, X,
  Users, FileText, BarChart2, Mail, ArrowDownToLine,
  ArrowUpFromLine, Lock, Eye, EyeOff, Globe, LogOut,
  MessageCircle, HelpCircle, Bell, Plus, Shield,
  CheckCircle2, Clock, AlertCircle, TrendingUp, Star,
  Settings, Crown, Zap, Package, Snowflake, KeyRound,
} from "lucide-react";

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  orange: "#f5a100",
  orangeLight: "#fff8e7",
  orangeDark: "#d48900",
  wine: "#7a2c3e",
  wineDark: "#4a1525",
  bg: "#f4f5f7",
  white: "#ffffff",
  text: "#222222",
  textMid: "#666666",
  textLight: "#999999",
  border: "#e8e8e8",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  gold: "#f59e0b",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "home" | "service" | "menu" | "record" | "mine";
type SubPage =
  | "deposit" | "deposit-qr"
  | "withdraw" | "add-wallet"
  | "teams" | "invite" | "wallet-mgmt"
  | "profile" | "deposit-records" | "withdraw-records"
  | "setting" | "task" | "admin";

// Product images (real URLs)
const PRODUCT_IMAGES: Record<string, string> = {
  amazon:     "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=400&q=80",
  alibaba:    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
  aliexpress: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  combo:      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
};

const BASE = import.meta.env.BASE_URL;

// ─── Pentagon Flower Logo SVG ─────────────────────────────────────────────────
function PentagonLogo({ size = 40, onTap }: { size?: number; onTap?: () => void }) {
  const s = size;
  const c = s / 2;
  const d = s * 0.21;
  const r = s * 0.30;
  const pts = (cx: number, cy: number, rot: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = (i * 72 + rot) * (Math.PI / 180);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
  const shapes = [
    { color: "#e8403a", dir: -90 },
    { color: "#f1c40f", dir: -18 },
    { color: "#9b59b6", dir:  54 },
    { color: "#3498db", dir: 126 },
    { color: "#2ecc71", dir: 198 },
  ];
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: "block", cursor: onTap ? "pointer" : "default" }} onClick={onTap}>
      {shapes.map((sh, i) => {
        const rad = sh.dir * (Math.PI / 180);
        const px = c + d * Math.cos(rad);
        const py = c + d * Math.sin(rad);
        return <polygon key={i} points={pts(px, py, sh.dir + 90)} fill={sh.color} />;
      })}
    </svg>
  );
}

// ─── VIP Badge ────────────────────────────────────────────────────────────────
function VipBadge({ level = 0, isVip = false }: { level?: number; isVip?: boolean }) {
  if (isVip) {
    return (
      <span style={{
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "#fff",
        fontSize: 10, fontWeight: 700,
        padding: "1px 7px", borderRadius: 3,
        display: "inline-flex", alignItems: "center", gap: 3,
      }}>
        <Crown size={9} /> VIP
      </span>
    );
  }
  return (
    <span style={{
      background: C.orange, color: "#fff",
      fontSize: 10, fontWeight: 700,
      padding: "1px 6px", borderRadius: 3, letterSpacing: 0.3,
    }}>VIP {level}</span>
  );
}

// ─── Back Header ──────────────────────────────────────────────────────────────
function BackHeader({
  title, onBack, dark = false,
}: { title: string; onBack: () => void; dark?: boolean }) {
  return (
    <div style={{
      height: 50,
      background: dark
        ? `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`
        : C.white,
      display: "flex", alignItems: "center", padding: "0 16px",
      borderBottom: dark ? "none" : `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: dark ? "#fff" : C.text, cursor: "pointer", padding: 4, marginRight: 8 }}>
        <ChevronLeft size={22} />
      </button>
      <span style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 15, color: dark ? "#fff" : C.text, marginRight: 36 }}>
        {title}
      </span>
    </div>
  );
}

// ─── Activity Ticker ──────────────────────────────────────────────────────────
function ActivityTicker() {
  const [idx, setIdx] = useState(0);
  const items = [
    "J*****7 successful withdrawal 479.31 USDT",
    "M*****2 completed order +1,230.00 USDT",
    "A*****9 grab order commission +85.40 USDT",
    "K*****5 withdrawn 320.00 USDT",
    "Z*****1 successful recharge 756.80 USDT",
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      background: C.white, margin: "0 12px 8px",
      borderRadius: 8, padding: "8px 12px",
      display: "flex", alignItems: "center", gap: 8,
      border: `1px solid ${C.border}`,
    }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <User size={13} color="#fff" />
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ fontSize: 11, color: C.textMid, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {items[idx]}
        </div>
      </div>
      <Bell size={13} color={C.orange} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function HomeScreen({ onNavigate }: { onNavigate: (sub: SubPage) => void }) {
  const quickActions = [
    { label: "Recharge",   icon: <ArrowDownToLine size={20} color={C.orange} />, page: "deposit"  as SubPage },
    { label: "Withdrawal", icon: <ArrowUpFromLine  size={20} color={C.orange} />, page: "withdraw" as SubPage },
    { label: "Teams",      icon: <Users            size={20} color={C.orange} />, page: "teams"    as SubPage },
    { label: "Invitation", icon: <Mail             size={20} color={C.orange} />, page: "invite"   as SubPage },
  ];
  const platformCards = [
    { title: "Platform profile",    desc: "About our platform",     img: `${BASE}a1.png`, color: "#e8f4fd" },
    { title: "Platform rules",      desc: "Policies & rules",       img: `${BASE}a2.png`, color: "#fef3e2" },
    { title: "Win-win cooperation", desc: "Partner with us",        img: `${BASE}a3.png`, color: "#f0fdf4" },
    { title: "Instructions for use",desc: "How to get started",     img: `${BASE}a4.png`, color: "#fdf4ff" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 68 }}>
      <div style={{
        background: C.white, padding: "8px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PentagonLogo size={30} />
          <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Wallet</span>
        </div>
        <Bell size={20} color={C.textMid} />
      </div>

      <div style={{
        background: C.white, margin: "8px 12px", borderRadius: 10,
        padding: "12px 6px",
        display: "flex", justifyContent: "space-around",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        {quickActions.map(a => (
          <button key={a.label} onClick={() => onNavigate(a.page)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: C.orangeLight, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{a.icon}</div>
            <span style={{ fontSize: 11, color: C.textMid }}>{a.label}</span>
          </button>
        ))}
      </div>

      <ActivityTicker />

      <div style={{ padding: "2px 12px 8px" }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 8 }}>
          Platform introduction
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {platformCards.map(card => (
            <div key={card.title} style={{
              borderRadius: 10, overflow: "hidden", background: C.white,
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)", cursor: "pointer",
            }}>
              <div style={{ height: 80, background: card.color, overflow: "hidden" }}>
                <img src={card.img} alt={card.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div style={{ padding: "6px 10px" }}>
                <div style={{ fontWeight: 600, fontSize: 11, color: C.text }}>{card.title}</div>
                <div style={{ fontSize: 10, color: C.textLight, marginTop: 1 }}>{card.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function ServiceScreen() {
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 68 }}>
      <div style={{
        background: "linear-gradient(135deg, #f7d4be 0%, #f5b8d2 100%)",
        padding: "20px 20px 32px", textAlign: "center",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#5a2d3e", marginBottom: 4 }}>
          Customer Service Center
        </div>
        <div style={{ fontSize: 11, color: "#7a4a58", marginBottom: 1 }}>Online customer service time (12:00–24:00)</div>
        <div style={{ fontSize: 11, color: "#7a4a58" }}>(07:00–23:00 UK)</div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Headphones size={42} color="#c85a7a" />
          </div>
        </div>
      </div>
      <div style={{ background: C.white, margin: "10px 12px 0", borderRadius: 10, overflow: "hidden" }}>
        {[
          { icon: <MessageCircle size={16} color={C.orange} />, label: "Online customer service" },
          { icon: <HelpCircle    size={16} color={C.orange} />, label: "Help" },
        ].map((item, i) => (
          <div key={item.label}>
            {i > 0 && <div style={{ height: 1, background: C.border, margin: "0 16px" }} />}
            <button style={{
              width: "100%", background: "none", border: "none",
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", cursor: "pointer",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
              <span style={{ flex: 1, textAlign: "left", fontSize: 13, color: C.text }}>{item.label}</span>
              <ChevronRight size={15} color={C.textLight} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ padding: 14, textAlign: "center", fontSize: 11, color: C.textLight }}>
        We are always here to help you
      </div>
    </div>
  );
}

// ─── Balance Tier Helpers ─────────────────────────────────────────────────────
type BalanceTier = "none" | "amazon" | "alibaba" | "aliexpress";

function getBalanceTier(balance: number): BalanceTier {
  if (balance < 20)   return "none";
  if (balance < 499)  return "amazon";
  if (balance < 899)  return "alibaba";
  return "aliexpress";
}

const TIER_PLATFORM: Record<BalanceTier, string> = {
  none:       "amazon",
  amazon:     "amazon",
  alibaba:    "alibaba",
  aliexpress: "aliexpress",
};

// ─── Tier Upgrade Popup ───────────────────────────────────────────────────────
function TierUpgradePopup({
  tier,
  onClose,
}: {
  tier: "alibaba" | "aliexpress";
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, []);
  const handleClose = () => { setVisible(false); setTimeout(onClose, 260); };

  const isAlibaba = tier === "alibaba";
  const accentColor = isAlibaba ? "#FF6A00" : "#e62e04";
  const bgGrad = isAlibaba
    ? "linear-gradient(135deg, #FF6A00 0%, #e55a00 100%)"
    : "linear-gradient(135deg, #e62e04 0%, #b71c1c 100%)";

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300,
          opacity: visible ? 1 : 0, transition: "opacity 260ms ease",
        }}
      />
      <div style={{
        position: "absolute", left: "4%", right: "4%", top: "50%",
        transform: visible ? "translate(0,-50%) scale(1)" : "translate(0,-50%) scale(0.88)",
        opacity: visible ? 1 : 0,
        transition: "transform 280ms cubic-bezier(0.34,1.56,0.64,1), opacity 260ms ease",
        zIndex: 301, background: C.white, borderRadius: 18,
        overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.28)",
      }}>
        {/* Coloured header */}
        <div style={{ background: bgGrad, padding: "22px 20px 18px", textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.5)",
            margin: "0 auto 10px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={28} color="#fff" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            Account Level Upgraded!
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
            Your balance has crossed the {isAlibaba ? "$499" : "$899"} threshold
          </div>
        </div>

        <div style={{ padding: "16px 18px 20px" }}>
          {/* New platform badge */}
          <div style={{
            background: `${accentColor}10`, border: `1.5px solid ${accentColor}40`,
            borderRadius: 12, padding: "12px 14px", marginBottom: 14, textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: C.textLight, marginBottom: 6 }}>
              You must now place orders exclusively from
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: accentColor, marginBottom: 4 }}>
              {isAlibaba ? "Alibaba" : "AliExpress"}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", border: "1px solid #86efac", borderRadius: 20, padding: "4px 14px" }}>
              <TrendingUp size={11} color={C.green} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>
                Commission: {isAlibaba ? "8%" : "12%"}
              </span>
            </div>
          </div>

          {/* Info rows */}
          {[
            {
              label: "Balance range",
              val: isAlibaba ? "$499 – $898" : "$899 and above",
              color: C.text,
            },
            {
              label: "Commission rate",
              val: isAlibaba ? "8% per order" : "12% per order",
              color: C.green,
            },
            {
              label: "Previous platform",
              val: isAlibaba ? "Amazon (locked)" : "Alibaba (locked)",
              color: C.red,
            },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingBottom: i < arr.length - 1 ? 10 : 0,
              marginBottom: i < arr.length - 1 ? 10 : 14,
              borderBottom: i < arr.length - 1 ? `1px dashed ${C.border}` : "none",
            }}>
              <span style={{ fontSize: 12, color: C.textMid }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{row.val}</span>
            </div>
          ))}

          <button onClick={handleClose} style={{
            width: "100%", border: "none", borderRadius: 10, padding: "13px 0",
            background: bgGrad, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: `0 4px 14px ${accentColor}55`,
          }}>
            Got it — Go to {isAlibaba ? "Alibaba" : "AliExpress"}
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MENU SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
type VipLevel = "all" | "1" | "2" | "3";

function MenuScreen({
  onTask,
  accountBalance,
}: {
  onTask: (platform: string) => void;
  accountBalance: number;
}) {
  const [filter, setFilter] = useState<VipLevel>("all");
  const currentTier = getBalanceTier(accountBalance);
  const allowedPlatform = TIER_PLATFORM[currentTier];

  const platforms = [
    { id: "amazon",     name: "Amazon",     vip: 1, range: "$20 – $498",  commission: "4%",  minBal: 20,  maxBal: 499  },
    { id: "alibaba",    name: "Alibaba",    vip: 2, range: "$499 – $898", commission: "8%",  minBal: 499, maxBal: 899  },
    { id: "aliexpress", name: "Aliexpress", vip: 3, range: "≥ $899",      commission: "12%", minBal: 899, maxBal: Infinity },
  ];
  const tabs: { key: VipLevel; label: string }[] = [
    { key: "all", label: "All" },
    { key: "1",   label: "VIP 1" },
    { key: "2",   label: "VIP 2" },
    { key: "3",   label: "VIP 3" },
  ];
  const filtered = filter === "all" ? platforms : platforms.filter(p => String(p.vip) === filter);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingBottom: 68 }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "10px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Menu</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: `${C.green}12`, border: `1px solid ${C.green}40`, borderRadius: 20, padding: "3px 10px" }}>
            <TrendingUp size={10} color={C.green} />
            <span style={{ fontSize: 10, fontWeight: 700, color: C.green }}>
              Balance: ${accountBalance.toFixed(2)}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{
              border: "none", cursor: "pointer",
              padding: "5px 12px",
              background: filter === t.key ? C.orange : "transparent",
              color: filter === t.key ? "#fff" : C.textMid,
              borderRadius: 20,
              fontSize: 12, fontWeight: filter === t.key ? 600 : 400,
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ height: 1, background: C.border, marginTop: 8 }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>

        {/* Balance notice */}
        {currentTier === "none" && (
          <div style={{
            background: "#fef3e2", border: `1.5px solid ${C.orange}`, borderRadius: 10,
            padding: "10px 14px", marginBottom: 10,
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <AlertCircle size={15} color={C.orange} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>Minimum balance required</div>
              <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.5 }}>
                You need at least <strong>$20</strong> in your account to start placing orders. Please make a deposit first.
              </div>
            </div>
          </div>
        )}

        {filtered.map(p => {
          const isActive  = p.id === allowedPlatform && currentTier !== "none";
          const isLocked  = !isActive;
          const isUpcoming = !isActive && p.minBal > accountBalance;
          const needed    = isUpcoming ? (p.minBal - accountBalance).toFixed(2) : null;

          return (
            <div
              key={p.id}
              onClick={() => isActive && onTask(p.id)}
              style={{
                width: "100%", background: isActive ? C.white : "#f9f9fb",
                border: isActive ? `2px solid ${C.orange}` : `1.5px solid ${C.border}`,
                borderRadius: 10, padding: "12px 14px", marginBottom: 8,
                cursor: isActive ? "pointer" : "not-allowed",
                boxShadow: isActive ? "0 2px 10px rgba(245,161,0,0.18)" : "none",
                display: "flex", alignItems: "center", gap: 10,
                opacity: isLocked ? 0.65 : 1,
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Active glow stripe */}
              {isActive && (
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
                  background: `linear-gradient(180deg, ${C.orange}, ${C.orangeDark})`,
                  borderRadius: "2px 0 0 2px",
                }} />
              )}

              <div style={{
                width: 46, height: 46, borderRadius: 10,
                background: isLocked ? "#f0f0f0" : C.orangeLight,
                border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden",
              }}>
                {isLocked ? (
                  <Lock size={20} color={C.textLight} />
                ) : (
                  <img src={PRODUCT_IMAGES[p.id]} alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: isLocked ? C.textLight : C.text }}>
                    {p.name}
                  </span>
                  <VipBadge level={p.vip} />
                  {isActive && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: "#fff",
                      background: `linear-gradient(135deg, ${C.green}, #16a34a)`,
                      padding: "1px 6px", borderRadius: 10,
                    }}>ACTIVE</span>
                  )}
                  {isLocked && p.id === "amazon" && accountBalance >= 499 && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: C.red,
                      background: "#fee2e2", padding: "1px 6px", borderRadius: 10,
                    }}>LOCKED</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: C.textMid, marginBottom: 2 }}>
                  Balance range: {p.range}
                </div>
                <div style={{ fontSize: 11, color: C.textMid }}>
                  Commission:{" "}
                  <span style={{
                    color: isActive ? C.green : C.textLight,
                    fontWeight: 700, fontSize: 12,
                    background: isActive ? "#dcfce7" : "#f4f5f7",
                    padding: "1px 5px", borderRadius: 4,
                  }}>
                    {p.commission}
                  </span>
                </div>
                {isUpcoming && needed && (
                  <div style={{ fontSize: 10, color: C.blue, marginTop: 3, fontWeight: 600 }}>
                    Deposit ${needed} more to unlock
                  </div>
                )}
                {isLocked && !isUpcoming && (
                  <div style={{ fontSize: 10, color: C.red, marginTop: 3, fontWeight: 600 }}>
                    Exceeded balance range — use {allowedPlatform}
                  </div>
                )}
              </div>

              {isActive
                ? <ChevronRight size={15} color={C.orange} />
                : <Lock size={14} color={C.textLight} />
              }
            </div>
          );
        })}
        <div style={{ textAlign: "center", fontSize: 11, color: C.textLight, paddingTop: 2 }}>No more</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK DETAIL SCREEN  (combo orders logic)
// ═══════════════════════════════════════════════════════════════════════════════
// Combo positions in a 25-order session (1-indexed)
const COMBO_POSITIONS_DEFAULT = [6, 12, 18, 24];

function TaskDetailScreen({
  platform: initialPlatform,
  onBack,
  onSubmitOrder,
  loginCount,
  isVip,
  adminCombos,
  accountBalance,
  sessionApproved,
  frozenAmount,
  onSessionComplete,
  onContactService,
}: {
  platform: string;
  onBack: () => void;
  onSubmitOrder: (platform: string, amount: string, commission: string, isCombo?: boolean) => void;
  loginCount: number;
  isVip: boolean;
  adminCombos: number[];
  accountBalance: number;
  sessionApproved: boolean;
  frozenAmount: number;
  onSessionComplete: () => void;
  onContactService: () => void;
}) {
  const currentTier    = getBalanceTier(accountBalance);
  const forcedPlatform = TIER_PLATFORM[currentTier];
  // Always use the tier-forced platform; ignore any passed-in platform if tier differs
  const [activePlatform, setActivePlatform] = useState(forcedPlatform);
  const [popupOpen,    setPopupOpen]    = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [comboDepositOpen, setComboDepositOpen] = useState(false);

  // Session 1: 1 order, no combos. Session 2+: 25 orders, 1 combo at position 13 (mid-point)
  const isFirstSession = loginCount === 1;
  const SESSION_LIMIT = isFirstSession ? 1 : 25;
  const DEFAULT_SINGLE_COMBO = [13]; // position 13 of 25 for non-VIP sessions

  // VIP accounts use admin-set positions; otherwise 1 combo at position 13 (or none for first session)
  const comboPositions = isFirstSession
    ? []
    : isVip && adminCombos.length > 0
      ? adminCombos
      : DEFAULT_SINGLE_COMBO;

  const NAMES:   Record<string, string> = { amazon: "Amazon", alibaba: "Alibaba", aliexpress: "Aliexpress" };
  const RATES:   Record<string, number> = { amazon: 4,        alibaba: 8,         aliexpress: 12 };
  const ACCENTS: Record<string, string> = { amazon: "#FF9900", alibaba: "#FF6A00",  aliexpress: "#e62e04" };

  const PLATFORM_DATA: Record<string, {
    balance: string; todayEarnings: string; yesterdayEarnings: string;
    cashGap: string; yesterdayBuyComm: string; yesterdayTeamComm: string;
  }> = {
    amazon: { balance: "1,248.60", todayEarnings: "42.80", yesterdayEarnings: "38.50", cashGap: "120.00", yesterdayBuyComm: "24.30", yesterdayTeamComm: "14.20" },
    alibaba: { balance: "2,837.40", todayEarnings: "87.20", yesterdayEarnings: "76.40", cashGap: "200.00", yesterdayBuyComm: "52.80", yesterdayTeamComm: "23.60" },
    aliexpress: { balance: "652.30", todayEarnings: "24.60", yesterdayEarnings: "18.90", cashGap: "80.00", yesterdayBuyComm: "12.40", yesterdayTeamComm: "6.50" },
  };

  const PRODUCTS: Record<string, { name: string; sku: string; unitPrice: string; qty: number }> = {
    amazon:     { name: "Scotlite Pro Fix Adhesive Tape Roll (Heavy Duty, 50m)",    sku: "AMZ-83712", unitPrice: "2.58",  qty: 62 },
    alibaba:    { name: "Wireless Bluetooth Earbuds Pro Max — Noise Cancelling",    sku: "ALB-10542", unitPrice: "49.90", qty: 2  },
    aliexpress: { name: "Smart Fitness Watch Band Series 7 — Heart Rate Monitor",   sku: "AEX-20391", unitPrice: "34.50", qty: 3  },
  };

  const p        = activePlatform;
  const data     = PLATFORM_DATA[p] ?? PLATFORM_DATA.amazon;
  const product  = PRODUCTS[p]      ?? PRODUCTS.amazon;
  const rate     = RATES[p]         ?? 4;
  const accent   = ACCENTS[p]       ?? C.orange;

  const orderAmt   = (parseFloat(product.unitPrice) * product.qty).toFixed(2);
  const commission = (parseFloat(orderAmt) * rate / 100).toFixed(2);
  const expected   = (parseFloat(orderAmt) + parseFloat(commission)).toFixed(2);
  const orderId    = `TR${Date.now().toString().slice(-10)}`;
  const projectedBalance = (
    parseFloat(data.balance.replace(/,/g, "")) + parseFloat(expected)
  ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const [sessionCount,      setSessionCount]      = useState(0);
  const [sessionLimitHit,   setSessionLimitHit]   = useState(false);
  const [successVisible,    setSuccessVisible]    = useState(false);
  const [depositDone,       setDepositDone]       = useState(false);
  // Blocking popup shown whenever the user has no permission to work yet
  const [showPermissionPopup, setShowPermissionPopup] = useState(!sessionApproved);

  // If permission is revoked/missing (e.g. right after finishing a session), re-show the block
  useEffect(() => {
    if (!sessionApproved) setShowPermissionPopup(true);
  }, [sessionApproved]);

  // Check if the NEXT order (sessionCount + 1) is a combo position
  const nextOrderNum = sessionCount + 1;
  const isNextCombo = !isFirstSession && comboPositions.includes(nextOrderNum);

  // Combo order values (30% commission for higher profit)
  const COMBO_RATE = 30;
  const COMBO_AMOUNTS: Record<string, string> = { amazon: "520.00", alibaba: "980.00", aliexpress: "750.00" };
  const comboAmt = COMBO_AMOUNTS[p] ?? "520.00";
  const comboComm = (parseFloat(comboAmt) * COMBO_RATE / 100).toFixed(2);
  const comboExpected = (parseFloat(comboAmt) + parseFloat(comboComm)).toFixed(2);

  const openPopup  = () => {
    if (isNextCombo && !depositDone) {
      setComboDepositOpen(true);
      return;
    }
    setPopupOpen(true);
    setTimeout(() => setPopupVisible(true), 20);
  };
  const closePopup = () => { setPopupVisible(false); setTimeout(() => setPopupOpen(false), 280); };

  const handleSubmit = (isCombo = false) => {
    const amt  = isCombo ? comboAmt : orderAmt;
    const comm = isCombo ? comboComm : commission;
    onSubmitOrder(p, amt, comm, isCombo);
    setSuccessVisible(true);
    const delay = 1000 + Math.random() * 1500;
    setTimeout(() => {
      setSuccessVisible(false);
      setPopupVisible(false);
      setTimeout(() => setPopupOpen(false), 280);
      setDepositDone(false);
      const next = sessionCount + 1;
      setSessionCount(next);
      if (next >= SESSION_LIMIT) {
        setSessionLimitHit(true);
        onSessionComplete(); // unlock withdrawal
      }
    }, delay);
  };

  const stats = [
    { label: "Today's Orders",         value: `${sessionCount}`,                highlight: false, noUnit: true },
    { label: "Today's Commission",     value: data.todayEarnings,               highlight: true  },
    { label: "Cash Gap Between Tasks", value: data.cashGap,                     highlight: false },
    { label: "Yesterday's Earnings",   value: data.yesterdayEarnings,           highlight: false },
    { label: "Yesterday's Team Comm.", value: data.yesterdayTeamComm,           highlight: false },
    { label: "Frozen in Accounts",     value: frozenAmount.toFixed(2),          highlight: false, warn: frozenAmount > 0 },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, position: "relative" }}>

      {/* Orange header */}
      <div style={{ background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`, flexShrink: 0 }}>
        <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 16px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, marginRight: 8 }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 15, color: "#fff", marginRight: 36 }}>
            {NAMES[p]}
          </span>
        </div>
        <div style={{ padding: "2px 20px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginBottom: 1 }}>Total Account Balance</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
            {data.balance} <span style={{ fontSize: 12, fontWeight: 400 }}>USDT</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 4 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Today's Earnings</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>+{data.todayEarnings} USDT</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Yesterday's Earnings</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{data.yesterdayEarnings} USDT</div>
            </div>
          </div>
        </div>

        {/* Platform tabs — locked to tier */}
        <div style={{ display: "flex", margin: "0 12px 0", background: "rgba(0,0,0,0.18)", borderRadius: 10, padding: 3 }}>
          {(["amazon", "alibaba", "aliexpress"] as const).map(key => {
            const isAllowed = key === forcedPlatform;
            return (
              <button
                key={key}
                disabled={!isAllowed}
                style={{
                  flex: 1, border: "none",
                  cursor: isAllowed ? "pointer" : "not-allowed",
                  borderRadius: 8, padding: "7px 4px",
                  background: activePlatform === key ? "#fff" : "transparent",
                  color: isAllowed
                    ? activePlatform === key ? C.orange : "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.3)",
                  fontWeight: activePlatform === key ? 700 : 500,
                  fontSize: 11,
                  transition: "all 200ms ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                }}
              >
                {!isAllowed && <Lock size={9} />}
                {NAMES[key]}
              </button>
            );
          })}
        </div>
        <div style={{ height: 10 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 68px" }}>

        {/* Permission gate — shown until customer service/admin approves the session */}
        {!sessionApproved && !sessionLimitHit && (
          <div style={{
            background: C.white, borderRadius: 10,
            border: `1.5px solid ${C.border}`,
            overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            marginBottom: 10,
          }}>
            <div style={{
              padding: "12px 14px",
              background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
              borderBottom: "1px solid #bae6fd",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.wine, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertCircle size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Permission Required</div>
                <div style={{ fontSize: 10, color: C.textMid }}>Contact customer service to start your session</div>
              </div>
            </div>
            <div style={{ padding: "12px 14px" }}>
              {accountBalance < 20 ? (
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 3 }}>Insufficient Balance</div>
                  <div style={{ fontSize: 11, color: C.textMid }}>You need at least <strong>20 USDT</strong> before customer service can approve your session.</div>
                </div>
              ) : (
                <button onClick={onContactService} style={{
                  width: "100%", border: "none", borderRadius: 8, padding: "12px 0",
                  background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
                  color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(122,44,62,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}><Headphones size={14} /> Contact Customer Service</button>
              )}
            </div>
          </div>
        )}

        {/* Earnings dashboard */}
        <div style={{ background: C.white, borderRadius: 10, marginBottom: 10, boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Earnings Dashboard</span>
            <span style={{ fontSize: 10, color: accent, fontWeight: 600, background: `${accent}18`, padding: "2px 8px", borderRadius: 10 }}>
              Commission {rate}%
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                padding: "10px 14px",
                borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
                borderRight: i % 2 === 0 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ fontSize: 9, color: C.textLight, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.highlight ? C.green : (s as any).warn ? C.red : C.text }}>
                  {s.highlight ? "+" : ""}{s.value}
                  {!(s as any).noUnit ? <span style={{ fontSize: 9, fontWeight: 400, color: C.textMid }}> USDT</span> : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session progress */}
        {!sessionLimitHit && (
          <div style={{ background: C.white, borderRadius: 8, padding: "8px 12px", marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: C.textMid, fontWeight: 600 }}>Session Progress</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: sessionCount >= SESSION_LIMIT - 5 ? C.red : C.orange }}>
                {sessionCount} / {SESSION_LIMIT} orders
              </span>
            </div>
            <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 3,
                width: `${(sessionCount / SESSION_LIMIT) * 100}%`,
                background: sessionCount >= SESSION_LIMIT - 5
                  ? `linear-gradient(90deg, ${C.orange}, ${C.red})`
                  : `linear-gradient(90deg, ${C.orange}, ${C.orangeDark})`,
                transition: "width 400ms ease",
              }} />
            </div>

            {/* Combo indicators on progress */}
            {!isFirstSession && (
              <div style={{ display: "flex", gap: 4, marginTop: 6, alignItems: "center" }}>
                <span style={{ fontSize: 9, color: C.textLight }}>Combos:</span>
                {comboPositions.map(pos => (
                  <div key={pos} style={{
                    width: 20, height: 18, borderRadius: 4,
                    background: sessionCount >= pos
                      ? `linear-gradient(135deg, ${C.green}, #16a34a)`
                      : sessionCount === pos - 1
                        ? `linear-gradient(135deg, ${C.purple}, #7c3aed)`
                        : `${C.purple}30`,
                    border: `1px solid ${sessionCount === pos - 1 ? C.purple : "transparent"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: sessionCount >= pos ? "#fff" : sessionCount === pos - 1 ? C.purple : C.textLight }}>
                      {pos}
                    </span>
                  </div>
                ))}
                <span style={{ fontSize: 9, color: C.purple, marginLeft: 2 }}>30% comm</span>
              </div>
            )}
          </div>
        )}

        {/* Grab button or session-complete panel */}
        {sessionLimitHit ? (
          <div style={{
            background: C.white, borderRadius: 10,
            border: `1.5px solid ${C.border}`,
            overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}>
            <div style={{
              padding: "12px 14px",
              background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
              borderBottom: "1px solid #86efac",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CheckCircle2 size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>25 Orders Completed!</div>
                <div style={{ fontSize: 10, color: C.textMid }}>Contact customer service for permission to start your next session</div>
              </div>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <button onClick={onContactService} style={{
                width: "100%", border: "none", borderRadius: 8, padding: "12px 0",
                background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
                color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(122,44,62,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}><Headphones size={14} /> Contact Customer Service</button>
            </div>
          </div>
        ) : sessionApproved ? (
          <>
            <button onClick={openPopup} style={{
              width: "100%",
              background: isNextCombo
                ? `linear-gradient(135deg, ${C.purple} 0%, #7c3aed 100%)`
                : `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
              border: "none", borderRadius: 8, padding: "14px 0",
              fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
              boxShadow: isNextCombo ? `0 4px 16px rgba(139,92,246,0.4)` : `0 4px 16px rgba(245,161,0,0.4)`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {isNextCombo ? <><Zap size={17} /> Grab Combo Order #{nextOrderNum}</> : "Grab the order immediately"}
            </button>
            <div style={{ fontSize: 11, color: C.textLight, textAlign: "center", marginTop: 8 }}>
              {isNextCombo
                ? "Combo order requires deposit first — higher profit!"
                : "Ensure your account balance meets the minimum requirement."}
            </div>
          </>
        ) : null}
      </div>

      {/* ── Combo Order Deposit Popup ── */}
      {comboDepositOpen && (
        <>
          <div onClick={() => setComboDepositOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} />
          <div style={{
            position: "absolute", left: "5%", right: "5%", top: "50%",
            transform: "translateY(-50%)",
            zIndex: 201, background: C.white, borderRadius: 16, overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${C.purple} 0%, #7c3aed 100%)`,
              padding: "16px 16px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={18} color="#fff" />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Combo Order #{nextOrderNum}</span>
              </div>
              <button onClick={() => setComboDepositOpen(false)} style={{ border: "none", background: "rgba(255,255,255,0.2)", cursor: "pointer", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={15} color="#fff" />
              </button>
            </div>

            <div style={{ padding: "16px 16px 18px" }}>
              <div style={{
                background: `${C.purple}10`, border: `1px solid ${C.purple}30`,
                borderRadius: 10, padding: "12px 14px", marginBottom: 14,
              }}>
                <div style={{ fontSize: 12, color: C.textMid, marginBottom: 4 }}>Combo Order Details</div>
                {[
                  { label: "Order Amount",      val: `${comboAmt} USDT`,     color: C.orange },
                  { label: "Commission (30%)",   val: `+${comboComm} USDT`,   color: C.green  },
                  { label: "Expected Income",    val: `${comboExpected} USDT`, color: C.purple, bold: true },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{
                    display: "flex", justifyContent: "space-between",
                    paddingBottom: i < arr.length - 1 ? 8 : 0,
                    marginBottom: i < arr.length - 1 ? 8 : 0,
                    borderBottom: i < arr.length - 1 ? `1px dashed ${C.border}` : "none",
                  }}>
                    <span style={{ fontSize: 12, color: C.textMid }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: (row as { bold?: boolean }).bold ? 700 : 600, color: row.color }}>{row.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff8e7", border: `1px solid ${C.orange}40`, borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 11, color: C.textMid, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 700, color: C.orange }}>Deposit Required:</span> You must make a deposit to unlock this combo order. After depositing, tap the button below to proceed.
              </div>

              {!depositDone ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setComboDepositOpen(false)} style={{
                    flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "10px 0",
                    background: "none", cursor: "pointer", fontSize: 13, color: C.textMid,
                  }}>Cancel</button>
                  <button onClick={() => { setDepositDone(true); setComboDepositOpen(false); setPopupOpen(true); setTimeout(() => setPopupVisible(true), 20); }} style={{
                    flex: 2, border: "none", borderRadius: 8, padding: "10px 0",
                    background: `linear-gradient(135deg, ${C.purple} 0%, #7c3aed 100%)`,
                    color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}>Deposit &amp; Proceed</button>
                </div>
              ) : (
                <button onClick={() => { setComboDepositOpen(false); setPopupOpen(true); setTimeout(() => setPopupVisible(true), 20); }} style={{
                  width: "100%", border: "none", borderRadius: 8, padding: "12px 0",
                  background: `linear-gradient(135deg, ${C.green} 0%, #16a34a 100%)`,
                  color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>✓ Deposit Confirmed — Open Order</button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Grab Order Popup ── */}
      {popupOpen && (
        <>
          <div onClick={closePopup} style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200,
            opacity: popupVisible ? 1 : 0, transition: "opacity 280ms ease",
          }} />
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 201,
            background: C.white, borderRadius: "18px 18px 0 0",
            display: "flex", flexDirection: "column",
            transform: popupVisible ? "translateY(0)" : "translateY(100%)",
            transition: "transform 280ms cubic-bezier(0.32,0.72,0,1)",
            boxShadow: "0 -4px 32px rgba(0,0,0,0.18)", overflow: "hidden",
          }}>
            <div style={{ padding: "10px 18px 0", flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#d1d5db", margin: "0 auto 12px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Order Details</span>
                  {depositDone && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.purple}, #7c3aed)`, padding: "2px 8px", borderRadius: 10 }}>
                      COMBO
                    </span>
                  )}
                </div>
                <button onClick={closePopup} style={{ border: "none", background: "#f4f5f7", cursor: "pointer", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={15} color={C.textMid} />
                </button>
              </div>
            </div>

            {/* Compact popup body — fits in phone without scrolling */}
            <div style={{ padding: "0 14px 14px" }}>

              {successVisible ? (
                /* ── Success state ── */
                <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.green} 0%, #16a34a 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 8px",
                    boxShadow: `0 0 0 8px ${C.green}22`,
                  }}>
                    <CheckCircle2 size={30} color="#fff" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 2 }}>Order Submitted!</div>
                  <div style={{ fontSize: 11, color: C.textMid, marginBottom: 10 }}>Recorded successfully.</div>
                  <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}40`, borderRadius: 8, padding: "8px 12px", marginBottom: 8, textAlign: "left" }}>
                    {[
                      { label: "Amount",     val: `${depositDone ? comboAmt : orderAmt} USDT` },
                      { label: "Commission", val: `+${depositDone ? comboComm : commission} USDT`, green: true },
                      { label: "Income",     val: `${depositDone ? comboExpected : expected} USDT`, bold: true },
                    ].map((row, i, arr) => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: i < arr.length - 1 ? 5 : 0, marginBottom: i < arr.length - 1 ? 5 : 0, borderBottom: i < arr.length - 1 ? `1px dashed ${C.green}40` : "none" }}>
                        <span style={{ fontSize: 11, color: C.textMid }}>{row.label}</span>
                        <span style={{ fontSize: 12, fontWeight: (row as {bold?:boolean}).bold ? 700 : 600, color: (row as {green?:boolean}).green ? C.green : C.text }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: C.textLight }}>Returning to dashboard…</div>
                </div>
              ) : (
                /* ── Order details state ── */
                <React.Fragment>
                  {/* Product image — smaller */}
                  <div style={{ borderRadius: 10, overflow: "hidden", background: `${accent}12`, border: `1.5px solid ${accent}30`, marginBottom: 8, position: "relative" }}>
                    <div style={{ height: 80, overflow: "hidden", position: "relative" }}>
                      <img
                        src={depositDone ? PRODUCT_IMAGES.combo : PRODUCT_IMAGES[p]}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = "none";
                          el.nextElementSibling && ((el.nextElementSibling as HTMLElement).style.display = "flex");
                        }}
                      />
                      <div style={{ display: "none", height: 80, alignItems: "center", justifyContent: "center", background: `${accent}15` }}>
                        <Package size={28} color={accent} />
                      </div>
                      {depositDone && (
                        <div style={{ position: "absolute", top: 6, right: 6, background: `linear-gradient(135deg, ${C.purple}, #7c3aed)`, borderRadius: 8, padding: "2px 7px", display: "flex", alignItems: "center", gap: 3 }}>
                          <Zap size={9} color="#fff" />
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>COMBO</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product name + SKU compact */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 1 }}>
                      {depositDone ? `Combo Bundle — ${NAMES[p]} Premium` : product.name}
                    </div>
                    <div style={{ fontSize: 9, color: C.textLight, fontFamily: "monospace" }}>SKU: {depositDone ? `COMBO-${orderId.slice(-6)}` : product.sku}</div>
                  </div>

                  {/* Order figures — 3 cols */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {[
                      { label: "Amount",     val: `${depositDone ? comboAmt : orderAmt}`, color: C.orange },
                      { label: "Comm.",      val: `+${depositDone ? comboComm : commission}`, color: C.green },
                      { label: "Income",     val: `${depositDone ? comboExpected : expected}`, color: depositDone ? C.purple : C.text },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, background: C.bg, borderRadius: 7, padding: "6px 4px", textAlign: "center", border: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 9, color: C.textLight, marginBottom: 1 }}>{s.label}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: 8, color: C.textLight }}>USDT</div>
                      </div>
                    ))}
                  </div>

                  {/* Commission rate badge + Order ID */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: C.textLight, fontFamily: "monospace" }}>ID: {orderId}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: depositDone ? C.purple : C.orange, background: depositDone ? `${C.purple}15` : `${C.orange}15`, padding: "2px 8px", borderRadius: 8 }}>
                      {depositDone ? COMBO_RATE : rate}% commission
                    </div>
                  </div>

                  <button onClick={() => handleSubmit(depositDone)} style={{
                    width: "100%",
                    background: depositDone
                      ? `linear-gradient(135deg, ${C.purple} 0%, #7c3aed 100%)`
                      : `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
                    border: "none", borderRadius: 10, padding: "12px 0",
                    fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
                    boxShadow: depositDone ? `0 4px 14px rgba(139,92,246,0.35)` : `0 4px 14px rgba(245,161,0,0.35)`,
                  }}>
                    {depositDone ? "Submit Combo Order" : "Submit Order"}
                  </button>
                </React.Fragment>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Blocking permission popup — forces contact with customer service ── */}
      {showPermissionPopup && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300 }} />
          <div style={{
            position: "absolute", left: 16, right: 16, top: "50%", transform: "translateY(-50%)",
            zIndex: 301, background: C.white, borderRadius: 14, overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
          }}>
            <div style={{ padding: "20px 18px 14px", textAlign: "center" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: `${C.red}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <AlertCircle size={22} color={C.red} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>Permission Required</div>
              <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>
                You cannot start working without permission. Please contact customer service to have your session approved.
              </div>
            </div>
            <div style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => setShowPermissionPopup(false)} style={{
                flex: 1, border: "none", borderRight: `1px solid ${C.border}`, background: C.white,
                padding: "13px 0", fontSize: 13, fontWeight: 600, color: C.textMid, cursor: "pointer",
              }}>Close</button>
              <button onClick={() => { setShowPermissionPopup(false); onContactService(); }} style={{
                flex: 1, border: "none", background: C.white,
                padding: "13px 0", fontSize: 13, fontWeight: 700, color: C.wine, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}><Headphones size={14} /> Contact Service</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER DETAILS POPUP
// ═══════════════════════════════════════════════════════════════════════════════
type OrderStatus = "pending" | "complete";

interface OrderProduct {
  name: string;
  unitPrice: string;
  qty: number;
  accentColor: string;
  icon: string;
  imageUrl?: string;
}

interface OrderRecord {
  id: string;
  platform: string;
  merchantColor: string;
  amount: string;
  commission: string;
  expectedIncome: string;
  time: string;
  status: OrderStatus;
  products: OrderProduct[];
  isCombo?: boolean;
}

const MOCK_ORDERS: OrderRecord[] = [
  {
    id: "TR2502121252212055",
    platform: "Amazon",
    merchantColor: "#FF9900",
    amount: "159.96",
    commission: "12.80",
    expectedIncome: "172.76",
    time: "2026-06-09 14:23:11",
    status: "pending",
    products: [
      { name: "Scotlite Scotlet Profix DC Fix Adhesive Tape Roll", unitPrice: "2.58", qty: 62, accentColor: "#3b82f6", icon: "📦", imageUrl: PRODUCT_IMAGES.amazon },
    ],
  },
  {
    id: "TR2502121183647012",
    platform: "Alibaba",
    merchantColor: "#FF6A00",
    amount: "980.00",
    commission: "294.00",
    expectedIncome: "1274.00",
    time: "2026-06-08 10:05:44",
    status: "complete",
    isCombo: true,
    products: [
      { name: "Premium Wireless Bluetooth Earbuds Pro Max Noise Cancelling", unitPrice: "490.00", qty: 2, accentColor: "#8b5cf6", icon: "🎧", imageUrl: PRODUCT_IMAGES.alibaba },
      { name: "USB-C Fast Charging Cable 2m Braided Nylon", unitPrice: "0.10", qty: 0, accentColor: "#22c55e", icon: "🔌", imageUrl: PRODUCT_IMAGES.combo },
    ],
  },
];

function Pill() {
  return <div style={{ width: 36, height: 4, borderRadius: 2, background: "#d1d5db", margin: "0 auto 14px" }} />;
}

function StatusChip({ status, isCombo }: { status: OrderStatus; isCombo?: boolean }) {
  const isPending = status === "pending";
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {isCombo && (
        <span style={{ background: `linear-gradient(135deg, ${C.purple}, #7c3aed)`, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 3 }}>
          <Zap size={9} /> COMBO
        </span>
      )}
      <span style={{
        background: isPending ? "#fef3e2" : "#dcfce7",
        color: isPending ? C.orange : C.green,
        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
        display: "inline-flex", alignItems: "center", gap: 3,
      }}>
        {isPending ? <Clock size={9} /> : <CheckCircle2 size={9} />}
        {isPending ? "Pending" : "Completed"}
      </span>
    </div>
  );
}

function OrderDetailsPopup({ order, onClose }: { order: OrderRecord; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 280); };

  const rows = [
    { label: "Order No.",        val: order.id,                         mono: true  },
    { label: "Merchant",         val: order.platform,                   bold: true  },
    { label: "Order amount",     val: `${order.amount} USDT`,           orange: true },
    { label: "Commission",       val: `+${order.commission} USDT`,      green: true  },
    { label: "Expected income",  val: `${order.expectedIncome} USDT`,   orange: true },
    { label: "Date & time",      val: order.time                                     },
    { label: "Status",           val: order.status,                     chip: true   },
  ];

  const product = order.products[imgIdx] ?? order.products[0];

  return (
    <>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, opacity: visible ? 1 : 0, transition: "opacity 280ms ease" }} />
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201,
        background: C.white, borderRadius: "18px 18px 0 0",
        maxHeight: "88%", display: "flex", flexDirection: "column",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 280ms cubic-bezier(0.32,0.72,0,1)",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.18)", overflow: "hidden",
      }}>
        <div style={{ padding: "8px 16px 0", flexShrink: 0 }}>
          <Pill />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Order Details</span>
              {order.isCombo && (
                <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.purple}, #7c3aed)`, padding: "2px 6px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <Zap size={8} /> COMBO
                </span>
              )}
            </div>
            <button onClick={handleClose} style={{ border: "none", background: "#f4f5f7", cursor: "pointer", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={13} color={C.textMid} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 14px" }}>
          {/* Product image */}
          <div style={{
            borderRadius: 10, overflow: "hidden",
            background: `linear-gradient(135deg, ${product.accentColor}22 0%, ${product.accentColor}11 100%)`,
            border: `1.5px solid ${product.accentColor}33`, marginBottom: 8,
          }}>
            <div style={{ height: 100, overflow: "hidden", position: "relative" }}>
              <img
                src={product.imageUrl ?? PRODUCT_IMAGES[order.platform.toLowerCase()] ?? PRODUCT_IMAGES.combo}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  // fallback to emoji display
                  const fb = el.parentElement?.querySelector(".fallback") as HTMLElement | null;
                  if (fb) fb.style.display = "flex";
                }}
              />
              <div className="fallback" style={{
                display: "none", position: "absolute", inset: 0,
                flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                background: `linear-gradient(135deg, ${product.accentColor}18 0%, ${product.accentColor}08 100%)`,
              }}>
                <span style={{ fontSize: 52, lineHeight: 1 }}>{product.icon}</span>
                <span style={{ fontSize: 10, color: product.accentColor, fontWeight: 600, background: `${product.accentColor}22`, padding: "2px 8px", borderRadius: 10 }}>{order.platform}</span>
              </div>
              {order.isCombo && (
                <div style={{ position: "absolute", top: 8, right: 8, background: `linear-gradient(135deg, ${C.purple}, #7c3aed)`, borderRadius: 10, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={9} color="#fff" />
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>COMBO</span>
                </div>
              )}
            </div>

            {order.products.length > 1 && (
              <div style={{ display: "flex", gap: 8, padding: "8px 10px", background: "rgba(255,255,255,0.7)", borderTop: `1px solid ${C.border}` }}>
                {order.products.map((p, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{
                    width: 42, height: 42, borderRadius: 7, flexShrink: 0,
                    border: `2px solid ${i === imgIdx ? product.accentColor : C.border}`,
                    background: `${p.accentColor}18`, overflow: "hidden",
                    cursor: "pointer", padding: 0,
                  }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <span style={{ fontSize: 20 }}>{p.icon}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div style={{ background: C.bg, borderRadius: 9, padding: "8px 10px", marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.35, marginBottom: 6 }}>{product.name}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { label: "Unit Price", val: `${product.unitPrice} USDT`, color: C.orange },
                { label: "Quantity",   val: `×${product.qty}`,           color: C.text   },
                { label: "Subtotal",   val: `${(parseFloat(product.unitPrice) * product.qty).toFixed(2)} USDT`, color: C.green },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, background: C.white, borderRadius: 6, padding: "5px 6px", textAlign: "center", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 8, color: C.textLight, marginBottom: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div style={{ background: C.white, borderRadius: 9, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ padding: "6px 10px", background: `linear-gradient(135deg, ${C.wine}08 0%, ${C.wine}04 100%)`, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>Order Summary</span>
            </div>
            {rows.map((row, i) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 11, color: C.textMid, flexShrink: 0 }}>{row.label}</span>
                {row.chip ? (
                  <StatusChip status={row.val as OrderStatus} isCombo={order.isCombo} />
                ) : (
                  <span style={{
                    fontSize: 11, fontWeight: row.bold || row.orange || row.green ? 700 : 400,
                    color: row.orange ? C.orange : row.green ? C.green : C.text,
                    fontFamily: row.mono ? "monospace" : "inherit",
                    maxWidth: "58%", textAlign: "right", wordBreak: "break-all",
                  }}>{row.val}</span>
                )}
              </div>
            ))}
          </div>

          <button onClick={handleClose} style={{
            width: "100%",
            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
            border: "none", borderRadius: 9, padding: "10px 0",
            fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
            boxShadow: `0 4px 16px rgba(245,161,0,0.35)`,
          }}>Close</button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECORD SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function RecordScreen({ orders, onSubmitIncomplete }: { orders: OrderRecord[]; onSubmitIncomplete: (id: string) => void }) {
  const [tab, setTab] = useState<"incomplete" | "complete">("incomplete");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const incompleteOrders = orders.filter(o => o.status === "pending");
  const completeOrders   = orders.filter(o => o.status === "complete");
  const visible = tab === "incomplete" ? incompleteOrders : completeOrders;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, paddingBottom: 68 }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ padding: "10px 16px 0", textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 8 }}>Record</div>
        </div>
        <div style={{ display: "flex", padding: "0 20px" }}>
          {(["incomplete","complete"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, border: "none", background: "none", cursor: "pointer",
              padding: "8px 0",
              color: tab === t ? C.orange : C.textMid,
              fontWeight: tab === t ? 700 : 400,
              fontSize: 13,
              borderBottom: tab === t ? `2px solid ${C.orange}` : "2px solid transparent",
            }}>{t === "incomplete" ? "Incomplete" : "Complete"}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
        {visible.length > 0 ? visible.map(order => (
          <button key={order.id} onClick={() => setSelectedOrder(order)} style={{
            width: "100%", background: C.white, border: "none", borderRadius: 10, padding: 12,
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 8, cursor: "pointer", textAlign: "left",
            borderLeft: order.isCombo ? `3px solid ${C.purple}` : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.textLight }}>{order.time}</span>
              <StatusChip status={order.status} isCombo={order.isCombo} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 7, flexShrink: 0, background: `${order.products[0].accentColor}18`, border: `1px solid ${order.products[0].accentColor}33`, overflow: "hidden" }}>
                {order.products[0].imageUrl ? (
                  <img src={order.products[0].imageUrl} alt={order.products[0].name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      el.parentElement!.innerHTML = `<span style="font-size:22px;display:flex;align-items:center;justify-content:center;height:100%">${order.products[0].icon}</span>`;
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 22 }}>{order.products[0].icon}</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {order.products[0].name}
                </div>
                <div style={{ fontSize: 10, color: C.textLight }}>
                  {order.products[0].unitPrice} USDT × {order.products[0].qty}
                  {order.products.length > 1 && ` (+${order.products.length - 1} more)`}
                </div>
              </div>
            </div>

            {[
              { label: "Order ID",   val: order.id,                   mono: true  },
              { label: "Platform",   val: order.platform                          },
              { label: "Amount",     val: `${order.amount} USDT`                  },
              { label: "Commission", val: `+${order.commission} USDT`, green: true },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.textMid }}>{row.label}</span>
                <span style={{ fontSize: 12, color: row.green ? C.green : C.text, fontWeight: row.green ? 600 : 400, fontFamily: row.mono ? "monospace" : "inherit", maxWidth: "58%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis" }}>{row.val}</span>
              </div>
            ))}

            {tab === "incomplete" && (
              <button onClick={e => { e.stopPropagation(); onSubmitIncomplete(order.id); }} style={{
                marginTop: 10, width: "100%", padding: "8px 0",
                background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
                border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer",
              }}>Submit order</button>
            )}
            <div style={{ marginTop: 6, textAlign: "center", fontSize: 10, color: C.textLight }}>Tap to view details</div>
          </button>
        )) : (
          <div style={{ textAlign: "center", padding: "32px 20px", color: C.textLight }}>
            <ClipboardList size={44} color={C.border} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 13 }}>No more</div>
          </div>
        )}
      </div>

      {selectedOrder && <OrderDetailsPopup order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function MineScreen({ onNavigate, isVip, username }: { onNavigate: (sub: SubPage) => void; isVip: boolean; username: string }) {
  const quickActions = [
    { label: "Teams",            icon: <Users       size={20} color={C.orange} />, bg: "#fff8e7", page: "teams"         as SubPage },
    { label: "Record",           icon: <FileText    size={20} color={C.green}  />, bg: "#f0fdf4", page: "deposit-records" as SubPage },
    { label: "Wallet management",icon: <BarChart2   size={20} color={C.red}    />, bg: "#fef2f2", page: "wallet-mgmt"   as SubPage },
    { label: "Invite friends",   icon: <Mail        size={20} color={C.blue}   />, bg: "#eff6ff", page: "invite"        as SubPage },
  ];
  const menuItems = [
    { label: "Profile",            icon: <User          size={16} color={C.orange}   />, bg: "#fff8e7", page: "profile"          as SubPage },
    { label: "Deposit records",    icon: <ArrowDownToLine size={16} color={C.green}  />, bg: "#f0fdf4", page: "deposit-records"  as SubPage },
    { label: "Withdrawal records", icon: <ArrowUpFromLine size={16} color={C.blue}   />, bg: "#eff6ff", page: "withdraw-records" as SubPage },
    { label: "Setting",            icon: <Globe         size={16} color={C.textMid}  />, bg: "#f4f5f7", page: "setting"          as SubPage },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg, paddingBottom: 68 }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
        padding: "18px 20px 28px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PentagonLogo size={44} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{username}</span>
          <VipBadge level={0} isVip={isVip} />
        </div>
        {isVip && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 8, padding: "4px 10px" }}>
            <Crown size={12} color={C.gold} />
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>VIP Account — Custom Combos Enabled</span>
          </div>
        )}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Invitation code: 925886</div>
      </div>

      <div style={{ margin: "-16px 12px 0", background: C.white, borderRadius: 10, padding: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}>
        <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>My Account</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10 }}>
          0.00 <span style={{ fontSize: 12, fontWeight: 400, color: C.textMid }}>USDT</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onNavigate("deposit")} style={{
            flex: 1,
            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
            border: "none", borderRadius: 7, padding: "10px 0",
            fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            <ArrowDownToLine size={14} /> Deposit
          </button>
          <button onClick={() => onNavigate("withdraw")} style={{
            flex: 1, background: C.white, border: `1.5px solid ${C.orange}`, borderRadius: 7, padding: "10px 0",
            fontSize: 13, fontWeight: 600, color: C.orange, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            <ArrowUpFromLine size={14} /> Withdrawal
          </button>
        </div>
      </div>

      <div style={{ background: C.white, margin: "8px 12px", borderRadius: 10, padding: "12px 6px", display: "flex", justifyContent: "space-around", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        {quickActions.map(a => (
          <button key={a.label} onClick={() => onNavigate(a.page)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{a.icon}</div>
            <span style={{ fontSize: 10, color: C.textMid, maxWidth: 54, textAlign: "center", lineHeight: 1.2 }}>{a.label}</span>
          </button>
        ))}
      </div>

      <div style={{ background: C.white, margin: "0 12px", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        {menuItems.map((item, i) => (
          <div key={item.label}>
            {i > 0 && <div style={{ height: 1, background: C.border, margin: "0 14px" }} />}
            <button onClick={() => onNavigate(item.page)} style={{ width: "100%", background: "none", border: "none", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer" }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
              <span style={{ flex: 1, textAlign: "left", fontSize: 13, color: C.text }}>{item.label}</span>
              <ChevronRight size={14} color={C.textLight} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEPOSIT SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function DepositScreen({ onBack, onQR }: { onBack: () => void; onQR: () => void }) {
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("TRC-20");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Deposit" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 68px" }}>
        <div style={{ background: C.white, borderRadius: 8, marginBottom: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 8 }}>Payment method</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.orangeLight, borderRadius: 7, padding: "8px 10px", border: `1px solid ${C.orange}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>₮</span>
            </div>
            <span style={{ fontWeight: 600, color: C.text, fontSize: 13 }}>USDT</span>
            <Check size={14} color={C.orange} style={{ marginLeft: "auto" }} />
          </div>
        </div>
        <div style={{ background: C.white, borderRadius: 8, marginBottom: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 8 }}>Select the protocol to use</div>
          <div style={{ display: "flex", gap: 7 }}>
            {["TRC-20", "ERC-20", "BEP-20"].map(n => (
              <button key={n} onClick={() => setNetwork(n)} style={{
                flex: 1, border: `1.5px solid ${network === n ? C.orange : C.border}`,
                borderRadius: 7, padding: "7px 0",
                background: network === n ? C.orangeLight : C.white,
                color: network === n ? C.orange : C.textMid,
                fontWeight: network === n ? 700 : 400, fontSize: 12, cursor: "pointer",
              }}>{n}</button>
            ))}
          </div>
        </div>
        <div style={{ background: C.white, borderRadius: 8, marginBottom: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 7 }}>Deposit amount</div>
          <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "8px 10px" }}>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: C.text, background: "transparent" }} />
            <button onClick={() => setAmount("500")} style={{ border: "none", background: C.orangeLight, borderRadius: 4, padding: "3px 7px", fontSize: 10, color: C.orange, fontWeight: 600, cursor: "pointer" }}>MAX</button>
          </div>
        </div>
        <button onClick={onQR} style={{
          width: "100%", background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
          border: "none", borderRadius: 8, padding: "13px 0",
          fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
        }}>Confirm &amp; Get QR Code</button>
      </div>
    </div>
  );
}

// ─── Deposit QR Screen ────────────────────────────────────────────────────────
const DEMO_ADDRESS = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";
function DepositQRScreen({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(DEMO_ADDRESS).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Deposit QR Code" onBack={onBack} dark />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px 68px" }}>
        <div style={{ background: C.white, borderRadius: 10, padding: "16px 14px", marginBottom: 10, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 10 }}>Scan to deposit USDT (TRC-20)</div>
          <div style={{ width: 160, height: 160, margin: "0 auto 12px", border: `2px solid ${C.border}`, borderRadius: 8, padding: 10, background: C.white }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(45deg, #000 0%, #333 50%, #000 100%)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>QR CODE</span>
            </div>
          </div>
          <div style={{ border: `1.5px solid ${C.red}`, borderRadius: 7, padding: "8px 10px", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ flex: 1, fontSize: 10, color: C.text, wordBreak: "break-all", fontFamily: "monospace" }}>{DEMO_ADDRESS}</span>
            <button onClick={handleCopy} style={{ border: "none", background: "none", cursor: "pointer", padding: 3 }}>
              {copied ? <Check size={16} color={C.green} /> : <Copy size={16} color={C.orange} />}
            </button>
          </div>
        </div>
        <div style={{ background: C.white, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontWeight: 600, fontSize: 12, color: C.text, marginBottom: 8 }}>Tips</div>
          {["This is a one-time address. Do not reuse it.", "Minimum deposit amount: 10 USDT.", "Funds typically arrive within 1–2 minutes."].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, fontSize: 11, color: C.textMid }}>
              <span style={{ color: C.orange, fontWeight: 700 }}>{i + 1}.</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WITHDRAW SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const FEE_RATE = 0.15;
function WithdrawScreen({ onBack, onAddWallet, canWithdraw }: { onBack: () => void; onAddWallet: () => void; canWithdraw: boolean }) {
  const [showPwdPopup, setShowPwdPopup] = useState(true);
  const [showTaskBlockPopup, setShowTaskBlockPopup] = useState(!canWithdraw);
  const [amount, setAmount] = useState("");
  const [fundPwd, setFundPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);

  if (success) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Withdrawal" onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <CheckCircle2 size={56} color={C.green} style={{ marginBottom: 14 }} />
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>Withdrawal Submitted</div>
        <div style={{ fontSize: 12, color: C.textMid, textAlign: "center", marginBottom: 20 }}>Your request has been submitted and is being processed.</div>
        <button onClick={onBack} style={{ background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`, border: "none", borderRadius: 8, padding: "12px 36px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Done</button>
      </div>
    </div>
  );

  const fee     = amount ? (parseFloat(amount) * FEE_RATE).toFixed(2) : "0.00";
  const receive = amount ? (parseFloat(amount) * (1 - FEE_RATE)).toFixed(2) : "0.00";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, position: "relative" }}>
      <BackHeader title="Withdrawal" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 68px" }}>
        <div style={{ background: C.white, borderRadius: 8, marginBottom: 8, padding: "10px 14px" }}>
          <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
            <div style={{ padding: "5px 14px", background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`, borderRadius: 20, fontSize: 12, color: "#fff", fontWeight: 600 }}>Virtual currency</div>
          </div>
          <button onClick={onAddWallet} style={{ width: "100%", border: `1.5px dashed ${C.border}`, borderRadius: 7, padding: "10px 0", background: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Plus size={14} color={C.orange} />
            <span style={{ color: C.orange }}>+ Add e-wallet</span>
          </button>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.textLight }}>Please bind an electronic wallet for withdrawal</div>
        </div>
        <div style={{ background: C.white, borderRadius: 8, marginBottom: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 6 }}>Withdrawal amount</div>
          <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "8px 10px" }}>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: C.text, background: "transparent" }} />
            <button onClick={() => setAmount("1000")} style={{ border: "none", background: C.orangeLight, borderRadius: 4, padding: "3px 7px", fontSize: 10, color: C.orange, fontWeight: 600, cursor: "pointer" }}>MAX</button>
          </div>
          {amount && (
            <div style={{ marginTop: 8, padding: "8px 10px", background: C.bg, borderRadius: 7, fontSize: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.textMid, marginBottom: 3 }}>
                <span>Fee (15%)</span>
                <span style={{ color: C.red }}>−{fee} USDT</span>
              </div>
              <div style={{ height: 1, background: C.border, margin: "5px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: C.text }}>
                <span>You receive</span>
                <span style={{ color: C.green }}>{receive} USDT</span>
              </div>
            </div>
          )}
        </div>
        <div style={{ background: C.white, borderRadius: 8, marginBottom: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 6 }}>Fund password</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "8px 10px" }}>
            <Lock size={14} color={C.textLight} />
            <input value={fundPwd} onChange={e => setFundPwd(e.target.value)} placeholder="Enter fund password" type={showPwd ? "text" : "password"} style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: C.text, background: "transparent" }} />
            <button onClick={() => setShowPwd(v => !v)} style={{ border: "none", background: "none", cursor: "pointer" }}>
              {showPwd ? <EyeOff size={14} color={C.textLight} /> : <Eye size={14} color={C.textLight} />}
            </button>
          </div>
        </div>
        <button onClick={() => amount && fundPwd && setSuccess(true)} style={{ width: "100%", background: (amount && fundPwd) ? `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)` : "#ccc", border: "none", borderRadius: 8, padding: "13px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Withdraw</button>
      </div>
      {/* Task incomplete block — shown if 25 orders not yet done */}
      {showTaskBlockPopup && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: 24 }}>
          <div style={{ background: C.white, borderRadius: 14, padding: 22, maxWidth: 290, width: "100%", textAlign: "center" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg,#fee2e2,#fecaca)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
            }}>
              <AlertCircle size={26} color={C.red} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>Task Not Completed</div>
            <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6, marginBottom: 18 }}>
              Your task is not completed. You can withdraw after submitting <strong>25 orders</strong>.
            </div>
            <button onClick={() => { setShowTaskBlockPopup(false); onBack(); }} style={{
              width: "100%", background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
              border: "none", borderRadius: 8, padding: "11px 0",
              fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
            }}>OK, Got It</button>
          </div>
        </div>
      )}

      {!showTaskBlockPopup && showPwdPopup && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
          <div style={{ background: C.white, borderRadius: 10, padding: 20, maxWidth: 280, width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 6 }}>Withdrawal password</div>
            <div style={{ fontSize: 12, color: C.textMid, marginBottom: 16 }}>Sorry! You have not set a withdrawal password. Please contact customer service to have it set for you.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setShowPwdPopup(false); onBack(); }} style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "9px 0", background: "none", cursor: "pointer", fontSize: 13, color: C.textMid }}>Cancel</button>
              <button onClick={() => setShowPwdPopup(false)} style={{ flex: 1, background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`, border: "none", borderRadius: 7, padding: "9px 0", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Headphones size={13} /> Contact Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Wallet Screen ────────────────────────────────────────────────────────
function AddWalletScreen({ onBack }: { onBack: () => void }) {
  const [walletName, setWalletName] = useState("");
  const [protocol, setProtocol] = useState("TRC-20");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Add E-Wallet" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 68px" }}>
        <div style={{ background: C.white, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
          {[
            { label: "Wallet name", value: walletName, set: setWalletName, placeholder: "Enter wallet name" },
            { label: "Names",       value: name,       set: setName,       placeholder: "Enter your name"   },
            { label: "Wallet address", value: address, set: setAddress,    placeholder: "Enter wallet address" },
          ].map((f, i) => (
            <div key={f.label}>
              {i > 0 && <div style={{ height: 1, background: C.border }} />}
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: C.textLight, marginBottom: 5 }}>{f.label}</div>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "9px 10px", fontSize: 13, color: C.text, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: C.border }} />
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: C.textLight, marginBottom: 7 }}>Virtual Currency Protocol</div>
            <div style={{ display: "flex", gap: 7 }}>
              {["TRC-20", "ERC-20", "BEP-20"].map(n => (
                <button key={n} onClick={() => setProtocol(n)} style={{ flex: 1, border: `1.5px solid ${protocol === n ? C.orange : C.border}`, borderRadius: 7, padding: "7px 0", background: protocol === n ? C.orangeLight : C.white, color: protocol === n ? C.orange : C.textMid, fontWeight: protocol === n ? 700 : 400, fontSize: 11, cursor: "pointer" }}>{n}</button>
              ))}
            </div>
          </div>
        </div>
        <button style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`, border: "none", borderRadius: 8, padding: "13px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", marginBottom: 8 }}>OK</button>
        <button onClick={onBack} style={{ width: "100%", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: C.textMid }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Teams Screen ─────────────────────────────────────────────────────────────
function TeamsScreen({ onBack }: { onBack: () => void }) {
  const [level, setLevel] = useState(1);
  const stats = [
    { label: "Agent Profit",      value: "0.00" },
    { label: "Total recharge",    value: "0.00" },
    { label: "Total withdraw",    value: "0.00" },
    { label: "Order commission",  value: "0.00" },
    { label: "Newcomers",         value: "0"    },
    { label: "Activities number", value: "0"    },
    { label: "Team amount",       value: "0.00" },
    { label: "Team number",       value: "0"    },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`, flexShrink: 0 }}>
        <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 16px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, marginRight: 8 }}><ChevronLeft size={22} /></button>
          <span style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 15, color: "#fff", marginRight: 36 }}>Team</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: 12, padding: "0 20px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>Team amount</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>0.00 <span style={{ fontSize: 12, fontWeight: 400 }}>USDT</span></div>
        </div>
        <div style={{ margin: "0 12px 0", background: "rgba(255,255,255,0.1)", borderRadius: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ padding: "10px 6px", textAlign: "center", borderRight: i % 4 !== 3 ? "1px solid rgba(255,255,255,0.15)" : "none", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.65)", lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 12 }} />
      </div>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex" }}>
          {[1, 2, 3].map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "10px 0", color: level === l ? C.orange : C.textMid, fontWeight: level === l ? 700 : 400, fontSize: 13, borderBottom: level === l ? `2px solid ${C.orange}` : "2px solid transparent" }}>Level {l}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: C.textLight }}>
        <Users size={44} color={C.border} style={{ marginBottom: 10 }} />
        <div style={{ fontSize: 13 }}>No data</div>
      </div>
    </div>
  );
}

// ─── Invite Screen ────────────────────────────────────────────────────────────
function InviteScreen({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const code = "925886";
  const link = `https://qudaizi.com/#/register?code=${code}`;
  const handleCopy = () => { navigator.clipboard.writeText(link).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Invite Friends" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 68px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: C.textMid, marginBottom: 5 }}>My invitation code</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: C.text, letterSpacing: 4, marginBottom: 20 }}>{code}</div>
        <div style={{ width: 180, height: 180, margin: "0 auto 10px", border: `2px solid ${C.border}`, borderRadius: 10, padding: 14, background: C.white, display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 2 }}>
          {Array.from({ length: 81 }, (_, i) => {
            const r = Math.floor(i / 9), col = i % 9;
            const corner = (r < 3 && col < 3) || (r < 3 && col > 5) || (r > 5 && col < 3);
            const dot = [40, 30, 32, 48, 50, 22, 58].includes(i);
            return <div key={i} style={{ background: (corner || dot) ? "#000" : "transparent", borderRadius: 1 }} />;
          })}
        </div>
        <div style={{ fontSize: 11, color: C.orange, marginBottom: 20 }}>Long press to save the QR code</div>
        <div style={{ background: C.white, borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.border}`, textAlign: "left" }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 5 }}>Share link</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ flex: 1, fontSize: 10, color: C.textMid, wordBreak: "break-all" }}>{link}</span>
            <button onClick={handleCopy} style={{ border: "none", background: C.orangeLight, borderRadius: 5, padding: "5px 10px", cursor: "pointer", fontSize: 11, color: C.orange, fontWeight: 600, display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wallet Mgmt Screen ───────────────────────────────────────────────────────
function WalletMgmtScreen({ onBack, onAdd }: { onBack: () => void; onAdd: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Wallet Management" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 68px" }}>
        <div style={{ background: C.white, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
            <div style={{ padding: "5px 14px", background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`, borderRadius: 20, fontSize: 12, color: "#fff", fontWeight: 600 }}>Virtual currency</div>
          </div>
          <button onClick={onAdd} style={{ width: "100%", background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`, border: "none", borderRadius: 7, padding: "10px 0", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Plus size={14} /> Add e-wallet
          </button>
          <div style={{ marginTop: 10, padding: "8px 10px", background: C.orangeLight, borderRadius: 7, fontSize: 11, color: C.orangeDark }}>Tips: Bind at most 1 group accounts.</div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 0", fontSize: 11, color: C.textLight }}>No data</div>
      </div>
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Profile" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: C.white, borderRadius: 8, margin: "10px 12px", overflow: "hidden" }}>
          {[
            { label: "Nickname",  val: "Hanif8989" },
            { label: "Username",  val: "hanif8989" },
            { label: "Phone",     val: "—"         },
            { label: "Email",     val: "—"         },
          ].map((item, i) => (
            <div key={item.label}>
              {i > 0 && <div style={{ height: 1, background: C.border, margin: "0 14px" }} />}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px" }}>
                <span style={{ fontSize: 13, color: C.textMid }}>{item.label}</span>
                <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{item.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Simple Records Screen ────────────────────────────────────────────────────
function SimpleRecordsScreen({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title={title} onBack={onBack} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: C.textLight }}>
        <FileText size={44} color={C.border} style={{ marginBottom: 10 }} />
        <div style={{ fontSize: 13 }}>No records yet</div>
      </div>
    </div>
  );
}

// ─── Setting Screen ───────────────────────────────────────────────────────────
function SettingScreen({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Settings" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 68px" }}>
        <div style={{ background: C.white, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
          {["Language", "Notification", "Privacy Policy", "Terms of Service"].map((item, i, arr) => (
            <div key={item}>
              {i > 0 && <div style={{ height: 1, background: C.border, margin: "0 14px" }} />}
              <button style={{ width: "100%", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", cursor: "pointer" }}>
                <span style={{ fontSize: 13, color: C.text }}>{item}</span>
                <ChevronRight size={14} color={C.textLight} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={{ width: "100%", background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`, border: "none", borderRadius: 8, padding: "13px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL  (admin-only: manage VIP accounts and combo arrangements)
// ═══════════════════════════════════════════════════════════════════════════════
interface MockUser {
  id: string;
  username: string;
  balance: string;
  isVip: boolean;
  combos: number[];
  sessionApproved: boolean;
  frozenAmount: number;
}

function AdminPanel({
  onBack,
  users,
  onToggleVip,
  onSaveCombos,
  onGrantApproval,
  onSetFrozen,
  onResetPassword,
}: {
  onBack: () => void;
  users: MockUser[];
  onToggleVip: (id: string) => void;
  onSaveCombos: (id: string, combos: number[]) => void;
  onGrantApproval: (id: string) => void;
  onSetFrozen: (id: string, amount: number) => void;
  onResetPassword: (id: string) => void;
}) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [comboInput, setComboInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [frozenInputs, setFrozenInputs] = useState<Record<string, string>>({});
  const [resetDoneId, setResetDoneId] = useState<string | null>(null);

  const selectedUser = users.find(u => u.id === selectedUserId);

  useEffect(() => {
    if (selectedUser) {
      setComboInput(selectedUser.combos.join(", "));
      setSaved(false);
    }
  }, [selectedUserId]);

  const handleSaveCombos = () => {
    if (!selectedUser) return;
    const parsed = comboInput.split(/[\s,]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 25);
    onSaveCombos(selectedUser.id, parsed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.wineDark} 0%, #2d0a15 100%)`, flexShrink: 0 }}>
        <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 16px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, marginRight: 8 }}><ChevronLeft size={22} /></button>
          <span style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 15, color: "#fff", marginRight: 36, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Shield size={15} /> Admin Panel
          </span>
        </div>
        <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <Crown size={13} color={C.gold} />
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>Admin Access Only</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 20px" }}>

        {/* Users list */}
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 8, paddingLeft: 2 }}>User Management</div>
        {users.map(u => (
          <div key={u.id} style={{
            background: C.white, borderRadius: 10, padding: "12px 14px", marginBottom: 8,
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            border: selectedUserId === u.id ? `1.5px solid ${C.orange}` : "1.5px solid transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: u.isVip ? `linear-gradient(135deg, ${C.gold}, #d97706)` : `${C.wine}20`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {u.isVip ? <Crown size={18} color="#fff" /> : <User size={18} color={C.wine} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{u.username}</span>
                  {u.isVip && <VipBadge isVip />}
                </div>
                <div style={{ fontSize: 11, color: C.textLight }}>Balance: {u.balance} USDT</div>
              </div>
              {/* VIP Toggle */}
              <button onClick={() => onToggleVip(u.id)} style={{
                borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700,
                background: u.isVip ? `${C.gold}20` : `linear-gradient(135deg, ${C.gold}, #d97706)`,
                color: u.isVip ? C.gold : "#fff",
                border: u.isVip ? `1px solid ${C.gold}` : "none",
              } as React.CSSProperties}>
                {u.isVip ? "Revoke VIP" : "Make VIP"}
              </button>
            </div>

            {/* Session approval + account controls */}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={12} color={u.sessionApproved ? C.green : C.textLight} />
                  <span style={{ fontSize: 11, color: C.text }}>
                    Session: {u.sessionApproved ? <span style={{ color: C.green, fontWeight: 700 }}>Approved</span> : <span style={{ color: C.textMid, fontWeight: 600 }}>Not approved</span>}
                  </span>
                </div>
                <button onClick={() => onGrantApproval(u.id)} disabled={u.sessionApproved} style={{
                  border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700,
                  cursor: u.sessionApproved ? "default" : "pointer",
                  background: u.sessionApproved ? `${C.green}18` : `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
                  color: u.sessionApproved ? C.green : "#fff",
                }}>
                  {u.sessionApproved ? "✓ Granted" : "Grant Session"}
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Snowflake size={12} color={u.frozenAmount > 0 ? C.red : C.textLight} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: C.text, flexShrink: 0 }}>Freeze:</span>
                <input
                  value={frozenInputs[u.id] ?? String(u.frozenAmount)}
                  onChange={e => setFrozenInputs(prev => ({ ...prev, [u.id]: e.target.value }))}
                  placeholder="0.00"
                  style={{ width: 64, border: `1.5px solid ${C.border}`, borderRadius: 6, padding: "4px 6px", fontSize: 11, color: C.text, outline: "none" }}
                />
                <button onClick={() => onSetFrozen(u.id, parseFloat(frozenInputs[u.id] ?? "0") || 0)} style={{
                  border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer",
                  background: `${C.red}15`, color: C.red,
                }}>Apply</button>
                {u.frozenAmount > 0 && <span style={{ fontSize: 10, color: C.red, fontWeight: 600 }}>{u.frozenAmount.toFixed(2)} USDT frozen</span>}
              </div>

              <button onClick={() => { onResetPassword(u.id); setResetDoneId(u.id); setTimeout(() => setResetDoneId(v => v === u.id ? null : v), 2000); }} style={{
                border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 0", fontSize: 11, fontWeight: 600, cursor: "pointer",
                background: resetDoneId === u.id ? `${C.green}12` : "none",
                color: resetDoneId === u.id ? C.green : C.textMid,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}>
                {resetDoneId === u.id ? <><CheckCircle2 size={12} /> Password reset sent</> : <><KeyRound size={12} /> Reset Password</>}
              </button>
            </div>

            {/* Expand to edit combos */}
            {u.isVip && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Zap size={13} color={C.purple} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.purple }}>Custom Combo Positions</span>
                  </div>
                  <button onClick={() => setSelectedUserId(v => v === u.id ? null : u.id)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 11, color: C.orange, fontWeight: 600 }}>
                    {selectedUserId === u.id ? "▲ Close" : "▼ Edit"}
                  </button>
                </div>

                {/* Current combos */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {u.combos.map(pos => (
                    <span key={pos} style={{ background: `${C.purple}20`, border: `1px solid ${C.purple}40`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.purple, fontWeight: 700 }}>#{pos}</span>
                  ))}
                  {u.combos.length === 0 && <span style={{ fontSize: 10, color: C.textLight }}>Default positions (6, 12, 18, 24)</span>}
                </div>

                {selectedUserId === u.id && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 10, color: C.textLight, marginBottom: 5 }}>Enter order positions (1–25) separated by commas:</div>
                    <input
                      value={comboInput}
                      onChange={e => setComboInput(e.target.value)}
                      placeholder="e.g. 5, 10, 15, 20"
                      style={{ width: "100%", border: `1.5px solid ${C.purple}`, borderRadius: 7, padding: "8px 10px", fontSize: 12, color: C.text, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
                    />
                    <button onClick={handleSaveCombos} style={{
                      width: "100%", border: "none", borderRadius: 7, padding: "9px 0",
                      background: saved ? `linear-gradient(135deg, ${C.green}, #16a34a)` : `linear-gradient(135deg, ${C.purple}, #7c3aed)`,
                      color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      transition: "background 300ms ease",
                    }}>
                      {saved ? <><CheckCircle2 size={13} /> Saved!</> : "Save Combo Positions"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div style={{ background: "#fff8e7", border: `1px solid ${C.orange}30`, borderRadius: 8, padding: "10px 12px", marginTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, marginBottom: 3 }}>Admin Instructions</div>
          <div style={{ fontSize: 10, color: C.textMid, lineHeight: 1.6 }}>
            • Make a user VIP to enable custom combo arrangements.<br />
            • Set combo positions (which order numbers trigger combos) per VIP user.<br />
            • Regular users always get the default positions: 6, 12, 18, 24.<br />
            • Only admins can access this panel.
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, overflowY: "auto" }}>
      <div style={{ background: `linear-gradient(160deg, ${C.wine} 0%, ${C.wineDark} 55%, ${C.bg} 100%)`, padding: "30px 24px 48px", textAlign: "center", flexShrink: 0 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.4)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PentagonLogo size={44} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 3 }}>Wallet Login</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Secure · Fast · Reliable</div>
      </div>
      <div style={{ margin: "-22px 20px 20px", background: C.white, borderRadius: 14, padding: "20px 18px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 5 }}>Username</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, border: `1.5px solid ${C.border}`, borderRadius: 9, padding: "9px 12px" }}>
            <User size={14} color={C.textLight} />
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: C.text, background: "transparent" }} />
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 5 }}>Password</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, border: `1.5px solid ${C.border}`, borderRadius: 9, padding: "9px 12px" }}>
            <Lock size={14} color={C.textLight} />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" type={show ? "text" : "password"}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: C.text, background: "transparent" }} />
            <button onClick={() => setShow(v => !v)} style={{ border: "none", background: "none", cursor: "pointer" }}>
              {show ? <EyeOff size={14} color={C.textLight} /> : <Eye size={14} color={C.textLight} />}
            </button>
          </div>
        </div>
        <button onClick={onLogin} style={{
          width: "100%",
          background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
          border: "none", borderRadius: 9, padding: "13px 0",
          fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
          boxShadow: `0 4px 16px rgba(245,161,0,0.4)`, marginBottom: 14,
        }}>Login</button>
        <div style={{ textAlign: "center", fontSize: 12, color: C.textMid, marginBottom: 8 }}>
          Don't have an account?{" "}
          <span onClick={onRegister} style={{ color: C.orange, fontWeight: 600, cursor: "pointer" }}>Register</span>
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: C.textMid }}>
          <span onClick={() => setShowForgot(true)} style={{ color: C.wine, fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
        </div>
      </div>

      {showForgot && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 24 }}>
          <div style={{ background: C.white, borderRadius: 12, padding: 20, maxWidth: 280, width: "100%", textAlign: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${C.wine}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <Headphones size={20} color={C.wine} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 6 }}>Forgot Password?</div>
            <div style={{ fontSize: 12, color: C.textMid, marginBottom: 16, lineHeight: 1.5 }}>
              For your account's security, passwords cannot be reset here. Please contact customer service for help with your account.
            </div>
            <button onClick={() => setShowForgot(false)} style={{
              width: "100%", background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
              border: "none", borderRadius: 8, padding: "10px 0",
              fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
            }}>OK, Got It</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Register Screen ──────────────────────────────────────────────────────────
function RegisterScreen({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("code") ?? p.get("ref") ?? p.get("invite");
      if (c && c.trim().length >= 4) { setInviteCode(c.trim()); setAutoFilled(true); }
    } catch { /* ignore */ }
  }, []);
  const pwdMismatch = confirm.length > 0 && pwd !== confirm;
  const codeOk      = inviteCode.trim().length >= 4;
  const canSubmit   = username.trim().length >= 3 && pwd.length >= 6 && pwd === confirm && codeOk;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, position: "relative", overflowY: "auto" }}>
      <div style={{ background: `linear-gradient(160deg, ${C.wine} 0%, ${C.wineDark} 55%, ${C.bg} 100%)`, padding: "28px 24px 44px", textAlign: "center", flexShrink: 0 }}>
        <button onClick={onBack} style={{ position: "absolute", top: 28, left: 14, background: "rgba(255,255,255,0.15)", border: "none", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={18} color="#fff" />
        </button>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.4)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PentagonLogo size={42} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 3 }}>Create Account</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Invite code required to register</div>
      </div>
      <div style={{ margin: "-20px 18px 18px", background: C.white, borderRadius: 14, padding: "18px 16px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
        {autoFilled && (
          <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}40`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={14} color={C.green} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: C.text }}><strong>Invite link detected.</strong> Referral code applied.</span>
          </div>
        )}
        {[
          { label: "Username", value: username, set: setUsername, type: "text", placeholder: "Min 3 chars", icon: <User size={13} color={C.textLight} /> },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 11 }}>
            <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>{f.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, border: `1.5px solid ${C.border}`, borderRadius: 9, padding: "9px 12px" }}>
              {f.icon}
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} type={f.type} style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: C.text, background: "transparent" }} />
            </div>
          </div>
        ))}
        {[
          { label: "Password", value: pwd, set: setPwd, show: showPwd, toggle: () => setShowPwd(v => !v), placeholder: "Min 6 chars", icon: <Lock size={13} color={C.textLight} />, error: false },
          { label: "Confirm Password", value: confirm, set: setConfirm, show: showConf, toggle: () => setShowConf(v => !v), placeholder: "Re-enter password", icon: <Shield size={13} color={C.textLight} />, error: pwdMismatch },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 11 }}>
            <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>{f.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, border: `1.5px solid ${f.error ? C.red : C.border}`, borderRadius: 9, padding: "9px 12px" }}>
              {f.icon}
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} type={f.show ? "text" : "password"} style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: C.text, background: "transparent" }} />
              <button onClick={f.toggle} style={{ border: "none", background: "none", cursor: "pointer" }}>
                {f.show ? <EyeOff size={13} color={C.textLight} /> : <Eye size={13} color={C.textLight} />}
              </button>
            </div>
            {f.error && <div style={{ fontSize: 10, color: C.red, marginTop: 3 }}>Passwords do not match</div>}
          </div>
        ))}
        <div style={{ marginBottom: 11 }}>
          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>Invite Code <span style={{ color: C.red }}>*</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, border: `1.5px solid ${autoFilled ? C.green : C.border}`, borderRadius: 9, padding: "9px 12px", background: autoFilled ? `${C.green}08` : "transparent" }}>
            <Users size={13} color={autoFilled ? C.green : C.textLight} />
            <input value={inviteCode} onChange={e => !autoFilled && setInviteCode(e.target.value)} placeholder="Enter invite code" type="text" readOnly={autoFilled}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: autoFilled ? C.textMid : C.text, background: "transparent" }} />
            {autoFilled && <Lock size={12} color={C.green} />}
          </div>
        </div>
        {!autoFilled && (
          <button onClick={() => { setInviteCode("925886"); setAutoFilled(true); }} style={{
            width: "100%", border: `1.5px dashed ${C.orange}60`, borderRadius: 7, padding: "7px 0", marginBottom: 12,
            background: `${C.orange}08`, cursor: "pointer", fontSize: 11, color: C.orange, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            <Bell size={12} /> Simulate: Join via Invite Link
          </button>
        )}
        <button onClick={() => canSubmit && onDone()} style={{
          width: "100%",
          background: canSubmit ? `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)` : C.border,
          border: "none", borderRadius: 9, padding: "13px 0",
          fontSize: 14, fontWeight: 700, color: canSubmit ? "#fff" : C.textLight,
          cursor: canSubmit ? "pointer" : "not-allowed",
          boxShadow: canSubmit ? `0 4px 16px rgba(245,161,0,0.4)` : "none",
        }}>Create Account</button>
        <div style={{ textAlign: "center", fontSize: 12, color: C.textMid, marginTop: 12 }}>
          Already have an account?{" "}
          <span onClick={onBack} style={{ color: C.orange, fontWeight: 600, cursor: "pointer" }}>Login</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════════
function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const items: { key: Tab; label: string; icon: (a: boolean) => React.ReactNode }[] = [
    { key: "home",    label: "Home",    icon: a => <Home          size={20} color={a ? C.orange : C.textLight} /> },
    { key: "service", label: "Service", icon: a => <Headphones    size={20} color={a ? C.orange : C.textLight} /> },
    { key: "menu",    label: "Menu",    icon: a => <ShoppingBag   size={20} color={a ? C.orange : C.textLight} /> },
    { key: "record",  label: "Record",  icon: a => <ClipboardList size={20} color={a ? C.orange : C.textLight} /> },
    { key: "mine",    label: "Mine",    icon: a => <User          size={20} color={a ? C.orange : C.textLight} /> },
  ];
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 50 }}>
      {items.map(item => {
        const active = tab === item.key;
        return (
          <button key={item.key} onClick={() => onTab(item.key)} style={{ flex: 1, border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
            {item.icon(active)}
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? C.orange : C.textLight }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
const PLATFORM_PRODUCTS: Record<string, OrderProduct> = {
  amazon:     { name: "Amazon Marketplace — Grab Order Product",     unitPrice: "100.00", qty: 1, accentColor: "#FF9900", icon: "📦",  imageUrl: PRODUCT_IMAGES.amazon     },
  alibaba:    { name: "Alibaba Global — Grab Order Product",         unitPrice: "100.00", qty: 1, accentColor: "#FF6A00", icon: "🛍️",  imageUrl: PRODUCT_IMAGES.alibaba    },
  aliexpress: { name: "AliExpress — Grab Order Product",             unitPrice: "100.00", qty: 1, accentColor: "#e62e04", icon: "🏪",  imageUrl: PRODUCT_IMAGES.aliexpress },
  combo:      { name: "Combo Bundle — Premium Selection",            unitPrice: "520.00", qty: 1, accentColor: "#8b5cf6", icon: "💎",  imageUrl: PRODUCT_IMAGES.combo      },
};
const PLATFORM_NAMES: Record<string, string> = { amazon: "Amazon", alibaba: "Alibaba", aliexpress: "Aliexpress" };

function nowTimestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Initial mock users for admin panel
const INITIAL_USERS: MockUser[] = [
  { id: "u1", username: "Hanif8989",  balance: "1,248.60", isVip: false, combos: [], sessionApproved: false, frozenAmount: 0 },
  { id: "u2", username: "Sarah_456",  balance: "4,500.00", isVip: false, combos: [], sessionApproved: false, frozenAmount: 0 },
  { id: "u3", username: "Trader_Pro", balance: "12,000.00", isVip: false, combos: [], sessionApproved: false, frozenAmount: 0 },
];

export default function App() {
  const [loggedIn,        setLoggedIn]        = useState(false);
  const [showRegister,    setShowRegister]    = useState(false);
  const [tab,             setTab]             = useState<Tab>("home");
  const [subPage,         setSubPage]         = useState<SubPage | null>(null);
  const [taskPlatform,    setTaskPlatform]    = useState("amazon");
  const [orders,          setOrders]          = useState<OrderRecord[]>(MOCK_ORDERS);
  const [loginCount,      setLoginCount]      = useState(0);
  const [isVip,           setIsVip]           = useState(false);
  const [users,           setUsers]           = useState<MockUser[]>(INITIAL_USERS);
  const [accountBalance,  setAccountBalance]  = useState(50); // Start in Amazon tier
  const [tierPopup,       setTierPopup]       = useState<"alibaba" | "aliexpress" | null>(null);
  const [canWithdraw,     setCanWithdraw]     = useState(false); // unlocks after 25 orders; resets each new session
  const [sessionApproved, setSessionApproved] = useState(false); // admin/customer-service grants permission to work
  const [frozenAmount,    setFrozenAmount]    = useState(0);     // default 0; set by admin if account is frozen

  // Secret admin tap counter (tap logo 5 times to access admin)
  const [adminTaps, setAdminTaps]   = useState(0);
  const [username,  setUsername]    = useState("Hanif8989");

  // Get current user's combos from admin panel
  const currentUser = users.find(u => u.username === username);
  const userCombos  = currentUser?.combos ?? [];

  // Keep local session/frozen state in sync with the current user's admin-set record
  useEffect(() => {
    if (currentUser) {
      setSessionApproved(currentUser.sessionApproved);
      setFrozenAmount(currentUser.frozenAmount);
    }
  }, [currentUser?.sessionApproved, currentUser?.frozenAmount]);

  const goSub  = (page: SubPage) => setSubPage(page);
  const goBack = () => setSubPage(null);
  const handleTab = (t: Tab) => { setTab(t); setSubPage(null); };

  const handleLogin = () => {
    setLoggedIn(true);
    setLoginCount(c => c + 1);
  };

  const handleAddOrder = (platform: string, amount: string, commission: string, isCombo = false) => {
    const product = isCombo ? PLATFORM_PRODUCTS.combo : (PLATFORM_PRODUCTS[platform] ?? PLATFORM_PRODUCTS.amazon);
    const income = parseFloat(amount) + parseFloat(commission);
    const expectedIncome = income.toFixed(2);
    const newOrder: OrderRecord = {
      id: `TR${Date.now()}`,
      platform: PLATFORM_NAMES[platform] ?? platform,
      merchantColor: product.accentColor,
      amount,
      commission,
      expectedIncome,
      time: nowTimestamp(),
      status: "complete",
      isCombo,
      products: [{ ...product, unitPrice: amount }],
    };
    setOrders(prev => [newOrder, ...prev]);

    // Update balance and check tier crossing
    setAccountBalance(prev => {
      const oldTier = getBalanceTier(prev);
      const newBal  = prev + income;
      const newTier = getBalanceTier(newBal);
      if (oldTier !== newTier) {
        if (newTier === "alibaba")    setTimeout(() => setTierPopup("alibaba"),    400);
        if (newTier === "aliexpress") setTimeout(() => setTierPopup("aliexpress"), 400);
      }
      return newBal;
    });
  };

  const handleSubmitIncomplete = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "complete" as OrderStatus } : o));
  };

  const handleToggleVip = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const nowVip = !u.isVip;
      // Sync isVip state if this is the current user
      if (u.username === username) setIsVip(nowVip);
      return { ...u, isVip: nowVip, combos: nowVip ? u.combos : [] };
    }));
  };

  const handleSaveCombos = (id: string, combos: number[]) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, combos } : u));
  };

  // Admin/customer-service grants permission for the user to start their next 25-order session
  const handleGrantApproval = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, sessionApproved: true } : u));
  };

  // Admin freezes/unfreezes funds on a user's account
  const handleSetFrozen = (id: string, amount: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, frozenAmount: amount } : u));
  };

  // Admin-only password reset (simulation — no self-service reset exists for users)
  const handleResetPassword = (_id: string) => {
    // Simulated: in a real backend this would trigger a temp password / reset email
  };

  // Called once the user finishes their 25th order — unlock withdrawal, and require a
  // fresh admin/customer-service approval before the next session can begin
  const handleSessionComplete = () => {
    setCanWithdraw(true);
    if (currentUser) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, sessionApproved: false } : u));
    }
  };

  const renderContent = () => {
    if (subPage === "deposit")          return <DepositScreen   onBack={goBack} onQR={() => setSubPage("deposit-qr")} />;
    if (subPage === "deposit-qr")       return <DepositQRScreen  onBack={() => setSubPage("deposit")} />;
    if (subPage === "withdraw")         return <WithdrawScreen   onBack={goBack} onAddWallet={() => setSubPage("add-wallet")} canWithdraw={canWithdraw} />;
    if (subPage === "add-wallet")       return <AddWalletScreen  onBack={() => setSubPage("withdraw")} />;
    if (subPage === "teams")            return <TeamsScreen      onBack={goBack} />;
    if (subPage === "invite")           return <InviteScreen     onBack={goBack} />;
    if (subPage === "wallet-mgmt")      return <WalletMgmtScreen onBack={goBack} onAdd={() => setSubPage("add-wallet")} />;
    if (subPage === "profile")          return <ProfileScreen    onBack={goBack} />;
    if (subPage === "deposit-records")  return <SimpleRecordsScreen title="Deposit Records"    onBack={goBack} />;
    if (subPage === "withdraw-records") return <SimpleRecordsScreen title="Withdrawal Records" onBack={goBack} />;
    if (subPage === "setting")          return <SettingScreen    onBack={goBack} onLogout={() => setLoggedIn(false)} />;
    if (subPage === "admin")            return (
      <AdminPanel
        onBack={goBack}
        users={users}
        onToggleVip={handleToggleVip}
        onSaveCombos={handleSaveCombos}
        onGrantApproval={handleGrantApproval}
        onSetFrozen={handleSetFrozen}
        onResetPassword={handleResetPassword}
      />
    );
    if (subPage === "task")             return (
      <TaskDetailScreen
        platform={taskPlatform}
        onBack={goBack}
        onSubmitOrder={handleAddOrder}
        loginCount={loginCount}
        isVip={isVip}
        adminCombos={userCombos}
        accountBalance={accountBalance}
        sessionApproved={sessionApproved}
        frozenAmount={frozenAmount}
        onSessionComplete={handleSessionComplete}
        onContactService={() => { setSubPage(null); setTab("service"); }}
      />
    );

    if (tab === "home")    return <HomeScreen    onNavigate={goSub} />;
    if (tab === "service") return <ServiceScreen />;
    if (tab === "menu")    return (
      <MenuScreen
        accountBalance={accountBalance}
        onTask={p => {
          setTaskPlatform(p);
          setSubPage("task");
        }}
      />
    );
    if (tab === "record")  return <RecordScreen  orders={orders} onSubmitIncomplete={handleSubmitIncomplete} />;
    if (tab === "mine")    return <MineScreen    onNavigate={goSub} isVip={isVip} username={username} />;
    return null;
  };

  // Admin button floating (visible after 5 logo taps — simulated via a small gear icon in top corner)
  const [showAdminHint, setShowAdminHint] = useState(false);
  useEffect(() => {
    if (adminTaps >= 5) { setShowAdminHint(false); }
  }, [adminTaps]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    }}>
      {/* Phone frame — compact size to avoid scrolling */}
      <div style={{
        width: 375,
        height: "min(720px, 97vh)",
        background: C.bg, borderRadius: 36, overflow: "hidden",
        boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.08)",
        position: "relative", display: "flex", flexDirection: "column",
        border: "5px solid #111",
      }}>
        {/* Status bar */}
        <div style={{
          height: 24, background: C.white, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 18px", fontSize: 10, fontWeight: 600, color: C.text,
        }}>
          <span>9:41</span>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <div style={{ width: 14, height: 7, border: `1.5px solid ${C.text}`, borderRadius: 2, display: "flex", alignItems: "center", padding: "0 1px" }}>
              <div style={{ width: "70%", height: "100%", background: C.text, borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* Secret admin access button (top-right, subtle) */}
        {loggedIn && (
          <div style={{ position: "absolute", top: 24, right: 0, zIndex: 100 }}>
            <button
              onClick={() => {
                const t = adminTaps + 1;
                setAdminTaps(t);
                if (t >= 5) { setAdminTaps(0); goSub("admin"); }
                else { setShowAdminHint(true); setTimeout(() => setShowAdminHint(false), 1500); }
              }}
              style={{
                width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.01,
              }}
            >
              <Shield size={14} color={C.textLight} />
            </button>
          </div>
        )}

        {/* Admin tap hint */}
        {showAdminHint && (
          <div style={{
            position: "absolute", top: 54, right: 8, zIndex: 101,
            background: "rgba(0,0,0,0.75)", borderRadius: 6, padding: "4px 8px",
            fontSize: 10, color: "#fff",
          }}>
            Admin: {adminTaps}/5 taps
          </div>
        )}

        {/* App content */}
        {!loggedIn ? (
          showRegister ? (
            <RegisterScreen onDone={() => { setShowRegister(false); handleLogin(); }} onBack={() => setShowRegister(false)} />
          ) : (
            <LoginScreen onLogin={handleLogin} onRegister={() => setShowRegister(true)} />
          )
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
            {renderContent()}
            {!subPage && <BottomNav tab={tab} onTab={handleTab} />}
          </div>
        )}

        {/* Tier Upgrade Popup — shown when balance crosses a threshold */}
        {tierPopup && (
          <TierUpgradePopup
            tier={tierPopup}
            onClose={() => setTierPopup(null)}
          />
        )}
      </div>
    </div>
  );
}
