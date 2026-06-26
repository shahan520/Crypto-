import React, { useState, useEffect } from "react";
import {
  Home, Headphones, ShoppingBag, ClipboardList, User,
  ChevronRight, ChevronLeft, Copy, Check, X,
  Users, FileText, BarChart2, Mail, ArrowDownToLine,
  ArrowUpFromLine, Lock, Eye, EyeOff, Globe, LogOut,
  MessageCircle, HelpCircle, Bell, Plus, Shield,
  CheckCircle2, Clock, AlertCircle,
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
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "home" | "service" | "menu" | "record" | "mine";
type SubPage =
  | "deposit" | "deposit-qr"
  | "withdraw" | "add-wallet"
  | "teams" | "invite" | "wallet-mgmt"
  | "profile" | "deposit-records" | "withdraw-records"
  | "setting" | "task";

const BASE = import.meta.env.BASE_URL;

// ─── Pentagon Flower Logo SVG ─────────────────────────────────────────────────
function PentagonLogo({ size = 40 }: { size?: number }) {
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
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: "block" }}>
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
function VipBadge({ level = 0 }: { level?: number }) {
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
      height: 54,
      background: dark
        ? `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`
        : C.white,
      display: "flex", alignItems: "center", padding: "0 16px",
      borderBottom: dark ? "none" : `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: dark ? "#fff" : C.text, cursor: "pointer", padding: 4, marginRight: 8 }}>
        <ChevronLeft size={24} />
      </button>
      <span style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 16, color: dark ? "#fff" : C.text, marginRight: 36 }}>
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
      background: C.white, margin: "0 12px 10px",
      borderRadius: 8, padding: "9px 12px",
      display: "flex", alignItems: "center", gap: 8,
      border: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: C.orange,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <User size={15} color="#fff" />
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ fontSize: 12, color: C.textMid, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {items[idx]}
        </div>
      </div>
      <Bell size={14} color={C.orange} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function HomeScreen({ onNavigate }: { onNavigate: (sub: SubPage) => void }) {
  const quickActions = [
    { label: "Recharge",   icon: <ArrowDownToLine size={22} color={C.orange} />, page: "deposit"  as SubPage },
    { label: "Withdrawal", icon: <ArrowUpFromLine  size={22} color={C.orange} />, page: "withdraw" as SubPage },
    { label: "Teams",      icon: <Users            size={22} color={C.orange} />, page: "teams"    as SubPage },
    { label: "Invitation", icon: <Mail             size={22} color={C.orange} />, page: "invite"   as SubPage },
  ];
  const platformCards = [
    { title: "Platform profile",    desc: "About our platform",     img: `${BASE}a1.png`, color: "#e8f4fd" },
    { title: "Platform rules",      desc: "Policies & rules",       img: `${BASE}a2.png`, color: "#fef3e2" },
    { title: "Win-win cooperation", desc: "Partner with us",        img: `${BASE}a3.png`, color: "#f0fdf4" },
    { title: "Instructions for use",desc: "How to get started",     img: `${BASE}a4.png`, color: "#fdf4ff" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
      {/* Top bar */}
      <div style={{
        background: C.white, padding: "10px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PentagonLogo size={34} />
          <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Wallet</span>
        </div>
        <Bell size={22} color={C.textMid} />
      </div>

      {/* Quick actions */}
      <div style={{
        background: C.white, margin: "10px 12px", borderRadius: 12,
        padding: "16px 8px",
        display: "flex", justifyContent: "space-around",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        {quickActions.map(a => (
          <button key={a.label} onClick={() => onNavigate(a.page)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: C.orangeLight, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{a.icon}</div>
            <span style={{ fontSize: 12, color: C.textMid }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Ticker */}
      <ActivityTicker />

      {/* Platform introduction */}
      <div style={{ padding: "4px 12px 8px" }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 10 }}>
          Platform introduction
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {platformCards.map(card => (
            <div key={card.title} style={{
              borderRadius: 10, overflow: "hidden", background: C.white,
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)", cursor: "pointer",
            }}>
              <div style={{ height: 90, background: card.color, overflow: "hidden" }}>
                <img src={card.img} alt={card.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{card.title}</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{card.desc}</div>
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
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
      <div style={{
        background: "linear-gradient(135deg, #f7d4be 0%, #f5b8d2 100%)",
        padding: "28px 20px 40px", textAlign: "center",
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#5a2d3e", marginBottom: 4 }}>
          Customer Service Center
        </div>
        <div style={{ fontSize: 12, color: "#7a4a58", marginBottom: 2 }}>Online customer service time (12:00–24:00)</div>
        <div style={{ fontSize: 12, color: "#7a4a58" }}>(07:00–23:00 UK)</div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Headphones size={48} color="#c85a7a" />
          </div>
        </div>
      </div>
      <div style={{ background: C.white, margin: "12px 12px 0", borderRadius: 10, overflow: "hidden" }}>
        {[
          { icon: <MessageCircle size={18} color={C.orange} />, label: "Online customer service" },
          { icon: <HelpCircle    size={18} color={C.orange} />, label: "Help" },
        ].map((item, i) => (
          <div key={item.label}>
            {i > 0 && <div style={{ height: 1, background: C.border, margin: "0 16px" }} />}
            <button style={{
              width: "100%", background: "none", border: "none",
              display: "flex", alignItems: "center", gap: 12,
              padding: "16px 16px", cursor: "pointer",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: C.orangeLight,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{item.icon}</div>
              <span style={{ flex: 1, textAlign: "left", fontSize: 14, color: C.text }}>{item.label}</span>
              <ChevronRight size={16} color={C.textLight} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ padding: 16, textAlign: "center", fontSize: 12, color: C.textLight }}>
        We are always here to help you
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MENU SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
type VipLevel = "all" | "1" | "2" | "3";

function MenuScreen({ onTask }: { onTask: (platform: string) => void }) {
  const [filter, setFilter] = useState<VipLevel>("all");

  const platforms = [
    { id: "amazon",     name: "Amazon",     iconColor: "#FF9900", vip: 1, range: "20 – 498 USDT",  commission: "4%"  },
    { id: "alibaba",    name: "Alibaba",    iconColor: "#FF6A00", vip: 2, range: "499 – 899 USDT", commission: "8%"  },
    { id: "aliexpress", name: "Aliexpress", iconColor: "#e74c3c", vip: 3, range: "≥ 899 USDT",     commission: "12%" },
  ];

  const tabs: { key: VipLevel; label: string }[] = [
    { key: "all", label: "All" },
    { key: "1",   label: "VIP 1" },
    { key: "2",   label: "VIP 2" },
    { key: "3",   label: "VIP 3" },
  ];

  const filtered = filter === "all" ? platforms : platforms.filter(p => String(p.vip) === filter);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingBottom: 80 }}>
      {/* Header + tabs */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "14px 16px 0" }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 12 }}>Menu</div>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{
              border: "none", cursor: "pointer",
              padding: "6px 14px",
              background: filter === t.key ? C.orange : "transparent",
              color: filter === t.key ? "#fff" : C.textMid,
              borderRadius: 20,
              fontSize: 13, fontWeight: filter === t.key ? 600 : 400,
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ height: 1, background: C.border, marginTop: 10 }} />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
        {filtered.map(p => (
          <button key={p.id} onClick={() => onTask(p.id)} style={{
            width: "100%", background: C.white, border: "none", borderRadius: 12,
            padding: "14px 14px", marginBottom: 10, cursor: "pointer",
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            display: "flex", alignItems: "center", gap: 12, textAlign: "left",
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 10,
              background: C.orangeLight, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <ShoppingBag size={22} color={p.iconColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{p.name}</span>
                <VipBadge level={p.vip} />
              </div>
              <div style={{ fontSize: 12, color: C.textMid }}>Available balance: {p.range}</div>
              <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>
                Commissions:{" "}
                <span style={{ color: C.red, fontWeight: 700, fontSize: 13, background: "#fee2e2", padding: "1px 6px", borderRadius: 4 }}>
                  {p.commission}
                </span>
              </div>
            </div>
            <ChevronRight size={16} color={C.textLight} />
          </button>
        ))}
        <div style={{ textAlign: "center", fontSize: 12, color: C.textLight, paddingTop: 4 }}>No more</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK DETAIL SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function TaskDetailScreen({
  platform,
  onBack,
  onSubmitOrder,
}: {
  platform: string;
  onBack: () => void;
  onSubmitOrder: (platform: string, amount: string, commission: string) => void;
}) {
  const [grabbed, setGrabbed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const names: Record<string, string> = { amazon: "Amazon", alibaba: "Alibaba", aliexpress: "Aliexpress" };
  const rates: Record<string, string> = { amazon: "4", alibaba: "8", aliexpress: "12" };

  const stats = [
    { label: "Today's Times",               value: "0"    },
    { label: "Today's commission",           value: "0.00" },
    { label: "Cash gap between tasks",       value: "0.00" },
    { label: "Yesterday's buy commission",   value: "0.00" },
    { label: "Yesterday's team commission",  value: "0.00" },
    { label: "Money frozen in accounts",     value: "0.00" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      {/* Orange header */}
      <div style={{ background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`, flexShrink: 0 }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", padding: "0 16px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, marginRight: 8 }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 16, color: "#fff", marginRight: 36 }}>
            {names[platform]}
          </span>
        </div>
        <div style={{ padding: "10px 20px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Account Balance</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>
            0 <span style={{ fontSize: 14, fontWeight: 400 }}>USDT</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
            Commission Rate: <strong>{rates[platform]}%</strong>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        {/* Stats grid */}
        <div style={{ background: C.white, borderRadius: 12, marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                padding: "14px 16px",
                borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
                borderRight: i % 2 === 0 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          /* ── Success state ── */
          <div style={{
            background: C.white, borderRadius: 12, padding: "28px 20px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)", textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#dcfce7",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
            }}>
              <CheckCircle2 size={36} color={C.green} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>Order Submitted!</div>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 20, lineHeight: 1.5 }}>
              Your order has been confirmed and added to<br />your Completed Orders history.
            </div>
            <button onClick={onBack} style={{
              width: "100%",
              background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
              border: "none", borderRadius: 10, padding: "14px 0",
              fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
            }}>Done</button>
          </div>
        ) : !grabbed ? (
          <button onClick={() => setGrabbed(true)} style={{
            width: "100%",
            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
            border: "none", borderRadius: 10, padding: "16px 0",
            fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer",
            boxShadow: `0 4px 16px rgba(245,161,0,0.4)`,
          }}>Grab the order immediately</button>
        ) : (
          <div style={{ background: C.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <CheckCircle2 size={20} color={C.green} />
              <span style={{ fontWeight: 600, color: C.text }}>Order grabbed!</span>
            </div>
            <div style={{ background: C.bg, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: C.textMid, marginBottom: 12 }}>
              <div style={{ marginBottom: 4 }}>Order ID: <span style={{ color: C.orange, fontWeight: 600 }}>TR{Date.now().toString().slice(-10)}</span></div>
              <div style={{ marginBottom: 4 }}>Amount: <span style={{ color: C.text, fontWeight: 600 }}>100.00 USDT</span></div>
              <div>Commission: <span style={{ color: C.green, fontWeight: 600 }}>{rates[platform]}% = {rates[platform]}.00 USDT</span></div>
            </div>
            <button
              onClick={() => {
                const amt = "100.00";
                const rate = parseFloat(rates[platform]);
                const comm = (100 * rate / 100).toFixed(2);
                onSubmitOrder(platform, amt, comm);
                setSubmitted(true);
              }}
              style={{
                width: "100%",
                background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
                border: "none", borderRadius: 8, padding: "12px 0",
                fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
              }}
            >Submit Order</button>
          </div>
        )}

        <div style={{ fontSize: 12, color: C.textLight, textAlign: "center", marginTop: 12 }}>
          Hint: Ensure your account balance meets the minimum requirement before grabbing orders.
        </div>
      </div>
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
      { name: "Scotlite Scotlet Profix DC Fix Good Fix Adhesive Tape Roll", unitPrice: "2.58", qty: 62, accentColor: "#3b82f6", icon: "📦" },
    ],
  },
  {
    id: "TR2502121183647012",
    platform: "Alibaba",
    merchantColor: "#FF6A00",
    amount: "499.00",
    commission: "39.92",
    expectedIncome: "538.92",
    time: "2026-06-08 10:05:44",
    status: "complete",
    products: [
      { name: "Premium Wireless Bluetooth Earbuds Pro Max Noise Cancelling", unitPrice: "49.90", qty: 10, accentColor: "#8b5cf6", icon: "🎧" },
      { name: "USB-C Fast Charging Cable 2m Braided Nylon", unitPrice: "0.10", qty: 0, accentColor: "#22c55e", icon: "🔌" },
    ],
  },
];

