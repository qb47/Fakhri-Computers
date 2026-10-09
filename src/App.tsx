import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ───────────────────────── constants ───────────────────────── */

const WA_NUMBER = "971555755427";
const WA_DISPLAY = "+971 55 575 7427";
const NOTE = "Indicative. Final price confirmed on your WhatsApp shortlist, valid 48 hours.";

const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* ───────────────────────── icons ───────────────────────── */

const ICONS: Record<string, ReactNode> = {
  arrow: (<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>),
  back: (<><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>),
  check: <path d="M20 6 9 17l-5-5" />,
  shield: (<><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>),
  camera: (<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" /><circle cx="12" cy="13" r="3" /></>),
  clock: (<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>),
  laptop: <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />,
  monitor: (<><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></>),
  mouse: (<><rect x="5" y="2" width="14" height="20" rx="7" /><path d="M12 6v4" /></>),
  pin: (<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>),
  x: (<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>),
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  send: (<><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>),
  menu: (<><path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h16" /></>),
  edit: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>),
  user: (<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  users: (<><path d="M17 21v-2a4 4 0 0 0-3-3.87" /><path d="M9 21v-2a4 4 0 0 1 3-3.87" /><circle cx="9" cy="7" r="4" /><path d="M21 7a4 4 0 0 0-3.87 3" /></>),
  lock: (<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6M4.93 4.93l4.24 4.24m5.66 5.66 4.24 4.24M1 12h6m6 0h6M4.93 19.07l4.24-4.24m5.66-5.66 4.24-4.24" /></>),
  inbox: (<><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>),
  package: (<><path d="M16.5 9.4 7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.3 7 12 12l8.7-5" /><path d="m12 22.08V12" /></>),
  trash: (<><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>),
  plus: (<><path d="M12 5v14" /><path d="M5 12h14" /></>),
  eye: (<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>),
  eyeOff: (<><path d="m15 9-6 6" /><path d="m21 3-3 3M2 12s3-7 10-7c2 0 3.5.7 4.8 1.6M9 5.3C10.3 5.1 11.1 5 12 5c7 0 10 7 10 7s-.6 1.5-1.6 2.9m-4.2 2.5A7 7 0 0 1 12 19c-7 0-10-7-10-7s.6-1.5 1.6-2.9" /><circle cx="12" cy="12" r="3" /></>),
  logOut: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>),
  download: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></>),
};

function Icon({ name, className = "size-5", fill = "none", sw = 2 }: { name: string; className?: string; fill?: string; sw?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* ───────────────────────── data ───────────────────────── */

const USES = [
  { id: "everyday", label: "Everyday", hint: "Browsing, video calls, streaming" },
  { id: "study", label: "Study", hint: "School or university work" },
  { id: "business", label: "Business and office work", hint: "Documents, Excel, meetings" },
  { id: "gaming", label: "Gaming", hint: "Modern games at smooth settings" },
  { id: "design", label: "Design and video editing", hint: "Photoshop, Premiere, 3D" },
  { id: "programming", label: "Programming", hint: "Code, VMs, many tabs" },
];

const BUDGETS = [
  { id: "b1", label: "Under AED 1,500", short: "an entry budget", min: 0, max: 1500 },
  { id: "b2", label: "AED 1,500 – 2,500", short: "a lower-mid budget", min: 1500, max: 2500 },
  { id: "b3", label: "AED 2,500 – 4,000", short: "a mid budget", min: 2500, max: 4000 },
  { id: "b4", label: "AED 4,000 – 6,000", short: "an upper budget", min: 4000, max: 6000 },
  { id: "b5", label: "AED 6,000+", short: "a premium budget", min: 6000, max: 0 },
  { id: "bx", label: "Not sure, advise me", short: "a budget we'll advise on", min: 0, max: 0 },
];

const PORTS = [
  { id: "light", label: "Light for travel", hint: "13–14\", easy to carry daily", phrase: "something light for travel" },
  { id: "balanced", label: "Balanced", hint: "14–15.6\", good mix of both", phrase: "a balanced size" },
  { id: "desk", label: "Big screen for a desk", hint: "15.6\"+ for comfort and space", phrase: "a big screen for a desk" },
];

const CONDS = [
  { id: "budget", label: "Budget second-hand", hint: "Fully tested, normal wear. Best price.", phrase: "budget second-hand" },
  { id: "good", label: "Good second-hand", hint: "Clean unit, light wear only.", phrase: "good second-hand condition" },
  { id: "new", label: "Like-new package", hint: "Cleaned, cosmetically refreshed and boxed. Costs extra.", phrase: "a like-new package" },
];

const MUSTS = [
  { id: "ssd", label: "SSD" },
  { id: "ram", label: "16GB+ RAM" },
  { id: "gpu", label: "Dedicated graphics" },
  { id: "battery", label: "Long battery" },
  { id: "numpad", label: "Numeric keypad" },
  { id: "touch", label: "Touchscreen" },
];

type Machine = {
  id: string; name: string; year: number; cpu: string; ram: number; ssd: number; gpu: string | null;
  screen: number; kg: number; bat: number; numpad: boolean; touch: boolean; uses: string[];
  low: number; high: number; grade: string; hue: number;
};

const CATALOG: Machine[] = [
  { id: "m1", name: "Dell Latitude 3510", year: 2020, cpu: "Core i3-10110U", ram: 8, ssd: 256, gpu: null, screen: 15.6, kg: 1.8, bat: 6, numpad: true, touch: false, uses: ["everyday", "study"], low: 800, high: 1100, grade: "B", hue: 210 },
  { id: "m2", name: "Dell Latitude 7480", year: 2018, cpu: "Core i5-7300U", ram: 8, ssd: 256, gpu: null, screen: 14, kg: 1.5, bat: 8, numpad: false, touch: false, uses: ["everyday", "study", "business"], low: 900, high: 1300, grade: "B", hue: 200 },
  { id: "m3", name: "Dell Latitude 5420", year: 2021, cpu: "Core i5-1135G7", ram: 8, ssd: 256, gpu: null, screen: 14, kg: 1.5, bat: 9, numpad: false, touch: false, uses: ["everyday", "study", "business"], low: 1100, high: 1500, grade: "A-", hue: 215 },
  { id: "m4", name: "HP Pavilion 15", year: 2021, cpu: "Core i5-1135G7", ram: 8, ssd: 512, gpu: null, screen: 15.6, kg: 1.7, bat: 7, numpad: true, touch: false, uses: ["everyday", "study"], low: 1300, high: 1800, grade: "A-", hue: 190 },
  { id: "m5", name: "Lenovo IdeaPad Flex 5", year: 2021, cpu: "Ryzen 5 5500U", ram: 16, ssd: 512, gpu: null, screen: 14, kg: 1.5, bat: 10, numpad: false, touch: true, uses: ["study", "everyday", "design"], low: 1600, high: 2200, grade: "A", hue: 270 },
  { id: "m6", name: "Lenovo ThinkPad E15 Gen 3", year: 2021, cpu: "Ryzen 5 5500U", ram: 16, ssd: 512, gpu: null, screen: 15.6, kg: 1.7, bat: 9, numpad: true, touch: false, uses: ["business", "study", "programming"], low: 1700, high: 2200, grade: "A-", hue: 220 },
  { id: "m7", name: "HP EliteBook 840 G7", year: 2020, cpu: "Core i7-10610U", ram: 16, ssd: 512, gpu: null, screen: 14, kg: 1.4, bat: 10, numpad: false, touch: false, uses: ["business", "programming"], low: 1700, high: 2300, grade: "A", hue: 205 },
  { id: "m8", name: "Lenovo ThinkPad T14 Gen 2", year: 2021, cpu: "Core i5-1145G7", ram: 16, ssd: 512, gpu: null, screen: 14, kg: 1.4, bat: 10, numpad: false, touch: false, uses: ["business", "programming", "everyday"], low: 1900, high: 2500, grade: "A", hue: 225 },
  { id: "m9", name: "Dell Latitude 5530", year: 2022, cpu: "Core i5-1235U", ram: 16, ssd: 512, gpu: null, screen: 15.6, kg: 1.6, bat: 10, numpad: true, touch: false, uses: ["business", "everyday", "programming"], low: 2200, high: 2900, grade: "A", hue: 212 },
  { id: "m10", name: "MacBook Air M1", year: 2020, cpu: "Apple M1", ram: 8, ssd: 256, gpu: null, screen: 13.3, kg: 1.29, bat: 15, numpad: false, touch: false, uses: ["study", "everyday", "design"], low: 2300, high: 3000, grade: "A", hue: 240 },
  { id: "m11", name: "Asus TUF Gaming F15", year: 2020, cpu: "Core i5-10300H", ram: 16, ssd: 512, gpu: "GTX 1650", screen: 15.6, kg: 2.3, bat: 5, numpad: true, touch: false, uses: ["gaming"], low: 2600, high: 3400, grade: "B+", hue: 20 },
  { id: "m12", name: "Acer Nitro 5", year: 2021, cpu: "Core i5-11400H", ram: 16, ssd: 512, gpu: "RTX 3050", screen: 15.6, kg: 2.2, bat: 5, numpad: true, touch: false, uses: ["gaming", "design"], low: 3000, high: 3800, grade: "A-", hue: 5 },
  { id: "m13", name: "Lenovo Legion 5", year: 2021, cpu: "Ryzen 7 5800H", ram: 16, ssd: 512, gpu: "RTX 3060", screen: 15.6, kg: 2.4, bat: 6, numpad: true, touch: false, uses: ["gaming", "design", "programming"], low: 3800, high: 4800, grade: "A", hue: 280 },
  { id: "m14", name: "ThinkPad P15v Gen 1", year: 2020, cpu: "Core i7-10750H", ram: 32, ssd: 1024, gpu: "Quadro T1000", screen: 15.6, kg: 2.2, bat: 6, numpad: true, touch: false, uses: ["design", "programming"], low: 3900, high: 5000, grade: "A-", hue: 230 },
  { id: "m15", name: "Dell XPS 15 9510", year: 2021, cpu: "Core i7-11800H", ram: 32, ssd: 1024, gpu: "RTX 3050 Ti", screen: 15.6, kg: 1.9, bat: 10, numpad: false, touch: true, uses: ["design", "programming"], low: 4600, high: 5800, grade: "A", hue: 195 },
  { id: "m16", name: "MacBook Pro 14 M1 Pro", year: 2021, cpu: "Apple M1 Pro", ram: 16, ssd: 512, gpu: null, screen: 14.2, kg: 1.6, bat: 15, numpad: false, touch: false, uses: ["design", "programming"], low: 5500, high: 6800, grade: "A", hue: 250 },
  { id: "m17", name: "HP ZBook Fury 17 G7", year: 2020, cpu: "Core i7-10850H", ram: 32, ssd: 1024, gpu: "Quadro RTX 3000", screen: 17.3, kg: 2.8, bat: 4, numpad: true, touch: false, uses: ["design"], low: 5200, high: 6500, grade: "B+", hue: 160 },
];

const RECENT: { id: string; status: "Available" | "Sold"; note: string }[] = [
  { id: "m8", status: "Available", note: "Listed 2 days ago" },
  { id: "m12", status: "Sold", note: "Sourced in 3 days" },
  { id: "m10", status: "Available", note: "Listed today" },
  { id: "m3", status: "Sold", note: "Sourced in 1 day" },
];

const CATEGORIES = {
  laptops: {
    title: "Laptops",
    icon: "laptop",
    blurb: "Business-class, student, gaming and creator machines, sourced one client at a time.",
    items: [] as { name: string; range: string; detail: string }[],
  },
  monitors: {
    title: "Monitors",
    icon: "monitor",
    blurb: "Office and creative displays, tested for dead pixels and backlight bleed before they reach you.",
    items: [
      { name: "Dell P2419H, 24\" IPS", range: "AED 250 – 400", detail: "Full HD, height-adjustable stand" },
      { name: "HP EliteDisplay E243", range: "AED 200 – 350", detail: "Full HD, thin bezel, HDMI + DisplayPort" },
      { name: "Samsung 27\" QHD", range: "AED 450 – 700", detail: "Sharper text for spreadsheets and code" },
      { name: "LG 27UK 4K IPS", range: "AED 700 – 1,000", detail: "4K, good for photo and video work" },
      { name: "Dell U2720Q, 27\" 4K USB-C", range: "AED 900 – 1,300", detail: "Single-cable laptop docking" },
    ],
  },
  accessories: {
    title: "Accessories",
    icon: "mouse",
    blurb: "Chargers, docks, bags and upgrades that match the machine you actually own.",
    items: [
      { name: "Brand-matched laptop charger", range: "AED 80 – 200", detail: "Dell, HP, Lenovo, Apple" },
      { name: "Wireless mouse", range: "AED 25 – 90", detail: "Logitech and similar" },
      { name: "USB-C docking station", range: "AED 250 – 500", detail: "HDMI, Ethernet, USB ports" },
      { name: "Laptop bag or sleeve", range: "AED 60 – 150", detail: "Padded, fits up to 15.6\"" },
      { name: "RAM or SSD upgrade, fitted", range: "AED 120 – 450", detail: "Depends on your model" },
    ],
  },
};
type CatKey = keyof typeof CATEGORIES;

const TESTIMONIALS = [
  { name: "Sara M.", role: "University student", text: "I gave a budget and said I needed long battery. Got three options on WhatsApp the next morning, and the one I bought was exactly as pictured." },
  { name: "Omar K.", role: "Small business owner", text: "Needed five office laptops that look the same. He sourced matching ThinkPads and I checked every one before paying. No pressure at all." },
  { name: "Daniel R.", role: "Video editor", text: "I'd been scrolling listings for weeks. One message and a shortlist later I had a proper editing laptop for far less than I expected." },
];

/* ───────────────────────── quiz logic ───────────────────────── */

type Answers = {
  use: string | null; budget: string | null; port: string | null; cond: string | null;
  musts: string[]; name: string; phone: string; consent: boolean;
};
const EMPTY: Answers = { use: null, budget: null, port: null, cond: null, musts: [], name: "", phone: "", consent: false };

const BASE: Record<string, { cpu: string; ram: number; ssd: number; gpu: boolean; low: number; high: number }> = {
  everyday: { cpu: "Core i5 / Ryzen 5 class", ram: 8, ssd: 256, gpu: false, low: 1100, high: 1800 },
  study: { cpu: "Core i5 / Ryzen 5 class", ram: 8, ssd: 256, gpu: false, low: 1100, high: 1900 },
  business: { cpu: "Core i5 business-class (ThinkPad, Latitude, EliteBook)", ram: 16, ssd: 512, gpu: false, low: 1700, high: 2800 },
  gaming: { cpu: "Core i5-H / Ryzen 5-H class", ram: 16, ssd: 512, gpu: true, low: 2800, high: 4500 },
  design: { cpu: "Core i7 / Ryzen 7 or Apple M-series", ram: 16, ssd: 512, gpu: true, low: 3400, high: 5400 },
  programming: { cpu: "Core i7 / Ryzen 7 class", ram: 16, ssd: 512, gpu: false, low: 2200, high: 3600 },
};

const r50 = (n: number) => Math.round(n / 50) * 50;
const aed = (n: number) => n.toLocaleString("en-US");
const lbl = <T extends { id: string; label: string }>(list: T[], id: string | null) => list.find((x) => x.id === id);

function buildProfile(a: Answers) {
  const use = a.use ?? "everyday";
  const b = BASE[use];
  const ram = Math.max(b.ram, a.musts.includes("ram") ? 16 : 0);
  const gpu = b.gpu || a.musts.includes("gpu");
  let screen = a.port === "light" ? "13\" – 14\"" : a.port === "desk" ? "15.6\" – 17.3\"" : "14\" – 15.6\"";
  const notes: string[] = [];
  if (a.musts.includes("numpad") && a.port !== "desk") {
    screen = "15.6\"";
    notes.push("A numeric keypad needs a 15.6\" body, so we've sized up from your portability pick.");
  }
  let low = b.low, high = b.high;
  if (gpu && !b.gpu) { low += 600; high += 900; }
  if (ram > b.ram) { low += 250; high += 350; }
  if (a.musts.includes("touch")) { low += 200; high += 300; }
  if (a.port === "light") { low += 100; high += 100; }
  if (a.cond === "budget") { low *= 0.85; high *= 0.85; }
  if (a.cond === "new") { low += 150; high += 300; }
  low = r50(low); high = r50(high);

  const bd = BUDGETS.find((x) => x.id === a.budget);
  let fit: "fits" | "stretch" | "headroom" | "advise" = "advise";
  if (bd && bd.id !== "bx") {
    if (bd.max && low > bd.max * 1.03) fit = "stretch";
    else if (bd.min && high < bd.min) fit = "headroom";
    else fit = "fits";
  }
  const tier = bd && bd.id !== "bx" ? bd.short.replace(/^an? /, "").replace(" budget", "") : "";
  const title = `${lbl(USES, use)!.label} + ${bd && bd.id !== "bx" ? `${tier} budget` : "budget to be advised"}`;
  const specs = [
    { k: "Processor", v: b.cpu },
    { k: "Memory", v: `${ram}GB RAM${ram >= 16 ? " or more" : ""}` },
    { k: "Storage", v: `${Math.max(b.ssd, a.musts.includes("ram") ? 512 : 0)}GB SSD` },
    { k: "Graphics", v: gpu ? "Dedicated GPU" : "Integrated (fine for your use)" },
    { k: "Screen", v: screen },
  ];
  if (a.musts.includes("battery")) specs.push({ k: "Battery", v: "10+ hours real-world" });
  if (a.musts.includes("touch")) specs.push({ k: "Display", v: "Touchscreen" });
  if (a.musts.includes("numpad")) specs.push({ k: "Keyboard", v: "Full-size with numeric keypad" });

  const summary = `${ram}GB RAM, SSD${gpu ? ", dedicated GPU" : ""}, ${screen} screen`;
  return { title, specs, low, high, fit, notes, summary };
}

function hasMust(m: Machine, id: string) {
  switch (id) {
    case "ssd": return m.ssd > 0;
    case "ram": return m.ram >= 16;
    case "gpu": return !!m.gpu;
    case "battery": return m.bat >= 10;
    case "numpad": return m.numpad;
    case "touch": return m.touch;
  }
  return false;
}

function score(m: Machine, a: Answers) {
  let s = 0;
  if (a.use && m.uses.includes(a.use)) s += 40;
  if (a.port === "light") s += m.screen <= 14.2 && m.kg <= 1.6 ? 20 : m.screen <= 14.2 ? 10 : 0;
  if (a.port === "balanced") s += m.screen >= 14 && m.screen <= 15.6 ? 20 : 8;
  if (a.port === "desk") s += m.screen >= 15.6 ? 20 : m.screen >= 14 ? 6 : 0;
  a.musts.forEach((id) => { s += hasMust(m, id) ? 8 : -6; });
  const bd = BUDGETS.find((x) => x.id === a.budget);
  if (bd && bd.id !== "bx") {
    if (bd.max) {
      if (m.high <= bd.max) s += 20;
      else if (m.low <= bd.max) s += 8;
      else s -= Math.min(30, (m.low - bd.max) / 80);
      if (bd.min && m.high < bd.min * 0.7) s -= 6;
    } else if (m.high >= bd.min * 0.8) s += 10;
  }
  if (a.cond === "budget") s -= (m.low + m.high) / 3000;
  return s;
}

const mid = (m: Machine) => (m.low + m.high) / 2;

function pickExamples(a: Answers) {
  const ranked = [...CATALOG].sort((x, y) => score(y, a) - score(x, a));
  const closest = ranked[0];
  const rest = ranked.slice(1, 9);
  const cheaper = rest.filter((m) => mid(m) < mid(closest));
  const value = cheaper[0] ?? [...rest].sort((x, y) => mid(x) - mid(y))[0];
  const pricier = ranked.slice(1).filter((m) => mid(m) > mid(closest) && m.id !== value.id);
  const step = pricier[0] ?? ranked.find((m) => m.id !== closest.id && m.id !== value.id)!;
  return [
    { slot: "Closest to your request", m: closest, role: "closest" as const },
    { slot: "Better value", m: value, role: "value" as const },
    { slot: "Step up", m: step, role: "step" as const },
  ];
}

function priceFor(m: Machine, a: Answers) {
  const extra = a.cond === "new" ? [150, 300] : [0, 0];
  return { low: r50(m.low + extra[0]), high: r50(m.high + extra[1]) };
}

function reasonFor(m: Machine, a: Answers, role: "closest" | "value" | "step", closest: Machine) {
  const bits: string[] = [];
  const use = lbl(USES, a.use);
  if (use) bits.push(`${use.label.toLowerCase()} use`);
  const bd = BUDGETS.find((x) => x.id === a.budget);
  if (bd && bd.id !== "bx") bits.push(`a budget of ${bd.label.replace("AED ", "AED ")}`);
  else if (bd) bits.push("a budget we'd advise on");
  const pt = PORTS.find((x) => x.id === a.port);
  if (pt) bits.push(pt.phrase);
  const cd = CONDS.find((x) => x.id === a.cond);
  if (cd) bits.push(cd.phrase);
  const head = `You asked for ${bits.join(", ")}.`;

  const ok = a.musts.filter((id) => hasMust(m, id)).map((id) => lbl(MUSTS, id)!.label);
  const no = a.musts.filter((id) => !hasMust(m, id)).map((id) => lbl(MUSTS, id)!.label);
  let tail = "";
  if (ok.length) tail += ` It ticks ${ok.join(", ")}.`;
  if (no.length) tail += ` It doesn't have ${no.join(", ")}, so we flag that honestly.`;
  if (!ok.length && !no.length) tail = ` It's a ${m.screen}" machine with ${m.ram}GB RAM and a ${m.ssd >= 1024 ? "1TB" : `${m.ssd}GB`} SSD.`;

  let role_s = "";
  if (role === "closest") role_s = " Best overall match to your answers.";
  if (role === "value") {
    const diff = r50(mid(closest) - mid(m));
    role_s = diff > 0 ? ` About AED ${aed(diff)} less than the closest match, with the key specs intact.` : " Same price band as the closest match, with a different strength.";
  }
  if (role === "step") {
    const diff = r50(mid(m) - mid(closest));
    role_s = diff > 0 ? ` About AED ${aed(diff)} more, if you want headroom for the next few years.` : " A stronger spec in a similar price band.";
  }
  return head + tail + role_s;
}

function validatePhone(raw: string) {
  const s = raw.replace(/[\s\-().]/g, "");
  if (!s) return "Enter your WhatsApp number.";
  if (/^05\d{8}$/.test(s)) return "";
  if (/^(\+|00)?971(5\d{8})$/.test(s)) return "";
  if (/^\+\d{9,14}$/.test(s)) return "";
  return "Enter a valid number, e.g. 055 123 4567 or +971 55 123 4567.";
}

function waSummary(a: Answers, p: ReturnType<typeof buildProfile>) {
  const parts = [
    `Hi Fakhri Computers, I'm ${a.name || "a new client"}. Please send me my laptop shortlist.`,
    `Use: ${lbl(USES, a.use)?.label ?? "-"}`,
    `Budget: ${lbl(BUDGETS, a.budget)?.label ?? "-"}`,
    `Size: ${lbl(PORTS, a.port)?.label ?? "-"}`,
    `Condition: ${lbl(CONDS, a.cond)?.label ?? "-"}`,
    `Must-haves: ${a.musts.length ? a.musts.map((id) => lbl(MUSTS, id)!.label).join(", ") : "none"}`,
    `Profile: ${p.summary} (indicative AED ${aed(p.low)} – ${aed(p.high)})`,
  ];
  return parts.join("\n");
}

/* ───────────────────────── small UI pieces ───────────────────────── */

type Screen = "home" | "quiz" | "result" | "confirm" | "category" | "recent" | "detail" | "reserved" | "monitors" | "how" | "warranty" | "reviews" | "about" | "bulk" | "contact" | "admin-login" | "admin";

function WaIcon({ className = "size-5" }: { className?: string }) {
  return <Icon name="chat" className={className} />;
}

function Btn({ children, onClick, href, variant = "primary", className = "", target, type = "button", disabled }: {
  children: ReactNode; onClick?: () => void; href?: string; variant?: "primary" | "secondary" | "ghost" | "dark";
  className?: string; target?: string; type?: "button" | "submit"; disabled?: boolean;
}) {
  const base = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-50";
  const v = {
    primary: "bg-accent text-navy shadow-[0_2px_0_var(--color-accent-dark)] hover:bg-[#f7b240]",
    secondary: "border border-navy/25 bg-white text-navy hover:border-navy hover:bg-navy/5",
    ghost: "text-navy hover:bg-navy/5",
    dark: "bg-navy text-white hover:bg-navy-soft",
  }[variant];
  const cls = `${base} ${v} ${className}`;
  if (href) return <a href={href} target={target} rel={target ? "noreferrer" : undefined} onClick={onClick} className={cls}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

function PriceNote({ className = "" }: { className?: string }) {
  return <p className={`text-xs leading-relaxed text-mute ${className}`}>{NOTE}</p>;
}

function Badge({ status }: { status: "Available" | "Sold" }) {
  const ok = status === "Available";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${ok ? "bg-ok-soft text-ok" : "bg-slate-200 text-slate-600"}`}>
      <span className={`size-1.5 rounded-full ${ok ? "bg-ok" : "bg-slate-500"}`} />
      {status}
    </span>
  );
}

function LaptopArt({ hue, sold = false }: { hue: number; sold?: boolean }) {
  return (
    <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg ${sold ? "grayscale" : ""}`} style={{ background: `linear-gradient(135deg, hsl(${hue} 30% 92%), hsl(${hue} 25% 82%))` }}>
      <svg viewBox="0 0 200 130" className="w-[72%]" aria-hidden="true">
        <rect x="32" y="12" width="136" height="86" rx="7" fill="#1e293b" />
        <rect x="38" y="18" width="124" height="74" rx="3" fill={`hsl(${hue} 55% 38%)`} />
        <rect x="38" y="18" width="124" height="74" rx="3" fill="url(#g)" opacity="0.5" />
        <path d="M10 104h180l-10 12a6 6 0 0 1-5 2H25a6 6 0 0 1-5-2z" fill="#cbd5e1" />
        <rect x="84" y="104" width="32" height="4" rx="2" fill="#94a3b8" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        </defs>
      </svg>
      <span className="absolute bottom-2 left-2 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-medium text-mute">Sample photo</span>
    </div>
  );
}

function Modal({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/60 p-0 md:items-center md:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()} className="rise relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl md:max-w-lg md:rounded-2xl md:p-7">
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full text-mute hover:bg-paper"><Icon name="x" /></button>
        {children}
      </div>
    </div>
  );
}

/* ───────────────────────── machine detail ───────────────────────── */

function MachineDetail({ m, status, answers, onClose }: { m: Machine; status?: "Available" | "Sold"; answers?: Answers; onClose: () => void }) {
  const price = answers ? priceFor(m, answers) : { low: m.low, high: m.high };
  const rows: [string, string][] = [
    ["Processor", m.cpu], ["Memory", `${m.ram}GB`], ["Storage", `${m.ssd >= 1024 ? "1TB" : `${m.ssd}GB`} SSD`],
    ["Graphics", m.gpu ?? "Integrated"], ["Screen", `${m.screen}"${m.touch ? " touchscreen" : ""}`],
    ["Weight", `${m.kg} kg`], ["Battery", `about ${m.bat}h`], ["Numeric keypad", m.numpad ? "Yes" : "No"], ["Condition grade", m.grade],
  ];
  return (
    <Modal onClose={onClose} label={m.name}>
      <LaptopArt hue={m.hue} sold={status === "Sold"} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-navy/8 px-2.5 py-1 text-xs font-semibold text-navy">Recent example</span>
        {status && <Badge status={status} />}
      </div>
      <h3 className="mt-2 text-xl font-bold text-navy">{m.name}</h3>
      <p className="text-sm text-mute">{m.year} model, sample listing</p>
      <dl className="mt-4 divide-y divide-line rounded-xl border border-line text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-3.5 py-2.5"><dt className="text-mute">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-mute">Indicative range</p>
      <p className="text-2xl font-bold text-navy">AED {aed(price.low)} – {aed(price.high)}</p>
      <PriceNote className="mt-1" />
      <div className="mt-5 flex flex-col gap-3">
        <Btn href={waLink(`Hi Fakhri Computers, I'm interested in something like the ${m.name} (sample). Can you source one for me?`)} target="_blank">
          <WaIcon /> Ask for one like this
        </Btn>
        <Btn variant="secondary" onClick={onClose}>Close</Btn>
      </div>
    </Modal>
  );
}

/* ───────────────────────── header / footer ───────────────────────── */

const NAV: { label: string; screen: Screen }[] = [
  { label: "Laptops", screen: "recent" },
  { label: "Monitors", screen: "monitors" },
  { label: "How it works", screen: "how" },
  { label: "Warranty & testing", screen: "warranty" },
  { label: "Reviews", screen: "reviews" },
  { label: "About", screen: "about" },
  { label: "Contact", screen: "contact" },
];

function Header({ go }: { go: (s: Screen) => void }) {
  const [open, setOpen] = useState(false);
  const nav = (sc: Screen) => { setOpen(false); go(sc); };
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 md:h-[72px] md:px-8">
        <button onClick={() => nav("home")} className="flex min-h-11 items-center gap-2.5 text-left" aria-label="Fakhri Computers home">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-navy text-base font-extrabold text-accent">F</span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold text-navy">Fakhri Computers</span>
            <span className="hidden text-[11px] text-mute sm:block">& Accessories</span>
          </span>
        </button>
        <nav className="hidden items-center lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <button key={n.screen} onClick={() => nav(n.screen)} className="min-h-11 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-navy/5 hover:text-navy">{n.label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Btn onClick={() => nav("quiz")} className="!min-h-11 !px-4 text-sm md:!px-5">Find my laptop</Btn>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu" className="flex size-11 items-center justify-center rounded-lg text-navy hover:bg-navy/5 lg:hidden"><Icon name={open ? "x" : "menu"} className="size-6" /></button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-white px-5 pb-4 pt-2 lg:hidden" aria-label="Mobile">
          {[...NAV, { label: "Bulk & office orders", screen: "bulk" as Screen }].map((n) => (
            <button key={n.screen} onClick={() => nav(n.screen)} className="flex min-h-12 w-full items-center justify-between border-b border-line text-left text-[15px] font-medium text-navy last:border-0">{n.label}<Icon name="arrow" className="size-4 text-mute" /></button>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer({ go }: { go: (s: Screen) => void }) {
  return (
    <footer id="contact" className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:px-8 md:py-16">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent text-base font-extrabold text-navy">F</span>
            <span className="text-lg font-bold">Fakhri Computers & Accessories</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">Second-hand and refurbished laptops, monitors and accessories. Personally sourced for you, inspected by you before you pay.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Btn href={waLink("Hi Fakhri Computers, I have a question.")} target="_blank"><WaIcon /> WhatsApp {WA_DISPLAY}</Btn>
          </div>
        </div>
        <div className="space-y-6 text-sm">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Visit</h4>
            <p className="mt-2 text-white/80">Shop 12, Sample Plaza<br />Al Rigga Road, Deira, Dubai<br /><span className="text-white/50">(Sample address for prototype)</span></p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Hours</h4>
            <p className="mt-2 text-white/80">Sat – Thu: 10:00 – 21:00<br />Friday: 16:00 – 21:00<br /><span className="text-white/50">WhatsApp replies within the hour in opening times</span></p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Explore</h4>
            <div className="mt-1 grid grid-cols-2 gap-x-4">
              {[...NAV, { label: "Bulk & office orders", screen: "bulk" as Screen }, { label: "Find my laptop", screen: "quiz" as Screen }].map((n) => (
                <button key={n.screen} onClick={() => go(n.screen)} className="min-h-10 text-left text-white/80 underline-offset-4 hover:underline">{n.label}</button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Find us</h4>
          <div className="mt-2"><MapBox /></div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/50">© 2026 Fakhri Computers & Accessories. Prototype with sample data. Prices are indicative ranges only.</div>
    </footer>
  );
}

/* ───────────────────────── home ───────────────────────── */

function Home({ go, openCat, openMachine }: { go: (s: Screen) => void; openCat: (c: CatKey) => void; openMachine: (id: string, status: "Available" | "Sold") => void }) {
  const trust = [
    { icon: "shield", t: "Tested before sale", d: "Every unit is run through a full check" },
    { icon: "camera", t: "Real photos of the real unit", d: "No stock images, ever" },
    { icon: "clock", t: "7-day check window", d: "Time to inspect it properly" },
  ];
  const steps = [
    { t: "Tell us your needs", d: "Six quick taps: what you do, your budget, size and must-haves." },
    { t: "We source from the market", d: "We search our network and send a live shortlist on WhatsApp within 24 hours." },
    { t: "You inspect and buy", d: "See the real unit, check it in person, and only pay when you're happy." },
  ];
  return (
    <div className="rise">
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-10 pt-8 md:grid-cols-[1.15fr_1fr] md:gap-14 md:px-8 md:pb-16 md:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-navy/6 px-3 py-1.5 text-xs font-semibold text-navy">
              <span className="size-1.5 rounded-full bg-ok" /> Personal sourcing, not a fixed catalogue
            </span>
            <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-tight text-navy md:text-[52px]">
              Tell us what you need. We'll find the right laptop at the right price.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Second-hand and refurbished laptops, picked one client at a time from the best-value machines on the market.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Btn onClick={() => go("quiz")} className="sm:min-w-[200px]">Find my laptop <Icon name="arrow" className="size-4" /></Btn>
              <Btn variant="secondary" href={waLink("Hi Fakhri Computers, I'm looking for a laptop. Can you help?")} target="_blank"><WaIcon className="size-[18px]" /> Chat on WhatsApp</Btn>
            </div>
            <p className="mt-4 text-sm text-mute">Takes about a minute. No payment, no obligation.</p>
          </div>

          <div className="hidden md:block" aria-hidden="true">
            <div className="relative rounded-2xl bg-paper p-5 ring-1 ring-line">
              <p className="text-xs font-semibold uppercase tracking-wider text-mute">What you'll get on WhatsApp</p>
              <div className="mt-3 space-y-2.5 text-sm">
                <div className="ml-auto w-[85%] rounded-xl rounded-tr-sm bg-[#dcf8c6] p-3">Gaming, mid budget, 15.6" screen, dedicated graphics please.</div>
                <div className="w-[92%] rounded-xl rounded-tl-sm bg-white p-3 shadow-sm">
                  <p className="font-semibold text-navy">Your shortlist is ready (3 options)</p>
                  <ul className="mt-1.5 space-y-1 text-slate-600">
                    <li>1. Asus TUF F15, GTX 1650, 16GB</li>
                    <li>2. Acer Nitro 5, RTX 3050, 16GB</li>
                    <li>3. Legion 5, RTX 3060, 16GB</li>
                  </ul>
                  <p className="mt-2 text-xs text-mute">Real photos attached. Prices valid 48 hours.</p>
                </div>
              </div>
              <span className="absolute -bottom-3 -right-3 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-navy shadow">Sample chat</span>
            </div>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-px px-5 md:grid-cols-3 md:px-8">
            {trust.map((x) => (
              <div key={x.t} className="flex items-center gap-3.5 py-4 md:py-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-[#9a5f00]"><Icon name={x.icon} /></span>
                <div><p className="text-[15px] font-semibold text-navy">{x.t}</p><p className="text-sm text-mute">{x.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:px-8 md:py-20">
        <h2 className="text-2xl font-bold text-navy md:text-3xl">How it works</h2>
        <p className="mt-2 text-slate-600">You do the telling. We do the hunting.</p>
        <ol className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-xl border border-line bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-navy text-base font-bold text-accent">{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{s.t}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
        <Btn variant="secondary" onClick={() => go("how")} className="mt-6">Read the full process <Icon name="arrow" className="size-4" /></Btn>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy md:text-3xl">Recently sourced</h2>
              <p className="mt-2 text-slate-600">Sample examples of the kind of machines we find. Stock changes daily.</p>
            </div>
            <Btn variant="ghost" onClick={() => openCat("laptops")} className="!min-h-11 shrink-0">See all <Icon name="arrow" className="size-4" /></Btn>
          </div>
          <div className="no-scrollbar -mx-5 mt-7 flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
            {RECENT.map((r) => {
              const m = CATALOG.find((x) => x.id === r.id)!;
              return (
                <button key={r.id} onClick={() => openMachine(r.id, r.status)} className="w-[260px] shrink-0 snap-start rounded-xl border border-line bg-paper p-3 text-left transition hover:border-navy/40 hover:shadow-md md:w-auto">
                  <LaptopArt hue={m.hue} sold={r.status === "Sold"} />
                  <div className="mt-3 flex items-center justify-between gap-2"><Badge status={r.status} /><span className="text-xs text-mute">{r.note}</span></div>
                  <h3 className="mt-2 font-semibold text-navy">{m.name}</h3>
                  <p className="text-sm text-mute">{m.cpu} · {m.ram}GB · {m.ssd >= 1024 ? "1TB" : `${m.ssd}GB`} SSD</p>
                  <p className="mt-2 text-sm font-semibold text-navy">AED {aed(m.low)} – {aed(m.high)}</p>
                  <p className="mt-0.5 text-[11px] text-mute">Indicative range, sample listing</p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-mute">{NOTE}</p>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:px-8 md:py-20">
        <h2 className="text-2xl font-bold text-navy md:text-3xl">Browse by category</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3 md:gap-6">
          {(Object.keys(CATEGORIES) as CatKey[]).map((k) => {
            const c = CATEGORIES[k];
            return (
              <button key={k} onClick={() => openCat(k)} className="group flex items-center gap-4 rounded-xl border border-line bg-white p-5 text-left transition hover:border-navy/40 hover:shadow-md md:flex-col md:items-start md:gap-6 md:p-7">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-navy text-accent"><Icon name={c.icon} className="size-7" /></span>
                <span className="flex-1">
                  <span className="block text-lg font-semibold text-navy">{c.title}</span>
                  <span className="mt-0.5 block text-sm text-mute">{c.blurb.split(",")[0].split(".")[0]}</span>
                </span>
                <Icon name="arrow" className="size-5 text-navy transition group-hover:translate-x-1 md:self-end" />
              </button>
            );
          })}
        </div>
      </section>

      <section id="reviews" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-2xl font-bold text-navy md:text-3xl">What clients say</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3 md:gap-6">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-xl border border-line bg-paper p-6">
                <div className="flex gap-0.5 text-accent">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" className="size-4" fill="currentColor" sw={1} />)}</div>
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-700">"{t.text}"</blockquote>
                <figcaption className="mt-4 text-sm"><span className="font-semibold text-navy">{t.name}</span><span className="text-mute"> · {t.role}</span><span className="mt-1 block text-[11px] text-mute">Sample testimonial</span></figcaption>
              </figure>
            ))}
          </div>
          <Btn variant="secondary" onClick={() => go("reviews")} className="mt-6">Read all reviews</Btn>
          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl bg-navy p-7 text-white md:flex-row md:items-center md:p-10">
            <div><h3 className="text-xl font-bold md:text-2xl">Ready to see what fits you?</h3><p className="mt-1 text-white/70">Six taps. Your shortlist lands on WhatsApp within 24 hours.</p></div>
            <Btn onClick={() => go("quiz")} className="w-full md:w-auto">Find my laptop <Icon name="arrow" className="size-4" /></Btn>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── category ───────────────────────── */

function CategoryPage({ cat, go, openCat, openMachine }: { cat: CatKey; go: (s: Screen) => void; openCat: (c: CatKey) => void; openMachine: (id: string, status?: "Available" | "Sold") => void }) {
  const c = CATEGORIES[cat];
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <Btn variant="ghost" onClick={() => go("home")} className="-ml-3 !min-h-11 !px-3"><Icon name="back" className="size-4" /> Home</Btn>
      <div className="mt-2 flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-xl bg-navy text-accent"><Icon name={c.icon} className="size-7" /></span>
        <h1 className="text-3xl font-extrabold text-navy md:text-4xl">{c.title}</h1>
      </div>
      <p className="mt-3 max-w-2xl text-slate-600">{c.blurb}</p>
      <div className="mt-5 flex gap-2">
        {(Object.keys(CATEGORIES) as CatKey[]).map((k) => (
          <button key={k} onClick={() => openCat(k)} aria-pressed={k === cat} className={`min-h-11 rounded-full px-4 text-sm font-semibold transition ${k === cat ? "bg-navy text-white" : "border border-line bg-white text-slate-600 hover:border-navy/40"}`}>{CATEGORIES[k].title}</button>
        ))}
      </div>

      {cat === "laptops" ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATALOG.slice(0, 9).map((m) => (
              <button key={m.id} onClick={() => openMachine(m.id)} className="rounded-xl border border-line bg-white p-3 text-left transition hover:border-navy/40 hover:shadow-md">
                <LaptopArt hue={m.hue} />
                <h3 className="mt-3 font-semibold text-navy">{m.name}</h3>
                <p className="text-sm text-mute">{m.cpu} · {m.ram}GB · {m.screen}"</p>
                <p className="mt-2 text-sm font-semibold text-navy">AED {aed(m.low)} – {aed(m.high)}</p>
              </button>
            ))}
          </div>
          <PriceNote className="mt-4" />
          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-navy p-7 text-white md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold">Not seeing the right one? We'll find it for you.</p>
            <Btn onClick={() => go("quiz")}>Find my laptop <Icon name="arrow" className="size-4" /></Btn>
          </div>
        </>
      ) : (
        <>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {c.items.map((it) => (
              <li key={it.name} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4 md:p-5">
                <div><p className="font-semibold text-navy">{it.name}</p><p className="text-sm text-mute">{it.detail}</p></div>
                <div className="shrink-0 text-right"><p className="text-sm font-bold text-navy">{it.range}</p><a href={waLink(`Hi Fakhri Computers, I'm looking for: ${it.name} (sample listing).`)} target="_blank" rel="noreferrer" className="mt-1 inline-flex min-h-9 items-center text-sm font-semibold text-[#9a5f00] underline-offset-4 hover:underline">Ask</a></div>
              </li>
            ))}
          </ul>
          <PriceNote className="mt-4" />
          <div className="mt-8"><Btn href={waLink(`Hi Fakhri Computers, I need ${c.title.toLowerCase()}. Can you advise?`)} target="_blank"><WaIcon /> Ask about {c.title.toLowerCase()} on WhatsApp</Btn></div>
        </>
      )}
    </div>
  );
}

/* ───────────────────────── quiz ───────────────────────── */

function Choice({ selected, onClick, label, hint, multi = false }: { selected: boolean; onClick: () => void; label: string; hint?: string; multi?: boolean }) {
  return (
    <button onClick={onClick} aria-pressed={selected} className={`flex min-h-[60px] w-full items-center gap-3.5 rounded-xl border-2 px-4 py-3 text-left transition active:scale-[0.99] ${selected ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-navy/40"}`}>
      <span className={`flex size-6 shrink-0 items-center justify-center border-2 ${multi ? "rounded-md" : "rounded-full"} ${selected ? "border-accent bg-accent text-navy" : "border-slate-300"}`}>{selected && <Icon name="check" className="size-3.5" sw={3.5} />}</span>
      <span>
        <span className="block text-[15px] font-semibold">{label}</span>
        {hint && <span className={`block text-[13px] ${selected ? "text-white/75" : "text-mute"}`}>{hint}</span>}
      </span>
    </button>
  );
}

function Quiz({ answers, setAnswers, step, setStep, go, finish }: {
  answers: Answers; setAnswers: (f: (a: Answers) => Answers) => void; step: number; setStep: (n: number) => void;
  go: (s: Screen) => void; finish: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const TOTAL = 6;
  const next = () => setStep(step + 1);
  const pick = (key: "use" | "budget" | "port" | "cond", id: string) => {
    setAnswers((a) => ({ ...a, [key]: id }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(next, 220);
  };
  const back = () => (step === 0 ? go("home") : setStep(step - 1));

  const phoneErr = validatePhone(answers.phone);
  const nameErr = answers.name.trim().length < 2 ? "Enter your name." : "";
  const consentErr = !answers.consent ? "Please tick the box so we can message you." : "";
  const submit = () => {
    setTouched(true);
    if (!phoneErr && !nameErr && !consentErr) finish();
  };

  const questions = [
    { q: "What will you use it for?", sub: "Pick the one that matters most.", key: "use" as const, opts: USES },
    { q: "What's your budget?", sub: "A rough range is fine. We'll stay inside it.", key: "budget" as const, opts: BUDGETS },
    { q: "How will you carry it?", sub: "This sets the screen size.", key: "port" as const, opts: PORTS },
    { q: "What condition suits you?", sub: "All units are tested. This is about looks and packaging.", key: "cond" as const, opts: CONDS },
  ];
  const cur = questions[step];
  const answered = cur ? !!answers[cur.key] : false;

  return (
    <div className="mx-auto max-w-xl px-5 py-6 md:py-12">
      <div className="flex items-center justify-between">
        <Btn variant="ghost" onClick={back} className="-ml-3 !min-h-11 !px-3"><Icon name="back" className="size-4" /> Back</Btn>
        <span className="text-sm font-medium text-mute">Question {step + 1} of {TOTAL}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={step + 1}>
        <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
      </div>

      <div key={step} className="rise mt-8">
        {cur && (
          <>
            <h1 className="text-[26px] font-extrabold leading-tight text-navy md:text-3xl">{cur.q}</h1>
            <p className="mt-1.5 text-slate-600">{cur.sub}</p>
            {cur.key === "budget" ? (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {BUDGETS.map((b) => (
                  <button key={b.id} onClick={() => pick("budget", b.id)} aria-pressed={answers.budget === b.id} className={`min-h-[60px] rounded-xl border-2 px-3 text-[15px] font-semibold transition active:scale-[0.98] ${b.id === "bx" ? "col-span-2" : ""} ${answers.budget === b.id ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-navy/40"}`}>{b.label}</button>
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {cur.opts.map((o) => (
                  <Choice key={o.id} selected={answers[cur.key] === o.id} onClick={() => pick(cur.key, o.id)} label={o.label} hint={"hint" in o ? (o as { hint: string }).hint : undefined} />
                ))}
              </div>
            )}
            {answered && <Btn variant="secondary" onClick={next} className="mt-6 w-full">Next <Icon name="arrow" className="size-4" /></Btn>}
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-[26px] font-extrabold leading-tight text-navy md:text-3xl">Any must-haves?</h1>
            <p className="mt-1.5 text-slate-600">Select all that apply, or skip.</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MUSTS.map((m) => (
                <Choice key={m.id} multi label={m.label} selected={answers.musts.includes(m.id)} onClick={() => setAnswers((a) => ({ ...a, musts: a.musts.includes(m.id) ? a.musts.filter((x) => x !== m.id) : [...a.musts, m.id] }))} />
              ))}
            </div>
            <Btn onClick={next} className="mt-6 w-full">{answers.musts.length ? `Continue with ${answers.musts.length} selected` : "No must-haves, continue"} <Icon name="arrow" className="size-4" /></Btn>
          </>
        )}

        {step === 5 && (
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
            <h1 className="text-[26px] font-extrabold leading-tight text-navy md:text-3xl">Where should we send your shortlist?</h1>
            <p className="mt-1.5 text-slate-600">We'll message you on WhatsApp. No spam, no calls.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="nm" className="text-sm font-semibold text-navy">Your name</label>
                <input id="nm" value={answers.name} onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))} autoComplete="name" placeholder="e.g. Ahmed" aria-invalid={touched && !!nameErr} className={`mt-1.5 min-h-[52px] w-full rounded-xl border-2 bg-white px-4 text-base outline-none focus:border-navy ${touched && nameErr ? "border-red-500" : "border-line"}`} />
                {touched && nameErr && <p className="mt-1 text-sm text-red-600">{nameErr}</p>}
              </div>
              <div>
                <label htmlFor="ph" className="text-sm font-semibold text-navy">WhatsApp number</label>
                <input id="ph" type="tel" inputMode="tel" value={answers.phone} onChange={(e) => setAnswers((a) => ({ ...a, phone: e.target.value }))} autoComplete="tel" placeholder="055 123 4567" aria-invalid={touched && !!phoneErr} className={`mt-1.5 min-h-[52px] w-full rounded-xl border-2 bg-white px-4 text-base outline-none focus:border-navy ${touched && phoneErr ? "border-red-500" : "border-line"}`} />
                {touched && phoneErr && <p className="mt-1 text-sm text-red-600">{phoneErr}</p>}
              </div>
              <div>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={answers.consent} onChange={(e) => setAnswers((a) => ({ ...a, consent: e.target.checked }))} className="mt-0.5 size-5 shrink-0 accent-[#0F2A43]" />
                  <span>I agree to be contacted on WhatsApp about my laptop request. I can stop at any time.</span>
                </label>
                {touched && consentErr && <p className="mt-1 text-sm text-red-600">{consentErr}</p>}
              </div>
            </div>
            <Btn type="submit" className="mt-6 w-full">See what fits me <Icon name="arrow" className="size-4" /></Btn>
          </form>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── result ───────────────────────── */

function Result({ answers, go, openMachine, editAnswers, onSend }: {
  answers: Answers; go: (s: Screen) => void; openMachine: (id: string) => void; editAnswers: () => void; onSend: () => void;
}) {
  const p = useMemo(() => buildProfile(answers), [answers]);
  const ex = useMemo(() => pickExamples(answers), [answers]);
  const closest = ex[0].m;
  const bd = lbl(BUDGETS, answers.budget);
  const fitMsg = {
    fits: "Your budget covers this profile.",
    stretch: "Heads up: this spec usually starts above your budget. We'll look at slightly older generations and may trade one spec.",
    headroom: "You have headroom. We can step up on quality or keep the change.",
    advise: "You asked us to advise, so we've sized the budget to the spec.",
  }[p.fit];

  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <Btn variant="ghost" onClick={editAnswers} className="-ml-3 !min-h-11 !px-3"><Icon name="back" className="size-4" /> Edit my answers</Btn>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy md:text-4xl">Here's what fits you</h1>
      <p className="mt-1.5 text-slate-600">Based on your answers, {answers.name.trim().split(" ")[0] || "friend"}.</p>

      <section className="mt-7 grid gap-5 rounded-2xl bg-navy p-6 text-white md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-9" aria-label="Recommended profile">
        <div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy">Recommended profile</span>
          <h2 className="mt-4 text-2xl font-bold md:text-3xl">{p.title}</h2>
          <p className="mt-2 text-white/75">{p.summary}</p>
          <div className="mt-6 rounded-xl bg-white/10 p-4">
            <p className="text-sm text-white/70">Indicative price range</p>
            <p className="mt-0.5 text-3xl font-extrabold text-accent md:text-4xl">AED {aed(p.low)} – {aed(p.high)}</p>
            <p className="mt-2 text-xs text-white/70">{NOTE}</p>
          </div>
          <p className="mt-4 text-sm text-white/80">{fitMsg}{bd && bd.id !== "bx" && p.fit !== "advise" ? ` (Your range: ${bd.label}.)` : ""}</p>
          {p.notes.map((n) => <p key={n} className="mt-2 text-sm text-white/80">{n}</p>)}
          {answers.cond === "new" && <p className="mt-2 text-sm text-white/80">Includes an estimated AED 150 – 300 for the like-new package (cleaned, refreshed, boxed).</p>}
        </div>
        <dl className="grid content-start gap-2.5 text-sm">
          {p.specs.map((s) => (
            <div key={s.k} className="flex items-start justify-between gap-4 rounded-lg bg-white/8 px-4 py-3"><dt className="text-white/65">{s.k}</dt><dd className="text-right font-semibold">{s.v}</dd></div>
          ))}
        </dl>
      </section>

      <h2 className="mt-12 text-2xl font-bold text-navy">Three example machines</h2>
      <p className="mt-1 text-slate-600">Recent samples that match this profile. Your live shortlist will use what's on the market right now.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {ex.map(({ slot, m, role }) => {
          const pr = priceFor(m, answers);
          return (
            <article key={slot} className={`flex flex-col rounded-xl border bg-white p-4 ${role === "closest" ? "border-accent ring-2 ring-accent/40" : "border-line"}`}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${role === "closest" ? "bg-accent text-navy" : "bg-navy text-white"}`}>{slot}</span>
                <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-mute ring-1 ring-line">Recent example</span>
              </div>
              <LaptopArt hue={m.hue} />
              <h3 className="mt-3 text-lg font-bold text-navy">{m.name}</h3>
              <p className="text-sm text-mute">{m.cpu} · {m.ram}GB RAM · {m.ssd >= 1024 ? "1TB" : `${m.ssd}GB`} SSD · {m.gpu ?? "Integrated graphics"} · {m.screen}"</p>
              <p className="mt-3 text-xl font-extrabold text-navy">AED {aed(pr.low)} – {aed(pr.high)}</p>
              <PriceNote className="mt-0.5" />
              <div className="mt-4 flex-1 rounded-lg bg-paper p-3.5">
                <p className="text-xs font-bold uppercase tracking-wide text-navy">Why we picked this for you</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{reasonFor(m, answers, role, closest)}</p>
              </div>
              <Btn variant="secondary" onClick={() => openMachine(m.id)} className="mt-4 !min-h-11">View details</Btn>
            </article>
          );
        })}
      </div>

      <section className="mt-12 rounded-2xl border border-line bg-white p-6 text-center md:p-10">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-ok-soft text-ok"><Icon name="clock" className="size-6" /></span>
        <h2 className="mt-4 text-xl font-bold text-navy md:text-2xl">We'll send your live shortlist on WhatsApp within 24 hours.</h2>
        <p className="mx-auto mt-2 max-w-lg text-slate-600">Real photos of real units, with your price confirmed and held for 48 hours. You check it in person before you pay.</p>
        <div className="mx-auto mt-6 flex max-w-md flex-col gap-3">
          <Btn href={waLink(waSummary(answers, p))} target="_blank" onClick={onSend}><WaIcon /> Get my shortlist on WhatsApp</Btn>
          <Btn variant="secondary" onClick={editAnswers}><Icon name="edit" className="size-4" /> Edit my answers</Btn>
        </div>
        <button onClick={() => go("home")} className="mt-4 min-h-11 text-sm text-mute underline-offset-4 hover:underline">Back to home</button>
      </section>
    </div>
  );
}

/* ───────────────────────── confirmation ───────────────────────── */

function Confirm({ answers, go, editAnswers }: { answers: Answers; go: (s: Screen) => void; editAnswers: () => void }) {
  const p = buildProfile(answers);
  const steps = [
    { t: "Send the pre-filled message", d: "WhatsApp should have opened with your answers ready to send. Tap send if you haven't yet." },
    { t: "We source within 24 hours", d: "We check the market and pick machines that match your profile." },
    { t: "Receive your live shortlist", d: "Real photos, confirmed prices and availability, held for 48 hours." },
    { t: "Inspect, then decide", d: "Check the unit in person. You also get a 7-day check window after purchase." },
  ];
  return (
    <div className="rise mx-auto max-w-2xl px-5 py-10 md:py-16">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-ok text-white"><Icon name="check" className="size-8" sw={3} /></span>
        <h1 className="mt-5 text-3xl font-extrabold text-navy">You're all set, {answers.name.trim().split(" ")[0]}.</h1>
        <p className="mt-2 text-slate-600">Your request is in. We'll message <span className="font-semibold text-navy">{answers.phone}</span> on WhatsApp.</p>
      </div>
      <ol className="mt-8 space-y-3">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4 rounded-xl border border-line bg-white p-4 md:p-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-accent">{i + 1}</span>
            <div><p className="font-semibold text-navy">{s.t}</p><p className="mt-0.5 text-sm text-slate-600">{s.d}</p></div>
          </li>
        ))}
      </ol>
      <div className="mt-6 rounded-xl bg-white p-5 ring-1 ring-line">
        <p className="text-xs font-bold uppercase tracking-wide text-mute">Your request</p>
        <p className="mt-1.5 font-semibold text-navy">{p.title}</p>
        <p className="text-sm text-slate-600">{p.summary}</p>
        <p className="mt-2 font-bold text-navy">AED {aed(p.low)} – {aed(p.high)}</p>
        <PriceNote className="mt-0.5" />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Btn href={waLink(waSummary(answers, p))} target="_blank"><WaIcon /> Open WhatsApp again</Btn>
        <Btn variant="secondary" onClick={editAnswers}><Icon name="edit" className="size-4" /> Edit my answers</Btn>
        <Btn variant="ghost" onClick={() => go("home")}>Back to home</Btn>
      </div>
    </div>
  );
}

/* ───────────────────────── extended data ───────────────────────── */

type Status = "Available" | "Sold";
type CondId = "budget" | "good" | "new";

const brandOf = (m: Machine) => (/^MacBook/.test(m.name) ? "Apple" : /^ThinkPad/.test(m.name) ? "Lenovo" : m.name.split(" ")[0]);

const UNITS: Record<string, { status: Status; cond: CondId }> = {
  m2: { status: "Available", cond: "budget" },
  m3: { status: "Sold", cond: "good" },
  m6: { status: "Available", cond: "good" },
  m7: { status: "Sold", cond: "good" },
  m8: { status: "Available", cond: "new" },
  m9: { status: "Available", cond: "good" },
  m10: { status: "Available", cond: "good" },
  m11: { status: "Available", cond: "budget" },
  m12: { status: "Sold", cond: "good" },
  m13: { status: "Available", cond: "new" },
  m14: { status: "Sold", cond: "good" },
  m15: { status: "Available", cond: "new" },
};
const LISTED = ["m2", "m3", "m6", "m7", "m8", "m9", "m10", "m11", "m12", "m13", "m14", "m15"];
const unitOf = (id: string) => UNITS[id] ?? { status: "Available" as Status, cond: "good" as CondId };
const condLabel = (c: CondId) => CONDS.find((x) => x.id === c)!.label;

const GRADES: Record<string, { title: string; text: string }> = {
  A: { title: "Grade A · Excellent", text: "Looks almost new. At most one or two faint marks you'd have to look for. Everything works exactly as it should." },
  "A-": { title: "Grade A- · Very good", text: "Light, even wear such as small marks on the lid or palm rest. No dents, cracks or screen marks." },
  "B+": { title: "Grade B+ · Good", text: "Visible everyday wear: small scuffs or light scratches on the body. The screen is clean when switched on." },
  B: { title: "Grade B · Fair", text: "Clearly used. Expect scuffs, shiny keys or a small dent. Fully working and tested, and priced lower for the looks." },
};

const healthOf = (m: Machine) => ({
  battery: ({ A: 93, "A-": 87, "B+": 81, B: 76 } as Record<string, number>)[m.grade] + (m.hue % 4),
  ssd: 95 + (m.hue % 5),
});

const TESTED = ["Screen", "Keyboard", "Trackpad", "Ports", "Wi-Fi", "Speakers", "Camera"];

const ADDONS = [
  { id: "bag", label: "Laptop bag or sleeve", low: 60, high: 150 },
  { id: "mouse", label: "Wireless mouse", low: 25, high: 90 },
  { id: "charger", label: "Spare charger", low: 80, high: 200 },
];

const VIEWS = ["Open, front", "Keyboard", "Side ports", "Lid", "Screen on"];

type Monitor = {
  id: string; name: string; size: number; res: "Full HD" | "QHD" | "4K"; hz: number; panel: "IPS" | "VA" | "TN";
  cond: CondId; status: Status; low: number; high: number; ports: string; hue: number;
};
const MONITORS: Monitor[] = [
  { id: "d1", name: "Dell P2419H", size: 24, res: "Full HD", hz: 60, panel: "IPS", cond: "good", status: "Available", low: 250, high: 400, ports: "HDMI, DisplayPort, VGA", hue: 205 },
  { id: "d2", name: "BenQ XL2411", size: 24, res: "Full HD", hz: 144, panel: "TN", cond: "budget", status: "Available", low: 300, high: 480, ports: "HDMI, DisplayPort, DVI", hue: 10 },
  { id: "d3", name: "Samsung Odyssey G5", size: 27, res: "QHD", hz: 144, panel: "VA", cond: "good", status: "Available", low: 700, high: 950, ports: "HDMI, DisplayPort", hue: 270 },
  { id: "d4", name: "LG 27UK650", size: 27, res: "4K", hz: 60, panel: "IPS", cond: "good", status: "Sold", low: 700, high: 1000, ports: "HDMI x2, DisplayPort", hue: 190 },
  { id: "d5", name: "Dell U2720Q", size: 27, res: "4K", hz: 60, panel: "IPS", cond: "new", status: "Available", low: 900, high: 1300, ports: "USB-C 90W, HDMI, DisplayPort", hue: 220 },
  { id: "d6", name: "Samsung Curved 32\"", size: 32, res: "Full HD", hz: 75, panel: "VA", cond: "budget", status: "Sold", low: 450, high: 700, ports: "HDMI, VGA", hue: 240 },
];

const REVIEWS = [
  { name: "Sara M.", bought: "Dell Latitude 5420 + wireless mouse", text: "I gave a budget and said I needed long battery. Got three options on WhatsApp the next morning, and the one I bought was exactly as pictured.", hue: 200 },
  { name: "Omar K.", bought: "5x Lenovo ThinkPad T14 (office order)", text: "Needed five office laptops that look the same. He sourced matching ThinkPads and I checked every one before paying. No pressure at all.", hue: 220 },
  { name: "Daniel R.", bought: "Dell XPS 15 9510", text: "I'd been scrolling listings for weeks. One message and a shortlist later I had a proper editing laptop for far less than I expected.", hue: 195 },
  { name: "Noor A.", bought: "Acer Nitro 5 + Dell P2419H monitor", text: "Wanted a first gaming setup for my son. He explained what was worth paying for and what wasn't. Honest advice, and the 7-day check gave me peace of mind.", hue: 5 },
  { name: "Khalid H.", bought: "HP EliteBook 840 G7", text: "Battery health was shown on the listing and matched when I checked it myself. That's rare when buying second-hand.", hue: 205 },
  { name: "Maria L.", bought: "MacBook Air M1 + charger", text: "Sent a WhatsApp message on Monday, inspected on Tuesday, bought on Wednesday. Straightforward and friendly.", hue: 240 },
];

const fmtRange = (lo: number, hi: number) => `AED ${aed(lo)} – ${aed(hi)}`;

/* ───────────────────────── shared pieces (extended) ───────────────────────── */

function GalleryArt({ hue, view, sold }: { hue: number; view: number; sold: boolean }) {
  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl ${sold ? "grayscale" : ""}`} style={{ background: `linear-gradient(135deg, hsl(${hue} 30% 92%), hsl(${hue} 25% 80%))` }}>
      <svg viewBox="0 0 200 150" className="absolute inset-0 size-full" aria-hidden="true">
        {view === 0 && (
          <>
            <rect x="38" y="22" width="124" height="80" rx="7" fill="#1e293b" />
            <rect x="44" y="28" width="112" height="68" rx="3" fill={`hsl(${hue} 55% 38%)`} />
            <path d="M14 108h172l-9 13a6 6 0 0 1-5 2H28a6 6 0 0 1-5-2z" fill="#cbd5e1" />
            <rect x="86" y="108" width="28" height="4" rx="2" fill="#94a3b8" />
          </>
        )}
        {view === 1 && (
          <>
            <rect x="12" y="24" width="176" height="102" rx="8" fill="#cbd5e1" />
            {Array.from({ length: 5 }).flatMap((_, r) =>
              Array.from({ length: 12 }).map((__, c) => <rect key={`${r}-${c}`} x={19 + c * 14} y={32 + r * 14} width="12" height="11" rx="2" fill="#334155" />),
            )}
            <rect x="62" y="104" width="76" height="16" rx="3" fill="#e2e8f0" />
          </>
        )}
        {view === 2 && (
          <>
            <rect x="14" y="62" width="172" height="22" rx="5" fill="#cbd5e1" />
            <rect x="14" y="84" width="172" height="6" rx="3" fill="#94a3b8" />
            {[26, 44, 62, 112, 140].map((x, i) => <rect key={x} x={x} y="68" width={i === 3 ? 20 : 12} height="8" rx="2" fill="#1e293b" />)}
            <circle cx="170" cy="72" r="3" fill="#15803d" />
          </>
        )}
        {view === 3 && (
          <>
            <rect x="26" y="18" width="148" height="114" rx="9" fill={`hsl(${hue} 12% 40%)`} />
            <circle cx="100" cy="75" r="14" fill="#ffffff" fillOpacity=".85" />
            <rect x="26" y="18" width="148" height="114" rx="9" fill="url(#lg)" />
            <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".25" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
          </>
        )}
        {view === 4 && (
          <>
            <rect x="14" y="14" width="172" height="112" rx="8" fill="#0f172a" />
            <rect x="20" y="20" width="160" height="100" rx="4" fill={`hsl(${hue} 60% 40%)`} />
            <circle cx="70" cy="95" r="46" fill={`hsl(${hue} 70% 55%)`} fillOpacity=".7" />
            <circle cx="140" cy="45" r="26" fill="#F5A524" fillOpacity=".8" />
            <rect x="20" y="108" width="160" height="12" fill="#0f172a" fillOpacity=".5" />
          </>
        )}
      </svg>
      <span className="absolute bottom-2 left-2 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-medium text-mute">{VIEWS[view]} · Sample photo</span>
    </div>
  );
}

function MonitorArt({ hue, sold = false }: { hue: number; sold?: boolean }) {
  return (
    <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg ${sold ? "grayscale" : ""}`} style={{ background: `linear-gradient(135deg, hsl(${hue} 30% 92%), hsl(${hue} 25% 82%))` }}>
      <svg viewBox="0 0 200 130" className="w-[70%]" aria-hidden="true">
        <rect x="22" y="10" width="156" height="92" rx="6" fill="#1e293b" />
        <rect x="27" y="15" width="146" height="82" rx="2" fill={`hsl(${hue} 55% 42%)`} />
        <circle cx="70" cy="75" r="34" fill="#fff" fillOpacity=".15" />
        <path d="M88 102h24l6 18H82z" fill="#94a3b8" />
        <rect x="68" y="119" width="64" height="5" rx="2.5" fill="#cbd5e1" />
      </svg>
      <span className="absolute bottom-2 left-2 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-medium text-mute">Sample photo</span>
    </div>
  );
}

function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "navy" }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone === "navy" ? "bg-navy text-white" : "bg-paper text-slate-600 ring-1 ring-line"}`}>{children}</span>;
}

function ChipGroup({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  const all = [{ id: "all", label: "All" }, ...options];
  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-wider text-mute">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {all.map((o) => (
          <button key={o.id} onClick={() => onChange(o.id)} aria-pressed={value === o.id} className={`min-h-10 rounded-full px-3.5 text-sm font-medium transition ${value === o.id ? "bg-navy text-white" : "border border-line bg-white text-slate-700 hover:border-navy/40"}`}>{o.label}</button>
        ))}
      </div>
    </fieldset>
  );
}

function FilterShell({ active, onClear, children }: { active: number; onClear: () => void; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="md:sticky md:top-24 md:self-start">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-12 w-full items-center justify-between rounded-xl border border-line bg-white px-4 text-[15px] font-semibold text-navy md:hidden">
        <span>Filters{active ? ` (${active})` : ""}</span><span className="text-mute">{open ? "Hide" : "Show"}</span>
      </button>
      <div className={`${open ? "mt-3 block" : "hidden"} space-y-5 rounded-xl border border-line bg-white p-4 md:mt-0 md:block`}>
        {children}
        {active > 0 && <Btn variant="secondary" onClick={onClear} className="!min-h-11 w-full">Clear filters</Btn>}
      </div>
    </aside>
  );
}

function EmptyState({ onClear, what }: { onClear: () => void; what: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="font-semibold text-navy">No {what} match those filters.</p>
      <p className="mt-1 text-sm text-slate-600">Stock changes daily, and we can often source what isn't listed.</p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Btn variant="secondary" onClick={onClear}>Clear filters</Btn>
        <Btn href={waLink(`Hi Fakhri Computers, I couldn't find the ${what} I want in the list. Can you source one?`)} target="_blank"><WaIcon /> Ask on WhatsApp</Btn>
      </div>
    </div>
  );
}

function PageHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-wider text-[#9a5f00]">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy md:text-5xl">{title}</h1>
      {intro && <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">{intro}</p>}
    </div>
  );
}

function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-xl border border-line bg-white">
      {items.map((i) => (
        <details key={i.q} className="group px-5">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-navy">
            {i.q}<span className="text-xl text-mute transition group-open:rotate-45">+</span>
          </summary>
          <p className="pb-4 text-[15px] leading-relaxed text-slate-600">{i.a}</p>
        </details>
      ))}
    </div>
  );
}

function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <Btn variant="ghost" onClick={onClick} className="-ml-3 !min-h-11 !px-3"><Icon name="back" className="size-4" /> {children}</Btn>;
}

function MapBox({ className = "h-44" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-[#173a5a] ${className}`} role="img" aria-label="Map placeholder">
      <svg className="absolute inset-0 size-full opacity-40" aria-hidden="true">
        <defs><pattern id="mapgrid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#fff" strokeOpacity=".25" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
        <path d="M-10 120 L120 70 L220 100 L360 30" stroke="#F5A524" strokeOpacity=".6" strokeWidth="6" fill="none" />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[70%] text-accent"><Icon name="pin" className="size-10" fill="#0F2A43" /></div>
      <span className="absolute bottom-2 left-2 rounded bg-white/15 px-2 py-0.5 text-[11px] text-white/80">Map placeholder</span>
    </div>
  );
}

/* ───────────────────────── recently sourced (laptops) ───────────────────────── */

type LapFilters = { use: string; brand: string; size: string; cond: string; avail: string };
const LAP0: LapFilters = { use: "all", brand: "all", size: "all", cond: "all", avail: "all" };
const sizeBucket = (s: number) => (s <= 14.2 ? "s" : s < 17 ? "m" : "l");

function LaptopCard({ m, onOpen }: { m: Machine; onOpen: () => void }) {
  const u = unitOf(m.id);
  const sold = u.status === "Sold";
  return (
    <article className={`flex flex-col rounded-xl border p-3 transition ${sold ? "border-line bg-slate-100" : "border-line bg-white hover:border-navy/40 hover:shadow-md"}`}>
      <button onClick={onOpen} className={`text-left ${sold ? "opacity-70" : ""}`} aria-label={`View ${m.name}`}>
        <LaptopArt hue={m.hue} sold={sold} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><Badge status={u.status} /><Chip>{condLabel(u.cond)}</Chip></div>
        <h3 className={`mt-2 text-[17px] font-semibold ${sold ? "text-slate-500" : "text-navy"}`}>{m.name}</h3>
        <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[13px] text-mute">
          <li>{m.cpu}</li><li>{m.ram}GB RAM</li><li>{m.ssd >= 1024 ? "1TB" : `${m.ssd}GB`} SSD</li><li>{m.screen}" screen</li>
        </ul>
        <p className={`mt-3 text-[15px] font-bold ${sold ? "text-slate-500" : "text-navy"}`}>{fmtRange(m.low, m.high)}</p>
        <p className="text-[11px] text-mute">Indicative range, sample listing</p>
      </button>
      <div className="mt-3">
        {sold ? (
          <Btn variant="secondary" href={waLink(`Hi Fakhri Computers, I saw the ${m.name} (sold). Can you find something similar?`)} target="_blank" className="!min-h-11 w-full">Ask for similar</Btn>
        ) : (
          <Btn variant="dark" onClick={onOpen} className="!min-h-11 w-full">View details</Btn>
        )}
      </div>
    </article>
  );
}

function RecentPage({ f, setF, openUnit, go }: { f: LapFilters; setF: (f: LapFilters) => void; openUnit: (id: string) => void; go: (s: Screen) => void }) {
  const list = LISTED.map((id) => CATALOG.find((m) => m.id === id)!).filter((m) => {
    const u = unitOf(m.id);
    return (f.use === "all" || m.uses.includes(f.use)) && (f.brand === "all" || brandOf(m) === f.brand) && (f.size === "all" || sizeBucket(m.screen) === f.size)
      && (f.cond === "all" || u.cond === f.cond) && (f.avail === "all" || u.status === f.avail);
  });
  const active = Object.values(f).filter((v) => v !== "all").length;
  const set = (k: keyof LapFilters) => (v: string) => setF({ ...f, [k]: v });
  const brands = [...new Set(LISTED.map((id) => brandOf(CATALOG.find((m) => m.id === id)!)))].map((b) => ({ id: b, label: b }));
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <PageHead eyebrow="Recently sourced" title="Laptops we've found for clients" intro="Sample examples of real sourcing work. Stock moves fast, so sold machines stay visible to show what's possible. Ask and we'll find something similar." />
      <div className="mt-8 grid gap-6 md:grid-cols-[250px_1fr] md:gap-8">
        <FilterShell active={active} onClear={() => setF(LAP0)}>
          <ChipGroup label="Use" value={f.use} onChange={set("use")} options={USES.map((u) => ({ id: u.id, label: u.label.replace(" and office work", "").replace(" and video editing", "") }))} />
          <ChipGroup label="Brand" value={f.brand} onChange={set("brand")} options={brands} />
          <ChipGroup label="Screen size" value={f.size} onChange={set("size")} options={[{ id: "s", label: "13–14\"" }, { id: "m", label: "15–16\"" }, { id: "l", label: "17\"+" }]} />
          <ChipGroup label="Condition" value={f.cond} onChange={set("cond")} options={CONDS.map((c) => ({ id: c.id, label: c.label }))} />
          <ChipGroup label="Availability" value={f.avail} onChange={set("avail")} options={[{ id: "Available", label: "Available" }, { id: "Sold", label: "Sold" }]} />
        </FilterShell>
        <div>
          <p className="mb-3 text-sm text-mute" aria-live="polite">Showing {list.length} of {LISTED.length} laptops</p>
          {list.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((m) => <LaptopCard key={m.id} m={m} onOpen={() => openUnit(m.id)} />)}</div>
          ) : <EmptyState what="laptops" onClear={() => setF(LAP0)} />}
          <PriceNote className="mt-5" />
          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-navy p-7 text-white md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold">Don't see the right one? We'll find it for you.</p>
            <Btn onClick={() => go("quiz")}>Find my laptop <Icon name="arrow" className="size-4" /></Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── laptop detail ───────────────────────── */

function HealthBar({ label, pct, hint }: { label: string; pct: number; hint: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between"><span className="text-sm font-semibold text-navy">{label}</span><span className="text-sm font-bold text-navy">{pct}%</span></div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full ${pct >= 85 ? "bg-ok" : "bg-accent"}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-mute">{hint}</p>
    </div>
  );
}

function Toggle({ on, onChange, disabled, label }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={() => onChange(!on)} className={`relative h-8 w-14 shrink-0 rounded-full transition disabled:opacity-60 ${on ? "bg-ok" : "bg-slate-300"}`}>
      <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition-all ${on ? "left-7" : "left-1"}`} />
    </button>
  );
}

function LaptopDetail({ m, held, onBack, onReserve, onViewHeld, go }: {
  m: Machine; held: boolean; onBack: () => void; onReserve: (o: { likeNew: boolean; addons: string[] }) => void; onViewHeld: () => void; go: (s: Screen) => void;
}) {
  const u = unitOf(m.id);
  const sold = u.status === "Sold";
  const [view, setView] = useState(0);
  const [likeNew, setLikeNew] = useState(u.cond === "new");
  const [add, setAdd] = useState<string[]>([]);
  const g = GRADES[m.grade];
  const h = healthOf(m);
  const sel = ADDONS.filter((a) => add.includes(a.id));
  const lo = m.low + sel.reduce((s, a) => s + a.low, 0);
  const hi = m.high + sel.reduce((s, a) => s + a.high, 0);
  const rows: [string, string][] = [
    ["Processor", m.cpu], ["Memory", `${m.ram}GB RAM`], ["Storage", `${m.ssd >= 1024 ? "1TB" : `${m.ssd}GB`} SSD`], ["Graphics", m.gpu ?? "Integrated"],
    ["Screen", `${m.screen}"${m.touch ? " touchscreen" : ""}`], ["Weight", `${m.kg} kg`], ["Battery life", `about ${m.bat} hours new-use`], ["Numeric keypad", m.numpad ? "Yes" : "No"], ["Model year", String(m.year)],
  ];
  const ask = `Hi Fakhri Computers, I'm interested in the ${m.name} (sample listing)${likeNew ? ", with the Like-new package" : ""}${sel.length ? `, plus ${sel.map((a) => a.label.toLowerCase()).join(", ")}` : ""}. ${sold ? "I saw it's sold. Can you find something similar?" : "Is it still available?"}`;

  return (
    <div className="rise mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-10">
      <BackLink onClick={onBack}>All laptops</BackLink>
      <div className="mt-2 flex flex-wrap items-center gap-2"><Badge status={u.status} /><Chip tone="navy">Recent example</Chip><Chip>{condLabel(u.cond)}</Chip></div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy md:text-4xl">{m.name}</h1>
      <p className="text-mute">{m.cpu} · {m.ram}GB · {m.ssd >= 1024 ? "1TB" : `${m.ssd}GB`} SSD · {m.screen}"</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
        <div>
          <GalleryArt hue={m.hue} view={view} sold={sold} />
          <div className="mt-3 grid grid-cols-5 gap-2" role="tablist" aria-label="Photos">
            {VIEWS.map((v, i) => (
              <button key={v} role="tab" aria-selected={view === i} aria-label={`Photo ${i + 1}: ${v}`} onClick={() => setView(i)} className={`overflow-hidden rounded-lg border-2 transition ${view === i ? "border-navy" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <div className="pointer-events-none"><GalleryThumb hue={m.hue} view={i} /></div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-mute">Photo {view + 1} of 5. Sample images. Your shortlist includes real photos of the real unit.</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 md:p-6 lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm text-mute">Indicative price range</p>
          <p className={`text-3xl font-extrabold ${sold ? "text-slate-500" : "text-navy"}`}>{fmtRange(lo, hi)}</p>
          {likeNew && u.cond !== "new" && <p className="mt-1 text-sm font-medium text-navy">+ Like-new package: price on request</p>}
          <PriceNote className="mt-1" />

          <div className="mt-5 flex items-start justify-between gap-4 rounded-xl bg-paper p-4">
            <div>
              <p className="font-semibold text-navy">Upgrade to Like-new package</p>
              <p className="mt-0.5 text-sm text-slate-600">Cleaned, cosmetically refreshed and boxed. {u.cond === "new" ? "Already included with this unit." : "Costs extra, price on request."}</p>
            </div>
            <Toggle on={likeNew} onChange={setLikeNew} disabled={u.cond === "new"} label="Upgrade to Like-new package" />
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-navy">Accessory add-ons</legend>
            <div className="mt-2 space-y-2">
              {ADDONS.map((a) => (
                <label key={a.id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3.5 py-2 text-sm transition ${add.includes(a.id) ? "border-navy bg-navy/5" : "border-line"}`}>
                  <input type="checkbox" className="size-5 accent-[#0F2A43]" checked={add.includes(a.id)} onChange={() => setAdd(add.includes(a.id) ? add.filter((x) => x !== a.id) : [...add, a.id])} />
                  <span className="flex-1 font-medium text-slate-800">{a.label}</span>
                  <span className="text-mute">AED {a.low} – {a.high}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-col gap-3">
            {sold ? (
              <Btn href={waLink(ask)} target="_blank"><WaIcon /> Ask for similar</Btn>
            ) : held ? (
              <Btn onClick={onViewHeld}>View my reservation</Btn>
            ) : (
              <Btn onClick={() => onReserve({ likeNew, addons: add })}>Reserve for 24 hours</Btn>
            )}
            {!sold && <Btn variant="secondary" href={waLink(ask)} target="_blank"><WaIcon /> Ask on WhatsApp</Btn>}
          </div>
          <p className="mt-3 text-xs text-mute">{sold ? "This unit has been sold. We can source a similar one." : "Reserving holds it for 24 hours while you inspect. No payment now."}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-navy">Tested before sale</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {TESTED.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[15px] text-slate-800">
                  <span className="flex size-6 items-center justify-center rounded-full bg-ok text-white"><Icon name="check" className="size-3.5" sw={3.5} /></span>{t}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-4 border-t border-line pt-5">
              <HealthBar label="Battery health" pct={h.battery} hint="Share of original capacity remaining, measured on this unit." />
              <HealthBar label="SSD health" pct={h.ssd} hint="Remaining drive life reported by the SSD itself." />
            </div>
          </section>
          <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-navy">Condition grade</h2>
            <p className="mt-3 inline-flex rounded-full bg-accent px-3 py-1 text-sm font-bold text-navy">{g.title}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{g.text}</p>
            <p className="mt-2 text-sm text-mute">Every grade is fully tested and working. Grades describe looks, not performance.</p>
          </section>
        </div>
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-navy">Specifications</h2>
            <dl className="mt-3 divide-y divide-line text-[15px]">
              {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-mute">{k}</dt><dd className="text-right font-medium text-slate-800">{v}</dd></div>)}
            </dl>
          </section>
          <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-navy">Warranty and returns</h2>
            <ul className="mt-3 space-y-3 text-[15px] text-slate-700">
              <li className="flex gap-3"><Icon name="shield" className="mt-0.5 size-5 shrink-0 text-ok" /><span><b className="text-navy">7-day check window.</b> If it doesn't match the listing, bring it back.</span></li>
              <li className="flex gap-3"><Icon name="shield" className="mt-0.5 size-5 shrink-0 text-ok" /><span><b className="text-navy">90-day shop warranty</b> on hardware faults (sample terms).</span></li>
              <li className="flex gap-3"><Icon name="camera" className="mt-0.5 size-5 shrink-0 text-ok" /><span><b className="text-navy">Inspect before you pay.</b> Check the real unit in person.</span></li>
            </ul>
            <button onClick={() => go("warranty")} className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#9a5f00] underline-offset-4 hover:underline">Read what's covered <Icon name="arrow" className="size-4" /></button>
          </section>
        </div>
      </div>
    </div>
  );
}

function GalleryThumb({ hue, view }: { hue: number; view: number }) {
  return <div className="aspect-[4/3] w-full [&_span]:hidden"><GalleryArt hue={hue} view={view} sold={false} /></div>;
}

/* ───────────────────────── reserve flow ───────────────────────── */

type Reservation = { id: string; name: string; phone: string; day: string; slot: string; until: number; likeNew: boolean; addons: string[] };

const SLOTS = ["Morning (10:00 – 13:00)", "Afternoon (13:00 – 17:00)", "Evening (17:00 – 21:00)"];
function nextDays() {
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    return `${i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-GB", { weekday: "long" })} · ${date}`;
  });
}

function Pick({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-navy">{label}</legend>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <button type="button" key={o} onClick={() => onChange(o)} aria-pressed={value === o} className={`min-h-11 rounded-xl border-2 px-3.5 text-sm font-medium transition ${value === o ? "border-navy bg-navy text-white" : "border-line bg-white text-slate-700 hover:border-navy/40"}`}>{o}</button>
        ))}
      </div>
    </fieldset>
  );
}

function ReserveModal({ m, opts, onClose, onDone }: { m: Machine; opts: { likeNew: boolean; addons: string[] }; onClose: () => void; onDone: (r: Reservation) => void }) {
  const days = useMemo(nextDays, []);
  const [f, setF] = useState({ name: "", phone: "", day: "", slot: "" });
  const [touched, setTouched] = useState(false);
  const errs = {
    name: f.name.trim().length < 2 ? "Enter your name." : "",
    phone: validatePhone(f.phone),
    time: !f.day || !f.slot ? "Choose a day and a time window." : "",
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (errs.name || errs.phone || errs.time) return;
    onDone({ id: m.id, name: f.name.trim(), phone: f.phone.trim(), day: f.day, slot: f.slot, until: Date.now() + 24 * 3600 * 1000, ...opts });
  };
  const inp = (bad: boolean) => `mt-1.5 min-h-[52px] w-full rounded-xl border-2 bg-white px-4 text-base outline-none focus:border-navy ${bad ? "border-red-500" : "border-line"}`;
  return (
    <Modal onClose={onClose} label="Reserve for 24 hours">
      <h2 className="pr-10 text-xl font-bold text-navy">Reserve for 24 hours</h2>
      <p className="mt-1 text-sm text-slate-600">{m.name}. No payment now. We hold it while you inspect.</p>
      <form onSubmit={submit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="rn" className="text-sm font-semibold text-navy">Your name</label>
          <input id="rn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" className={inp(touched && !!errs.name)} />
          {touched && errs.name && <p className="mt-1 text-sm text-red-600">{errs.name}</p>}
        </div>
        <div>
          <label htmlFor="rp" className="text-sm font-semibold text-navy">WhatsApp number</label>
          <input id="rp" type="tel" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" placeholder="055 123 4567" className={inp(touched && !!errs.phone)} />
          {touched && errs.phone && <p className="mt-1 text-sm text-red-600">{errs.phone}</p>}
        </div>
        <Pick label="Preferred inspection day" options={days} value={f.day} onChange={(v) => setF({ ...f, day: v })} />
        <Pick label="Preferred time" options={SLOTS} value={f.slot} onChange={(v) => setF({ ...f, slot: v })} />
        {touched && errs.time && <p className="text-sm text-red-600">{errs.time}</p>}
        <Btn type="submit" className="w-full">Hold it for me</Btn>
      </form>
    </Modal>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

function ReservedPage({ r, go, openUnit, release }: { r: Reservation; go: (s: Screen) => void; openUnit: (id: string) => void; release: () => void }) {
  const m = CATALOG.find((x) => x.id === r.id)!;
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t); }, []);
  const left = Math.max(0, r.until - now);
  const hh = Math.floor(left / 3600000), mm = Math.floor((left % 3600000) / 60000), ss = Math.floor((left % 60000) / 1000);
  const until = new Date(r.until).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const extras = [r.likeNew && "Like-new package (price on request)", ...ADDONS.filter((a) => r.addons.includes(a.id)).map((a) => a.label)].filter(Boolean) as string[];
  const msg = `Hi Fakhri Computers, I'm ${r.name}. I reserved the ${m.name} (sample listing) and would like to inspect it ${r.day}, ${r.slot}.${extras.length ? ` Extras: ${extras.join(", ")}.` : ""}`;
  return (
    <div className="rise mx-auto max-w-2xl px-5 py-10 md:py-16">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-ok text-white"><Icon name="check" className="size-8" sw={3} /></span>
        <h1 className="mt-5 text-3xl font-extrabold text-navy">{left > 0 ? `Held for you until ${until}` : "This reservation has ended"}</h1>
        <p className="mt-2 text-slate-600">{m.name}, reserved by {r.name}.</p>
      </div>
      {left > 0 && (
        <div className="mt-7 grid grid-cols-3 gap-3 text-center" role="timer" aria-label="Time left on your reservation">
          {[[hh, "Hours"], [mm, "Minutes"], [ss, "Seconds"]].map(([v, l]) => (
            <div key={l as string} className="rounded-xl bg-navy py-5 text-white"><p className="text-4xl font-extrabold tabular-nums text-accent">{pad(v as number)}</p><p className="mt-1 text-xs uppercase tracking-wider text-white/70">{l}</p></div>
          ))}
        </div>
      )}
      <div className="mt-6 space-y-2 rounded-xl border border-line bg-white p-5 text-[15px]">
        <div className="flex justify-between gap-4"><span className="text-mute">Inspection</span><span className="text-right font-medium">{r.day}<br />{r.slot}</span></div>
        <div className="flex justify-between gap-4"><span className="text-mute">We'll message</span><span className="font-medium">{r.phone}</span></div>
        <div className="flex justify-between gap-4"><span className="text-mute">Indicative range</span><span className="font-medium">{fmtRange(m.low, m.high)}</span></div>
        {extras.length > 0 && <div className="flex justify-between gap-4"><span className="text-mute">Extras</span><span className="text-right font-medium">{extras.join(", ")}</span></div>}
        <PriceNote className="pt-1" />
      </div>
      <ol className="mt-6 space-y-3 text-[15px] text-slate-700">
        {["We confirm your inspection time on WhatsApp.", "Check the unit in person: tested items, health and condition.", "Happy? Pay and take it home, with your 7-day check window. Not for you? Release it, no cost."].map((t, i) => (
          <li key={t} className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-accent">{i + 1}</span><span className="pt-0.5">{t}</span></li>
        ))}
      </ol>
      <div className="mt-7 flex flex-col gap-3">
        <Btn href={waLink(msg)} target="_blank"><WaIcon /> Confirm on WhatsApp</Btn>
        <Btn variant="secondary" onClick={() => openUnit(m.id)}>Back to this laptop</Btn>
        <Btn variant="ghost" onClick={() => go("recent")}>Browse more laptops</Btn>
        <button onClick={release} className="min-h-11 text-sm text-mute underline-offset-4 hover:underline">Release this reservation</button>
      </div>
    </div>
  );
}

/* ───────────────────────── monitors ───────────────────────── */

type MonFilters = { size: string; res: string; hz: string; panel: string; cond: string };
const MON0: MonFilters = { size: "all", res: "all", hz: "all", panel: "all", cond: "all" };
const monSize = (s: number) => (s <= 24 ? "24" : s <= 27 ? "27" : "32");
const monHz = (h: number) => (h <= 60 ? "60" : h < 144 ? "75" : "144");

function MonitorCard({ m, onOpen }: { m: Monitor; onOpen: () => void }) {
  const sold = m.status === "Sold";
  return (
    <article className={`flex flex-col rounded-xl border p-3 transition ${sold ? "border-line bg-slate-100" : "border-line bg-white hover:border-navy/40 hover:shadow-md"}`}>
      <button onClick={onOpen} className={`text-left ${sold ? "opacity-70" : ""}`} aria-label={`View ${m.name}`}>
        <MonitorArt hue={m.hue} sold={sold} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><Badge status={m.status} /><Chip>{condLabel(m.cond)}</Chip></div>
        <h3 className={`mt-2 text-[17px] font-semibold ${sold ? "text-slate-500" : "text-navy"}`}>{m.name}</h3>
        <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[13px] text-mute">
          <li>{m.size}" screen</li><li>{m.res}</li><li>{m.hz}Hz</li><li>{m.panel} panel</li>
        </ul>
        <p className={`mt-3 text-[15px] font-bold ${sold ? "text-slate-500" : "text-navy"}`}>{fmtRange(m.low, m.high)}</p>
        <p className="text-[11px] text-mute">Indicative range, sample listing</p>
      </button>
      <div className="mt-3">
        {sold ? <Btn variant="secondary" href={waLink(`Hi Fakhri Computers, I saw the ${m.name} monitor (sold). Can you find something similar?`)} target="_blank" className="!min-h-11 w-full">Ask for similar</Btn>
          : <Btn variant="dark" onClick={onOpen} className="!min-h-11 w-full">View details</Btn>}
      </div>
    </article>
  );
}

function MonitorsPage() {
  const [f, setF] = useState(MON0);
  const [open, setOpen] = useState<Monitor | null>(null);
  const list = MONITORS.filter((m) => (f.size === "all" || monSize(m.size) === f.size) && (f.res === "all" || m.res === f.res) && (f.hz === "all" || monHz(m.hz) === f.hz) && (f.panel === "all" || m.panel === f.panel) && (f.cond === "all" || m.cond === f.cond));
  const active = Object.values(f).filter((v) => v !== "all").length;
  const set = (k: keyof MonFilters) => (v: string) => setF({ ...f, [k]: v });
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <PageHead eyebrow="Monitors" title="Tested monitors, checked for dead pixels" intro="Office, gaming and colour-accurate displays. Each is checked for dead pixels, backlight bleed and input faults before it reaches you." />
      <div className="mt-8 grid gap-6 md:grid-cols-[250px_1fr] md:gap-8">
        <FilterShell active={active} onClear={() => setF(MON0)}>
          <ChipGroup label="Size" value={f.size} onChange={set("size")} options={[{ id: "24", label: "24\" and under" }, { id: "27", label: "27\"" }, { id: "32", label: "32\"+" }]} />
          <ChipGroup label="Resolution" value={f.res} onChange={set("res")} options={[{ id: "Full HD", label: "Full HD" }, { id: "QHD", label: "QHD" }, { id: "4K", label: "4K" }]} />
          <ChipGroup label="Refresh rate" value={f.hz} onChange={set("hz")} options={[{ id: "60", label: "60Hz" }, { id: "75", label: "75Hz" }, { id: "144", label: "144Hz+" }]} />
          <ChipGroup label="Panel type" value={f.panel} onChange={set("panel")} options={[{ id: "IPS", label: "IPS" }, { id: "VA", label: "VA" }, { id: "TN", label: "TN" }]} />
          <ChipGroup label="Condition" value={f.cond} onChange={set("cond")} options={CONDS.map((c) => ({ id: c.id, label: c.label }))} />
        </FilterShell>
        <div>
          <p className="mb-3 text-sm text-mute" aria-live="polite">Showing {list.length} of {MONITORS.length} monitors</p>
          {list.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((m) => <MonitorCard key={m.id} m={m} onOpen={() => setOpen(m)} />)}</div> : <EmptyState what="monitors" onClear={() => setF(MON0)} />}
          <PriceNote className="mt-5" />
        </div>
      </div>
      {open && (
        <Modal onClose={() => setOpen(null)} label={open.name}>
          <MonitorArt hue={open.hue} sold={open.status === "Sold"} />
          <div className="mt-4 flex flex-wrap gap-2"><Chip tone="navy">Recent example</Chip><Badge status={open.status} /></div>
          <h3 className="mt-2 text-xl font-bold text-navy">{open.name}</h3>
          <dl className="mt-3 divide-y divide-line rounded-xl border border-line text-sm">
            {([["Size", `${open.size}"`], ["Resolution", open.res], ["Refresh rate", `${open.hz}Hz`], ["Panel", open.panel], ["Inputs", open.ports], ["Condition", condLabel(open.cond)]] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-3.5 py-2.5"><dt className="text-mute">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
            ))}
          </dl>
          <p className="mt-4 text-2xl font-bold text-navy">{fmtRange(open.low, open.high)}</p>
          <PriceNote className="mt-1" />
          <div className="mt-5 flex flex-col gap-3">
            <Btn href={waLink(`Hi Fakhri Computers, I'm interested in the ${open.name} monitor (sample listing). ${open.status === "Sold" ? "Can you find something similar?" : "Is it still available?"}`)} target="_blank"><WaIcon /> {open.status === "Sold" ? "Ask for similar" : "Ask on WhatsApp"}</Btn>
            <Btn variant="secondary" onClick={() => setOpen(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ───────────────────────── trust pages ───────────────────────── */

function HowPage({ go }: { go: (s: Screen) => void }) {
  const steps = [
    { t: "Tell us your needs", you: "Answer six quick questions, or just message us on WhatsApp.", we: "We read your use, budget, size, condition and must-haves.", time: "About 1 minute" },
    { t: "We source from the market", you: "Nothing. Carry on with your day.", we: "We search our trade network, suppliers and private sellers for the best-value machines that fit.", time: "Within 24 hours" },
    { t: "Your WhatsApp shortlist", you: "Review two or three options with real photos, health stats and a confirmed price.", we: "We hold the quoted price for 48 hours.", time: "Price valid 48 hours" },
    { t: "Reserve and inspect", you: "Reserve your pick for 24 hours and come and check it in person.", we: "We keep it aside, and confirm your inspection time.", time: "24-hour hold" },
    { t: "Buy with a safety net", you: "Pay only when you're happy. Then use your 7-day check window.", we: "We stand behind what we tested.", time: "7-day check window" },
  ];
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <PageHead eyebrow="How it works" title="A personal sourcing service, not a fixed catalogue" intro="Most second-hand listings are a gamble. We do the searching, testing and negotiating, so you only see machines worth your time." />
      <ol className="mt-10 space-y-4">
        {steps.map((s, i) => (
          <li key={s.t} className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-[72px_1fr_1fr_160px] md:items-start md:gap-6 md:p-6">
            <span className="flex size-12 items-center justify-center rounded-full bg-navy text-lg font-bold text-accent">{i + 1}</span>
            <div><h2 className="text-lg font-bold text-navy">{s.t}</h2></div>
            <div className="text-[15px] text-slate-700"><p><b className="text-navy">You: </b>{s.you}</p><p className="mt-1.5"><b className="text-navy">We: </b>{s.we}</p></div>
            <div><Chip>{s.time}</Chip></div>
          </li>
        ))}
      </ol>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { t: "Why ranges, not prices", d: "Second-hand prices move daily and every unit is different. We show an honest range, then confirm the exact price on your WhatsApp shortlist." },
          { t: "Like-new package", d: "Want it to look and feel fresh? We clean it, refresh the cosmetics and box it. It costs extra, quoted on request." },
          { t: "No obligation", d: "Asking is free. You pay only after you've seen and checked the unit in person." },
        ].map((c) => <div key={c.t} className="rounded-xl bg-white p-6 ring-1 ring-line"><h3 className="font-bold text-navy">{c.t}</h3><p className="mt-1.5 text-[15px] text-slate-600">{c.d}</p></div>)}
      </div>
      <h2 className="mt-12 text-2xl font-bold text-navy">Common questions</h2>
      <div className="mt-4 max-w-3xl">
        <Faq items={[
          { q: "Do I have to buy what you send?", a: "Never. The shortlist is a recommendation. If none of the options suit you, we keep looking." },
          { q: "What if the price changes?", a: "The price on your shortlist is held for 48 hours. If you reserve a unit, it's held for 24 hours from the reservation." },
          { q: "Can you source a specific model?", a: "Often, yes. Send us the model and your budget on WhatsApp and we'll tell you honestly what's realistic." },
          { q: "Do you deliver?", a: "For office and bulk orders, yes. Single laptops are usually inspected and collected in the shop." },
        ]} />
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Btn onClick={() => go("quiz")}>Find my laptop <Icon name="arrow" className="size-4" /></Btn>
        <Btn variant="secondary" onClick={() => go("warranty")}>See how we test</Btn>
      </div>
    </div>
  );
}

function WarrantyPage({ go }: { go: (s: Screen) => void }) {
  const tests = [
    ["Screen", "Dead pixels, backlight bleed, brightness and touch response."],
    ["Keyboard", "Every key, backlight and function row."],
    ["Trackpad", "Tracking, gestures and click on both sides."],
    ["Ports", "USB, HDMI, charging and headphone jack, each with a live device."],
    ["Wi-Fi and Bluetooth", "Connects, holds signal and pairs with a device."],
    ["Speakers and microphone", "Left and right channels, distortion and recording."],
    ["Camera", "Image quality and privacy shutter where fitted."],
    ["Battery", "Capacity measured against the original, and charge cycles."],
    ["SSD", "Drive health reported, plus a read and write check."],
    ["Heat and fans", "Stress test for temperature and fan noise."],
  ];
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <PageHead eyebrow="Warranty and testing" title="Tested before sale. Backed after it." intro="Terms below are sample terms for this prototype and will be finalised by the shop." />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[["7-day check window", "Time to inspect the unit properly after you take it home."], ["90-day shop warranty", "Covers hardware faults that aren't caused by damage (sample term)."], ["Inspect before paying", "Come and check the real unit in person. No pressure."]].map(([t, d]) => (
          <div key={t} className="rounded-xl bg-navy p-6 text-white"><Icon name="shield" className="size-7 text-accent" /><h2 className="mt-3 text-lg font-bold">{t}</h2><p className="mt-1 text-sm text-white/75">{d}</p></div>
        ))}
      </div>
      <h2 className="mt-12 text-2xl font-bold text-navy">What we test</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map(([t, d]) => (
          <li key={t} className="flex gap-3 rounded-xl border border-line bg-white p-4">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ok text-white"><Icon name="check" className="size-3.5" sw={3.5} /></span>
            <div><p className="font-semibold text-navy">{t}</p><p className="text-sm text-slate-600">{d}</p></div>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-2xl font-bold text-navy">The return window</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-ok/30 bg-white p-6">
          <h3 className="flex items-center gap-2 font-bold text-ok"><Icon name="check" className="size-5" sw={3} /> What it covers</h3>
          <ul className="mt-3 space-y-2 text-[15px] text-slate-700">
            {["The unit doesn't match the listing or photos", "A tested function stops working (screen, keyboard, ports, Wi-Fi...)", "Battery or SSD health far below what we stated", "Faults that were present on day one"].map((x) => <li key={x} className="flex gap-2"><span className="text-ok">•</span>{x}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-red-200 bg-white p-6">
          <h3 className="flex items-center gap-2 font-bold text-red-700"><Icon name="x" className="size-5" sw={3} /> What it doesn't cover</h3>
          <ul className="mt-3 space-y-2 text-[15px] text-slate-700">
            {["Drops, spills, cracked screens or other damage after purchase", "Wear that was graded and shown in the listing", "Software problems, viruses or changes you made", "Changing your mind on the model or colour"].map((x) => <li key={x} className="flex gap-2"><span className="text-red-600">•</span>{x}</li>)}
          </ul>
        </div>
      </div>
      <h2 className="mt-12 text-2xl font-bold text-navy">Questions</h2>
      <div className="mt-4 max-w-3xl">
        <Faq items={[
          { q: "How do I make a claim?", a: "Message us on WhatsApp with your name and the unit. Bring it in and we'll inspect it together." },
          { q: "What happens if it fails inside 7 days?", a: "We'll refund you or swap it for a similar unit, your choice." },
          { q: "Is the battery covered?", a: "Battery health is measured and shown on every listing. Normal ageing isn't a fault, but a result far below what we stated is covered." },
        ]} />
      </div>
      <div className="mt-10"><Btn variant="secondary" onClick={() => go("recent")}>See tested examples</Btn></div>
    </div>
  );
}

function ReviewsPage({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <PageHead eyebrow="Reviews" title="What clients say" intro="Sample reviews for this prototype. Real reviews and client photos will replace these." />
      <div className="mt-5 flex items-center gap-3">
        <div className="flex gap-0.5 text-accent">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" className="size-5" fill="currentColor" sw={1} />)}</div>
        <span className="text-sm font-semibold text-navy">4.9 average</span><span className="text-sm text-mute">(sample)</span>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="flex flex-col rounded-xl border border-line bg-white p-4">
            <div className="flex aspect-[16/10] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-center text-sm text-mute" style={{ borderColor: `hsl(${r.hue} 25% 75%)`, background: `hsl(${r.hue} 30% 96%)` }}>
              <Icon name="camera" className="size-6" /><span className="font-medium">Photo from the client</span><span className="text-[11px]">Sample slot</span>
            </div>
            <div className="mt-4 flex gap-0.5 text-accent">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" className="size-4" fill="currentColor" sw={1} />)}</div>
            <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-700">"{r.text}"</blockquote>
            <figcaption className="mt-4 border-t border-line pt-3 text-sm"><p className="font-semibold text-navy">{r.name}</p><p className="text-mute">Bought: {r.bought}</p></figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Btn onClick={() => go("quiz")}>Find my laptop <Icon name="arrow" className="size-4" /></Btn>
        <Btn variant="secondary" href={waLink("Hi Fakhri Computers, I'd like to leave a review.")} target="_blank"><WaIcon /> Share your experience</Btn>
      </div>
    </div>
  );
}

function AboutPage({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <PageHead eyebrow="About" title="One person who actually checks the machine" />
      <div className="mt-8 grid gap-8 md:grid-cols-[360px_1fr] md:gap-14">
        <div>
          <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-navy to-navy-soft text-white/80">
            <svg viewBox="0 0 24 24" className="size-24 text-white/40" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.5" /><path d="M3.5 21c0-4.6 3.8-7.5 8.5-7.5s8.5 2.9 8.5 7.5z" /></svg>
            <span className="text-sm font-medium">Owner photo placeholder</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-navy">Fakhri, owner</p><p className="text-sm text-mute">Sample bio, to be replaced</p>
        </div>
        <div>
          <div className="space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
            <p>Fakhri Computers started with a simple frustration: friends and family kept asking where to buy a good second-hand laptop, and most of the market was guesswork.</p>
            <p>So the shop works the other way round. You tell us what you need, and we use years of trade contacts to find the best-value machine. We test it, photograph it honestly and let you inspect it before you pay.</p>
            <p>It's a small, personal business. When you message us, you talk to the person who picks and tests your laptop.</p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[["9", "years in business"], ["1,200+", "laptops sourced"], ["7 days", "check window"]].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-white p-4 text-center ring-1 ring-line"><p className="text-2xl font-extrabold text-navy md:text-3xl">{n}</p><p className="text-xs text-mute md:text-sm">{l}</p></div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-mute">Sample figures for the prototype.</p>
          <div className="mt-8 flex gap-4 rounded-xl bg-white p-5 ring-1 ring-line">
            <Icon name="pin" className="mt-0.5 size-6 shrink-0 text-navy" />
            <div><p className="font-semibold text-navy">Visit the shop</p><p className="text-slate-600">Shop 12, Sample Plaza, Al Rigga Road, Deira, Dubai</p><p className="text-sm text-mute">Sample address</p></div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Btn onClick={() => go("contact")}>Get in touch</Btn>
            <Btn variant="secondary" onClick={() => go("how")}>How it works</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function BulkPage({ onSubmit }: { onSubmit?: (enquiry: BulkEnquiry) => void }) {
  const blank = { company: "", name: "", phone: "", qty: "", use: "", band: "", delivery: "", emirate: "" };
  const [f, setF] = useState(blank);
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const qty = Number(f.qty);
  const e = {
    company: f.company.trim().length < 2 ? "Enter the company name." : "",
    name: f.name.trim().length < 2 ? "Enter a contact name." : "",
    phone: validatePhone(f.phone),
    qty: !Number.isInteger(qty) || qty < 2 ? "Enter a quantity of 2 or more." : "",
    use: !f.use ? "Choose a use." : "",
    band: !f.band ? "Choose a budget band." : "",
    delivery: !f.delivery ? "Tell us if you need delivery." : "",
    emirate: f.delivery === "yes" && !f.emirate ? "Choose a delivery emirate." : "",
  };
  const bad = (k: keyof typeof e) => touched && !!e[k];
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    if (Object.values(e).every((x) => !x)) {
      const newEnquiry: BulkEnquiry = {
        id: `B${String(Date.now()).slice(-6)}`,
        company: f.company.trim(),
        name: f.name.trim(),
        phone: f.phone.trim(),
        qty: Number(f.qty),
        use: f.use,
        band: f.band,
        delivery: f.delivery === "yes" ? "Yes" : "No",
        emirate: f.emirate || "N/A",
        timestamp: Date.now(),
        status: "new",
      };
      onSubmit?.(newEnquiry);
      setSent(true);
    }
  };
  const inp = (b: boolean) => `mt-1.5 min-h-[52px] w-full rounded-xl border-2 bg-white px-4 text-base outline-none focus:border-navy ${b ? "border-red-500" : "border-line"}`;
  const Err = ({ k }: { k: keyof typeof e }) => (bad(k) ? <p className="mt-1 text-sm text-red-600">{e[k]}</p> : null);
  const msg = `Hi Fakhri Computers, bulk enquiry from ${f.company} (${f.name}). Quantity: ${f.qty}. Use: ${f.use}. Budget per unit: ${f.band}. Delivery: ${f.delivery === "yes" ? f.emirate : "not needed"}.`;

  if (sent) {
    return (
      <div className="rise mx-auto max-w-xl px-5 py-12 text-center md:py-20">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-ok text-white"><Icon name="check" className="size-8" sw={3} /></span>
        <h1 className="mt-5 text-3xl font-extrabold text-navy">Enquiry received</h1>
        <p className="mt-2 text-slate-600">Thanks, {f.name.split(" ")[0]}. We'll send a matched quote for {f.qty} units to {f.phone} on WhatsApp within one working day.</p>
        <div className="mt-7 flex flex-col gap-3"><Btn href={waLink(msg)} target="_blank"><WaIcon /> Send details on WhatsApp</Btn><Btn variant="secondary" onClick={() => { setF(blank); setTouched(false); setSent(false); }}>Start another enquiry</Btn></div>
      </div>
    );
  }
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
        <div>
          <PageHead eyebrow="Bulk and office orders" title="Matching machines for your whole team" intro="Five identical business laptops are harder to find than one. We source matched units, test every one, and quote a per-unit range." />
          <ul className="mt-6 space-y-3 text-[15px] text-slate-700">
            {["Matched models, specs and condition grade across the order", "Every unit tested, with health stats per machine", "Inspect the batch before you pay", "Delivery available across the UAE", "Monitors, docks and accessories can be added"].map((x) => <li key={x} className="flex gap-3"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ok text-white"><Icon name="check" className="size-3.5" sw={3.5} /></span>{x}</li>)}
          </ul>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-line bg-white p-5 md:p-7">
          <h2 className="text-xl font-bold text-navy">Tell us about your order</h2>
          <div><label htmlFor="bc" className="text-sm font-semibold text-navy">Company</label><input id="bc" value={f.company} onChange={(x) => setF({ ...f, company: x.target.value })} autoComplete="organization" className={inp(bad("company"))} /><Err k="company" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="bn" className="text-sm font-semibold text-navy">Contact name</label><input id="bn" value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} autoComplete="name" className={inp(bad("name"))} /><Err k="name" /></div>
            <div><label htmlFor="bp" className="text-sm font-semibold text-navy">WhatsApp number</label><input id="bp" type="tel" inputMode="tel" value={f.phone} onChange={(x) => setF({ ...f, phone: x.target.value })} placeholder="055 123 4567" className={inp(bad("phone"))} /><Err k="phone" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="bq" className="text-sm font-semibold text-navy">Quantity</label><input id="bq" type="number" inputMode="numeric" min={2} value={f.qty} onChange={(x) => setF({ ...f, qty: x.target.value })} className={inp(bad("qty"))} /><Err k="qty" /></div>
            <div>
              <label htmlFor="bb" className="text-sm font-semibold text-navy">Budget per unit</label>
              <select id="bb" value={f.band} onChange={(x) => setF({ ...f, band: x.target.value })} className={inp(bad("band"))}>
                <option value="">Choose...</option>{["Under AED 1,000", "AED 1,000 – 1,500", "AED 1,500 – 2,500", "AED 2,500+", "Not sure, advise me"].map((o) => <option key={o}>{o}</option>)}
              </select><Err k="band" />
            </div>
          </div>
          <div>
            <label htmlFor="bu" className="text-sm font-semibold text-navy">Use</label>
            <select id="bu" value={f.use} onChange={(x) => setF({ ...f, use: x.target.value })} className={inp(bad("use"))}>
              <option value="">Choose...</option>{["Office and admin", "Call centre", "School or training room", "Design or engineering team", "Mixed use"].map((o) => <option key={o}>{o}</option>)}
            </select><Err k="use" />
          </div>
          <div>
            <Pick label="Delivery needed?" options={["Yes", "No"]} value={f.delivery === "yes" ? "Yes" : f.delivery === "no" ? "No" : ""} onChange={(v) => setF({ ...f, delivery: v.toLowerCase(), emirate: v === "No" ? "" : f.emirate })} />
            <Err k="delivery" />
          </div>
          {f.delivery === "yes" && (
            <div>
              <label htmlFor="be" className="text-sm font-semibold text-navy">Delivery emirate</label>
              <select id="be" value={f.emirate} onChange={(x) => setF({ ...f, emirate: x.target.value })} className={inp(bad("emirate"))}>
                <option value="">Choose...</option>{["Dubai", "Sharjah", "Ajman", "Abu Dhabi", "Other emirate"].map((o) => <option key={o}>{o}</option>)}
              </select><Err k="emirate" />
            </div>
          )}
          <Btn type="submit" className="w-full">Request a quote</Btn>
        </form>
      </div>
    </div>
  );
}

function ContactPage() {
  const topics = ["A laptop", "A monitor", "Accessories", "A bulk order", "Warranty or returns"];
  return (
    <div className="rise mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-14">
      <PageHead eyebrow="Contact" title="WhatsApp is the fastest way" intro="Most clients message us from a link. We reply within the hour during opening times." />
      <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="space-y-4">
          <div className="rounded-2xl bg-navy p-6 text-white">
            <p className="text-sm text-white/70">Message us about</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map((t) => <a key={t} href={waLink(`Hi Fakhri Computers, I have a question about: ${t.toLowerCase()}.`)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-white/10 px-4 text-sm font-medium hover:bg-white/20">{t}</a>)}
            </div>
            <Btn href={waLink("Hi Fakhri Computers, I have a question.")} target="_blank" className="mt-5 w-full"><WaIcon /> WhatsApp {WA_DISPLAY}</Btn>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-5 ring-1 ring-line"><p className="text-xs font-bold uppercase tracking-wider text-mute">Phone</p><a href={`tel:+${WA_NUMBER}`} className="mt-1 inline-flex min-h-11 items-center text-lg font-semibold text-navy">{WA_DISPLAY}</a></div>
            <div className="rounded-xl bg-white p-5 ring-1 ring-line"><p className="text-xs font-bold uppercase tracking-wider text-mute">Hours</p><p className="mt-1 text-[15px] text-slate-700">Sat – Thu: 10:00 – 21:00<br />Friday: 16:00 – 21:00</p></div>
          </div>
          <div className="rounded-xl bg-white p-5 ring-1 ring-line"><p className="text-xs font-bold uppercase tracking-wider text-mute">Address</p><p className="mt-1 text-[15px] text-slate-700">Shop 12, Sample Plaza, Al Rigga Road, Deira, Dubai</p><p className="text-xs text-mute">Sample address</p></div>
        </div>
        <MapBox className="h-72 md:h-full md:min-h-[360px]" />
      </div>
    </div>
  );
}

/* ───────────────────────── admin types and data ───────────────────────── */

type AdminTab = "leads" | "inventory" | "reservations" | "bulk" | "settings";
type LeadStatus = "new" | "contacted" | "closed";

type Lead = {
  id: string; name: string; phone: string; use: string; budget: string;
  port: string; cond: string; musts: string[]; timestamp: number; status: LeadStatus;
};

type BulkEnquiry = {
  id: string;
  company: string;
  name: string;
  phone: string;
  qty: number;
  use: string;
  band: string;
  delivery: string;
  emirate: string;
  timestamp: number;
  status: "new" | "contacted" | "closed";
};

type SiteSettings = {
  waNumber: string; waDisplay: string; address: string; hours: string;
  mode: "sample" | "live";
};

const ADMIN_CREDS = { username: "admin", password: "fakhri2024" };

const SAMPLE_LEADS: Lead[] = [
  { id: "L001", name: "Ahmed Hassan", phone: "+971 55 123 4567", use: "business", budget: "AED 2,500 – 4,000", port: "balanced", cond: "good", musts: ["ssd", "ram"], timestamp: Date.now() - 3600000, status: "new" },
  { id: "L002", name: "Sara Al-Mansoori", phone: "+971 50 987 6543", use: "study", budget: "AED 1,500 – 2,500", port: "light", cond: "budget", musts: ["battery"], timestamp: Date.now() - 7200000, status: "contacted" },
  { id: "L003", name: "Omar Khalid", phone: "+971 56 456 7890", use: "gaming", budget: "AED 4,000 – 6,000", port: "desk", cond: "good", musts: ["gpu", "ssd"], timestamp: Date.now() - 86400000, status: "new" },
];

/* ───────────────────────── admin login ───────────────────────── */

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
      onLogin();
    } else {
      setError("Invalid credentials. Try admin / fakhri2024");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-navy text-2xl font-extrabold text-accent">F</div>
          <h1 className="mt-4 text-2xl font-bold text-navy">Admin Login</h1>
          <p className="mt-1 text-sm text-mute">Fakhri Computers owner area</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6">
          <div>
            <label htmlFor="user" className="text-sm font-semibold text-navy">Username</label>
            <input id="user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className="mt-1.5 min-h-[52px] w-full rounded-xl border-2 border-line bg-white px-4 text-base outline-none focus:border-navy" />
          </div>
          <div>
            <label htmlFor="pass" className="text-sm font-semibold text-navy">Password</label>
            <div className="relative">
              <input id="pass" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="mt-1.5 min-h-[52px] w-full rounded-xl border-2 border-line bg-white px-4 pr-12 text-base outline-none focus:border-navy" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-mute hover:text-navy" aria-label={showPass ? "Hide password" : "Show password"}>
                <Icon name={showPass ? "eyeOff" : "eye"} className="size-5" />
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Btn type="submit" className="w-full"><Icon name="lock" className="size-4" /> Sign in</Btn>
          <p className="text-xs text-center text-mute">Demo credentials: admin / fakhri2024</p>
        </form>
      </div>
    </div>
  );
}

/* ───────────────────────── admin dashboard ───────────────────────── */

function AdminDashboard({ onLogout, leads, setLeads, inventory, setInventory, reservations, settings, setSettings, bulkEnquiries, setBulkEnquiries }: {
  onLogout: () => void; leads: Lead[]; setLeads: (l: Lead[]) => void;
  inventory: Machine[]; setInventory: (m: Machine[]) => void;
  reservations: Reservation[]; settings: SiteSettings; setSettings: (s: SiteSettings) => void;
  bulkEnquiries: BulkEnquiry[]; setBulkEnquiries: (b: BulkEnquiry[]) => void;
}) {
  const [tab, setTab] = useState<AdminTab>("leads");
  const [editMachine, setEditMachine] = useState<Machine | null>(null);

  const tabs: { id: AdminTab; label: string; icon: string; count?: number }[] = [
    { id: "leads", label: "Leads", icon: "inbox", count: leads.filter((l) => l.status === "new").length },
    { id: "inventory", label: "Inventory", icon: "package", count: inventory.length },
    { id: "reservations", label: "Reservations", icon: "clock", count: reservations.length },
    { id: "bulk", label: "Bulk Orders", icon: "users", count: bulkEnquiries.filter((b) => b.status === "new").length },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-navy text-base font-extrabold text-accent">F</span>
            <div>
              <h1 className="text-[15px] font-bold text-navy">Admin Dashboard</h1>
              <p className="text-[11px] text-mute">Fakhri Computers</p>
            </div>
          </div>
          <Btn variant="ghost" onClick={onLogout} className="!min-h-10 !px-3"><Icon name="logOut" className="size-4" /> Sign out</Btn>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <nav className="flex gap-2 border-b border-line overflow-x-auto" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition whitespace-nowrap ${tab === t.id ? "border-navy text-navy" : "border-transparent text-mute hover:text-navy"}`}>
              <Icon name={t.icon} className="size-4" />
              {t.label}
              {t.count !== undefined && t.count > 0 && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-navy">{t.count}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {tab === "leads" && <LeadsTab leads={leads} setLeads={setLeads} />}
          {tab === "inventory" && <InventoryTab inventory={inventory} setInventory={setInventory} onEdit={setEditMachine} />}
          {tab === "reservations" && <ReservationsTab reservations={reservations} />}
          {tab === "bulk" && <BulkEnquiriesTab enquiries={bulkEnquiries} setEnquiries={setBulkEnquiries} />}
          {tab === "settings" && <SettingsTab settings={settings} setSettings={setSettings} />}
        </div>
      </div>

      {editMachine && <MachineEditModal machine={editMachine} onClose={() => setEditMachine(null)} onSave={(updated) => { setInventory(inventory.map((m) => m.id === updated.id ? updated : m)); setEditMachine(null); }} />}
    </div>
  );
}

/* ───────────────────────── leads tab ───────────────────────── */

function LeadsTab({ leads, setLeads }: { leads: Lead[]; setLeads: (l: Lead[]) => void }) {
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filtered = leads.filter((l) => filter === "all" || l.status === filter);
  const sorted = [...filtered].sort((a, b) => sort === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads(leads.map((l) => l.id === id ? { ...l, status } : l));
  };

  const deleteLead = (id: string) => {
    if (confirm("Delete this lead?")) setLeads(leads.filter((l) => l.id !== id));
  };

  const exportCSV = () => {
    const csv = ["ID,Name,Phone,Use,Budget,Port,Condition,Must-haves,Date,Status"]
      .concat(leads.map((l) => `${l.id},"${l.name}","${l.phone}","${l.use}","${l.budget}","${l.port}","${l.cond}","${l.musts.join("; ")}","${new Date(l.timestamp).toLocaleString()}","${l.status}"`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(["all", "new", "contacted", "closed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`min-h-10 rounded-lg px-4 text-sm font-medium transition ${filter === f ? "bg-navy text-white" : "border border-line bg-white text-slate-700 hover:border-navy/40"}`}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} {f !== "all" && `(${leads.filter((l) => l.status === f).length})`}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSort(sort === "newest" ? "oldest" : "newest")} className="min-h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-slate-700 hover:border-navy/40">
            {sort === "newest" ? "Newest first" : "Oldest first"}
          </button>
          <Btn variant="secondary" onClick={exportCSV} className="!min-h-10"><Icon name="download" className="size-4" /> Export CSV</Btn>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-semibold text-navy">No leads yet</p>
          <p className="mt-1 text-sm text-slate-600">Quiz submissions will appear here</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs font-semibold uppercase tracking-wider text-mute">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Use</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((l) => (
                  <tr key={l.id} className="hover:bg-paper">
                    <td className="px-4 py-3 font-mono text-xs text-mute">{l.id}</td>
                    <td className="px-4 py-3 font-medium text-navy">{l.name}</td>
                    <td className="px-4 py-3"><a href={waLink(`Hi ${l.name}, this is Fakhri Computers following up on your laptop request.`)} target="_blank" rel="noreferrer" className="text-[#1fa855] hover:underline">{l.phone}</a></td>
                    <td className="px-4 py-3 capitalize">{l.use}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{l.budget}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-mute">{new Date(l.timestamp).toLocaleDateString()} {new Date(l.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-4 py-3">
                      <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)} className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${l.status === "new" ? "border-accent/30 bg-accent/10 text-[#9a5f00]" : l.status === "contacted" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => alert(`Lead details:\n\nName: ${l.name}\nPhone: ${l.phone}\nUse: ${l.use}\nBudget: ${l.budget}\nSize: ${l.port}\nCondition: ${l.cond}\nMust-haves: ${l.musts.join(", ") || "none"}`)} className="flex size-8 items-center justify-center rounded-lg text-navy hover:bg-navy/5" aria-label="View details"><Icon name="eye" className="size-4" /></button>
                        <button onClick={() => deleteLead(l.id)} className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" aria-label="Delete"><Icon name="trash" className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── inventory tab ───────────────────────── */

function InventoryTab({ inventory, setInventory, onEdit }: { inventory: Machine[]; setInventory: (m: Machine[]) => void; onEdit: (m: Machine) => void }) {
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const available = inventory.filter((m) => unitOf(m.id).status === "Available").length;
  const filtered = inventory.filter((m) => {
    const u = unitOf(m.id);
    return filter === "all" || (filter === "available" && u.status === "Available") || (filter === "sold" && u.status === "Sold");
  });

  const toggleAvailability = (id: string) => {
    const u = unitOf(id);
    UNITS[id] = { ...u, status: u.status === "Available" ? "Sold" : "Available" };
    setInventory([...inventory]);
  };

  const deleteMachine = (id: string) => {
    if (confirm("Delete this machine from inventory?")) {
      setInventory(inventory.filter((m) => m.id !== id));
      delete UNITS[id];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button onClick={() => setFilter("all")} className={`min-h-10 rounded-lg px-4 text-sm font-medium transition ${filter === "all" ? "bg-navy text-white" : "border border-line bg-white text-slate-700 hover:border-navy/40"}`}>All ({inventory.length})</button>
          <button onClick={() => setFilter("available")} className={`min-h-10 rounded-lg px-4 text-sm font-medium transition ${filter === "available" ? "bg-navy text-white" : "border border-line bg-white text-slate-700 hover:border-navy/40"}`}>Available ({available})</button>
          <button onClick={() => setFilter("sold")} className={`min-h-10 rounded-lg px-4 text-sm font-medium transition ${filter === "sold" ? "bg-navy text-white" : "border border-line bg-white text-slate-700 hover:border-navy/40"}`}>Sold ({inventory.length - available})</button>
        </div>
        <Btn onClick={() => setShowAddModal(true)} className="!min-h-10"><Icon name="plus" className="size-4" /> Add machine</Btn>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => {
          const u = unitOf(m.id);
          const avail = u.status === "Available";
          return (
            <div key={m.id} className={`rounded-xl border p-4 ${avail ? "border-line bg-white" : "border-slate-200 bg-slate-50"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-navy">{m.name}</h3>
                  <p className="text-xs text-mute">{m.year} · {m.cpu}</p>
                </div>
                <Badge status={u.status} />
              </div>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-mute">RAM</dt><dd className="font-medium">{m.ram}GB</dd></div>
                <div className="flex justify-between"><dt className="text-mute">Storage</dt><dd className="font-medium">{m.ssd >= 1024 ? "1TB" : `${m.ssd}GB`}</dd></div>
                <div className="flex justify-between"><dt className="text-mute">Screen</dt><dd className="font-medium">{m.screen}"</dd></div>
                <div className="flex justify-between"><dt className="text-mute">Price</dt><dd className="font-medium">{fmtRange(m.low, m.high)}</dd></div>
              </dl>
              <div className="mt-4 flex gap-2">
                <button onClick={() => toggleAvailability(m.id)} className={`flex-1 rounded-lg border-2 py-2 text-sm font-semibold transition ${avail ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100" : "border-ok/30 bg-ok/10 text-ok hover:bg-ok/20"}`}>{avail ? "Mark sold" : "Mark available"}</button>
                <button onClick={() => onEdit(m)} className="flex size-10 items-center justify-center rounded-lg border border-line bg-white text-navy hover:bg-navy/5" aria-label="Edit"><Icon name="edit" className="size-4" /></button>
                <button onClick={() => deleteMachine(m.id)} className="flex size-10 items-center justify-center rounded-lg border border-line bg-white text-red-600 hover:bg-red-50" aria-label="Delete"><Icon name="trash" className="size-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <MachineAddModal
          onClose={() => setShowAddModal(false)}
          onSave={(newMachine) => {
            setInventory([...inventory, newMachine]);
            setShowAddModal(false);
          }}
          existingInventory={inventory}
        />
      )}
    </div>
  );
}

/* ───────────────────────── reservations tab ───────────────────────── */

function ReservationsTab({ reservations }: { reservations: Reservation[] }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const active = reservations.filter((r) => r.until > now);
  const expired = reservations.filter((r) => r.until <= now);

  return (
    <div className="space-y-6">
      {active.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-bold text-navy">Active reservations ({active.length})</h2>
          <div className="space-y-3">
            {active.map((r) => {
              const m = CATALOG.find((x) => x.id === r.id)!;
              const left = r.until - now;
              const hh = Math.floor(left / 3600000), mm = Math.floor((left % 3600000) / 60000);
              return (
                <div key={r.id} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-navy">{m.name}</h3>
                      <p className="text-sm text-mute">{r.name} · {r.phone}</p>
                    </div>
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-[#9a5f00]">{hh}h {mm}m left</span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div><dt className="text-mute">Inspection</dt><dd className="font-medium">{r.day}</dd></div>
                    <div><dt className="text-mute">Time slot</dt><dd className="font-medium">{r.slot}</dd></div>
                    <div><dt className="text-mute">Price range</dt><dd className="font-medium">{fmtRange(m.low, m.high)}</dd></div>
                    <div><dt className="text-mute">Expires</dt><dd className="font-medium">{new Date(r.until).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</dd></div>
                  </dl>
                  {(r.likeNew || r.addons.length > 0) && (
                    <div className="mt-3 rounded-lg bg-paper p-3 text-sm">
                      <p className="font-semibold text-navy">Extras requested:</p>
                      <ul className="mt-1 space-y-0.5 text-slate-700">
                        {r.likeNew && <li>• Like-new package</li>}
                        {r.addons.map((id) => <li key={id}>• {ADDONS.find((a) => a.id === id)?.label}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {expired.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-600">Expired reservations ({expired.length})</h2>
          <div className="space-y-2">
            {expired.map((r) => {
              const m = CATALOG.find((x) => x.id === r.id)!;
              return (
                <div key={r.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 opacity-60">
                  <div>
                    <p className="font-medium text-slate-700">{m.name}</p>
                    <p className="text-sm text-slate-500">{r.name} · Expired {new Date(r.until).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reservations.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-semibold text-navy">No reservations</p>
          <p className="mt-1 text-sm text-slate-600">Customer reservations will appear here</p>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── bulk enquiries tab ───────────────────────── */

function BulkEnquiriesTab({ enquiries, setEnquiries }: { enquiries: BulkEnquiry[]; setEnquiries: (e: BulkEnquiry[]) => void }) {
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "closed">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filtered = enquiries.filter((e) => filter === "all" || e.status === filter);
  const sorted = [...filtered].sort((a, b) => sort === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);

  const updateStatus = (id: string, status: "new" | "contacted" | "closed") => {
    setEnquiries(enquiries.map((e) => e.id === id ? { ...e, status } : e));
  };

  const deleteEnquiry = (id: string) => {
    if (confirm("Delete this bulk enquiry?")) setEnquiries(enquiries.filter((e) => e.id !== id));
  };

  const exportCSV = () => {
    const csv = ["ID,Company,Contact Name,Phone,Quantity,Use,Budget per unit,Delivery,Emirate,Date,Status"]
      .concat(enquiries.map((e) => `${e.id},"${e.company}","${e.name}","${e.phone}",${e.qty},"${e.use}","${e.band}","${e.delivery}","${e.emirate}","${new Date(e.timestamp).toLocaleString()}","${e.status}"`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulk-enquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(["all", "new", "contacted", "closed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`min-h-10 rounded-lg px-4 text-sm font-medium transition ${filter === f ? "bg-navy text-white" : "border border-line bg-white text-slate-700 hover:border-navy/40"}`}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} {f !== "all" && `(${enquiries.filter((e) => e.status === f).length})`}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSort(sort === "newest" ? "oldest" : "newest")} className="min-h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-slate-700 hover:border-navy/40">
            {sort === "newest" ? "Newest first" : "Oldest first"}
          </button>
          <Btn variant="secondary" onClick={exportCSV} className="!min-h-10"><Icon name="download" className="size-4" /> Export CSV</Btn>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-semibold text-navy">No bulk enquiries yet</p>
          <p className="mt-1 text-sm text-slate-600">Bulk order form submissions will appear here</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs font-semibold uppercase tracking-wider text-mute">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Use</th>
                  <th className="px-4 py-3">Budget/unit</th>
                  <th className="px-4 py-3">Delivery</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((e) => (
                  <tr key={e.id} className="hover:bg-paper">
                    <td className="px-4 py-3 font-mono text-xs text-mute">{e.id}</td>
                    <td className="px-4 py-3 font-medium text-navy">{e.company}</td>
                    <td className="px-4 py-3">{e.name}</td>
                    <td className="px-4 py-3">
                      <a href={waLink(`Hi ${e.name} from ${e.company}, this is Fakhri Computers following up on your bulk order enquiry for ${e.qty} units.`)} target="_blank" rel="noreferrer" className="text-[#1fa855] hover:underline">{e.phone}</a>
                    </td>
                    <td className="px-4 py-3 font-medium">{e.qty}</td>
                    <td className="px-4 py-3">{e.use}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{e.band}</td>
                    <td className="px-4 py-3">
                      {e.delivery === "Yes" ? `Yes (${e.emirate})` : "No"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-mute">
                      {new Date(e.timestamp).toLocaleDateString()} {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <select value={e.status} onChange={(ev) => updateStatus(e.id, ev.target.value as typeof e.status)} className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${e.status === "new" ? "border-accent/30 bg-accent/10 text-[#9a5f00]" : e.status === "contacted" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => alert(`Bulk Enquiry Details:\n\nCompany: ${e.company}\nContact: ${e.name}\nPhone: ${e.phone}\nQuantity: ${e.qty} units\nUse: ${e.use}\nBudget per unit: ${e.band}\nDelivery: ${e.delivery}${e.delivery === "Yes" ? ` to ${e.emirate}` : ""}`)} className="flex size-8 items-center justify-center rounded-lg text-navy hover:bg-navy/5" aria-label="View details">
                          <Icon name="eye" className="size-4" />
                        </button>
                        <button onClick={() => deleteEnquiry(e.id)} className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" aria-label="Delete">
                          <Icon name="trash" className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── settings tab ───────────────────────── */

function SettingsTab({ settings, setSettings }: { settings: SiteSettings; setSettings: (s: SiteSettings) => void }) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-line bg-white p-6">
        <h2 className="text-lg font-bold text-navy">Contact Information</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="wanum" className="text-sm font-semibold text-navy">WhatsApp Number</label>
            <input id="wanum" value={form.waNumber} onChange={(e) => setForm({ ...form, waNumber: e.target.value })} placeholder="971555755427" className="mt-1.5 min-h-[52px] w-full rounded-xl border-2 border-line bg-white px-4 text-base outline-none focus:border-navy" />
          </div>
          <div>
            <label htmlFor="wadisp" className="text-sm font-semibold text-navy">WhatsApp Display</label>
            <input id="wadisp" value={form.waDisplay} onChange={(e) => setForm({ ...form, waDisplay: e.target.value })} placeholder="+971 55 575 7427" className="mt-1.5 min-h-[52px] w-full rounded-xl border-2 border-line bg-white px-4 text-base outline-none focus:border-navy" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-6">
        <h2 className="text-lg font-bold text-navy">Shop Details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="addr" className="text-sm font-semibold text-navy">Address</label>
            <textarea id="addr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} placeholder="Shop 12, Sample Plaza, Al Rigga Road, Deira, Dubai" className="mt-1.5 w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base outline-none focus:border-navy" />
          </div>
          <div>
            <label htmlFor="hrs" className="text-sm font-semibold text-navy">Hours</label>
            <textarea id="hrs" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} rows={2} placeholder="Sat – Thu: 10:00 – 21:00&#10;Friday: 16:00 – 21:00" className="mt-1.5 w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base outline-none focus:border-navy" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-6">
        <h2 className="text-lg font-bold text-navy">Site Mode</h2>
        <p className="mt-1 text-sm text-slate-600">Toggle between sample data (for demo) and live mode (real inventory)</p>
        <div className="mt-4 flex items-center gap-4">
          <button onClick={() => setForm({ ...form, mode: "sample" })} className={`flex-1 rounded-lg border-2 py-3 text-sm font-semibold transition ${form.mode === "sample" ? "border-accent bg-accent/10 text-navy" : "border-line text-slate-600 hover:border-navy/30"}`}>
            Sample Mode
          </button>
          <button onClick={() => setForm({ ...form, mode: "live" })} className={`flex-1 rounded-lg border-2 py-3 text-sm font-semibold transition ${form.mode === "live" ? "border-ok bg-ok/10 text-ok" : "border-line text-slate-600 hover:border-navy/30"}`}>
            Live Mode
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Btn onClick={save} className="min-w-[140px]"><Icon name="check" className="size-4" /> {saved ? "Saved!" : "Save changes"}</Btn>
        {saved && <span className="text-sm text-ok">Settings updated successfully</span>}
      </div>
    </div>
  );
}

/* ───────────────────────── machine edit modal ───────────────────────── */

function MachineEditModal({ machine, onClose, onSave }: { machine: Machine; onClose: () => void; onSave: (m: Machine) => void }) {
  const [form, setForm] = useState(machine);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal onClose={onClose} label="Edit machine">
      <h2 className="pr-10 text-xl font-bold text-navy">Edit Machine</h2>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="ename" className="text-sm font-semibold text-navy">Name</label>
          <input id="ename" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="eram" className="text-sm font-semibold text-navy">RAM (GB)</label>
            <input id="eram" type="number" value={form.ram} onChange={(e) => setForm({ ...form, ram: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
          </div>
          <div>
            <label htmlFor="essd" className="text-sm font-semibold text-navy">SSD (GB)</label>
            <input id="essd" type="number" value={form.ssd} onChange={(e) => setForm({ ...form, ssd: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="elow" className="text-sm font-semibold text-navy">Price Low (AED)</label>
            <input id="elow" type="number" value={form.low} onChange={(e) => setForm({ ...form, low: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
          </div>
          <div>
            <label htmlFor="ehigh" className="text-sm font-semibold text-navy">Price High (AED)</label>
            <input id="ehigh" type="number" value={form.high} onChange={(e) => setForm({ ...form, high: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
          </div>
        </div>
        <div className="flex gap-3">
          <Btn type="submit" className="flex-1">Save changes</Btn>
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
        </div>
      </form>
    </Modal>
  );
}

/* ───────────────────────── machine add modal ───────────────────────── */

function MachineAddModal({ onClose, onSave, existingInventory }: { onClose: () => void; onSave: (m: Machine) => void; existingInventory: Machine[] }) {
  const [form, setForm] = useState({
    name: "",
    year: 2024,
    cpu: "",
    ram: 8,
    ssd: 256,
    gpu: "",
    screen: 15.6,
    kg: 1.8,
    bat: 8,
    numpad: false,
    touch: false,
    uses: [] as string[],
    low: 1500,
    high: 2000,
    grade: "A-" as string,
    hue: 210,
    status: "Draft" as "Draft" | "Available" | "Sold",
    cond: "good" as "budget" | "good" | "new",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.cpu.trim()) errs.cpu = "CPU is required";
    if (form.year < 2015 || form.year > 2026) errs.year = "Year must be between 2015 and 2026";
    if (form.low >= form.high) errs.price = "Price high must be greater than price low";
    if (form.uses.length === 0) errs.uses = "Select at least one use case";
    if (form.hue < 0 || form.hue > 360) errs.hue = "Hue must be between 0 and 360";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const existingIds = existingInventory.map(m => m.id);
    const nums = existingIds.map(id => parseInt(id.substring(1))).filter(n => !isNaN(n));
    const maxNum = nums.length ? Math.max(...nums) : 0;
    const newId = `m${maxNum + 1}`;

    const newMachine: Machine = {
      id: newId,
      name: form.name.trim(),
      year: form.year,
      cpu: form.cpu.trim(),
      ram: form.ram,
      ssd: form.ssd,
      gpu: form.gpu.trim() || null,
      screen: form.screen,
      kg: form.kg,
      bat: form.bat,
      numpad: form.numpad,
      touch: form.touch,
      uses: form.uses,
      low: form.low,
      high: form.high,
      grade: form.grade,
      hue: form.hue,
    };

    UNITS[newId] = { status: form.status, cond: form.cond };
    onSave(newMachine);
  };

  const toggleUse = (id: string) => {
    setForm({
      ...form,
      uses: form.uses.includes(id) ? form.uses.filter(u => u !== id) : [...form.uses, id],
    });
  };

  return (
    <Modal onClose={onClose} label="Add new machine">
      <h2 className="pr-10 text-xl font-bold text-navy">Add New Machine</h2>
      <form onSubmit={submit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-mute">Basic Info</h3>
          <div className="mt-2 space-y-3">
            <div>
              <label htmlFor="aname" className="text-sm font-semibold text-navy">Name *</label>
              <input id="aname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Dell Latitude 5420" className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ayear" className="text-sm font-semibold text-navy">Year *</label>
                <input id="ayear" type="number" min="2015" max="2026" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
                {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
              </div>
              <div>
                <label htmlFor="acpu" className="text-sm font-semibold text-navy">CPU *</label>
                <input id="acpu" value={form.cpu} onChange={(e) => setForm({ ...form, cpu: e.target.value })} placeholder="Core i5-1135G7" className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
                {errors.cpu && <p className="mt-1 text-xs text-red-600">{errors.cpu}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Specs */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-mute">Hardware Specs</h3>
          <div className="mt-2 grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="aram" className="text-sm font-semibold text-navy">RAM (GB) *</label>
              <input id="aram" type="number" min="4" max="64" value={form.ram} onChange={(e) => setForm({ ...form, ram: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
            </div>
            <div>
              <label htmlFor="assd" className="text-sm font-semibold text-navy">SSD (GB) *</label>
              <input id="assd" type="number" min="128" max="2048" step="128" value={form.ssd} onChange={(e) => setForm({ ...form, ssd: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
            </div>
            <div>
              <label htmlFor="agpu" className="text-sm font-semibold text-navy">GPU</label>
              <input id="agpu" value={form.gpu} onChange={(e) => setForm({ ...form, gpu: e.target.value })} placeholder="Optional" className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
            </div>
          </div>
        </div>

        {/* Display */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-mute">Display</h3>
          <div className="mt-2 space-y-3">
            <div>
              <label htmlFor="ascreen" className="text-sm font-semibold text-navy">Screen Size (inches) *</label>
              <input id="ascreen" type="number" min="11" max="17.3" step="0.1" value={form.screen} onChange={(e) => setForm({ ...form, screen: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
            </div>
            <div className="flex gap-4">
              <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={form.touch} onChange={(e) => setForm({ ...form, touch: e.target.checked })} className="size-5 accent-navy" />
                <span className="font-medium text-navy">Touchscreen</span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={form.numpad} onChange={(e) => setForm({ ...form, numpad: e.target.checked })} className="size-5 accent-navy" />
                <span className="font-medium text-navy">Numeric Keypad</span>
              </label>
            </div>
          </div>
        </div>

        {/* Physical */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-mute">Physical</h3>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="akg" className="text-sm font-semibold text-navy">Weight (kg) *</label>
              <input id="akg" type="number" min="0.5" max="4" step="0.1" value={form.kg} onChange={(e) => setForm({ ...form, kg: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
            </div>
            <div>
              <label htmlFor="abat" className="text-sm font-semibold text-navy">Battery (hours) *</label>
              <input id="abat" type="number" min="3" max="20" value={form.bat} onChange={(e) => setForm({ ...form, bat: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-mute">Pricing</h3>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="alow" className="text-sm font-semibold text-navy">Price Low (AED) *</label>
              <input id="alow" type="number" min="0" step="50" value={form.low} onChange={(e) => setForm({ ...form, low: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
            </div>
            <div>
              <label htmlFor="ahigh" className="text-sm font-semibold text-navy">Price High (AED) *</label>
              <input id="ahigh" type="number" min="0" step="50" value={form.high} onChange={(e) => setForm({ ...form, high: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
            </div>
          </div>
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        {/* Categorization */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-mute">Categorization</h3>
          <div className="mt-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="agrade" className="text-sm font-semibold text-navy">Condition Grade *</label>
                <select id="agrade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy">
                  <option value="A">A - Excellent</option>
                  <option value="A-">A- - Very good</option>
                  <option value="B+">B+ - Good</option>
                  <option value="B">B - Fair</option>
                </select>
              </div>
              <div>
                <label htmlFor="ahue" className="text-sm font-semibold text-navy">Color Hue (0-360)</label>
                <input id="ahue" type="number" min="0" max="360" value={form.hue} onChange={(e) => setForm({ ...form, hue: Number(e.target.value) })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy" />
                {errors.hue && <p className="mt-1 text-xs text-red-600">{errors.hue}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">Use Cases * (select at least one)</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {USES.map((u) => (
                  <label key={u.id} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border-2 border-line px-3 text-sm hover:border-navy/40">
                    <input type="checkbox" checked={form.uses.includes(u.id)} onChange={() => toggleUse(u.id)} className="size-4 accent-navy" />
                    <span className="font-medium">{u.label}</span>
                  </label>
                ))}
              </div>
              {errors.uses && <p className="mt-1 text-xs text-red-600">{errors.uses}</p>}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-mute">Availability</h3>
          <div className="mt-2 space-y-3">
            <div>
              <label className="text-sm font-semibold text-navy">Status *</label>
              <div className="mt-2 flex gap-2">
                {(["Draft", "Available", "Sold"] as const).map((s) => (
                  <label key={s} className={`flex-1 cursor-pointer rounded-lg border-2 px-4 py-3 text-center text-sm font-semibold transition ${form.status === s ? "border-navy bg-navy text-white" : "border-line hover:border-navy/40"}`}>
                    <input type="radio" name="status" value={s} checked={form.status === s} onChange={(e) => setForm({ ...form, status: e.target.value as typeof s })} className="sr-only" />
                    {s}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-mute">Draft: Not visible on site. Available: Published. Sold: Visible but marked.</p>
            </div>
            <div>
              <label htmlFor="acond" className="text-sm font-semibold text-navy">Condition *</label>
              <select id="acond" value={form.cond} onChange={(e) => setForm({ ...form, cond: e.target.value as typeof form.cond })} className="mt-1.5 min-h-[48px] w-full rounded-xl border-2 border-line bg-white px-4 outline-none focus:border-navy">
                <option value="budget">Budget second-hand</option>
                <option value="good">Good second-hand</option>
                <option value="new">Like-new package</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Btn type="submit" className="flex-1"><Icon name="plus" className="size-4" /> Add Machine</Btn>
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
        </div>
      </form>
    </Modal>
  );
}

/* ───────────────────────── app ───────────────────────── */

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [answers, setAnswersState] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [cat, setCat] = useState<CatKey>("accessories");
  const [modalId, setModalId] = useState<string | null>(null);
  const [unitId, setUnitId] = useState("m8");
  const [lapF, setLapF] = useState<LapFilters>(LAP0);
  const [reserveOpts, setReserveOpts] = useState<{ likeNew: boolean; addons: string[] } | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLeads, setAdminLeads] = useState<Lead[]>(SAMPLE_LEADS);
  const [adminInventory, setAdminInventory] = useState<Machine[]>(CATALOG);
  const [adminReservations, setAdminReservations] = useState<Reservation[]>([]);
  const [adminBulkEnquiries, setAdminBulkEnquiries] = useState<BulkEnquiry[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    waNumber: WA_NUMBER,
    waDisplay: WA_DISPLAY,
    address: "Shop 12, Sample Plaza, Al Rigga Road, Deira, Dubai",
    hours: "Sat – Thu: 10:00 – 21:00\nFriday: 16:00 – 21:00",
    mode: "sample",
  });

  const setAnswers = (f: (a: Answers) => Answers) => setAnswersState(f);
  const go = (s: Screen) => setScreen(s);
  const startQuiz = (s: Screen) => { if (s === "quiz") setStep(0); setScreen(s); };
  const edit = () => { setStep(0); setScreen("quiz"); };
  const openUnit = (id: string) => { setUnitId(id); setScreen("detail"); };
  const openCat = (c: CatKey) => {
    if (c === "laptops") setScreen("recent");
    else if (c === "monitors") setScreen("monitors");
    else { setCat(c); setScreen("category"); }
  };

  useEffect(() => { window.scrollTo(0, 0); }, [screen, unitId]);

  useEffect(() => {
    if (reservation && !adminReservations.find((r) => r.id === reservation.id)) {
      setAdminReservations([...adminReservations, reservation]);
    }
  }, [reservation]);

  const finishQuiz = () => {
    const newLead: Lead = {
      id: `L${String(adminLeads.length + 1).padStart(3, "0")}`,
      name: answers.name,
      phone: answers.phone,
      use: lbl(USES, answers.use)?.label || "",
      budget: lbl(BUDGETS, answers.budget)?.label || "",
      port: answers.port || "",
      cond: answers.cond || "",
      musts: answers.musts,
      timestamp: Date.now(),
      status: "new",
    };
    setAdminLeads([...adminLeads, newLead]);
    go("result");
  };

  const unit = CATALOG.find((m) => m.id === unitId)!;
  const waText = screen === "result" || screen === "confirm" ? waSummary(answers, buildProfile(answers))
    : screen === "quiz" ? "Hi Fakhri Computers, I'm filling in the laptop quiz and have a question."
    : screen === "detail" ? `Hi Fakhri Computers, I'm looking at the ${unit.name} (sample listing). Is it still available?`
    : screen === "monitors" ? "Hi Fakhri Computers, I'm looking for a monitor. Can you help?"
    : screen === "bulk" ? "Hi Fakhri Computers, I'd like a quote for an office order."
    : "Hi Fakhri Computers, I'm looking for a laptop. Can you help?";
  const modalMachine = modalId ? CATALOG.find((m) => m.id === modalId) : null;

  if (screen === "admin-login") {
    return <AdminLogin onLogin={() => { setIsAdmin(true); go("admin"); }} />;
  }

  if (screen === "admin" && isAdmin) {
    return (
      <AdminDashboard
        onLogout={() => { setIsAdmin(false); go("home"); }}
        leads={adminLeads}
        setLeads={setAdminLeads}
        inventory={adminInventory}
        setInventory={setAdminInventory}
        reservations={adminReservations}
        settings={siteSettings}
        setSettings={setSiteSettings}
        bulkEnquiries={adminBulkEnquiries}
        setBulkEnquiries={setAdminBulkEnquiries}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <Header go={startQuiz} />
      <main className="pb-24">
        {screen === "home" && <Home go={startQuiz} openCat={openCat} openMachine={(id) => openUnit(id)} />}
        {screen === "category" && <CategoryPage cat={cat} go={startQuiz} openCat={openCat} openMachine={(id) => openUnit(id)} />}
        {screen === "quiz" && <Quiz answers={answers} setAnswers={setAnswers} step={step} setStep={setStep} go={go} finish={finishQuiz} />}
        {screen === "result" && <Result answers={answers} go={startQuiz} openMachine={(id) => setModalId(id)} editAnswers={edit} onSend={() => go("confirm")} />}
        {screen === "confirm" && <Confirm answers={answers} go={startQuiz} editAnswers={edit} />}
        {screen === "recent" && <RecentPage f={lapF} setF={setLapF} openUnit={openUnit} go={startQuiz} />}
        {screen === "detail" && <LaptopDetail key={unit.id} m={unit} held={reservation?.id === unit.id} onBack={() => go("recent")} onReserve={setReserveOpts} onViewHeld={() => go("reserved")} go={startQuiz} />}
        {screen === "reserved" && reservation && <ReservedPage r={reservation} go={startQuiz} openUnit={openUnit} release={() => { setReservation(null); go("recent"); }} />}
        {screen === "monitors" && <MonitorsPage />}
        {screen === "how" && <HowPage go={startQuiz} />}
        {screen === "warranty" && <WarrantyPage go={startQuiz} />}
        {screen === "reviews" && <ReviewsPage go={startQuiz} />}
        {screen === "about" && <AboutPage go={startQuiz} />}
        {screen === "bulk" && <BulkPage />}
        {screen === "contact" && <ContactPage />}
      </main>
      <Footer go={startQuiz} />

      <a href={waLink(waText)} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-4 right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-[#1fa855] px-4 font-semibold text-white shadow-lg shadow-black/25 transition hover:bg-[#188a45] active:scale-95 md:bottom-6 md:right-6 md:px-5">
        <WaIcon className="size-6" />
        <span className="hidden text-[15px] sm:inline">WhatsApp us</span>
      </a>

      <button onClick={() => go("admin-login")} className="fixed bottom-4 left-4 z-40 flex size-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg shadow-black/25 transition hover:bg-slate-700 active:scale-95 md:bottom-6 md:left-6" aria-label="Admin login">
        <Icon name="lock" className="size-5" />
      </button>

      {modalMachine && <MachineDetail m={modalMachine} answers={answers} onClose={() => setModalId(null)} />}
      {reserveOpts && <ReserveModal m={unit} opts={reserveOpts} onClose={() => setReserveOpts(null)} onDone={(r) => { setReservation(r); setReserveOpts(null); go("reserved"); }} />}
    </div>
  );
}
