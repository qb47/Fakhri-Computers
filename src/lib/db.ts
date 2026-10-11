import { requireSupabase } from "./supabase";
import type {
  BulkEnquiry,
  ContactMessage,
  Lead,
  LeadStatus,
  Machine,
  Reservation,
  SiteSettings,
} from "./types";

/**
 * Every database read and write goes through this file. Components never talk
 * to Supabase directly, which keeps the snake_case↔camelCase mapping and the
 * id-generation rules in exactly one place.
 */

const ms = (iso: string | null) => (iso ? new Date(iso).getTime() : Date.now());
const iso = (t: number) => new Date(t).toISOString();

/* ─────────────────────────────── machines ─────────────────────────────── */

type MachineRow = {
  id: string; name: string; year: number; cpu: string; ram: number; ssd: number;
  gpu: string | null; screen: number; kg: number; bat: number; numpad: boolean;
  touch: boolean; uses: string[]; low: number; high: number; grade: string;
  hue: number; status: string; cond: string; listed: boolean;
  image_url: string | null; position: number; held_until: string | null;
};

const toMachine = (r: MachineRow): Machine => ({
  id: r.id, name: r.name, year: r.year, cpu: r.cpu, ram: r.ram, ssd: r.ssd,
  gpu: r.gpu, screen: r.screen, kg: r.kg, bat: r.bat, numpad: r.numpad,
  touch: r.touch, uses: r.uses ?? [], low: r.low, high: r.high, grade: r.grade,
  hue: r.hue, status: r.status as Machine["status"], cond: r.cond as Machine["cond"],
  listed: r.listed, imageUrl: r.image_url, position: r.position,
  heldUntil: r.held_until ? ms(r.held_until) : null,
});

/* held_until is deliberately NOT written from here — the reservations trigger
   owns it, so an admin edit can never clobber an active hold. */
const fromMachine = (m: Machine) => ({
  id: m.id, name: m.name, year: m.year, cpu: m.cpu, ram: m.ram, ssd: m.ssd,
  gpu: m.gpu, screen: m.screen, kg: m.kg, bat: m.bat, numpad: m.numpad,
  touch: m.touch, uses: m.uses, low: m.low, high: m.high, grade: m.grade,
  hue: m.hue, status: m.status, cond: m.cond, listed: m.listed,
  image_url: m.imageUrl, position: m.position, updated_at: new Date().toISOString(),
});

/** RLS decides the scope: the public sees published rows, an admin sees all. */
export async function fetchMachines(): Promise<Machine[]> {
  const { data, error } = await requireSupabase()
    .from("machines")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data as MachineRow[]).map(toMachine);
}

export async function createMachine(m: Machine): Promise<Machine> {
  const { data, error } = await requireSupabase()
    .from("machines").insert(fromMachine(m)).select().single();
  if (error) throw error;
  return toMachine(data as MachineRow);
}

export async function updateMachine(m: Machine): Promise<Machine> {
  const { data, error } = await requireSupabase()
    .from("machines").update(fromMachine(m)).eq("id", m.id).select().single();
  if (error) throw error;
  return toMachine(data as MachineRow);
}

export async function deleteMachine(id: string): Promise<void> {
  const { error } = await requireSupabase().from("machines").delete().eq("id", id);
  if (error) throw error;
}

/** Next free `m{n}` id — admin-only, so reading the table is allowed here. */
export async function nextMachineId(): Promise<string> {
  const { data, error } = await requireSupabase().from("machines").select("id");
  if (error) throw error;
  const nums = (data as { id: string }[])
    .map((r) => parseInt(r.id.replace(/^m/, ""), 10))
    .filter((n) => !Number.isNaN(n));
  return `m${(nums.length ? Math.max(...nums) : 0) + 1}`;
}

/* ──────────────────────────────── leads ───────────────────────────────── */

type LeadRow = {
  id: string; name: string; phone: string; use_case: string | null;
  budget: string | null; port: string | null; cond: string | null;
  musts: string[]; status: string; created_at: string;
};

const toLead = (r: LeadRow): Lead => ({
  id: r.id, name: r.name, phone: r.phone, use: r.use_case ?? "",
  budget: r.budget ?? "", port: r.port ?? "", cond: r.cond ?? "",
  musts: r.musts ?? [], timestamp: ms(r.created_at), status: r.status as LeadStatus,
});

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await requireSupabase()
    .from("leads").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as LeadRow[]).map(toLead);
}

