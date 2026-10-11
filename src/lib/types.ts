/** Shared domain types. These mirror the tables in supabase/schema.sql. */

export type Status = "Available" | "Sold" | "Draft";
export type CondId = "budget" | "good" | "new";
export type LeadStatus = "new" | "contacted" | "closed";

export type Machine = {
  id: string;
  name: string;
  year: number;
  cpu: string;
  ram: number;
  ssd: number;
  gpu: string | null;
  screen: number;
  kg: number;
  bat: number;
  numpad: boolean;
  touch: boolean;
  uses: string[];
  low: number;
  high: number;
  grade: string;
  hue: number;
  status: Status;
  cond: CondId;
  listed: boolean;
  imageUrl: string | null;
  position: number;
  /** Active hold expiry, mirrored from `reservations` by a trigger. Public-safe. */
  heldUntil?: number | null;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  use: string;
  budget: string;
  port: string;
  cond: string;
  musts: string[];
  timestamp: number;
  status: LeadStatus;
};

export type BulkEnquiry = {
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
  status: LeadStatus;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  timestamp: number;
  status: LeadStatus;
};

export type Reservation = {
  id: string; // the machine id — one active hold per machine
  name: string;
  phone: string;
  day: string;
  slot: string;
  until: number;
  likeNew: boolean;
  addons: string[];
};

export type SiteSettings = {
  waNumber: string;
  waDisplay: string;
  address: string;
  hours: string;
  mode: "sample" | "live";
};

export type AdminTab = "overview" | "leads" | "inventory" | "reservations" | "bulk" | "contact" | "settings";
