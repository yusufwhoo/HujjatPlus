import React, { useState, useEffect, useRef } from "react";
import {
  FileText, FileSpreadsheet, FileCheck2, Landmark, LayoutTemplate, Languages,
  Palette, Wallet, MoreHorizontal, Menu, X, ChevronDown, ChevronRight, Check,
  CheckCircle2, Send, Search, Download, Upload, Clock, Phone,
  User, MessageSquare, Paperclip, Loader2, AlertCircle,
  ClipboardList, LayoutDashboard, Settings as SettingsIcon, Trash2, Pencil,
  Plus, Save, Eye, EyeOff, Lock, LogOut, Info, ListChecks, Building2,
} from "lucide-react";

/* ============================== DATA ============================== */

const ICONS = {
  FileText, FileSpreadsheet, FileCheck2, Landmark, LayoutTemplate, Languages,
  Palette, Wallet, MoreHorizontal, Building2,
};

const COLORS = {
  blue: { bg: "#EAF1FF", fg: "#155EEF" },
  green: { bg: "#E9F9F0", fg: "#12A150" },
  purple: { bg: "#F1EEFF", fg: "#7C5CFC" },
  orange: { bg: "#FFF3E8", fg: "#D9770B" },
  gray: { bg: "#F1F3F6", fg: "#5B6472" },
};

const STATUS_LIST = [
  "Qabul qilindi",
  "Ko'rib chiqilmoqda",
  "Ish bajarilmoqda",
  "Tekshirilmoqda",
  "Tayyor",
  "Yakunlandi",
];

const STORAGE_KEYS = {
  orders: "hujjatplus-orders-v1",
  services: "hujjatplus-services-v1",
  faqs: "hujjatplus-faqs-v1",
  settings: "hujjatplus-settings-v1",
};

const ADMIN_PASSCODE = "operator2026";

const DEFAULT_SERVICES = [
  {
    id: "hujjat-tayyorlash",
    title: "Hujjat tayyorlash",
    shortDesc: "Ariza, CV, shartnoma, tarjimai hol va boshqa hujjatlarni tayyorlab beramiz.",
    longDesc: "Sizga kerakli har qanday hujjatni - arizadan tortib shartnomagacha - tez va to'g'ri tarzda tayyorlab beramiz. Matnni qanday yozishni bilmasangiz ham, faqat nima kerakligini ayting, qolgan ishni biz bajaramiz.",
    examples: ["Ish yoki o'qishga ariza", "CV va rezyume", "Shartnoma va bitim hujjatlari", "Tarjimai hol (avtobiografiya)", "Ishonchnoma va vakolatnoma"],
    whatNeeded: ["Hujjat turi va maqsadi haqida qisqacha ma'lumot", "Shaxsiy ma'lumotlaringiz (F.I.Sh, manzil va h.k.)", "Mavjud bo'lsa, namuna yoki oldingi hujjat"],
    estimate: "Odatda 1 ish kuni ichida tayyor bo'ladi.",
    icon: "FileText",
    color: "blue",
  },
  {
    id: "word-excel",
    title: "Word & Excel",
    shortDesc: "Matn yozish, jadval yaratish, formatlash, ma'lumotlarni tartiblash va boshqa ishlar.",
    longDesc: "Matn terish, jadval tuzish, formulalar bilan hisob-kitob, ma'lumotlarni tartibga solish - Word va Excel bilan bog'liq har qanday ishni bajaramiz.",
    examples: ["Matnni Word formatida terish", "Excel jadval va hisobotlar", "Diagramma va grafiklar", "Ma'lumotlarni saralash va tartiblash", "Shablon asosida hujjat tayyorlash"],
    whatNeeded: ["Boshlang'ich ma'lumot yoki qo'lyozma", "Natija qanday ko'rinishda kerakligi", "Mavjud fayllar (agar bo'lsa)"],
    estimate: "Ishning hajmiga qarab, odatda bir necha soatdan 1 kungacha.",
    icon: "FileSpreadsheet",
    color: "green",
  },
  {
    id: "pdf-xizmatlari",
    title: "PDF xizmatlari",
    shortDesc: "PDF → Word, Word → PDF, PDF birlashtirish, sahifalarni ajratish, siqish va boshqa amallar.",
    longDesc: "PDF fayllar bilan bog'liq barcha amallarni - formatni o'zgartirishdan tortib fayllarni birlashtirishgacha - bajarib beramiz.",
    examples: ["PDF → Word", "Word → PDF", "Bir nechta PDF faylni birlashtirish", "PDF sahifalarini ajratish", "Fayl hajmini siqish"],
    whatNeeded: ["Asl fayl(lar)", "Kerakli natija formati", "Maxsus talablar (agar bo'lsa)"],
    estimate: "Odatda bir necha soat ichida.",
    icon: "FileCheck2",
    color: "purple",
  },
  {
    id: "davlat-xizmatlari",
    title: "Davlat xizmatlari",
    shortDesc: "Kerakli davlat xizmatidan foydalanishda amaliy yordam va yo'l-yo'riq.",
    longDesc: "Davlat xizmatlari portallaridan foydalanishda amaliy yordam va yo'l-yo'riq beramiz. Barcha rasmiy qarorlar tegishli davlat tashkiloti tomonidan qabul qilinadi - biz faqat jarayonda yordam ko'rsatamiz.",
    examples: ["Onlayn ariza topshirishda yordam", "Kerakli hujjatlar ro'yxatini aniqlash", "Portalda ro'yxatdan o'tishda yordam", "Jarayon bo'yicha maslahat"],
    whatNeeded: ["Qaysi xizmat kerakligi haqida ma'lumot", "Mavjud hujjatlaringiz", "Aloqa uchun telefon raqami"],
    estimate: "Xizmat turiga qarab belgilanadi.",
    icon: "Landmark",
    color: "orange",
  },
  {
    id: "shablonlar",
    title: "Shablonlar",
    shortDesc: "Ariza, CV, hujjat va boshqa holatlar uchun tayyor namunalar.",
    longDesc: "Ariza, CV, shartnoma va boshqa hujjatlar uchun tayyor shablonlarni taklif qilamiz. Shablonni tanlang, ma'lumotlaringizni bering - qolganini biz moslashtirib beramiz.",
    examples: ["Ariza shablonlari", "CV shablonlari", "Shartnoma namunalari", "Rasmiy xat shablonlari"],
    whatNeeded: ["Qaysi shablon turi kerakligi", "Shaxsiy ma'lumotlaringiz"],
    estimate: "Odatda bir necha soat ichida.",
    icon: "LayoutTemplate",
    color: "blue",
  },
  {
    id: "tarjima",
    title: "Tarjima",
    shortDesc: "Hujjatlar va matnlarni tarjima qilish.",
    longDesc: "Hujjat va matnlarni bir tildan boshqasiga aniq va sifatli tarjima qilamiz.",
    examples: ["Rasmiy hujjatlar tarjimasi", "Shaxsiy hujjatlar tarjimasi", "Matn va maqolalar tarjimasi"],
    whatNeeded: ["Tarjima qilinadigan fayl yoki matn", "Qaysi tildan qaysi tilga", "Muddat talablari (agar bo'lsa)"],
    estimate: "Hajmga qarab, odatda 1 kun ichida.",
    icon: "Languages",
    color: "purple",
  },
  {
    id: "dizayn",
    title: "Dizayn",
    shortDesc: "Hujjat, taqdimot, e'lon va boshqa oddiy dizayn xizmatlari.",
    longDesc: "Hujjat, taqdimot, e'lon va boshqa oddiy dizayn ishlarini bajaramiz.",
    examples: ["Taqdimot (prezentatsiya) dizayni", "E'lon va bannerlar", "Hujjatlarni chiroyli formatlash", "Vizit kartochka dizayni"],
    whatNeeded: ["Dizayn g'oyasi yoki namuna", "Matn va rasm materiallari", "O'lcham va format talablari"],
    estimate: "Murakkabligiga qarab, odatda 1-2 kun.",
    icon: "Palette",
    color: "orange",
  },
  {
    id: "onlayn-tolovlar",
    title: "Online to'lovlar",
    shortDesc: "Mavjud xizmatlar doirasida kommunal, internet va boshqa online to'lovlarda yordam.",
    longDesc: "Mavjud imkoniyatlar doirasida kommunal to'lovlar, internet va boshqa onlayn to'lovlarni amalga oshirishda yordam beramiz.",
    examples: ["Kommunal xizmatlar uchun to'lov", "Internet va aloqa to'lovlari", "Boshqa onlayn to'lovlar"],
    whatNeeded: ["To'lov turi va summasi", "Kerakli hisob raqami yoki ma'lumotlar"],
    estimate: "Odatda bir necha soat ichida.",
    icon: "Wallet",
    color: "green",
  },
  {
    id: "boshqa-xizmatlar",
    title: "Boshqa xizmatlar",
    shortDesc: "Ro'yxatda bo'lmagan raqamli xizmat kerakmi? Bizga yozing.",
    longDesc: "Ro'yxatda yo'q biror raqamli xizmat kerakmi? Bizga yozing - imkoniyatimiz doirasida yordam berishga harakat qilamiz.",
    examples: ["Ro'yxatda yo'q boshqa raqamli ishlar"],
    whatNeeded: ["Nima kerakligi haqida batafsil ma'lumot"],
    estimate: "So'rov ko'rib chiqilgach aniqlanadi.",
    icon: "MoreHorizontal",
    color: "gray",
  },
];