export async function createLead(l: Omit<Lead, "id" | "timestamp" | "status">): Promise<Lead> {
  // Two deliberate choices here:
  //  · the id is generated client-side, because a public visitor cannot SELECT
  //    from `leads`, so counting rows to pick the next id is impossible;
  //  · we do NOT use .select() on the insert. Postgres applies SELECT policies
  //    to `INSERT ... RETURNING`, and anon is correctly denied SELECT on leads —
  //    asking for the row back therefore fails with an RLS violation. We build
  //    the object locally instead.
  const id = `L${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const row = {
    id, name: l.name, phone: l.phone, use_case: l.use,
    budget: l.budget, port: l.port, cond: l.cond, musts: l.musts, status: "new",
  };
  const { error } = await requireSupabase().from("leads").insert(row);
  if (error) throw error;
  return { ...l, id, timestamp: Date.now(), status: "new" };
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await requireSupabase().from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await requireSupabase().from("leads").delete().eq("id", id);
  if (error) throw error;
}

/* ─────────────────────────── bulk enquiries ───────────────────────────── */

type BulkRow = {
  id: string; company: string | null; name: string; phone: string; qty: number;
  use_case: string | null; band: string | null; delivery: string | null;
  emirate: string | null; status: string; created_at: string;
};

const toBulk = (r: BulkRow): BulkEnquiry => ({
  id: r.id, company: r.company ?? "", name: r.name, phone: r.phone, qty: r.qty,
  use: r.use_case ?? "", band: r.band ?? "", delivery: r.delivery ?? "",
  emirate: r.emirate ?? "", timestamp: ms(r.created_at), status: r.status as LeadStatus,
});

export async function fetchBulkEnquiries(): Promise<BulkEnquiry[]> {
  const { data, error } = await requireSupabase()
    .from("bulk_enquiries").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BulkRow[]).map(toBulk);
}

export async function createBulkEnquiry(
  b: Omit<BulkEnquiry, "id" | "timestamp" | "status">,
): Promise<BulkEnquiry> {
  const id = `B${Date.now().toString(36).toUpperCase()}`;
  const row = {
    id, company: b.company, name: b.name, phone: b.phone, qty: b.qty,
    use_case: b.use, band: b.band, delivery: b.delivery, emirate: b.emirate,
  };
  // No .select() — see the note in createLead (anon cannot read this table back).
  const { error } = await requireSupabase().from("bulk_enquiries").insert(row);
  if (error) throw error;
  return { ...b, id, timestamp: Date.now(), status: "new" };
}

export async function setBulkStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await requireSupabase().from("bulk_enquiries").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteBulkEnquiry(id: string): Promise<void> {
  const { error } = await requireSupabase().from("bulk_enquiries").delete().eq("id", id);
  if (error) throw error;
}

/* ─────────────────────────── contact messages ─────────────────────────── */

type ContactRow = {
  id: string; name: string; phone: string; email: string | null;
  message: string | null; status: string; created_at: string;
};

const toContact = (r: ContactRow): ContactMessage => ({
  id: r.id, name: r.name, phone: r.phone, email: r.email ?? "",
  message: r.message ?? "", timestamp: ms(r.created_at), status: r.status as LeadStatus,
});

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await requireSupabase()
    .from("contact_messages").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ContactRow[]).map(toContact);
}

export async function createContactMessage(
  c: Omit<ContactMessage, "id" | "timestamp" | "status">,
): Promise<ContactMessage> {
  const id = `C${Date.now().toString(36).toUpperCase()}`;
  // No .select() — see the note in createLead (anon cannot read this table back).
  const { error } = await requireSupabase()
    .from("contact_messages")
    .insert({ id, name: c.name, phone: c.phone, email: c.email, message: c.message });
  if (error) throw error;
  return { ...c, id, timestamp: Date.now(), status: "new" };
}

export async function setContactStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await requireSupabase().from("contact_messages").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await requireSupabase().from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}

/* ───────────────────────────── reservations ───────────────────────────── */

type ReservationRow = {
  machine_id: string; name: string; phone: string; day: string | null;
  slot: string | null; until: string; like_new: boolean; addons: string[];
};

const toReservation = (r: ReservationRow): Reservation => ({
  id: r.machine_id, name: r.name, phone: r.phone, day: r.day ?? "",
  slot: r.slot ?? "", until: ms(r.until), likeNew: r.like_new, addons: r.addons ?? [],
});

export async function fetchReservations(): Promise<Reservation[]> {
  const { data, error } = await requireSupabase()
    .from("reservations").select("*").order("until", { ascending: false });
  if (error) throw error;
  return (data as ReservationRow[]).map(toReservation);
}

export async function createReservation(r: Reservation): Promise<void> {
  const row = {
    machine_id: r.id, name: r.name, phone: r.phone, day: r.day, slot: r.slot,
    until: iso(r.until), like_new: r.likeNew, addons: r.addons,
  };
  // Upsert: a fresh hold replaces any previous one on the same machine.
  const { error } = await requireSupabase()
    .from("reservations").upsert(row, { onConflict: "machine_id" });
  if (error) throw error;
}

export async function deleteReservation(machineId: string): Promise<void> {
  const { error } = await requireSupabase().from("reservations").delete().eq("machine_id", machineId);
  if (error) throw error;
}

/* ──────────────────────────────── admin ───────────────────────────────── */

/**
 * True only if the signed-in user has a row in `admins`. The "read own row"
 * policy means this returns the caller's row or nothing — never anyone else's.
 */
export async function fetchIsAdmin(): Promise<boolean> {
  const { data, error } = await requireSupabase().from("admins").select("user_id").limit(1);
  if (error) throw error;
  return (data as { user_id: string }[]).length > 0;
}

/* ─────────────────────────────── settings ─────────────────────────────── */

type SettingsRow = {
  wa_number: string; wa_display: string; address: string; hours: string; mode: string;
};

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await requireSupabase()
    .from("settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  const r = data as SettingsRow | null;
  if (!r) {
    return { waNumber: "", waDisplay: "", address: "", hours: "", mode: "live" };
  }
  return {
    waNumber: r.wa_number, waDisplay: r.wa_display, address: r.address,
    hours: r.hours, mode: r.mode as SiteSettings["mode"],
  };
}

export async function saveSettings(s: SiteSettings): Promise<void> {
  const { error } = await requireSupabase().from("settings").upsert({
    id: 1, wa_number: s.waNumber, wa_display: s.waDisplay, address: s.address,
    hours: s.hours, mode: s.mode, updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
