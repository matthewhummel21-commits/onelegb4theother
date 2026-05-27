"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RequestRow } from "@/lib/db";

type Tab = "needs_call" | "pending" | "approved" | "denied";

interface Props {
  needsCall: RequestRow[];
  pending: RequestRow[];
  approved: RequestRow[];
  denied: RequestRow[];
}

function formatDate(d: string) {
  // Only append Z if no timezone info present already
  const normalized = /[Zz]$|[+-]\d{2}:?\d{2}$/.test(d) ? d : d + "Z";
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return d; // fallback to raw string
  return date.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function RequestCard({
  req,
  onAction,
}: {
  req: RequestRow;
  onAction: (id: number, action: string, callNotes?: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [callNotes, setCallNotes] = useState(req.call_notes || "");
  const [showCallForm, setShowCallForm] = useState(false);

  const fullName = `${req.first_name || ""} ${req.last_name || ""}`.trim();
  const fullAddress = [req.address, req.city, req.state, req.zip].filter(Boolean).join(", ");
  const size = req.pant_size || (req.waist && req.inseam ? `${req.waist}x${req.inseam}` : "?");
  const type = req.pant_type === "sweatpants" ? "Sweatpants" : "Lee Jeans";

  const doAction = async (action: string, notes?: string) => {
    setLoading(true);
    try {
      await onAction(req.id, action, notes);
    } finally {
      setLoading(false);
    }
  };

  const isActive = req.status === "pending" || req.status === "needs_call";
  const isApproved = req.status === "approved" || req.status === "shipped";

  return (
    <div className="bg-[#1a2d42] border border-[#2a3d52] rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-base">{fullName || "Unknown"}</h3>
            <span className="text-xs text-slate-400">#{req.id}</span>
            {req.id_uploaded ? (
              <span className="inline-flex items-center gap-1 text-xs bg-green-900/40 border border-green-700/50 text-green-400 px-2 py-0.5 rounded-full font-medium">
                ✅ ID Uploaded
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-900/40 border border-amber-700/50 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                📞 Needs Call
              </span>
            )}
            {req.status === "shipped" && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-900/40 border border-blue-700/50 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                📦 Shipped
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">{formatDate(req.created_at)}</p>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
        <InfoRow label="Phone" value={req.phone} />
        <InfoRow label="Email" value={req.email} />
        <InfoRow label="Branch" value={[req.branch, req.years_served].filter(Boolean).join(" · ")} />
        <InfoRow label="Pants" value={[type, size, req.pant_fit, req.pant_color, req.pant_brand].filter(Boolean).join(" · ")} />
        <InfoRow label="Address" value={fullAddress} className="col-span-2" />
        {req.household_size && <InfoRow label="Household" value={`${req.household_size} people · ${req.annual_income}/yr`} className="col-span-2" />}
        {req.referred_by && <InfoRow label="Referred by" value={req.referred_by} className="col-span-2" />}
        {req.notes && <InfoRow label="Notes" value={req.notes} className="col-span-2" />}
        {req.call_notes && <InfoRow label="Call Notes" value={req.call_notes} className="col-span-2 text-amber-300" />}
        {req.verified_by && <InfoRow label="Verified via" value={req.verified_by} />}
        {req.wants_follow_up_call && (
          <div className="col-span-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-900/40 border border-green-600/40 text-green-400 text-xs font-bold">
              📞 Open to a follow-up call
            </span>
          </div>
        )}
      </div>

      {/* ID file link */}
      {req.id_file_path && (
        <a
          href={req.id_file_path}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 border border-blue-800/40 px-3 py-1.5 rounded-lg transition-colors"
        >
          📎 View Uploaded ID
        </a>
      )}

      {/* Amazon link (approved) */}
      {isApproved && req.amazon_link && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800 border border-slate-600">
            <div className="flex-1">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Ship To</p>
              <p className="text-sm text-white font-bold">{req.first_name} {req.last_name}</p>
              <p className="text-xs text-slate-300">{fullAddress}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(`${req.first_name} ${req.last_name}\n${fullAddress}`)}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors shrink-0"
            >
              📋 Copy
            </button>
          </div>
          <a
            href={req.amazon_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors shadow-lg"
          >
            🛒 Order on Amazon — Ship to Veteran
          </a>
        </div>
      )}

      {/* Call verification form */}
      {showCallForm && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Call Notes
          </label>
          <textarea
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            rows={2}
            placeholder="Notes from phone call verification..."
            className="w-full rounded-xl border border-[#2a3d52] bg-[#0d1b2a] text-white text-sm px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => doAction("verify_call", callNotes)}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
            >
              ✅ Mark Verified & Move to Pending
            </button>
            <button
              onClick={() => setShowCallForm(false)}
              className="px-4 py-2 rounded-lg border border-[#2a3d52] text-slate-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {isActive && !showCallForm && (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => doAction("approve")}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
          >
            ✅ Approve
          </button>
          {req.status === "pending" && (
            <button
              onClick={() => doAction("flag_call")}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
            >
              📞 Flag for Call
            </button>
          )}
          {req.status === "needs_call" && (
            <button
              onClick={() => setShowCallForm(true)}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
            >
              📞 Log Call
            </button>
          )}
          <button
            onClick={() => {
              if (confirm(`Deny request from ${fullName}?`)) doAction("deny");
            }}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-60"
          >
            ✗ Deny
          </button>
        </div>
      )}

      {isApproved && req.status === "approved" && (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => doAction("mark_shipped")}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
          >
            📦 Mark Shipped
          </button>
        </div>
      )}

      {req.status === "shipped" && req.shipped_at && (
        <p className="text-xs text-slate-500">Shipped: {formatDate(req.shipped_at)}</p>
      )}
    </div>
  );
}

function InfoRow({ label, value, className }: { label: string; value?: string | null; className?: string }) {
  if (!value) return null;
  return (
    <div className={className}>
      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}: </span>
      <span className="text-sm text-slate-200">{value}</span>
    </div>
  );
}