const DEFAULT_FAQS = [
  { q: "Xizmatga qanday buyurtma beraman?", a: "Kerakli xizmatni tanlaysiz, ma'lumotlarni yuborasiz va buyurtma berasiz. Operatorimiz siz bilan bog'lanadi." },
  { q: "Men Word yoki Excel dasturini bilmayman. Yordam bera olasizmi?", a: "Ha. Kerakli ishni bizga tushuntirsangiz, imkoniyatimiz doirasida bajarib beramiz." },
  { q: "Hujjatni qanday yuboraman?", a: "Buyurtma berish vaqtida kerakli fayllarni yuklashingiz mumkin." },
  { q: "Davlat xizmatlaridan foydalanishda yordam berasizlarmi?", a: "Ha. Mavjud xizmatlar bo'yicha foydalanish jarayonida yordam beramiz." },
  { q: "Buyurtmam qachon tayyor bo'ladi?", a: "Muddat xizmat turi va buyurtmaning murakkabligiga qarab belgilanadi. Operator buyurtmani qabul qilgandan keyin sizga ma'lum qiladi." },
];

const DEFAULT_SETTINGS = {
  telegramUsername: "",
  phone: "",
  workingHours: "Dushanba - Juma, 09:00 - 18:00",
};

const TRUST_ITEMS = [
  { title: "Oddiy", desc: "Texnik bilim talab qilinmaydi.", icon: "ListChecks" },
  { title: "Qulay", desc: "Kerakli xizmatlarni bir joydan buyurtma qilasiz.", icon: "LayoutTemplate" },
  { title: "Inson yordami", desc: "Buyurtmalaringiz operatorlar tomonidan ko'rib chiqiladi.", icon: "User" },
  { title: "Tezkor", desc: "Buyurtmangiz imkon qadar tez bajariladi.", icon: "Clock" },
];

/* ============================== HELPERS ============================== */

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

async function storageGet(key, shared) {
  try {
    const res = await window.storage.get(key, shared);
    return res ? JSON.parse(res.value) : null;
  } catch (e) {
    return null;
  }
}

async function storageSet(key, value, shared) {
  try {
    const res = await window.storage.set(key, JSON.stringify(value), shared);
    return !!res;
  } catch (e) {
    return false;
  }
}

function genOrderNumber(existingOrders) {
  const taken = new Set((existingOrders || []).map((o) => o.orderNumber));
  let num;
  let attempts = 0;
  do {
    num = "HP-" + (10000 + Math.floor(Math.random() * 90000));
    attempts++;
  } while (taken.has(num) && attempts < 50);
  return num;
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isToday(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

const MAX_FILE_BYTES = 350 * 1024;

async function processFiles(fileList) {
  const files = Array.from(fileList || []);
  const out = [];
  for (const f of files.slice(0, 4)) {
    if (f.size <= MAX_FILE_BYTES) {
      const dataUrl = await readFileAsDataUrl(f);
      out.push({ name: f.name, size: f.size, type: f.type, dataUrl });
    } else {
      out.push({ name: f.name, size: f.size, type: f.type, dataUrl: null, tooLarge: true });
    }
  }
  return out;
}

/* ============================== UI ATOMS ============================== */

function Button({ children, variant = "primary", size = "md", className, icon: Icon, ...props }) {
  const base = "hp-focus inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { md: "px-5 py-3 text-base", sm: "px-4 py-2 text-sm", lg: "px-7 py-4 text-lg" };
  const variants = {
    primary: "hp-btn-primary",
    secondary: "hp-btn-secondary",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...props}>
      {Icon && <Icon size={18} strokeWidth={2.2} />}
      {children}
    </button>
  );
}

function Card({ children, className, ...props }) {
  return (
    <div className={cx("hp-card rounded-2xl", className)} {...props}>
      {children}
    </div>
  );
}

function Field({ label, hint, error, required, children }) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--hp-navy)" }}>
        {label}
        {required && <span style={{ color: "var(--hp-blue)" }}> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm" style={{ color: "var(--hp-gray)" }}>{hint}</p>}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "hp-focus w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors placeholder:text-slate-400";

function TextInput(props) {
  return <input {...props} className={cx(inputBase, "hp-input", props.className)} />;
}
function TextArea(props) {
  return <textarea {...props} className={cx(inputBase, "hp-input", props.className)} />;
}
function Select({ children, ...props }) {
  return (
    <select {...props} className={cx(inputBase, "hp-input bg-white", props.className)}>
      {children}
    </select>
  );
}

function StatusBadge({ status }) {
  const idx = STATUS_LIST.indexOf(status);
  const done = idx === STATUS_LIST.length - 1;
  const style = done
    ? { bg: "#E9F9F0", fg: "#12A150" }
    : idx <= 0
    ? { bg: "#EAF1FF", fg: "#155EEF" }
    : { bg: "#FFF3E8", fg: "#D9770B" };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
      style={{ background: style.bg, color: style.fg }}
    >
      {done && <Check size={14} />}
      {status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const c = COLORS[color] || COLORS.blue;
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: c.bg }}>
          <Icon size={20} color={c.fg} />
        </div>
        <div>
          <div className="text-2xl font-extrabold" style={{ color: "var(--hp-navy)" }}>{value}</div>
          <div className="text-sm" style={{ color: "var(--hp-gray)" }}>{label}</div>
        </div>
      </div>
    </Card>
  );
}