// Pill indicator + close helpers
function Pill() {
  return (
    <div style={{
      width: 40, height: 4, borderRadius: 2,
      background: "#d1d5db", margin: "0 auto 16px",
    }} />
  );
}

function StatusChip({ status }: { status: OrderStatus }) {
  const isPending = status === "pending";
  return (
    <span style={{
      background: isPending ? "#fef3e2" : "#dcfce7",
      color: isPending ? C.orange : C.green,
      fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {isPending ? <Clock size={10} /> : <CheckCircle2 size={10} />}
      {isPending ? "Pending" : "Completed"}
    </span>
  );
}

function OrderDetailsPopup({
  order,
  onClose,
}: {
  order: OrderRecord;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  // Trigger slide-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

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
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: "opacity 280ms ease",
        }}
      />

      {/* Sheet */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0,
        zIndex: 201,
        background: C.white,
        borderRadius: "20px 20px 0 0",
        maxHeight: "88%",
        display: "flex", flexDirection: "column",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 280ms cubic-bezier(0.32,0.72,0,1)",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}>
        {/* Drag handle + header */}
        <div style={{ padding: "12px 20px 0", flexShrink: 0 }}>
          <Pill />
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 14,
          }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>Order Details</span>
            <button
              onClick={handleClose}
              style={{
                border: "none", background: "#f4f5f7", cursor: "pointer",
                width: 30, height: 30, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={16} color={C.textMid} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>

          {/* ── Product image / gallery ── */}
          <div style={{
            borderRadius: 14, overflow: "hidden",
            background: `linear-gradient(135deg, ${product.accentColor}22 0%, ${product.accentColor}11 100%)`,
            border: `1.5px solid ${product.accentColor}33`,
            marginBottom: 12,
          }}>
            {/* Main image area */}
            <div style={{
              height: 180,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
              background: `linear-gradient(135deg, ${product.accentColor}18 0%, ${product.accentColor}08 100%)`,
            }}>
              <span style={{ fontSize: 64, lineHeight: 1 }}>{product.icon}</span>
              <span style={{
                fontSize: 11, color: product.accentColor, fontWeight: 600,
                background: `${product.accentColor}22`,
                padding: "3px 10px", borderRadius: 12,
              }}>
                {order.platform}
              </span>
            </div>

            {/* Gallery dots / thumbnails (when multiple products) */}
            {order.products.length > 1 && (
              <div style={{
                display: "flex", gap: 8, padding: "10px 12px",
                background: "rgba(255,255,255,0.7)", borderTop: `1px solid ${C.border}`,
              }}>
                {order.products.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    style={{
                      width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                      border: `2px solid ${i === imgIdx ? product.accentColor : C.border}`,
                      background: `${p.accentColor}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, cursor: "pointer",
                    }}
                  >
                    {p.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div style={{
            background: C.bg, borderRadius: 12,
            padding: "12px 14px", marginBottom: 12,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.4, marginBottom: 10 }}>
              {product.name}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                flex: 1, background: C.white, borderRadius: 8,
                padding: "8px 10px", textAlign: "center",
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ fontSize: 10, color: C.textLight, marginBottom: 3 }}>Unit Price</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.orange }}>{product.unitPrice} <span style={{ fontSize: 10, fontWeight: 400 }}>USDT</span></div>
              </div>
              <div style={{
                flex: 1, background: C.white, borderRadius: 8,
                padding: "8px 10px", textAlign: "center",
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ fontSize: 10, color: C.textLight, marginBottom: 3 }}>Quantity</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>×{product.qty}</div>
              </div>
              <div style={{
                flex: 1, background: C.white, borderRadius: 8,
                padding: "8px 10px", textAlign: "center",
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ fontSize: 10, color: C.textLight, marginBottom: 3 }}>Subtotal</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.green }}>
                  {(parseFloat(product.unitPrice) * product.qty).toFixed(2)} <span style={{ fontSize: 10, fontWeight: 400 }}>USDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Summary section ── */}
          <div style={{
            background: C.white, borderRadius: 12,
            border: `1px solid ${C.border}`,
            overflow: "hidden", marginBottom: 16,
          }}>
            <div style={{
              padding: "10px 14px",
              background: `linear-gradient(135deg, ${C.wine}08 0%, ${C.wine}04 100%)`,
              borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Order Summary</span>
            </div>
            {rows.map((row, i) => (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 14px",
                borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <span style={{ fontSize: 13, color: C.textMid, flexShrink: 0 }}>{row.label}</span>
                {row.chip ? (
                  <StatusChip status={row.val as OrderStatus} />
                ) : (
                  <span style={{
                    fontSize: 13,
                    fontWeight: row.bold || row.orange || row.green ? 700 : 400,
                    color: row.orange ? C.orange : row.green ? C.green : row.mono ? C.text : C.text,
                    fontFamily: row.mono ? "monospace" : "inherit",
                    maxWidth: "60%", textAlign: "right", wordBreak: "break-all",
                  }}>
                    {row.val}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* ── Close button ── */}
          <button
            onClick={handleClose}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
              border: "none", borderRadius: 12, padding: "15px 0",
              fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
              boxShadow: `0 4px 16px rgba(245,161,0,0.35)`,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECORD SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function RecordScreen({
  orders,
  onSubmitIncomplete,
}: {
  orders: OrderRecord[];
  onSubmitIncomplete: (id: string) => void;
}) {
  const [tab, setTab] = useState<"incomplete" | "complete">("incomplete");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const incompleteOrders = orders.filter(o => o.status === "pending");
  const completeOrders   = orders.filter(o => o.status === "complete");
  const visible = tab === "incomplete" ? incompleteOrders : completeOrders;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, paddingBottom: 80 }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ padding: "14px 16px 0", textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 12 }}>Record</div>
        </div>
        <div style={{ display: "flex", padding: "0 20px" }}>
          {(["incomplete","complete"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, border: "none", background: "none", cursor: "pointer",
              padding: "10px 0",
              color: tab === t ? C.orange : C.textMid,
              fontWeight: tab === t ? 700 : 400,
              fontSize: 14,
              borderBottom: tab === t ? `2px solid ${C.orange}` : "2px solid transparent",
            }}>{t === "incomplete" ? "Incomplete" : "Complete"}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
        {visible.length > 0 ? visible.map(order => (
          <button
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            style={{
              width: "100%", background: C.white, border: "none", borderRadius: 12, padding: 16,
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 10, cursor: "pointer",
              textAlign: "left",
            }}
          >
            {/* Top row: time + status */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: C.textLight }}>{order.time}</span>
              <StatusChip status={order.status} />
            </div>

            {/* Product preview row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                background: `${order.products[0].accentColor}18`,
                border: `1px solid ${order.products[0].accentColor}33`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>
                {order.products[0].icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {order.products[0].name}
                </div>
                <div style={{ fontSize: 11, color: C.textLight }}>
                  {order.products[0].unitPrice} USDT × {order.products[0].qty}
                  {order.products.length > 1 && ` (+${order.products.length - 1} more)`}
                </div>
              </div>
            </div>

            {/* Data rows */}
            {[
              { label: "Order ID",   val: order.id,                              mono: true  },
              { label: "Platform",   val: order.platform                                     },
              { label: "Amount",     val: `${order.amount} USDT`                            },
              { label: "Commission", val: `+${order.commission} USDT`, green: true           },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: C.textMid }}>{row.label}</span>
                <span style={{
                  fontSize: 13,
                  color: row.green ? C.green : C.text,
                  fontWeight: row.green ? 600 : 400,
                  fontFamily: row.mono ? "monospace" : "inherit",
                  maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis",
                }}>{row.val}</span>
              </div>
            ))}

            {tab === "incomplete" && (
              <button
                onClick={e => { e.stopPropagation(); onSubmitIncomplete(order.id); }}
                style={{
                  marginTop: 12, width: "100%", padding: "10px 0",
                  background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
                  border: "none", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
                }}
              >Submit order</button>
            )}

            {/* "Tap for details" hint */}
            <div style={{ marginTop: 8, textAlign: "center", fontSize: 11, color: C.textLight }}>
              Tap to view details
            </div>
          </button>
        )) : (
          <div style={{ textAlign: "center", padding: "40px 20px", color: C.textLight }}>
            <ClipboardList size={48} color={C.border} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 14 }}>No more</div>
          </div>
        )}
      </div>

      {/* Order Details Popup */}
      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function MineScreen({ onNavigate }: { onNavigate: (sub: SubPage) => void }) {
  const quickActions = [
    { label: "Teams",            icon: <Users       size={22} color={C.orange} />, bg: "#fff8e7", page: "teams"         as SubPage },
    { label: "Record",           icon: <FileText    size={22} color={C.green}  />, bg: "#f0fdf4", page: "deposit-records" as SubPage },
    { label: "Wallet management",icon: <BarChart2   size={22} color={C.red}    />, bg: "#fef2f2", page: "wallet-mgmt"   as SubPage },
    { label: "Invite friends",   icon: <Mail        size={22} color={C.blue}   />, bg: "#eff6ff", page: "invite"        as SubPage },
  ];
  const menuItems = [
    { label: "Profile",            icon: <User          size={18} color={C.orange}   />, bg: "#fff8e7", page: "profile"          as SubPage },
    { label: "Deposit records",    icon: <ArrowDownToLine size={18} color={C.green}  />, bg: "#f0fdf4", page: "deposit-records"  as SubPage },
    { label: "Withdrawal records", icon: <ArrowUpFromLine size={18} color={C.blue}   />, bg: "#eff6ff", page: "withdraw-records" as SubPage },
    { label: "Setting",            icon: <Globe         size={18} color={C.textMid}  />, bg: "#f4f5f7", page: "setting"          as SubPage },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg, paddingBottom: 80 }}>
      {/* Wine gradient header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
        padding: "24px 20px 36px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "3px solid rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <PentagonLogo size={50} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Hanif8989</span>
          <VipBadge level={0} />
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
          Invitation code: 925886
        </div>
      </div>

      {/* Balance card (overlaps header) */}
      <div style={{
        margin: "-20px 12px 0", background: C.white,
        borderRadius: 12, padding: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
      }}>
        <div style={{ fontSize: 12, color: C.textLight, marginBottom: 6 }}>My Account</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>
          0.00 <span style={{ fontSize: 14, fontWeight: 400, color: C.textMid }}>USDT</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onNavigate("deposit")} style={{
            flex: 1,
            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
            border: "none", borderRadius: 8, padding: "12px 0",
            fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <ArrowDownToLine size={16} /> Deposit
          </button>
          <button onClick={() => onNavigate("withdraw")} style={{
            flex: 1, background: C.white,
            border: `1.5px solid ${C.orange}`, borderRadius: 8, padding: "12px 0",
            fontSize: 14, fontWeight: 600, color: C.orange, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <ArrowUpFromLine size={16} /> Withdrawal
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{
        background: C.white, margin: "10px 12px", borderRadius: 12,
        padding: "16px 8px",
        display: "flex", justifyContent: "space-around",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        {quickActions.map(a => (
          <button key={a.label} onClick={() => onNavigate(a.page)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, background: a.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{a.icon}</div>
            <span style={{ fontSize: 11, color: C.textMid, maxWidth: 58, textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Menu list */}
      <div style={{ background: C.white, margin: "0 12px", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        {menuItems.map((item, i) => (
          <div key={item.label}>
            {i > 0 && <div style={{ height: 1, background: C.border, margin: "0 16px" }} />}
            <button onClick={() => onNavigate(item.page)} style={{
              width: "100%", background: "none", border: "none",
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", cursor: "pointer",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: item.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{item.icon}</div>
              <span style={{ flex: 1, textAlign: "left", fontSize: 14, color: C.text }}>{item.label}</span>
              <ChevronRight size={16} color={C.textLight} />
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
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        {/* Payment method */}
        <div style={{ background: C.white, borderRadius: 10, marginBottom: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 10 }}>Payment method</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: C.orangeLight, borderRadius: 8, padding: "10px 12px",
            border: `1px solid ${C.orange}`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: "#3b82f6",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>₮</span>
            </div>
            <span style={{ fontWeight: 600, color: C.text }}>USDT</span>
            <Check size={16} color={C.orange} style={{ marginLeft: "auto" }} />
          </div>
        </div>

        {/* Network selector */}
        <div style={{ background: C.white, borderRadius: 10, marginBottom: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 10 }}>Select the protocol to use</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["TRC-20", "ERC-20", "BEP-20"].map(n => (
              <button key={n} onClick={() => setNetwork(n)} style={{
                flex: 1, border: `1.5px solid ${network === n ? C.orange : C.border}`,
                borderRadius: 8, padding: "8px 0",
                background: network === n ? C.orangeLight : C.white,
                color: network === n ? C.orange : C.textMid,
                fontWeight: network === n ? 700 : 400,
                fontSize: 13, cursor: "pointer",
              }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div style={{ background: C.white, borderRadius: 10, marginBottom: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>Deposit amount</div>
          <div style={{
            display: "flex", alignItems: "center",
            border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "10px 12px",
          }}>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Please enter the amount"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: C.text, background: "transparent" }}
            />
            <span style={{ fontSize: 13, color: C.textMid }}>USDT</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: C.textMid }}>
            Estimated payment: <span style={{ color: C.orange }}>{amount || "0"} USDT</span>
          </div>
          <div style={{ fontSize: 12, color: C.textMid }}>Reference rate: 1 USDT = 1 USDT</div>
        </div>

        <button onClick={() => amount && onQR()} style={{
          width: "100%",
          background: amount
            ? `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`
            : "#ccc",
          border: "none", borderRadius: 10, padding: "14px 0",
          fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
        }}>Deposit now</button>
        {!amount && (
          <div style={{ fontSize: 12, color: C.textLight, textAlign: "center", marginTop: 8 }}>
            Please enter an amount to continue
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEPOSIT QR SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const DEMO_ADDRESS = "TDqfQ6tLFGGArRERHvvR3z3JF5QKekUvM1";

function DepositQRScreen({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(DEMO_ADDRESS).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Minimal QR visual
  const qrCells = Array.from({ length: 100 }, (_, i) => {
    const r = Math.floor(i / 10), col = i % 10;
    const corner = (r < 3 && col < 3) || (r < 3 && col > 6) || (r > 6 && col < 3);
    const mid = [44, 45, 54, 55, 33, 22, 66, 77, 38, 61].includes(i);
    return corner || mid;
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Deposit" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        {/* Amount + progress */}
        <div style={{ background: C.white, borderRadius: 10, padding: 16, marginBottom: 10, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 6 }}>Amount</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.orange, marginBottom: 4 }}>100</div>
          <div style={{ fontSize: 13, color: C.textMid, marginBottom: 12 }}>Network: TRON (TRC-20)</div>
          <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
            <div style={{ height: "100%", width: "20%", background: C.orange, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, color: C.textLight, marginTop: 6 }}>Waiting for payment...</div>
        </div>

        {/* QR + address */}
        <div style={{ background: C.white, borderRadius: 10, padding: 16, marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: C.orange, fontWeight: 600, marginBottom: 12 }}>One Time Address:</div>
          {/* QR */}
          <div style={{
            width: 160, height: 160, margin: "0 auto 16px",
            border: `2px solid ${C.border}`, borderRadius: 8, padding: 8,
            display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: 1.5,
          }}>
            {qrCells.map((on, i) => (
              <div key={i} style={{ background: on ? "#000" : "transparent", borderRadius: 1 }} />
            ))}
          </div>
          {/* Address box */}
          <div style={{
            border: `1.5px solid ${C.red}`, borderRadius: 8, padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ flex: 1, fontSize: 11, color: C.text, wordBreak: "break-all", fontFamily: "monospace" }}>
              {DEMO_ADDRESS}
            </span>
            <button onClick={handleCopy} style={{ border: "none", background: "none", cursor: "pointer", padding: 4 }}>
              {copied ? <Check size={18} color={C.green} /> : <Copy size={18} color={C.orange} />}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div style={{ background: C.white, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 10 }}>Tips</div>
          {[
            "This is a one-time address. Do not reuse it.",
            "Minimum deposit amount: 10 USDT.",
            "Funds typically arrive within 1–2 minutes.",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12, color: C.textMid }}>
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

function WithdrawScreen({ onBack, onAddWallet }: { onBack: () => void; onAddWallet: () => void }) {
  const [showPwdPopup, setShowPwdPopup] = useState(true);
  const [amount, setAmount] = useState("");
  const [fundPwd, setFundPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
        <BackHeader title="Withdrawal" onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <CheckCircle2 size={64} color={C.green} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Withdrawal Submitted</div>
          <div style={{ fontSize: 13, color: C.textMid, textAlign: "center", marginBottom: 24 }}>
            Your request has been submitted and is being processed.
          </div>
          <button onClick={onBack} style={{
            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
            border: "none", borderRadius: 10, padding: "14px 40px",
            fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
          }}>Done</button>
        </div>
      </div>
    );
  }

  const fee = amount ? (parseFloat(amount) * FEE_RATE).toFixed(2) : "0.00";
  const receive = amount ? (parseFloat(amount) * (1 - FEE_RATE)).toFixed(2) : "0.00";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, position: "relative" }}>
      <BackHeader title="Withdrawal" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        {/* Virtual currency tab */}
        <div style={{ background: C.white, borderRadius: 10, marginBottom: 10, padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{
              padding: "6px 16px",
              background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
              borderRadius: 20, fontSize: 13, color: "#fff", fontWeight: 600,
              position: "relative",
            }}>
              Virtual currency
              <div style={{
                position: "absolute", top: -4, right: -4, width: 14, height: 14,
                borderRadius: "50%", background: C.orange,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Check size={9} color="#fff" />
              </div>
            </div>
          </div>
          <button onClick={onAddWallet} style={{
            width: "100%", border: `1.5px dashed ${C.border}`, borderRadius: 8, padding: "12px 0",
            background: "none", cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Plus size={16} color={C.orange} />
            <span style={{ color: C.orange }}>+ Add e-wallet</span>
          </button>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: C.textLight }}>
            Please bind an electronic wallet for withdrawal
          </div>
        </div>

        {/* Withdraw form (available after wallet bound, shown for demo) */}
        <div style={{ background: C.white, borderRadius: 10, marginBottom: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>Withdrawal amount</div>
          <div style={{
            display: "flex", alignItems: "center",
            border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "10px 12px",
          }}>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: C.text, background: "transparent" }}
            />
            <button onClick={() => setAmount("1000")} style={{
              border: "none", background: C.orangeLight, borderRadius: 4,
              padding: "4px 8px", fontSize: 11, color: C.orange, fontWeight: 600, cursor: "pointer",
            }}>MAX</button>
          </div>
          {amount && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: C.bg, borderRadius: 8, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.textMid, marginBottom: 4 }}>
                <span>Fee (15%)</span>
                <span style={{ color: C.red }}>−{fee} USDT</span>
              </div>
              <div style={{ height: 1, background: C.border, margin: "6px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: C.text }}>
                <span>You receive</span>
                <span style={{ color: C.green }}>{receive} USDT</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: C.white, borderRadius: 10, marginBottom: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>Fund password</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "10px 12px",
          }}>
            <Lock size={16} color={C.textLight} />
            <input
              value={fundPwd}
              onChange={e => setFundPwd(e.target.value)}
              placeholder="Enter fund password"
              type={showPwd ? "text" : "password"}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: C.text, background: "transparent" }}
            />
            <button onClick={() => setShowPwd(v => !v)} style={{ border: "none", background: "none", cursor: "pointer" }}>
              {showPwd ? <EyeOff size={16} color={C.textLight} /> : <Eye size={16} color={C.textLight} />}
            </button>
          </div>
        </div>

        <button onClick={() => amount && fundPwd && setSuccess(true)} style={{
          width: "100%",
          background: (amount && fundPwd)
            ? `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`
            : "#ccc",
          border: "none", borderRadius: 10, padding: "14px 0",
          fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
        }}>Withdraw</button>
      </div>

      {/* Fund password not set popup */}
      {showPwdPopup && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 24,
        }}>
          <div style={{ background: C.white, borderRadius: 12, padding: 24, maxWidth: 300, width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 8 }}>Withdrawal password</div>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 20 }}>
              Sorry! You have not set a withdrawal password. Please set it first to proceed.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowPwdPopup(false); onBack(); }} style={{
                flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 8,
                padding: "10px 0", background: "none", cursor: "pointer",
                fontSize: 14, color: C.textMid,
              }}>Cancel</button>
              <button onClick={() => setShowPwdPopup(false)} style={{
                flex: 1,
                background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
                border: "none", borderRadius: 8, padding: "10px 0",
                cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff",
              }}>To set</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD WALLET SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function AddWalletScreen({ onBack }: { onBack: () => void }) {
  const [walletName, setWalletName] = useState("");
  const [protocol, setProtocol] = useState("TRC-20");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Add E-Wallet" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        <div style={{ background: C.white, borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
          {[
            { label: "Wallet name",    value: walletName, set: setWalletName, placeholder: "Enter wallet name"    },
            { label: "Names",          value: name,       set: setName,       placeholder: "Enter your name"       },
            { label: "Wallet address", value: address,    set: setAddress,    placeholder: "Enter wallet address"  },
          ].map((f, i) => (
            <div key={f.label}>
              {i > 0 && <div style={{ height: 1, background: C.border }} />}
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: C.textLight, marginBottom: 6 }}>{f.label}</div>
                <input
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%", border: `1.5px solid ${C.border}`,
                    borderRadius: 8, padding: "10px 12px",
                    fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: C.border }} />
          <div style={{ padding: "12px 16px" }}>
            <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>Virtual Currency Protocol</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["TRC-20", "ERC-20", "BEP-20"].map(n => (
                <button key={n} onClick={() => setProtocol(n)} style={{
                  flex: 1, border: `1.5px solid ${protocol === n ? C.orange : C.border}`,
                  borderRadius: 8, padding: "8px 0",
                  background: protocol === n ? C.orangeLight : C.white,
                  color: protocol === n ? C.orange : C.textMid,
                  fontWeight: protocol === n ? 700 : 400,
                  fontSize: 12, cursor: "pointer",
                }}>{n}</button>
              ))}
            </div>
          </div>
        </div>
        <button style={{
          width: "100%",
          background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
          border: "none", borderRadius: 10, padding: "14px 0",
          fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", marginBottom: 10,
        }}>OK</button>
        <button onClick={onBack} style={{
          width: "100%", border: "none", background: "none",
          cursor: "pointer", fontSize: 14, color: C.textMid,
        }}>Cancel</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAMS SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
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
        <div style={{ height: 54, display: "flex", alignItems: "center", padding: "0 16px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, marginRight: 8 }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 16, color: "#fff", marginRight: 36 }}>Team</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: 16, padding: "0 20px" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Team amount</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>
            0.00 <span style={{ fontSize: 14, fontWeight: 400 }}>USDT</span>
          </div>
        </div>
        <div style={{ margin: "0 12px 0", background: "rgba(255,255,255,0.1)", borderRadius: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                padding: "12px 8px", textAlign: "center",
                borderRight: i % 4 !== 3 ? "1px solid rgba(255,255,255,0.15)" : "none",
                borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.15)" : "none",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 16 }} />
      </div>

      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex" }}>
          {[1, 2, 3].map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{
              flex: 1, border: "none", background: "none", cursor: "pointer",
              padding: "12px 0",
              color: level === l ? C.orange : C.textMid,
              fontWeight: level === l ? 700 : 400, fontSize: 14,
              borderBottom: level === l ? `2px solid ${C.orange}` : "2px solid transparent",
            }}>Level {l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: C.textLight }}>
        <Users size={48} color={C.border} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 14 }}>No data</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVITE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function InviteScreen({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const code = "925886";
  const link = `https://qudaizi.com/#/register?code=${code}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrOn = [0,1,2,9,10,18,27,36,45,54,11,20,7,8,16,25,34,63,72,81,62,71,80,70,79,88,69,78,87,40,41,42,49,50,51,31,38,44,53,60,67].map(n => n % 81);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Invite Friends" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: C.textMid, marginBottom: 6 }}>My invitation code</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: C.text, letterSpacing: 4, marginBottom: 24 }}>{code}</div>

        {/* QR */}
        <div style={{
          width: 200, height: 200, margin: "0 auto 12px",
          border: `2px solid ${C.border}`, borderRadius: 12, padding: 16,
          background: C.white,
          display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 2.5,
        }}>
          {Array.from({ length: 81 }, (_, i) => {
            const r = Math.floor(i / 9), col = i % 9;
            const corner = (r < 3 && col < 3) || (r < 3 && col > 5) || (r > 5 && col < 3);
            const dot = [40, 30, 32, 48, 50, 22, 58].includes(i);
            return <div key={i} style={{ background: (corner || dot) ? "#000" : "transparent", borderRadius: 1 }} />;
          })}
        </div>

        <div style={{ fontSize: 12, color: C.orange, marginBottom: 24 }}>Long press to save the QR code</div>

        <div style={{
          background: C.white, borderRadius: 10, padding: "12px 14px",
          border: `1px solid ${C.border}`, textAlign: "left",
        }}>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 6 }}>Share link</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ flex: 1, fontSize: 11, color: C.textMid, wordBreak: "break-all" }}>{link}</span>
            <button onClick={handleCopy} style={{
              border: "none", background: C.orangeLight, borderRadius: 6,
              padding: "6px 12px", cursor: "pointer",
              fontSize: 12, color: C.orange, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
            }}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WALLET MANAGEMENT SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function WalletMgmtScreen({ onBack, onAdd }: { onBack: () => void; onAdd: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Wallet Management" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        <div style={{ background: C.white, borderRadius: 10, padding: "12px 16px", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{
              padding: "6px 16px",
              background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
              borderRadius: 20, fontSize: 13, color: "#fff", fontWeight: 600,
            }}>Virtual currency</div>
          </div>
          <button onClick={onAdd} style={{
            width: "100%",
            background: `linear-gradient(135deg, ${C.wine} 0%, ${C.wineDark} 100%)`,
            border: "none", borderRadius: 8, padding: "12px 0",
            fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Plus size={16} /> Add e-wallet
          </button>
          <div style={{ marginTop: 12, padding: "10px 12px", background: C.orangeLight, borderRadius: 8, fontSize: 12, color: C.orangeDark }}>
            Tips: Bind at most 1 group accounts.
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "20px 0", fontSize: 12, color: C.textLight }}>No data</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function ProfileScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Profile" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: C.white, borderRadius: 10, margin: "12px 12px", overflow: "hidden" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 16px", borderBottom: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 14, color: C.text }}>Personal Avatar</span>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: C.bg, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PentagonLogo size={36} />
            </div>
          </div>
          {[
            { label: "Username",        value: "Hanif8989" },
            { label: "VIP Level",       value: "VIP 0"     },
            { label: "Phone number",    value: "Not set"   },
            { label: "Invitation code", value: "925886"    },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
            }}>
              <span style={{ fontSize: 14, color: C.text }}>{item.label}</span>
              <span style={{ fontSize: 13, color: C.textMid }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIMPLE RECORDS SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function SimpleRecordsScreen({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title={title} onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.textLight }}>
        <FileText size={48} color={C.border} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 14 }}>No more</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTING SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function SettingScreen({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <BackHeader title="Setting" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        <div style={{ background: C.white, borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
          <button style={{
            width: "100%", border: "none", background: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={18} color={C.blue} />
            </div>
            <span style={{ flex: 1, textAlign: "left", fontSize: 14, color: C.text }}>Language settings</span>
            <ChevronRight size={16} color={C.textLight} />
          </button>
        </div>
        <button onClick={onLogout} style={{
          width: "100%", border: "none", background: C.white, cursor: "pointer",
          borderRadius: 10, padding: "14px 16px",
          fontSize: 14, fontWeight: 600, color: C.red,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{
        background: `linear-gradient(160deg, ${C.wine} 0%, ${C.wineDark} 55%, ${C.bg} 100%)`,
        padding: "48px 24px 60px", textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "3px solid rgba(255,255,255,0.4)",
          margin: "0 auto 16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <PentagonLogo size={54} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Welcome Back</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Sign in to your account</div>
      </div>

      <div style={{
        margin: "-24px 20px 0",
        background: C.white, borderRadius: 16,
        padding: "28px 20px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      }}>
        {[
          {
            label: "Username / Phone", value: user, set: setUser,
            placeholder: "Enter username or phone", icon: <User size={16} color={C.textLight} />, type: "text",
          },
          {
            label: "Password", value: pwd, set: setPwd,
            placeholder: "Enter password",
            icon: <Lock size={16} color={C.textLight} />,
            type: showPwd ? "text" : "password",
            suffix: (
              <button onClick={() => setShowPwd(v => !v)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                {showPwd ? <EyeOff size={16} color={C.textLight} /> : <Eye size={16} color={C.textLight} />}
              </button>
            ),
          },
        ].map((f, i) => (
          <div key={f.label} style={{ marginBottom: i === 0 ? 14 : 22 }}>
            <div style={{ fontSize: 12, color: C.textLight, marginBottom: 6 }}>{f.label}</div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "11px 14px",
            }}>
              {f.icon}
              <input
                value={f.value}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                type={f.type}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: C.text, background: "transparent" }}
              />
              {f.suffix}
            </div>
          </div>
        ))}

        <button onClick={onLogin} style={{
          width: "100%",
          background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
          border: "none", borderRadius: 10, padding: "14px 0",
          fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
          boxShadow: `0 4px 16px rgba(245,161,0,0.4)`, marginBottom: 16,
        }}>Login</button>

        <div style={{ textAlign: "center", fontSize: 13, color: C.textMid }}>
          Don't have an account?{" "}
          <span style={{ color: C.orange, fontWeight: 600, cursor: "pointer" }}>Register</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════════
function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const items: { key: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    { key: "home",    label: "Home",    icon: a => <Home        size={22} color={a ? C.orange : C.textLight} /> },
    { key: "service", label: "Service", icon: a => <Headphones  size={22} color={a ? C.orange : C.textLight} /> },
    { key: "menu",    label: "Menu",    icon: a => <ShoppingBag size={22} color={a ? C.orange : C.textLight} /> },
    { key: "record",  label: "Record",  icon: a => <ClipboardList size={22} color={a ? C.orange : C.textLight} /> },
    { key: "mine",    label: "Mine",    icon: a => <User        size={22} color={a ? C.orange : C.textLight} /> },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: 68, background: C.white,
      borderTop: `1px solid ${C.border}`,
      display: "flex", zIndex: 50,
    }}>
      {items.map(item => {
        const active = tab === item.key;
        return (
          <button key={item.key} onClick={() => onTab(item.key)} style={{
            flex: 1, border: "none", background: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3,
          }}>
            {item.icon(active)}
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? C.orange : C.textLight }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
// Platform product catalogue used when building completed orders from the task screen
const PLATFORM_PRODUCTS: Record<string, OrderProduct> = {
  amazon:     { name: "Amazon Marketplace — Grab Order Product",     unitPrice: "100.00", qty: 1, accentColor: "#FF9900", icon: "📦" },
  alibaba:    { name: "Alibaba Global — Grab Order Product",         unitPrice: "100.00", qty: 1, accentColor: "#FF6A00", icon: "🛍️" },
  aliexpress: { name: "AliExpress — Grab Order Product",             unitPrice: "100.00", qty: 1, accentColor: "#e62e04", icon: "🏪" },
};
const PLATFORM_NAMES: Record<string, string> = {
  amazon: "Amazon", alibaba: "Alibaba", aliexpress: "Aliexpress",
};

function nowTimestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [subPage, setSubPage] = useState<SubPage | null>(null);
  const [taskPlatform, setTaskPlatform] = useState("amazon");
  const [orders, setOrders] = useState<OrderRecord[]>(MOCK_ORDERS);

  const goSub = (page: SubPage) => setSubPage(page);
  const goBack = () => setSubPage(null);

  const handleTab = (t: Tab) => {
    setTab(t);
    setSubPage(null);
  };

  // Called by TaskDetailScreen when Submit Order is clicked
  const handleAddOrder = (platform: string, amount: string, commission: string) => {
    const product = PLATFORM_PRODUCTS[platform] ?? PLATFORM_PRODUCTS.amazon;
    const expectedIncome = (parseFloat(amount) + parseFloat(commission)).toFixed(2);
    const newOrder: OrderRecord = {
      id: `TR${Date.now()}`,
      platform: PLATFORM_NAMES[platform] ?? platform,
      merchantColor: product.accentColor,
      amount,
      commission,
      expectedIncome,
      time: nowTimestamp(),
      status: "complete",
      products: [{ ...product, unitPrice: amount }],
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  // Called by the "Submit order" button on pending cards in RecordScreen
  const handleSubmitIncomplete = (id: string) => {
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status: "complete" as OrderStatus } : o)
    );
  };

  const renderContent = () => {
    if (subPage === "deposit")          return <DepositScreen   onBack={goBack} onQR={() => setSubPage("deposit-qr")} />;
    if (subPage === "deposit-qr")       return <DepositQRScreen  onBack={() => setSubPage("deposit")} />;
    if (subPage === "withdraw")         return <WithdrawScreen   onBack={goBack} onAddWallet={() => setSubPage("add-wallet")} />;
    if (subPage === "add-wallet")       return <AddWalletScreen  onBack={() => setSubPage("withdraw")} />;
    if (subPage === "teams")            return <TeamsScreen      onBack={goBack} />;
    if (subPage === "invite")           return <InviteScreen     onBack={goBack} />;
    if (subPage === "wallet-mgmt")      return <WalletMgmtScreen onBack={goBack} onAdd={() => setSubPage("add-wallet")} />;
    if (subPage === "profile")          return <ProfileScreen    onBack={goBack} />;
    if (subPage === "deposit-records")  return <SimpleRecordsScreen title="Deposit Records"    onBack={goBack} />;
    if (subPage === "withdraw-records") return <SimpleRecordsScreen title="Withdrawal Records" onBack={goBack} />;
    if (subPage === "setting")          return <SettingScreen    onBack={goBack} onLogout={() => setLoggedIn(false)} />;
    if (subPage === "task")             return (
      <TaskDetailScreen
        platform={taskPlatform}
        onBack={goBack}
        onSubmitOrder={handleAddOrder}
      />
    );

    if (tab === "home")    return <HomeScreen    onNavigate={goSub} />;
    if (tab === "service") return <ServiceScreen />;
    if (tab === "menu")    return <MenuScreen    onTask={p => { setTaskPlatform(p); setSubPage("task"); }} />;
    if (tab === "record")  return (
      <RecordScreen
        orders={orders}
        onSubmitIncomplete={handleSubmitIncomplete}
      />
    );
    if (tab === "mine")    return <MineScreen    onNavigate={goSub} />;
    return null;
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      padding: "20px 0",
    }}>
      {/* Phone frame */}
      <div style={{
        width: 390, height: 820,
        background: C.bg, borderRadius: 40, overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.1)",
        position: "relative", display: "flex", flexDirection: "column",
        border: "6px solid #111",
      }}>
        {/* Status bar */}
        <div style={{
          height: 28, background: C.white, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", fontSize: 11, fontWeight: 600, color: C.text,
        }}>
          <span>9:41</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ width: 16, height: 8, border: `1.5px solid ${C.text}`, borderRadius: 2, display: "flex", alignItems: "center", padding: 1 }}>
              <div style={{ width: "70%", height: "100%", background: C.text, borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* App content */}
        {!loggedIn ? (
          <LoginScreen onLogin={() => setLoggedIn(true)} />
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
            {renderContent()}
            {!subPage && <BottomNav tab={tab} onTab={handleTab} />}
          </div>
        )}
      </div>
    </div>
  );
}
