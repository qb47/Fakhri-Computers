import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import * as db from "../lib/db";
import { setWaNumber } from "../lib/wa";
import { SEED_LEADS, SEED_MACHINES, SEED_SETTINGS } from "../lib/seed";
import type {
  BulkEnquiry,
  ContactMessage,
  Lead,
  LeadStatus,
  Machine,
  Reservation,
  SiteSettings,
} from "../lib/types";

/**
 * One store for the whole app.
 *
 * The storefront and the admin dashboard read the SAME data here, which is the
 * whole point: a change made in the dashboard is a row in Supabase, and the
 * storefront is querying that same row. Before this, the two halves of the app
 * read from different places, so nothing an admin did ever reached the site.
 *
 * When Supabase is not configured the store falls back to the bundled sample
 * data and works purely in memory, so the app is never broken mid-setup.
 */

type StoreValue = {
  configured: boolean;
  loading: boolean;
  error: string | null;

  // data
  machines: Machine[];
  leads: Lead[];
  bulkEnquiries: BulkEnquiry[];
  contactMessages: ContactMessage[];
  reservations: Reservation[];
  settings: SiteSettings;

  // auth
  authLoading: boolean;
  isAdmin: boolean;
  adminEmail: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;

  refresh: () => Promise<void>;

  // public submissions
  submitLead: (l: Omit<Lead, "id" | "timestamp" | "status">) => Promise<void>;
  submitBulk: (b: Omit<BulkEnquiry, "id" | "timestamp" | "status">) => Promise<void>;
  submitContact: (c: Omit<ContactMessage, "id" | "timestamp" | "status">) => Promise<void>;
  holdMachine: (r: Reservation) => Promise<void>;
  releaseHold: (machineId: string) => Promise<void>;

  // admin mutations
  createMachine: (m: Machine) => Promise<void>;
  updateMachine: (m: Machine) => Promise<void>;
  deleteMachine: (id: string) => Promise<void>;
  setLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  setBulkStatus: (id: string, status: LeadStatus) => Promise<void>;
  deleteBulk: (id: string) => Promise<void>;
  setContactStatus: (id: string, status: LeadStatus) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  saveSettings: (s: SiteSettings) => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const [machines, setMachines] = useState<Machine[]>(SEED_MACHINES);
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [bulkEnquiries, setBulkEnquiries] = useState<BulkEnquiry[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);

  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  /* ─────────────────────────── loading ─────────────────────────── */

  const loadPublic = useCallback(async () => {
    const [m, s] = await Promise.all([db.fetchMachines(), db.fetchSettings()]);
    setMachines(m);
    setSettings((prev) => ({ ...s, waNumber: s.waNumber || prev.waNumber }));
  }, []);

  const loadAdminData = useCallback(async () => {
    const [l, b, c, r] = await Promise.all([
      db.fetchLeads(),
      db.fetchBulkEnquiries(),
      db.fetchContactMessages(),
      db.fetchReservations(),
    ]);
    setLeads(l);
    setBulkEnquiries(b);
    setContactMessages(c);
    setReservations(r);
  }, []);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setError(null);
    try {
      await loadPublic();
      if (isAdmin) await loadAdminData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    }
  }, [isAdmin, loadAdminData, loadPublic]);

  // Initial load: public data always; admin data only once we know they're an admin.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setAuthLoading(false);
      return;
    }
    let alive = true;
    (async () => {
      try {
        await loadPublic();
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [loadPublic]);

  // Keep every WhatsApp link on the site pointing at the number in Settings.
  useEffect(() => {
    setWaNumber(settings.waNumber);
  }, [settings.waNumber]);

  /* ──────────────────────────── auth ───────────────────────────── */

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }
    let alive = true;

    const applySession = async (email: string | null) => {
      if (!alive) return;
      if (!email) {
        setIsAdmin(false);
        setAdminEmail(null);
        return;
      }
      try {
        const admin = await db.fetchIsAdmin();
        if (!alive) return;
        setIsAdmin(admin);
        setAdminEmail(admin ? email : null);
      } catch {
        if (alive) {
          setIsAdmin(false);
          setAdminEmail(null);
        }
      }
    };

    supabase.auth.getSession().then(async ({ data }) => {
      await applySession(data.session?.user.email ?? null);
      if (alive) setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session?.user.email ?? null);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Once signed in as admin, pull the customer data that RLS now allows.
  useEffect(() => {
    if (!isSupabaseConfigured || !isAdmin) return;
    loadAdminData().catch((e) =>
      setError(e instanceof Error ? e.message : "Failed to load dashboard data"),
    );
  }, [isAdmin, loadAdminData]);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    // Fallback mode (no Supabase yet): keep the old demo login so the dashboard
    // is still explorable. This path disappears the moment env vars are set.
    if (!isSupabaseConfigured || !supabase) {
      if (email === "admin" && password === "fakhri2024") {
        setIsAdmin(true);
        setAdminEmail("demo");
        return null;
      }
      return "Invalid credentials.";
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) return err.message;
    const admin = await db.fetchIsAdmin();
    if (!admin) {
      await supabase.auth.signOut();
      return "That account is not an administrator.";
    }
    return null;
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
    setIsAdmin(false);
    setAdminEmail(null);
  }, []);

  /* ──────────────────────── public submissions ─────────────────── */

  const submitLead = useCallback<StoreValue["submitLead"]>(async (data) => {
    if (!isSupabaseConfigured) {
      setLeads((prev) => [
        {
          ...data,
          id: `L${String(prev.length + 1).padStart(3, "0")}`,
          timestamp: Date.now(),
          status: "new",
        },
        ...prev,
      ]);
      return;
    }
    const created = await db.createLead(data);
    setLeads((prev) => [created, ...prev]);
  }, []);

  const submitBulk = useCallback<StoreValue["submitBulk"]>(async (data) => {
    if (!isSupabaseConfigured) {
      setBulkEnquiries((prev) => [
        { ...data, id: `B${prev.length + 1}`, timestamp: Date.now(), status: "new" },
        ...prev,
      ]);
      return;
    }
    const created = await db.createBulkEnquiry(data);
    setBulkEnquiries((prev) => [created, ...prev]);
  }, []);

  const submitContact = useCallback<StoreValue["submitContact"]>(async (data) => {
    if (!isSupabaseConfigured) {
      setContactMessages((prev) => [
        { ...data, id: `C${prev.length + 1}`, timestamp: Date.now(), status: "new" },
        ...prev,
      ]);
      return;
    }
    const created = await db.createContactMessage(data);
    setContactMessages((prev) => [created, ...prev]);
  }, []);

  const holdMachine = useCallback<StoreValue["holdMachine"]>(async (r) => {
    if (isSupabaseConfigured) await db.createReservation(r);
    // Mirror locally; the DB trigger does the same on machines.held_until.
    setReservations((prev) => [r, ...prev.filter((x) => x.id !== r.id)]);
    setMachines((prev) => prev.map((m) => (m.id === r.id ? { ...m, heldUntil: r.until } : m)));
  }, []);

  const releaseHold = useCallback<StoreValue["releaseHold"]>(async (machineId) => {
    if (isSupabaseConfigured) await db.deleteReservation(machineId);
    setReservations((prev) => prev.filter((r) => r.id !== machineId));
    setMachines((prev) => prev.map((m) => (m.id === machineId ? { ...m, heldUntil: null } : m)));
  }, []);

  /* ─────────────────────── admin mutations ─────────────────────── */

  const createMachineFn = useCallback<StoreValue["createMachine"]>(async (m) => {
    if (isSupabaseConfigured) {
      const created = await db.createMachine(m);
      setMachines((prev) => [...prev, created]);
    } else {
      setMachines((prev) => [...prev, m]);
    }
  }, []);

  const updateMachineFn = useCallback<StoreValue["updateMachine"]>(async (m) => {
    if (isSupabaseConfigured) await db.updateMachine(m);
    setMachines((prev) => prev.map((x) => (x.id === m.id ? m : x)));
  }, []);

  const deleteMachineFn = useCallback<StoreValue["deleteMachine"]>(async (id) => {
    if (isSupabaseConfigured) await db.deleteMachine(id);
    setMachines((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const setLeadStatusFn = useCallback<StoreValue["setLeadStatus"]>(async (id, status) => {
    if (isSupabaseConfigured) await db.setLeadStatus(id, status);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const deleteLeadFn = useCallback<StoreValue["deleteLead"]>(async (id) => {
    if (isSupabaseConfigured) await db.deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setBulkStatusFn = useCallback<StoreValue["setBulkStatus"]>(async (id, status) => {
    if (isSupabaseConfigured) await db.setBulkStatus(id, status);
    setBulkEnquiries((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }, []);

  const deleteBulkFn = useCallback<StoreValue["deleteBulk"]>(async (id) => {
    if (isSupabaseConfigured) await db.deleteBulkEnquiry(id);
    setBulkEnquiries((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const setContactStatusFn = useCallback<StoreValue["setContactStatus"]>(async (id, status) => {
    if (isSupabaseConfigured) await db.setContactStatus(id, status);
    setContactMessages((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  const deleteContactFn = useCallback<StoreValue["deleteContact"]>(async (id) => {
    if (isSupabaseConfigured) await db.deleteContactMessage(id);
    setContactMessages((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const saveSettingsFn = useCallback<StoreValue["saveSettings"]>(async (s) => {
    if (isSupabaseConfigured) await db.saveSettings(s);
    setSettings(s);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      error,
      machines,
      leads,
      bulkEnquiries,
      contactMessages,
      reservations,
      settings,
      authLoading,
      isAdmin,
      adminEmail,
      signIn,
      signOut,
      refresh,
      submitLead,
      submitBulk,
      submitContact,
      holdMachine,
      releaseHold,
      createMachine: createMachineFn,
      updateMachine: updateMachineFn,
      deleteMachine: deleteMachineFn,
      setLeadStatus: setLeadStatusFn,
      deleteLead: deleteLeadFn,
      setBulkStatus: setBulkStatusFn,
      deleteBulk: deleteBulkFn,
      setContactStatus: setContactStatusFn,
      deleteContact: deleteContactFn,
      saveSettings: saveSettingsFn,
    }),
    [
      loading, error, machines, leads, bulkEnquiries, contactMessages, reservations,
      settings, authLoading, isAdmin, adminEmail, signIn, signOut, refresh, submitLead,
      submitBulk, submitContact, holdMachine, releaseHold, createMachineFn, updateMachineFn,
      deleteMachineFn, setLeadStatusFn, deleteLeadFn, setBulkStatusFn, deleteBulkFn,
      setContactStatusFn, deleteContactFn, saveSettingsFn,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