function Timeline({ status }) {
  const idx = Math.max(0, STATUS_LIST.indexOf(status));
  return (
    <div className="flex flex-col gap-0 sm:flex-row sm:items-start">
      {STATUS_LIST.map((s, i) => {
        const state = i < idx ? "done" : i === idx ? "current" : "upcoming";
        return (
          <div key={s} className="flex flex-1 items-start sm:flex-col">
            <div className="flex flex-col items-center sm:w-full">
              <div className="flex items-center w-full sm:w-auto">
                <div
                  className={cx(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:mx-auto"
                  )}
                  style={{
                    background: state === "upcoming" ? "#F1F3F6" : "var(--hp-blue)",
                    color: state === "upcoming" ? "#8A93A6" : "#fff",
                  }}
                >
                  {state === "done" ? <Check size={16} /> : i + 1}
                </div>
                {i < STATUS_LIST.length - 1 && (
                  <div className="mx-2 hidden h-0.5 flex-1 sm:block" style={{ background: i < idx ? "var(--hp-blue)" : "#E4E8F0" }} />
                )}
              </div>
            </div>
            <div className="ml-3 pb-4 sm:ml-0 sm:pt-2 sm:text-center">
              <div className={cx("text-sm", state === "upcoming" ? "text-slate-400" : "font-semibold")} style={{ color: state === "upcoming" ? undefined : "var(--hp-navy)" }}>
                {s}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className={cx("hp-card max-h-[90vh] w-full overflow-y-auto rounded-t-3xl sm:rounded-3xl", wide ? "sm:max-w-2xl" : "sm:max-w-lg")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--hp-border)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--hp-navy)" }}>{title}</h3>
          <button onClick={onClose} className="hp-focus rounded-full p-1.5 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}

/* ============================== LAYOUT ============================== */

function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="hp-focus flex items-center gap-2 rounded-lg">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--hp-blue)" }}>
        <FileCheck2 size={20} color="#fff" />
      </div>
      <span className="text-xl font-extrabold" style={{ color: "var(--hp-navy)" }}>
        Hujjat<span style={{ color: "var(--hp-blue)" }}>Plus</span>
      </span>
    </button>
  );
}

function Navbar({ view, go, goSection }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Bosh sahifa", action: () => go("home") },
    { label: "Xizmatlar", action: () => goSection("xizmatlar") },
    { label: "Buyurtmani tekshirish", action: () => go("track") },
    { label: "Mening buyurtmalarim", action: () => go("dashboard") },
    { label: "FAQ", action: () => goSection("faq") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur" style={{ borderColor: "var(--hp-border)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo onClick={() => go("home")} />
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <button key={l.label} onClick={l.action} className="hp-focus rounded text-sm font-semibold text-slate-600 hover:text-slate-900">
              {l.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => go("order")}>
            Xizmat buyurtma qilish
          </Button>
          <button className="hp-focus rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menyu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-white px-4 py-3 lg:hidden" style={{ borderColor: "var(--hp-border)" }}>
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => { l.action(); setOpen(false); }}
                className="hp-focus rounded-lg px-3 py-2.5 text-left text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </button>
            ))}
            <Button className="mt-2" onClick={() => { go("order"); setOpen(false); }}>
              Xizmat buyurtma qilish
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ go, goSection, setModal }) {
  const cols = [
    { label: "Bosh sahifa", action: () => go("home") },
    { label: "Xizmatlar", action: () => goSection("xizmatlar") },
    { label: "Buyurtma berish", action: () => go("order") },
    { label: "Buyurtmani tekshirish", action: () => go("track") },
    { label: "Biz haqimizda", action: () => setModal("about") },
    { label: "FAQ", action: () => goSection("faq") },
    { label: "Aloqa", action: () => goSection("aloqa") },
    { label: "Maxfiylik siyosati", action: () => setModal("privacy") },
  ];
  return (
    <footer className="mt-16" style={{ background: "var(--hp-navy)" }}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--hp-blue)" }}>
                <FileCheck2 size={20} color="#fff" />
              </div>
              <span className="text-xl font-extrabold text-white">HujjatPlus</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-300">Siz so'raysiz - biz bajaramiz.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 sm:flex sm:gap-10">
            <div className="flex flex-col gap-2">
              {cols.slice(0, 4).map((c) => (
                <button key={c.label} onClick={c.action} className="hp-focus text-left text-sm text-slate-300 hover:text-white">
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {cols.slice(4).map((c) => (
                <button key={c.label} onClick={c.action} className="hp-focus text-left text-sm text-slate-300 hover:text-white">
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row">
          <span>© {new Date().getFullYear()} HujjatPlus. Barcha huquqlar himoyalangan.</span>
          <button onClick={() => go("admin")} className="hp-focus text-slate-400 hover:text-white">
            Operator kirish
          </button>
        </div>
      </div>
    </footer>
  );
}

function TelegramFAB({ settings }) {
  const handle = settings.telegramUsername ? settings.telegramUsername.replace(/^@/, "") : "";
  const href = handle ? `https://t.me/${handle}` : undefined;
  return (
    <a
      href={href || "#"}
      onClick={(e) => { if (!href) e.preventDefault(); }}
      target={href ? "_blank" : undefined}
      rel="noreferrer"
      className="hp-focus fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full px-4 py-3.5 font-semibold text-white shadow-lg transition-transform hover:scale-105"
      style={{ background: "#229ED9" }}
      title={href ? "Telegram orqali yozing" : "Telegram manzili hali sozlanmagan"}
    >
      <Send size={19} />
      <span className="hidden sm:inline">Telegram orqali yozing</span>
    </a>
  );
}

/* ============================== HOME VIEW ============================== */

function Hero({ go }) {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F5F8FF 0%, #FFFFFF 100%)" }}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold" style={{ background: "#EAF1FF", color: "var(--hp-blue)" }}>
            <User size={15} /> Har bir buyurtmani odam ko'rib chiqadi
          </div>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl" style={{ color: "var(--hp-navy)" }}>
            Kerakli hujjat va raqamli xizmatlarni bizga topshiring
          </h1>
          <p className="mt-5 max-w-xl text-lg" style={{ color: "var(--hp-gray)" }}>
            Word, Excel, PDF, arizalar, davlat xizmatlari va boshqa raqamli ishlarni biz siz uchun bajaramiz.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => go("order")}>Xizmat buyurtma qilish</Button>
            <Button size="lg" variant="secondary" onClick={() => go("services-anchor")}>Barcha xizmatlar</Button>
          </div>
          <p className="mt-6 text-base font-medium" style={{ color: "var(--hp-navy)" }}>
            Siz faqat nima kerakligini aytasiz. Qolgan ishni biz bajaramiz.
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="hp-card relative rounded-3xl p-6">
            <div className="flex items-center gap-2 border-b pb-4" style={{ borderColor: "var(--hp-border)" }}>
              <div className="h-3 w-3 rounded-full bg-red-300" />
              <div className="h-3 w-3 rounded-full bg-amber-300" />
              <div className="h-3 w-3 rounded-full bg-green-300" />
              <span className="ml-2 text-sm font-medium text-slate-400">Buyurtma № HP-10482</span>
            </div>
            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ background: "#EAF1FF" }}>
                <FileText size={26} color="var(--hp-blue)" />
              </div>
              <div className="flex-1">
                <div className="h-3 w-3/4 rounded-full bg-slate-100" />
                <div className="mt-2 h-3 w-1/2 rounded-full bg-slate-100" />
                <div className="mt-3">
                  <StatusBadge status="Ish bajarilmoqda" />
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {["Word", "Excel", "PDF"].map((t) => (
                <div key={t} className="rounded-xl border py-2 text-center text-sm font-semibold text-slate-500" style={{ borderColor: "var(--hp-border)" }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="hp-card absolute -bottom-5 -left-5 flex items-center gap-2 rounded-2xl px-4 py-3 sm:-left-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#E9F9F0" }}>
              <CheckCircle2 size={18} color="#12A150" />
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--hp-navy)" }}>Operator ish boshladi</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, onOpen, onOrder }) {
  const Icon = ICONS[service.icon] || FileText;
  const c = COLORS[service.color] || COLORS.blue;
  return (
    <Card className="flex flex-col p-6 transition-shadow hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: c.bg }}>
        <Icon size={24} color={c.fg} />
      </div>
      <h3 className="mt-4 text-lg font-bold" style={{ color: "var(--hp-navy)" }}>{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: "var(--hp-gray)" }}>{service.shortDesc}</p>
      <div className="mt-5 flex items-center gap-4">
        <button onClick={() => onOpen(service.id)} className="hp-focus text-sm font-semibold" style={{ color: "var(--hp-blue)" }}>
          Batafsil
        </button>
        <button onClick={() => onOrder(service.id)} className="hp-focus flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--hp-navy)" }}>
          Buyurtma berish <ChevronRight size={15} />
        </button>
      </div>
    </Card>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, title: "Xizmatingizni tanlang", desc: "Sizga kerakli xizmatni tanlaysiz." },
    { n: 2, title: "Ma'lumotlarni yuboring", desc: "Kerakli ma'lumot yoki fayllarni yuborasiz." },
    { n: 3, title: "Biz bajaramiz", desc: "Operatorimiz buyurtmangizni ko'rib chiqadi va ishni bajaradi." },
    { n: 4, title: "Tayyor natijani oling", desc: "Tayyor hujjat yoki xizmat natijasi sizga yuboriladi." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>Qanday ishlaydi?</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.n} className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white" style={{ background: "var(--hp-blue)" }}>
                {s.n}
              </div>
              {i < steps.length - 1 && <div className="hidden h-0.5 flex-1 lg:block" style={{ background: "#E4E8F0" }} />}
            </div>
            <h3 className="mt-4 text-base font-bold" style={{ color: "var(--hp-navy)" }}>{s.title}</h3>
            <p className="mt-1.5 text-sm" style={{ color: "var(--hp-gray)" }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TRUST_ICONS = { ListChecks, LayoutTemplate, User, Clock };

function TrustSection() {
  return (
    <section className="py-16" style={{ background: "var(--hp-bg-soft)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>Nega HujjatPlus?</h2>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {TRUST_ITEMS.map((t) => {
            const Icon = TRUST_ICONS[t.icon];
            return (
              <div key={t.title} className="rounded-2xl bg-white p-5 text-center" style={{ border: "1px solid var(--hp-border)" }}>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "#EAF1FF" }}>
                  <Icon size={20} color="var(--hp-blue)" />
                </div>
                <h3 className="mt-3 font-bold" style={{ color: "var(--hp-navy)" }}>{t.title}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--hp-gray)" }}>{t.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ faqs }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>Ko'p so'raladigan savollar</h2>
      <div className="mt-8 flex flex-col gap-3">
        {faqs.map((f, i) => (
          <div key={i} className="hp-card overflow-hidden rounded-2xl">
            <button
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="hp-focus flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-semibold" style={{ color: "var(--hp-navy)" }}>{f.q}</span>
              <ChevronDown size={20} className={cx("shrink-0 transition-transform", openIdx === i && "rotate-180")} color="var(--hp-gray)" />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--hp-gray)" }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ settings }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  return (
    <section id="aloqa" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>Biz bilan bog'laning</h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "#E5F6FC" }}>
              <Send size={20} color="#229ED9" />
            </div>
            <div>
              <div className="text-sm" style={{ color: "var(--hp-gray)" }}>Telegram</div>
              <div className="font-semibold" style={{ color: "var(--hp-navy)" }}>{settings.telegramUsername || "Tez orada qo'shiladi"}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "#EAF1FF" }}>
              <Phone size={20} color="var(--hp-blue)" />
            </div>
            <div>
              <div className="text-sm" style={{ color: "var(--hp-gray)" }}>Telefon</div>
              <div className="font-semibold" style={{ color: "var(--hp-navy)" }}>{settings.phone || "Tez orada qo'shiladi"}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "#FFF3E8" }}>
              <Clock size={20} color="#D9770B" />
            </div>
            <div>
              <div className="text-sm" style={{ color: "var(--hp-gray)" }}>Ish vaqti</div>
              <div className="font-semibold" style={{ color: "var(--hp-navy)" }}>{settings.workingHours}</div>
            </div>
          </Card>
        </div>
        <Card className="p-6">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 size={40} color="#12A150" />
              <p className="mt-3 font-semibold" style={{ color: "var(--hp-navy)" }}>Xabaringiz yuborildi. Tez orada bog'lanamiz.</p>
            </div>
          ) : (
            <>
              <Field label="Ismingiz" required>
                <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ismingizni kiriting" />
              </Field>
              <Field label="Telefon yoki Telegram" required>
                <TextInput value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+998 90 123 45 67" />
              </Field>
              <Field label="Xabar" required>
                <TextArea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Savolingizni yozing" />
              </Field>
              <Button
                className="w-full"
                disabled={!form.name || !form.contact || !form.message}
                onClick={() => setSent(true)}
              >
                Yuborish
              </Button>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}

function HomeView({ go, goOrder, goService, services, faqs, settings }) {
  return (
    <div>
      <Hero go={go} />
      <section id="xizmatlar" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>Bizning xizmatlar</h2>
        <p className="mx-auto mt-3 max-w-xl text-center" style={{ color: "var(--hp-gray)" }}>
          Kerakli xizmatni tanlang - qolgan ishni operatorlarimiz bajaradi.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} onOpen={goService} onOrder={goOrder} />
          ))}
        </div>
      </section>
      <HowItWorks />
      <TrustSection />
      <FaqSection faqs={faqs} />
      <ContactSection settings={settings} />
    </div>
  );
}