const TAB_CONFIG: { id: Tab; label: string; emoji: string; color: string }[] = [
  { id: "needs_call", label: "Needs Call", emoji: "📞", color: "text-amber-400 border-amber-500" },
  { id: "pending", label: "Pending Review", emoji: "⏳", color: "text-blue-400 border-blue-500" },
  { id: "approved", label: "Approved / Shipped", emoji: "✅", color: "text-green-400 border-green-500" },
  { id: "denied", label: "Denied", emoji: "✗", color: "text-red-400 border-red-500" },
];

// ─── Manual Add Modal ────────────────────────────────────────────────────────
function ManualAddModal({ onClose, onAdded }: { onClose: () => void; onAdded: (row: RequestRow) => void }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    address: "", city: "", state: "", zip: "",
    branch: "", yearsServed: "",
    pantType: "jeans", pantSize: "", waist: "", inseam: "", pantFit: "", pantColor: "", pantBrand: "",
    householdSize: "", annualIncome: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          referredBy: "Matt",  // triggers pre-verified bypass
          wantsFollowUpCall: false,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const { requestId } = await res.json();
      // Build a local row to insert optimistically
      const size = form.pantSize || (form.waist && form.inseam ? `${form.waist}x${form.inseam}` : "?");
      const newRow: RequestRow = {
        id: requestId,
        status: "pending",
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        branch: form.branch,
        years_served: form.yearsServed,
        household_size: form.householdSize,
        annual_income: form.annualIncome,
        pant_type: form.pantType,
        pant_fit: form.pantFit,
        pant_color: form.pantColor,
        pant_brand: form.pantBrand,
        pant_size: size,
        waist: form.waist,
        inseam: form.inseam,
        referred_by: "Matt",
        notes: form.notes,
        wants_follow_up_call: false,
        id_uploaded: false,
        id_file_path: null,
        verified_by: "referral",
        call_notes: null,
        amazon_link: null,
        shipped_at: null,
        created_at: new Date().toISOString(),
      };
      onAdded(newRow);
      onClose();
    } catch {
      alert("Failed to add. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full h-10 rounded-lg border border-[#2a3d52] bg-[#0d1b2a] text-white text-sm px-3 focus:outline-none focus:border-blue-500";
  const lbl = "block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#1a2d42] border border-[#2a3d52] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#2a3d52] flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">➕ Add Vet Manually</h2>
          <p className="text-xs text-green-400 font-semibold">🤝 Pre-verified — no ID required</p>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>First Name *</label><input required className={inp} value={form.firstName} onChange={set("firstName")} placeholder="John" /></div>
            <div><label className={lbl}>Last Name *</label><input required className={inp} value={form.lastName} onChange={set("lastName")} placeholder="Smith" /></div>
            <div><label className={lbl}>Phone *</label><input required className={inp} value={form.phone} onChange={set("phone")} placeholder="(605) 555-0000" /></div>
            <div><label className={lbl}>Email</label><input className={inp} value={form.email} onChange={set("email")} placeholder="optional" /></div>
          </div>
          <div><label className={lbl}>Street Address *</label><input required className={inp} value={form.address} onChange={set("address")} placeholder="123 Main St" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1"><label className={lbl}>City *</label><input required className={inp} value={form.city} onChange={set("city")} /></div>
            <div><label className={lbl}>State *</label><input required className={inp} value={form.state} onChange={set("state")} maxLength={2} placeholder="SD" /></div>
            <div><label className={lbl}>ZIP *</label><input required className={inp} value={form.zip} onChange={set("zip")} placeholder="57104" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Branch</label>
              <select className={inp} value={form.branch} onChange={set("branch")}>
                <option value="">Select...</option>
                {["Army","Navy","Marine Corps","Air Force","Space Force","Coast Guard","National Guard","Reserves"].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Years Served</label><input className={inp} value={form.yearsServed} onChange={set("yearsServed")} placeholder="2005–2013" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Pants Type *</label>
              <select required className={inp} value={form.pantType} onChange={set("pantType")}>
                <option value="jeans">👖 Jeans</option>
                <option value="sweatpants">🩳 Sweatpants</option>
              </select>
            </div>
            {form.pantType === "sweatpants" ? (
              <div>
                <label className={lbl}>Size *</label>
                <select required className={inp} value={form.pantSize} onChange={set("pantSize")}>
                  <option value="">Select...</option>
                  {["S","M","L","XL","2XL","3XL"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ) : (
              <div><label className={lbl}>Size (e.g. 32x30)</label><input className={inp} value={form.pantSize} onChange={set("pantSize")} placeholder="32x30" /></div>
            )}
          </div>
          {form.pantType === "jeans" && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Waist</label><input className={inp} value={form.waist} onChange={set("waist")} placeholder="32" /></div>
              <div><label className={lbl}>Inseam</label><input className={inp} value={form.inseam} onChange={set("inseam")} placeholder="30" /></div>
            </div>
          )}
          <div>
            <label className={lbl}>Fit Style</label>
            <select className={inp} value={form.pantFit} onChange={set("pantFit")}>
              <option value="">Select fit...</option>
              {form.pantType === "sweatpants" ? (
                <>
                  <option value="Regular">Regular</option>
                  <option value="Relaxed / Baggy">Relaxed / Baggy</option>
                  <option value="Slim / Tapered">Slim / Tapered</option>
                  <option value="Athletic">Athletic</option>
                  <option value="No preference">No preference</option>
                </>
              ) : (
                <>
                  <option value="Relaxed / Loose">Relaxed / Loose</option>
                  <option value="Regular / Straight">Regular / Straight</option>
                  <option value="Slim / Fitted">Slim / Fitted</option>
                  <option value="Bootcut">Bootcut</option>
                  <option value="No preference">No preference</option>
                </>
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Color Preference</label>
              <select className={inp} value={form.pantColor} onChange={set("pantColor")}>
                <option value="">Select color...</option>
                <option value="Dark (Black / Dark Wash / Navy)">Dark — Black, Dark Wash, Navy</option>
                <option value="Medium (Medium Wash / Khaki / Grey)">Medium — Wash, Khaki, Grey</option>
                <option value="Light (Light Wash / Tan)">Light — Light Wash, Tan</option>
                <option value="No preference">No preference</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Brand Preference</label>
              <select className={inp} value={form.pantBrand} onChange={set("pantBrand")}>
                <option value="">Select brand...</option>
                {form.pantType === "sweatpants" ? (
                  <>
                    <option value="Hanes">Hanes</option>
                    <option value="Fruit of the Loom">Fruit of the Loom</option>
                    <option value="No preference">No preference</option>
                  </>
                ) : (
                  <>
                    <option value="Lee">Lee</option>
                    <option value="Wrangler">Wrangler</option>
                    <option value="No preference">No preference</option>
                  </>
                )}
              </select>
            </div>
          </div>
          <div><label className={lbl}>Notes</label><textarea className={`${inp} h-20 py-2 resize-none`} value={form.notes} onChange={set("notes")} placeholder="Any context about this vet..." /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-xl border border-[#2a3d52] text-slate-400 hover:text-white text-sm font-bold transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors disabled:opacity-60">
              {saving ? "Adding..." : "Add Vet →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardClient({ needsCall, pending, approved, denied }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("needs_call");
  const [localNeedsCall, setLocalNeedsCall] = useState(needsCall);
  const [localPending, setLocalPending] = useState(pending);
  const [localApproved, setLocalApproved] = useState(approved);
  const [localDenied, setLocalDenied] = useState(denied);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const router = useRouter();

  const getList = (tab: Tab) => {
    if (tab === "needs_call") return localNeedsCall;
    if (tab === "pending") return localPending;
    if (tab === "approved") return localApproved;
    return localDenied;
  };

  const handleAction = async (id: number, action: string, callNotes?: string) => {
    const res = await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, callNotes }),
    });

    if (!res.ok) {
      alert("Action failed. Please try again.");
      return;
    }

    const data = await res.json();

    // Optimistic UI: move request between lists
    const allRows = [...localNeedsCall, ...localPending, ...localApproved, ...localDenied];
    const row = allRows.find((r) => r.id === id);
    if (!row) { router.refresh(); return; }

    const removeFromAll = (rows: RequestRow[]) => rows.filter((r) => r.id !== id);

    switch (action) {
      case "approve": {
        const updated = { ...row, status: "approved", amazon_link: data.amazonLink || row.amazon_link };
        setLocalNeedsCall(removeFromAll(localNeedsCall));
        setLocalPending(removeFromAll(localPending));
        setLocalApproved([updated, ...removeFromAll(localApproved)]);
        setActiveTab("approved");
        break;
      }
      case "flag_call": {
        const updated = { ...row, status: "needs_call" };
        setLocalPending(removeFromAll(localPending));
        setLocalNeedsCall([updated, ...removeFromAll(localNeedsCall)]);
        setActiveTab("needs_call");
        break;
      }
      case "verify_call": {
        const updated = { ...row, status: "pending", verified_by: "call", call_notes: callNotes || null };
        setLocalNeedsCall(removeFromAll(localNeedsCall));
        setLocalPending([updated, ...removeFromAll(localPending)]);
        setActiveTab("pending");
        break;
      }
      case "deny": {
        const updated = { ...row, status: "denied" };
        setLocalNeedsCall(removeFromAll(localNeedsCall));
        setLocalPending(removeFromAll(localPending));
        setLocalDenied([updated, ...removeFromAll(localDenied)]);
        setActiveTab("denied");
        break;
      }
      case "mark_shipped": {
        const updated = { ...row, status: "shipped", shipped_at: new Date().toISOString() };
        setLocalApproved([updated, ...removeFromAll(localApproved)]);
        break;
      }
      default:
        router.refresh();
    }
  };

  const counts = {
    needs_call: localNeedsCall.length,
    pending: localPending.length,
    approved: localApproved.length,
    denied: localDenied.length,
  };

  const currentList = getList(activeTab);

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white">
      {/* Header */}
      <header className="border-b border-[#2a3d52] bg-[#0d1b2a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎖️</span>
            <div>
              <h1 className="font-extrabold text-white text-lg leading-tight">One Leg B4 the Other</h1>
              <p className="text-xs text-slate-400">Request Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">
              {counts.needs_call + counts.pending} active · {counts.approved} approved
            </span>
            <button
              onClick={() => setShowManualAdd(true)}
              className="text-xs text-white font-bold bg-blue-600 hover:bg-blue-500 transition-colors px-3 py-1.5 rounded-lg"
            >
              + Add Vet
            </button>
            <button
              onClick={() => router.refresh()}
              className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[#2a3d52] hover:border-slate-500"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </header>

      {showManualAdd && (
        <ManualAddModal
          onClose={() => setShowManualAdd(false)}
          onAdded={(row) => {
            setLocalPending((p) => [row, ...p]);
            setActiveTab("pending");
          }}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TAB_CONFIG.map((tab) => {
            const count = counts[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                  isActive
                    ? `bg-[#1a2d42] ${tab.color}`
                    : "border-transparent text-slate-400 hover:text-white hover:bg-[#1a2d42]"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-current/20 opacity-80" : "bg-slate-700 text-slate-300"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Request cards */}
        {currentList.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-lg font-semibold">Nothing here!</p>
            <p className="text-sm mt-1">All clear in this queue.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {currentList.map((req) => (
              <RequestCard key={req.id} req={req} onAction={handleAction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
