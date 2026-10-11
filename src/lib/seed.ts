import type { Lead, Machine, SiteSettings } from "./types";

/**
 * Sample data used when Supabase is not configured yet.
 *
 * This is the app's original hard-coded catalogue, kept only as a graceful
 * fallback so the site still renders before VITE_SUPABASE_URL is set (and on
 * a fresh clone with no .env). Once Supabase is connected these are ignored —
 * the real rows in `machines` / `settings` take over.
 */

export const SEED_MACHINES: Machine[] = [
  { id: "m1", name: "Dell Latitude 3510", year: 2020, cpu: "Core i3-10110U", ram: 8, ssd: 256, gpu: null, screen: 15.6, kg: 1.8, bat: 6, numpad: true, touch: false, uses: ["everyday", "study"], low: 800, high: 1100, grade: "B", hue: 210, status: "Available", cond: "good", listed: false, imageUrl: null, position: 1 },
  { id: "m2", name: "Dell Latitude 7480", year: 2018, cpu: "Core i5-7300U", ram: 8, ssd: 256, gpu: null, screen: 14, kg: 1.5, bat: 8, numpad: false, touch: false, uses: ["everyday", "study", "business"], low: 900, high: 1300, grade: "B", hue: 200, status: "Available", cond: "budget", listed: true, imageUrl: null, position: 2 },
  { id: "m3", name: "Dell Latitude 5420", year: 2021, cpu: "Core i5-1135G7", ram: 8, ssd: 256, gpu: null, screen: 14, kg: 1.5, bat: 9, numpad: false, touch: false, uses: ["everyday", "study", "business"], low: 1100, high: 1500, grade: "A-", hue: 215, status: "Sold", cond: "good", listed: true, imageUrl: null, position: 3 },
  { id: "m4", name: "HP Pavilion 15", year: 2021, cpu: "Core i5-1135G7", ram: 8, ssd: 512, gpu: null, screen: 15.6, kg: 1.7, bat: 7, numpad: true, touch: false, uses: ["everyday", "study"], low: 1300, high: 1800, grade: "A-", hue: 190, status: "Available", cond: "good", listed: false, imageUrl: null, position: 4 },
  { id: "m5", name: "Lenovo IdeaPad Flex 5", year: 2021, cpu: "Ryzen 5 5500U", ram: 16, ssd: 512, gpu: null, screen: 14, kg: 1.5, bat: 10, numpad: false, touch: true, uses: ["study", "everyday", "design"], low: 1600, high: 2200, grade: "A", hue: 270, status: "Available", cond: "good", listed: false, imageUrl: null, position: 5 },
  { id: "m6", name: "Lenovo ThinkPad E15 Gen 3", year: 2021, cpu: "Ryzen 5 5500U", ram: 16, ssd: 512, gpu: null, screen: 15.6, kg: 1.7, bat: 9, numpad: true, touch: false, uses: ["business", "study", "programming"], low: 1700, high: 2200, grade: "A-", hue: 220, status: "Available", cond: "good", listed: true, imageUrl: null, position: 6 },
  { id: "m7", name: "HP EliteBook 840 G7", year: 2020, cpu: "Core i7-10610U", ram: 16, ssd: 512, gpu: null, screen: 14, kg: 1.4, bat: 10, numpad: false, touch: false, uses: ["business", "programming"], low: 1700, high: 2300, grade: "A", hue: 205, status: "Sold", cond: "good", listed: true, imageUrl: null, position: 7 },
  { id: "m8", name: "Lenovo ThinkPad T14 Gen 2", year: 2021, cpu: "Core i5-1145G7", ram: 16, ssd: 512, gpu: null, screen: 14, kg: 1.4, bat: 10, numpad: false, touch: false, uses: ["business", "programming", "everyday"], low: 1900, high: 2500, grade: "A", hue: 225, status: "Available", cond: "new", listed: true, imageUrl: null, position: 8 },
  { id: "m9", name: "Dell Latitude 5530", year: 2022, cpu: "Core i5-1235U", ram: 16, ssd: 512, gpu: null, screen: 15.6, kg: 1.6, bat: 10, numpad: true, touch: false, uses: ["business", "everyday", "programming"], low: 2200, high: 2900, grade: "A", hue: 212, status: "Available", cond: "good", listed: true, imageUrl: null, position: 9 },
  { id: "m10", name: "MacBook Air M1", year: 2020, cpu: "Apple M1", ram: 8, ssd: 256, gpu: null, screen: 13.3, kg: 1.29, bat: 15, numpad: false, touch: false, uses: ["study", "everyday", "design"], low: 2300, high: 3000, grade: "A", hue: 240, status: "Available", cond: "good", listed: true, imageUrl: null, position: 10 },
  { id: "m11", name: "Asus TUF Gaming F15", year: 2020, cpu: "Core i5-10300H", ram: 16, ssd: 512, gpu: "GTX 1650", screen: 15.6, kg: 2.3, bat: 5, numpad: true, touch: false, uses: ["gaming"], low: 2600, high: 3400, grade: "B+", hue: 20, status: "Available", cond: "budget", listed: true, imageUrl: null, position: 11 },
  { id: "m12", name: "Acer Nitro 5", year: 2021, cpu: "Core i5-11400H", ram: 16, ssd: 512, gpu: "RTX 3050", screen: 15.6, kg: 2.2, bat: 5, numpad: true, touch: false, uses: ["gaming", "design"], low: 3000, high: 3800, grade: "A-", hue: 5, status: "Sold", cond: "good", listed: true, imageUrl: null, position: 12 },
  { id: "m13", name: "Lenovo Legion 5", year: 2021, cpu: "Ryzen 7 5800H", ram: 16, ssd: 512, gpu: "RTX 3060", screen: 15.6, kg: 2.4, bat: 6, numpad: true, touch: false, uses: ["gaming", "design", "programming"], low: 3800, high: 4800, grade: "A", hue: 280, status: "Available", cond: "new", listed: true, imageUrl: null, position: 13 },
  { id: "m14", name: "ThinkPad P15v Gen 1", year: 2020, cpu: "Core i7-10750H", ram: 32, ssd: 1024, gpu: "Quadro T1000", screen: 15.6, kg: 2.2, bat: 6, numpad: true, touch: false, uses: ["design", "programming"], low: 3900, high: 5000, grade: "A-", hue: 230, status: "Sold", cond: "good", listed: true, imageUrl: null, position: 14 },
  { id: "m15", name: "Dell XPS 15 9510", year: 2021, cpu: "Core i7-11800H", ram: 32, ssd: 1024, gpu: "RTX 3050 Ti", screen: 15.6, kg: 1.9, bat: 10, numpad: false, touch: true, uses: ["design", "programming"], low: 4600, high: 5800, grade: "A", hue: 195, status: "Available", cond: "new", listed: true, imageUrl: null, position: 15 },
  { id: "m16", name: "MacBook Pro 14 M1 Pro", year: 2021, cpu: "Apple M1 Pro", ram: 16, ssd: 512, gpu: null, screen: 14.2, kg: 1.6, bat: 15, numpad: false, touch: false, uses: ["design", "programming"], low: 5500, high: 6800, grade: "A", hue: 250, status: "Available", cond: "good", listed: false, imageUrl: null, position: 16 },
  { id: "m17", name: "HP ZBook Fury 17 G7", year: 2020, cpu: "Core i7-10850H", ram: 32, ssd: 1024, gpu: "Quadro RTX 3000", screen: 17.3, kg: 2.8, bat: 4, numpad: true, touch: false, uses: ["design"], low: 5200, high: 6500, grade: "B+", hue: 160, status: "Available", cond: "good", listed: false, imageUrl: null, position: 17 },
];

export const SEED_LEADS: Lead[] = [
  { id: "L001", name: "Ahmed Hassan", phone: "+971 55 123 4567", use: "business", budget: "AED 2,500 – 4,000", port: "balanced", cond: "good", musts: ["ssd", "ram"], timestamp: Date.now() - 3600000, status: "new" },
  { id: "L002", name: "Sara Al-Mansoori", phone: "+971 50 987 6543", use: "study", budget: "AED 1,500 – 2,500", port: "light", cond: "budget", musts: ["battery"], timestamp: Date.now() - 7200000, status: "contacted" },
  { id: "L003", name: "Omar Khalid", phone: "+971 56 456 7890", use: "gaming", budget: "AED 4,000 – 6,000", port: "desk", cond: "good", musts: ["gpu", "ssd"], timestamp: Date.now() - 86400000, status: "new" },
];

export const SEED_SETTINGS: SiteSettings = {
  waNumber: "971555755427",
  waDisplay: "+971 55 575 7427",
  address: "Shop 12, Sample Plaza, Al Rigga Road, Deira, Dubai",
  hours: "Sat – Thu: 10:00 – 21:00\nFriday: 16:00 – 21:00",
  mode: "sample",
};