/* ============================== SERVICE DETAIL VIEW ============================== */

function ServiceDetailView({ service, go, goOrder }) {
  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p style={{ color: "var(--hp-gray)" }}>Xizmat topilmadi.</p>
        <Button className="mt-4" onClick={() => go("home")}>Bosh sahifaga qaytish</Button>
      </div>
    );
  }
  const Icon = ICONS[service.icon] || FileText;
  const c = COLORS[service.color] || COLORS.blue;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <button onClick={() => go("home")} className="hp-focus mb-6 flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--hp-gray)" }}>
        <ChevronRight size={16} className="rotate-180" /> Bosh sahifa
      </button>
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ background: c.bg }}>
          <Icon size={30} color={c.fg} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>{service.title}</h1>
          <p className="mt-2" style={{ color: "var(--hp-gray)" }}>{service.longDesc}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-bold" style={{ color: "var(--hp-navy)" }}>Nimalarni bajaramiz</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {service.examples.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--hp-gray)" }}>
                <Check size={16} color="var(--hp-blue)" className="mt-0.5 shrink-0" /> {e}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold" style={{ color: "var(--hp-navy)" }}>Sizdan nima kerak</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {service.whatNeeded.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--hp-gray)" }}>
                <ChevronRight size={16} color="var(--hp-blue)" className="mt-0.5 shrink-0" /> {e}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Clock size={20} color="var(--hp-gray)" />
          <div>
            <div className="text-sm" style={{ color: "var(--hp-gray)" }}>Taxminiy muddat</div>
            <div className="font-semibold" style={{ color: "var(--hp-navy)" }}>{service.estimate}</div>
          </div>
        </div>
        <div className="text-sm font-medium" style={{ color: "var(--hp-navy)" }}>
          Narx buyurtma tafsilotlariga qarab belgilanadi.
        </div>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={() => goOrder(service.id)}>Buyurtma berish</Button>
        <Button size="lg" variant="secondary" onClick={() => go("home")}>Boshqa xizmatlar</Button>
      </div>
    </div>
  );
}

/* ============================== ORDER VIEW ============================== */

function OrderView({ services, orders, persistOrders, prefillServiceId, go }) {
  const [form, setForm] = useState({
    name: "", phone: "", telegram: "", serviceId: prefillServiceId || "", description: "",
    comment: "", contactMethod: "Telefon",
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (prefillServiceId) setForm((f) => ({ ...f, serviceId: prefillServiceId }));
  }, [prefillServiceId]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Ismingizni kiriting.";
    if (!form.phone.trim()) e.phone = "Telefon raqamingizni kiriting.";
    if (!form.serviceId) e.serviceId = "Xizmat turini tanlang.";
    if (!form.description.trim()) e.description = "Buyurtma haqida qisqacha yozing.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    const fileMeta = await processFiles(files);
    const service = services.find((s) => s.id === form.serviceId);
    const orderNumber = genOrderNumber(orders);
    const newOrder = {
      orderNumber,
      name: form.name.trim(),
      phone: form.phone.trim(),
      telegram: form.telegram.trim(),
      serviceId: form.serviceId,
      serviceName: service ? service.title : form.serviceId,
      description: form.description.trim(),
      comment: form.comment.trim(),
      contactMethod: form.contactMethod,
      files: fileMeta,
      status: STATUS_LIST[0],
      statusHistory: [{ status: STATUS_LIST[0], at: new Date().toISOString() }],
      notes: "",
      completedFiles: [],
      createdAt: new Date().toISOString(),
    };
    const nextOrders = [newOrder, ...orders];
    await persistOrders(nextOrders);
    setSubmitting(false);
    setResult(newOrder);
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "#E9F9F0" }}>
          <CheckCircle2 size={32} color="#12A150" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold" style={{ color: "var(--hp-navy)" }}>Buyurtmangiz qabul qilindi!</h1>
        <p className="mt-2" style={{ color: "var(--hp-gray)" }}>
          Operatorimiz buyurtmangizni ko'rib chiqadi va siz bilan bog'lanadi.
        </p>
        <Card className="mt-6 p-5">
          <div className="text-sm" style={{ color: "var(--hp-gray)" }}>Buyurtma raqami</div>
          <div className="mt-1 text-2xl font-extrabold tracking-wide" style={{ color: "var(--hp-blue)" }}>{result.orderNumber}</div>
        </Card>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => go("track", result.orderNumber)}>Buyurtmani kuzatish</Button>
          <Button variant="secondary" onClick={() => go("home")}>Bosh sahifaga qaytish</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>Xizmat buyurtma qilish</h1>
      <p className="mt-2" style={{ color: "var(--hp-gray)" }}>
        Quyidagi qisqa shaklni to'ldiring. Operatorimiz tez orada siz bilan bog'lanadi.
      </p>

      <Card className="mt-6 p-6">
        <Field label="Ism" required error={errors.name}>
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ismingizni kiriting" />
        </Field>
        <Field label="Telefon raqami" required error={errors.phone} hint="Operator shu raqam orqali bog'lanadi.">
          <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 123 45 67" />
        </Field>
        <Field label="Telegram username" hint="Ixtiyoriy. Masalan: @username">
          <TextInput value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="@username" />
        </Field>
        <Field label="Xizmat turi" required error={errors.serviceId}>
          <Select value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
            <option value="">Xizmatni tanlang</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </Select>
        </Field>
        <Field label="Buyurtma haqida qisqacha ma'lumot" required error={errors.description}>
          <TextArea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Sizga qanday yordam kerakligini yozing" />
        </Field>
        <Field label="Fayl yuklash" hint="Kerak bo'lsa, hujjat yoki rasm fayllarini biriktiring (4 tagacha).">
          <div
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="hp-focus flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 text-center"
            style={{ borderColor: "var(--hp-border)" }}
          >
            <Upload size={22} color="var(--hp-gray)" />
            <span className="text-sm font-medium" style={{ color: "var(--hp-navy)" }}>Fayl tanlash uchun bosing</span>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          </div>
          {files.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "var(--hp-gray)" }}>
                  <Paperclip size={14} /> {f.name}
                </li>
              ))}
            </ul>
          )}
        </Field>
        <Field label="Qo'shimcha izoh" hint="Ixtiyoriy">
          <TextArea rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Qo'shimcha izohingiz bo'lsa, yozing" />
        </Field>
        <Field label="Aloqa usuli">
          <div className="flex gap-3">
            {["Telefon", "Telegram"].map((m) => (
              <button
                key={m}
                onClick={() => setForm({ ...form, contactMethod: m })}
                className={cx(
                  "hp-focus flex-1 rounded-xl border px-4 py-3 text-sm font-semibold",
                )}
                style={{
                  borderColor: form.contactMethod === m ? "var(--hp-blue)" : "var(--hp-border)",
                  background: form.contactMethod === m ? "#EAF1FF" : "#fff",
                  color: form.contactMethod === m ? "var(--hp-blue)" : "var(--hp-gray)",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        <Button className="mt-2 w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
          {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
          {submitting ? "Yuborilmoqda..." : "Buyurtmani yuborish"}
        </Button>
      </Card>
    </div>
  );
}

/* ============================== TRACK VIEW ============================== */

function TrackView({ orders, prefillOrderNumber }) {
  const [orderNumber, setOrderNumber] = useState(prefillOrderNumber || "");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [found, setFound] = useState(null);

  useEffect(() => {
    if (prefillOrderNumber) setOrderNumber(prefillOrderNumber);
  }, [prefillOrderNumber]);

  function handleSearch() {
    setSearched(true);
    const match = orders.find(
      (o) => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() && o.phone.replace(/\s/g, "") === phone.replace(/\s/g, "")
    );
    setFound(match || null);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>Buyurtmani tekshirish</h1>
      <p className="mt-2" style={{ color: "var(--hp-gray)" }}>Buyurtma raqami va telefon raqamingizni kiriting.</p>

      <Card className="mt-6 p-6">
        <Field label="Buyurtma raqami" required>
          <TextInput value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="HP-10482" />
        </Field>
        <Field label="Telefon raqami" required>
          <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
        </Field>
        <Button className="w-full" icon={Search} onClick={handleSearch} disabled={!orderNumber || !phone}>
          Qidirish
        </Button>
      </Card>

      {searched && !found && (
        <Card className="mt-6 flex items-center gap-3 p-5">
          <AlertCircle size={20} color="#D9770B" />
          <p style={{ color: "var(--hp-navy)" }}>Buyurtma topilmadi. Raqamlarni tekshirib qayta urinib ko'ring.</p>
        </Card>
      )}

      {found && (
        <Card className="mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm" style={{ color: "var(--hp-gray)" }}>Buyurtma № {found.orderNumber}</div>
              <div className="mt-1 text-lg font-bold" style={{ color: "var(--hp-navy)" }}>{found.serviceName}</div>
            </div>
            <StatusBadge status={found.status} />
          </div>
          <div className="mt-6 overflow-x-auto">
            <Timeline status={found.status} />
          </div>
          <div className="mt-4 text-sm" style={{ color: "var(--hp-gray)" }}>Topshirilgan sana: {fmtDate(found.createdAt)}</div>
          {found.completedFiles && found.completedFiles.length > 0 && (
            <div className="mt-5 border-t pt-5" style={{ borderColor: "var(--hp-border)" }}>
              <h3 className="font-bold" style={{ color: "var(--hp-navy)" }}>Tayyor fayllar</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {found.completedFiles.map((f, i) => (
                  <li key={i}>
                    <a href={f.dataUrl || "#"} download={f.name} className="hp-focus flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--hp-blue)" }}>
                      <Download size={15} /> {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

/* ============================== DASHBOARD VIEW ============================== */

function DashboardView({ orders, settings, go }) {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const myOrders = orders.filter((o) => o.phone.replace(/\s/g, "") === phone.replace(/\s/g, "") && phone.trim() !== "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--hp-navy)" }}>Mening buyurtmalarim</h1>
      <p className="mt-2" style={{ color: "var(--hp-gray)" }}>Buyurtmalaringizni ko'rish uchun telefon raqamingizni kiriting.</p>

      <Card className="mt-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="Telefon raqami">
            <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
          </Field>
        </div>
        <Button className="sm:mb-5" icon={Search} onClick={() => setSearched(true)} disabled={!phone}>
          Qidirish
        </Button>
      </Card>

      {searched && myOrders.length === 0 && (
        <Card className="mt-6 p-6 text-center">
          <p style={{ color: "var(--hp-gray)" }}>Bu raqamga tegishli buyurtma topilmadi.</p>
          <Button className="mt-4" onClick={() => go("order")}>Yangi buyurtma berish</Button>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {myOrders.map((o) => (
          <Card key={o.orderNumber} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm" style={{ color: "var(--hp-gray)" }}>№ {o.orderNumber} · {fmtDate(o.createdAt)}</div>
                <div className="mt-0.5 font-bold" style={{ color: "var(--hp-navy)" }}>{o.serviceName}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--hp-gray)" }}>{o.description}</p>
            {o.completedFiles && o.completedFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {o.completedFiles.map((f, i) => (
                  <a
                    key={i}
                    href={f.dataUrl || "#"}
                    download={f.name}
                    className="hp-focus flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold"
                    style={{ background: "#EAF1FF", color: "var(--hp-blue)" }}
                  >
                    <Download size={14} /> {f.name}
                  </a>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-3 border-t pt-4" style={{ borderColor: "var(--hp-border)" }}>
              <a
                href={settings.telegramUsername ? `https://t.me/${settings.telegramUsername.replace(/^@/, "")}` : "#"}
                target="_blank" rel="noreferrer"
                className="hp-focus flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--hp-navy)" }}
              >
                <MessageSquare size={15} /> Operator bilan bog'lanish
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== ADMIN VIEW ============================== */

function AdminLogin({ onSuccess }) {
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 sm:px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "#EAF1FF" }}>
        <Lock size={26} color="var(--hp-blue)" />
      </div>
      <h1 className="mt-4 text-xl font-extrabold" style={{ color: "var(--hp-navy)" }}>Operator kirish</h1>
      <p className="mt-1 text-center text-sm" style={{ color: "var(--hp-gray)" }}>Bu bo'lim faqat HujjatPlus operatorlari uchun.</p>
      <Card className="mt-6 w-full p-5">
        <Field label="Parol" error={error}>
          <div className="relative">
            <TextInput
              type={show ? "text" : "password"}
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }}
              placeholder="Parolni kiriting"
              className="pr-11"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <Button
          className="w-full"
          onClick={() => (code === ADMIN_PASSCODE ? onSuccess() : setError("Parol noto'g'ri."))}
        >
          Kirish
        </Button>
      </Card>
      <p className="mt-4 text-center text-xs" style={{ color: "var(--hp-gray)" }}>
        Namoyish rejimi: parol - operator2026
      </p>
    </div>
  );
}

function AdminOrderDrawer({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.notes || "");
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  function saveStatus() {
    const history = [...(order.statusHistory || []), { status, at: new Date().toISOString() }];
    onUpdate({ ...order, status, statusHistory: history });
  }
  function saveNotes() {
    onUpdate({ ...order, notes });
  }
  async function addCompletedFiles(fileList) {
    setUploading(true);
    const meta = await processFiles(fileList);
    onUpdate({ ...order, completedFiles: [...(order.completedFiles || []), ...meta] });
    setUploading(false);
  }
  function removeCompletedFile(idx) {
    const next = (order.completedFiles || []).filter((_, i) => i !== idx);
    onUpdate({ ...order, completedFiles: next });
  }

  return (
    <Modal title={`Buyurtma № ${order.orderNumber}`} onClose={onClose} wide>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--hp-gray)" }}>Mijoz</h4>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <div className="font-semibold" style={{ color: "var(--hp-navy)" }}>{order.name}</div>
            <div style={{ color: "var(--hp-gray)" }}>{order.phone}</div>
            {order.telegram && <div style={{ color: "var(--hp-gray)" }}>{order.telegram}</div>}
            <div style={{ color: "var(--hp-gray)" }}>Aloqa usuli: {order.contactMethod}</div>
          </div>
          <h4 className="mt-4 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--hp-gray)" }}>Xizmat</h4>
          <p className="mt-1 text-sm font-semibold" style={{ color: "var(--hp-navy)" }}>{order.serviceName}</p>
          <p className="mt-1 text-sm" style={{ color: "var(--hp-gray)" }}>{order.description}</p>
          {order.comment && <p className="mt-1 text-sm italic" style={{ color: "var(--hp-gray)" }}>"{order.comment}"</p>}

          <h4 className="mt-4 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--hp-gray)" }}>Mijoz yuklagan fayllar</h4>
          {order.files && order.files.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1.5">
              {order.files.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "var(--hp-gray)" }}>
                  <Paperclip size={14} />
                  {f.dataUrl ? (
                    <a href={f.dataUrl} download={f.name} className="hp-focus font-medium" style={{ color: "var(--hp-blue)" }}>{f.name}</a>
                  ) : (
                    <span>{f.name} (juda katta, operator bog'lanadi)</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm" style={{ color: "var(--hp-gray)" }}>Fayl biriktirilmagan.</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--hp-gray)" }}>Status</h4>
          <div className="mt-2 flex gap-2">
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="flex-1">
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Button size="sm" icon={Save} onClick={saveStatus}>Saqlash</Button>
          </div>
          <Button size="sm" variant="secondary" className="mt-2 w-full" icon={CheckCircle2} onClick={() => { setStatus("Yakunlandi"); onUpdate({ ...order, status: "Yakunlandi", statusHistory: [...(order.statusHistory || []), { status: "Yakunlandi", at: new Date().toISOString() }] }); }}>
            Yakunlandi deb belgilash
          </Button>

          <h4 className="mt-5 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--hp-gray)" }}>Ichki eslatma (faqat operator uchun)</h4>
          <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Eslatma yozing" className="mt-2" />
          <Button size="sm" variant="secondary" className="mt-2" icon={Save} onClick={saveNotes}>Eslatmani saqlash</Button>

          <h4 className="mt-5 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--hp-gray)" }}>Tayyor fayllar</h4>
          {order.completedFiles && order.completedFiles.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1.5">
              {order.completedFiles.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-sm" style={{ color: "var(--hp-gray)" }}>
                  <span className="flex items-center gap-2"><Paperclip size={14} /> {f.name}</span>
                  <button onClick={() => removeCompletedFile(i)} className="hp-focus text-red-500"><Trash2 size={14} /></button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm" style={{ color: "var(--hp-gray)" }}>Hali fayl yuklanmagan.</p>
          )}
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="hp-focus mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm font-semibold"
            style={{ borderColor: "var(--hp-border)", color: "var(--hp-navy)" }}
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Tayyor fayl yuklash
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => addCompletedFiles(e.target.files)} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

function AdminOrdersTab({ orders, updateOrder }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = orders.filter((o) => {
    const matchesQ = !q || [o.orderNumber, o.name, o.phone, o.serviceName].join(" ").toLowerCase().includes(q.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="var(--hp-gray)" />
          <TextInput className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Raqam, ism yoki telefon bo'yicha qidirish" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-56">
          <option value="">Barcha statuslar</option>
          {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {filtered.length === 0 && (
          <Card className="p-8 text-center" style={{ color: "var(--hp-gray)" }}>Buyurtmalar topilmadi.</Card>
        )}
        {filtered.map((o) => (
          <Card key={o.orderNumber} className="cursor-pointer p-4 hover:shadow-md sm:p-5" onClick={() => setSelected(o)}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--hp-blue)" }}>{o.orderNumber}</div>
                <div className="font-bold" style={{ color: "var(--hp-navy)" }}>{o.name} · {o.serviceName}</div>
                <div className="text-sm" style={{ color: "var(--hp-gray)" }}>{o.phone} · {fmtDate(o.createdAt)}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
          </Card>
        ))}
      </div>

      {selected && (
        <AdminOrderDrawer
          order={orders.find((o) => o.orderNumber === selected.orderNumber) || selected}
          onClose={() => setSelected(null)}
          onUpdate={(updated) => { updateOrder(updated); setSelected(updated); }}
        />
      )}
    </div>
  );
}

function ServiceEditForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial);
  return (
    <Card className="p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nomi" required><TextInput value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Rang">
          <Select value={f.color} onChange={(e) => setF({ ...f, color: e.target.value })}>
            {Object.keys(COLORS).map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Qisqa tavsif (kartochkada ko'rinadi)"><TextArea rows={2} value={f.shortDesc} onChange={(e) => setF({ ...f, shortDesc: e.target.value })} /></Field>
      <Field label="To'liq tavsif"><TextArea rows={3} value={f.longDesc} onChange={(e) => setF({ ...f, longDesc: e.target.value })} /></Field>
      <Field label="Misollar (vergul bilan ajrating)">
        <TextInput value={f.examples.join(", ")} onChange={(e) => setF({ ...f, examples: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
      </Field>
      <Field label="Mijozdan nima kerak (vergul bilan ajrating)">
        <TextInput value={f.whatNeeded.join(", ")} onChange={(e) => setF({ ...f, whatNeeded: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
      </Field>
      <Field label="Taxminiy muddat"><TextInput value={f.estimate} onChange={(e) => setF({ ...f, estimate: e.target.value })} /></Field>
      <div className="flex gap-3">
        <Button icon={Save} onClick={() => onSave(f)}>Saqlash</Button>
        <Button variant="ghost" onClick={onCancel}>Bekor qilish</Button>
      </div>
    </Card>
  );
}

function AdminServicesTab({ services, updateServices }) {
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  function save(updated) {
    updateServices(services.map((s) => (s.id === updated.id ? updated : s)));
    setEditingId(null);
  }
  function remove(id) {
    updateServices(services.filter((s) => s.id !== id));
  }
  function addNew(f) {
    const id = f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `xizmat-${Date.now()}`;
    updateServices([...services, { ...f, id, icon: "FileText" }]);
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold" style={{ color: "var(--hp-navy)" }}>Xizmatlar ({services.length})</h3>
        <Button size="sm" icon={Plus} onClick={() => setAdding(true)}>Yangi xizmat</Button>
      </div>
      {adding && (
        <ServiceEditForm
          initial={{ title: "", shortDesc: "", longDesc: "", examples: [], whatNeeded: [], estimate: "", color: "blue" }}
          onSave={addNew}
          onCancel={() => setAdding(false)}
        />
      )}
      {services.map((s) => {
        const Icon = ICONS[s.icon] || FileText;
        const c = COLORS[s.color] || COLORS.blue;
        return editingId === s.id ? (
          <ServiceEditForm key={s.id} initial={s} onSave={save} onCancel={() => setEditingId(null)} />
        ) : (
          <Card key={s.id} className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: c.bg }}>
                <Icon size={18} color={c.fg} />
              </div>
              <div>
                <div className="font-semibold" style={{ color: "var(--hp-navy)" }}>{s.title}</div>
                <div className="text-sm" style={{ color: "var(--hp-gray)" }}>{s.shortDesc}</div>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => setEditingId(s.id)} className="hp-focus rounded-lg p-2 hover:bg-slate-100"><Pencil size={16} /></button>
              <button onClick={() => remove(s.id)} className="hp-focus rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function AdminFaqTab({ faqs, updateFaqs }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ q: "", a: "" });

  function startEdit(i) { setEditingIdx(i); setDraft(faqs[i]); }
  function save(i) {
    const next = [...faqs];
    next[i] = draft;
    updateFaqs(next);
    setEditingIdx(null);
  }
  function remove(i) { updateFaqs(faqs.filter((_, idx) => idx !== i)); }
  function addNew() { updateFaqs([...faqs, draft]); setDraft({ q: "", a: "" }); setAdding(false); }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold" style={{ color: "var(--hp-navy)" }}>FAQ ({faqs.length})</h3>
        <Button size="sm" icon={Plus} onClick={() => { setAdding(true); setDraft({ q: "", a: "" }); }}>Yangi savol</Button>
      </div>
      {adding && (
        <Card className="p-5">
          <Field label="Savol"><TextInput value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} /></Field>
          <Field label="Javob"><TextArea rows={3} value={draft.a} onChange={(e) => setDraft({ ...draft, a: e.target.value })} /></Field>
          <div className="flex gap-3">
            <Button icon={Save} onClick={addNew}>Saqlash</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Bekor qilish</Button>
          </div>
        </Card>
      )}
      {faqs.map((f, i) =>
        editingIdx === i ? (
          <Card key={i} className="p-5">
            <Field label="Savol"><TextInput value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })} /></Field>
            <Field label="Javob"><TextArea rows={3} value={draft.a} onChange={(e) => setDraft({ ...draft, a: e.target.value })} /></Field>
            <div className="flex gap-3">
              <Button icon={Save} onClick={() => save(i)}>Saqlash</Button>
              <Button variant="ghost" onClick={() => setEditingIdx(null)}>Bekor qilish</Button>
            </div>
          </Card>
        ) : (
          <Card key={i} className="flex items-start justify-between gap-3 p-4">
            <div>
              <div className="font-semibold" style={{ color: "var(--hp-navy)" }}>{f.q}</div>
              <div className="mt-1 text-sm" style={{ color: "var(--hp-gray)" }}>{f.a}</div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => startEdit(i)} className="hp-focus rounded-lg p-2 hover:bg-slate-100"><Pencil size={16} /></button>
              <button onClick={() => remove(i)} className="hp-focus rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
          </Card>
        )
      )}
    </div>
  );
}

function AdminSettingsTab({ settings, updateSettings }) {
  const [f, setF] = useState(settings);
  const [saved, setSaved] = useState(false);
  return (
    <Card className="max-w-lg p-6">
      <Field label="Telegram username" hint="Masalan: @hujjatplus">
        <TextInput value={f.telegramUsername} onChange={(e) => setF({ ...f, telegramUsername: e.target.value })} placeholder="@username" />
      </Field>
      <Field label="Telefon raqami">
        <TextInput value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+998 90 123 45 67" />
      </Field>
      <Field label="Ish vaqti">
        <TextInput value={f.workingHours} onChange={(e) => setF({ ...f, workingHours: e.target.value })} />
      </Field>
      <Button icon={Save} onClick={() => { updateSettings(f); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
        {saved ? "Saqlandi" : "Saqlash"}
      </Button>
    </Card>
  );
}

function AdminView({ orders, updateOrder, services, updateServices, faqs, updateFaqs, settings, updateSettings, onLogout }) {
  const [tab, setTab] = useState("orders");
  const stats = {
    newCount: orders.filter((o) => o.status === "Qabul qilindi").length,
    inProgress: orders.filter((o) => ["Ko'rib chiqilmoqda", "Ish bajarilmoqda", "Tekshirilmoqda"].includes(o.status)).length,
    completed: orders.filter((o) => o.status === "Yakunlandi").length,
    total: orders.length,
    today: orders.filter((o) => isToday(o.createdAt)).length,
  };
  const tabs = [
    { id: "orders", label: "Buyurtmalar", icon: ClipboardList },
    { id: "services", label: "Xizmatlar", icon: LayoutTemplate },
    { id: "faq", label: "FAQ", icon: Info },
    { id: "settings", label: "Sozlamalar", icon: SettingsIcon },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--hp-navy)" }}>Operator paneli</h1>
          <p className="text-sm" style={{ color: "var(--hp-gray)" }}>Buyurtmalarni boshqarish va tizim sozlamalari.</p>
        </div>
        <Button variant="ghost" icon={LogOut} onClick={onLogout}>Chiqish</Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Yangi buyurtmalar" value={stats.newCount} icon={ClipboardList} color="blue" />
        <StatCard label="Jarayonda" value={stats.inProgress} icon={Clock} color="orange" />
        <StatCard label="Yakunlangan" value={stats.completed} icon={CheckCircle2} color="green" />
        <StatCard label="Jami buyurtmalar" value={stats.total} icon={LayoutDashboard} color="purple" />
        <StatCard label="Bugungi buyurtmalar" value={stats.today} icon={ClipboardList} color="gray" />
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto border-b" style={{ borderColor: "var(--hp-border)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="hp-focus flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold"
            style={{ borderColor: tab === t.id ? "var(--hp-blue)" : "transparent", color: tab === t.id ? "var(--hp-blue)" : "var(--hp-gray)" }}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "orders" && <AdminOrdersTab orders={orders} updateOrder={updateOrder} />}
        {tab === "services" && <AdminServicesTab services={services} updateServices={updateServices} />}
        {tab === "faq" && <AdminFaqTab faqs={faqs} updateFaqs={updateFaqs} />}
        {tab === "settings" && <AdminSettingsTab settings={settings} updateSettings={updateSettings} />}
      </div>
    </div>
  );
}

/* ============================== INFO MODALS ============================== */

function InfoModal({ kind, onClose }) {
  if (kind === "about") {
    return (
      <Modal title="Biz haqimizda" onClose={onClose}>
        <p className="text-sm leading-relaxed" style={{ color: "var(--hp-gray)" }}>
          HujjatPlus - hujjatlar va raqamli xizmatlar bilan bog'liq ishlarni odamlar o'rniga bajarib beruvchi xizmat. Biz ayniqsa kompyuter va internetdan foydalanishga unchalik ko'nikmagan odamlarga yordam berishni maqsad qilganmiz: siz nima kerakligini aytasiz, ishni operatorlarimiz bajaradi.
        </p>
      </Modal>
    );
  }
  return (
    <Modal title="Maxfiylik siyosati" onClose={onClose}>
      <p className="text-sm leading-relaxed" style={{ color: "var(--hp-gray)" }}>
        Bu bo'lim namunaviy matn sifatida keltirilgan. HujjatPlusning rasmiy maxfiylik siyosati matni sayt administratori tomonidan keyinroq joylashtiriladi.
      </p>
    </Modal>
  );
}

/* ============================== ROOT APP ============================== */

export default function App() {
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [prefillServiceId, setPrefillServiceId] = useState(null);
  const [prefillOrderNumber, setPrefillOrderNumber] = useState(null);
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [modal, setModal] = useState(null);
  const [pendingScroll, setPendingScroll] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const [o, s, f, st] = await Promise.all([
        storageGet(STORAGE_KEYS.orders, true),
        storageGet(STORAGE_KEYS.services, true),
        storageGet(STORAGE_KEYS.faqs, true),
        storageGet(STORAGE_KEYS.settings, true),
      ]);
      setOrders(o || []);
      setServices(s && s.length ? s : DEFAULT_SERVICES);
      setFaqs(f && f.length ? f : DEFAULT_FAQS);
      setSettings(st || DEFAULT_SETTINGS);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  useEffect(() => {
    if (view === "home" && pendingScroll) {
      const el = document.getElementById(pendingScroll);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 60);
      setPendingScroll(null);
    }
  }, [view, pendingScroll]);

  function go(target, extra) {
    if (target === "services-anchor") {
      setView("home");
      setPendingScroll("xizmatlar");
      return;
    }
    if (target === "track" && extra) setPrefillOrderNumber(extra);
    setView(target);
  }
  function goSection(id) {
    setView("home");
    setPendingScroll(id);
  }
  function goOrder(serviceId) {
    setPrefillServiceId(serviceId || null);
    setView("order");
  }
  function goService(serviceId) {
    setSelectedServiceId(serviceId);
    setView("service");
  }

  async function persistOrders(next) {
    setOrders(next);
    const ok = await storageSet(STORAGE_KEYS.orders, next, true);
    if (!ok) setToast("Saqlashda xatolik yuz berdi. Qayta urinib ko'ring.");
  }
  function updateOrder(updated) {
    const next = orders.map((o) => (o.orderNumber === updated.orderNumber ? updated : o));
    persistOrders(next);
    setToast("Saqlandi");
    setTimeout(() => setToast(null), 1800);
  }
  async function updateServices(next) {
    setServices(next);
    await storageSet(STORAGE_KEYS.services, next, true);
  }
  async function updateFaqs(next) {
    setFaqs(next);
    await storageSet(STORAGE_KEYS.faqs, next, true);
  }
  async function updateSettings(next) {
    setSettings(next);
    await storageSet(STORAGE_KEYS.settings, next, true);
  }

  const selectedService = services.find((s) => s.id === selectedServiceId) || null;

  return (
    <div className="min-h-screen font-display" style={{ background: "#fff", color: "var(--hp-navy)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        :root {
          --hp-blue: #155EEF;
          --hp-blue-dark: #0E3AA8;
          --hp-navy: #0F1A2A;
          --hp-gray: #55607A;
          --hp-bg-soft: #F5F8FF;
          --hp-border: rgba(15,26,42,0.09);
        }
        .font-display { font-family: 'Manrope', ui-sans-serif, system-ui, -apple-system, sans-serif; }
        .hp-card { background:#fff; border:1px solid var(--hp-border); box-shadow: 0 1px 2px rgba(15,26,42,0.04), 0 8px 20px rgba(15,26,42,0.05); }
        .hp-btn-primary { background: var(--hp-blue); color:#fff; }
        .hp-btn-primary:hover { background: var(--hp-blue-dark); }
        .hp-btn-secondary { background:#fff; color: var(--hp-blue); border:1.5px solid var(--hp-blue); }
        .hp-btn-secondary:hover { background:#F5F8FF; }
        .hp-input { border-color: var(--hp-border); color: var(--hp-navy); }
        .hp-input:focus { border-color: var(--hp-blue); box-shadow: 0 0 0 3px rgba(21,94,239,0.12); }
        .hp-focus:focus-visible { outline: 2px solid var(--hp-blue); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } }
      `}</style>

      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 size={28} className="animate-spin" color="var(--hp-blue)" />
        </div>
      ) : (
        <>
          <Navbar view={view} go={go} goSection={goSection} />

          {view === "home" && (
            <HomeView go={go} goOrder={goOrder} goService={goService} services={services} faqs={faqs} settings={settings} />
          )}
          {view === "order" && (
            <OrderView services={services} orders={orders} persistOrders={persistOrders} prefillServiceId={prefillServiceId} go={go} />
          )}
          {view === "track" && <TrackView orders={orders} prefillOrderNumber={prefillOrderNumber} />}
          {view === "service" && <ServiceDetailView service={selectedService} go={go} goOrder={goOrder} />}
          {view === "dashboard" && <DashboardView orders={orders} settings={settings} go={go} />}
          {view === "admin" &&
            (isAdminAuthed ? (
              <AdminView
                orders={orders}
                updateOrder={updateOrder}
                services={services}
                updateServices={updateServices}
                faqs={faqs}
                updateFaqs={updateFaqs}
                settings={settings}
                updateSettings={updateSettings}
                onLogout={() => { setIsAdminAuthed(false); go("home"); }}
              />
            ) : (
              <AdminLogin onSuccess={() => setIsAdminAuthed(true)} />
            ))}

          <Footer go={go} goSection={goSection} setModal={setModal} />
          <TelegramFAB settings={settings} />
          {modal && <InfoModal kind={modal} onClose={() => setModal(null)} />}
          <Toast message={toast} />
        </>
      )}
    </div>
  );
}
