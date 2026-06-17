"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  branch: string;
  yearsServed: string;
  pantType: string;
  pantSize: string;
  waist: string;
  inseam: string;
  pantFit: string;
  pantColor: string;
  pantBrand: string;
  householdSize: string;
  annualIncome: string;
  notes: string;
  wantsFollowUpCall: boolean;
}

const INITIAL: FormData = {
  firstName: "", lastName: "", phone: "", email: "",
  address: "", city: "", state: "", zip: "",
  branch: "", yearsServed: "",
  pantType: "jeans", pantSize: "", waist: "", inseam: "", pantFit: "", pantColor: "", pantBrand: "",
  householdSize: "", annualIncome: "",
  notes: "", wantsFollowUpCall: false,
};

const BRANCHES = ["Army", "Navy", "Marine Corps", "Air Force", "Space Force", "Coast Guard", "National Guard", "Reserves"];

const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
  ["DC","Washington D.C."],
] as const;

const STEPS = [
  { num: 1, label: "Contact" },
  { num: 2, label: "Shipping" },
  { num: 3, label: "Service" },
  { num: 4, label: "Sizing" },
  { num: 5, label: "Submit" },
];

const inputClass = "h-12 rounded-xl border-2 border-border focus:border-primary bg-white text-gray-900 text-sm placeholder:text-gray-400";
const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5";
const selectClass = "w-full h-12 rounded-xl border-2 border-border focus:border-primary bg-white text-gray-900 text-sm px-3 focus:outline-none";

export function VeteranRequestForm() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const [form, setForm] = useState<FormData>(INITIAL);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleZip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/\D/g, "").slice(0, 5);
    setForm(prev => ({ ...prev, zip }));
    if (zip.length === 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (res.ok) {
          const data = await res.json();
          const place = data.places?.[0];
          if (place) setForm(prev => ({
            ...prev, zip,
            city: prev.city || place["place name"] || prev.city,
            state: prev.state || place["state abbreviation"] || prev.state,
          }));
        }
      } catch { /* silent */ }
    }
  };

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!form.phone.trim()) e.phone = "Required";
    }
    if (s === 2) {
      if (!form.address.trim()) e.address = "Required";
      if (!form.city.trim()) e.city = "Required";
      if (!form.state) e.state = "Required";
      if (!form.zip || form.zip.length < 5) e.zip = "Enter a valid ZIP";
    }
    if (s === 3) {
      if (!form.branch) e.branch = "Required";
    }
    if (s === 4) {
      if (form.pantType === "jeans" && !form.waist) e.waist = "Required";
      if (form.pantType === "jeans" && !form.inseam) e.inseam = "Required";
      if (form.pantType === "sweatpants" && !form.pantSize) e.pantSize = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setDir(1);
    setStep(s => s + 1);
  };

  const back = () => {
    setDir(-1);
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (idFile) fd.append("idFile", idFile);
      const res = await fetch("/api/request", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again or call (605) 277-2721.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-8"
      >
        <div className="text-6xl mb-6">🎖️</div>
        <h3 className="text-2xl font-extrabold mb-3">Request Received. Thank You for Your Service.</h3>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          {idFile
            ? "We received your ID and will review your request shortly. If approved, we'll ship directly to you at no cost."
            : "We'll give you a call to verify your service, then ship directly to you at no cost."}
        </p>
      </motion.div>
    );
  }

  const pct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-2">
          {STEPS.map(s => (
            <div key={s.num} className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                step > s.num
                  ? "bg-primary text-white"
                  : step === s.num
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}>
                {step > s.num ? "✓" : s.num}
              </div>
              <span className={`text-[10px] font-semibold hidden sm:block ${step === s.num ? "text-primary" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">Step {step} of {STEPS.length}</p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Who are you?</h3>
                <p className="text-sm text-muted-foreground">Just the basics — we'll take care of the rest.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <Input value={form.firstName} onChange={set("firstName")} className={`${inputClass} ${errors.firstName ? "border-red-400" : ""}`} placeholder="John" />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <Input value={form.lastName} onChange={set("lastName")} className={`${inputClass} ${errors.lastName ? "border-red-400" : ""}`} placeholder="Smith" />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <Input type="tel" value={form.phone} onChange={set("phone")} className={`${inputClass} ${errors.phone ? "border-red-400" : ""}`} placeholder="(605) 555-0000" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                <p className="text-xs text-muted-foreground mt-1.5">We may call to verify your service — no spam, ever.</p>
              </div>
              <div>
                <label className={labelClass}>Email <span className="font-normal normal-case">(optional)</span></label>
                <Input type="email" value={form.email} onChange={set("email")} className={inputClass} placeholder="john@email.com" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Where do we ship?</h3>
                <p className="text-sm text-muted-foreground">We'll send the pants directly to your door, free of charge.</p>
              </div>
              <div>
                <label className={labelClass}>Street Address *</label>
                <Input value={form.address} onChange={set("address")} className={`${inputClass} ${errors.address ? "border-red-400" : ""}`} placeholder="123 Main St" />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className={labelClass}>ZIP Code *</label>
                <Input value={form.zip} onChange={handleZip} className={`${inputClass} ${errors.zip ? "border-red-400" : ""}`} placeholder="57104" maxLength={5} inputMode="numeric" />
                {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                {form.zip.length === 5 && form.city && (
                  <p className="text-xs text-green-600 mt-1 font-semibold">✓ {form.city}, {form.state}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City *</label>
                  <Input value={form.city} onChange={set("city")} className={`${inputClass} ${errors.city ? "border-red-400" : ""}`} placeholder="Sioux Falls" />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <select value={form.state} onChange={set("state")} className={`${selectClass} ${errors.state ? "border-red-400" : ""}`}>
                    <option value="">State...</option>
                    {US_STATES.map(([abbr, name]) => (
                      <option key={abbr} value={abbr}>{abbr} — {name}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Your service</h3>
                <p className="text-sm text-muted-foreground">Tell us a little about your time in uniform.</p>
              </div>
              <div>
                <label className={labelClass}>Branch *</label>
                <div className="grid grid-cols-2 gap-2">
                  {BRANCHES.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => { setForm(prev => ({ ...prev, branch: b })); setErrors(prev => ({ ...prev, branch: undefined })); }}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold text-left transition-all ${
                        form.branch === b
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      } ${errors.branch ? "border-red-300" : ""}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                {errors.branch && <p className="text-xs text-red-500 mt-2">{errors.branch}</p>}
              </div>
              <div>
                <label className={labelClass}>Years Served <span className="font-normal normal-case">(optional)</span></label>
                <Input value={form.yearsServed} onChange={set("yearsServed")} className={inputClass} placeholder="e.g. 2005–2013" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">What do you need?</h3>
                <p className="text-sm text-muted-foreground">We want them to fit right.</p>
              </div>

              {/* Type toggle */}
              <div>
                <label className={labelClass}>Type of Pants</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "jeans", label: "👖 Jeans", desc: "Lee or Wrangler denim" },
                    { value: "sweatpants", label: "🩳 Sweatpants", desc: "Athletic, comfortable" },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, pantType: opt.value, pantSize: "", waist: "", inseam: "", pantColor: "" }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.pantType === opt.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-bold text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweatpants sizing */}
              {form.pantType === "sweatpants" && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Size *</label>
                    <div className="flex flex-wrap gap-2">
                      {["S", "M", "L", "XL", "2XL", "3XL"].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => { setForm(prev => ({ ...prev, pantSize: size })); setErrors(prev => ({ ...prev, pantSize: undefined })); }}
                          className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                            form.pantSize === size
                              ? "bg-primary border-primary text-white"
                              : `border-border hover:border-primary/50 ${errors.pantSize ? "border-red-300" : ""}`
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {errors.pantSize && <p className="text-xs text-red-500 mt-2">{errors.pantSize}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Color <span className="font-normal normal-case">(optional)</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "Black", hex: "#1A1A1A" },
                        { key: "Grey", hex: "#9B9B9B" },
                        { key: "No preference", hex: "#cccccc" },
                      ].map(c => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, pantColor: c.key }))}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                            form.pantColor === c.key
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: c.hex }} />
                          {c.key}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Jeans sizing */}
              {form.pantType === "jeans" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Waist (inches) *</label>
                      <Input value={form.waist} onChange={set("waist")} className={`${inputClass} ${errors.waist ? "border-red-400" : ""}`} placeholder="32" inputMode="numeric" />
                      {errors.waist && <p className="text-xs text-red-500 mt-1">{errors.waist}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Inseam (inches) *</label>
                      <Input value={form.inseam} onChange={set("inseam")} className={`${inputClass} ${errors.inseam ? "border-red-400" : ""}`} placeholder="30" inputMode="numeric" />
                      {errors.inseam && <p className="text-xs text-red-500 mt-1">{errors.inseam}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Fit Style <span className="font-normal normal-case">(optional)</span></label>
                    <select value={form.pantFit} onChange={set("pantFit")} className={selectClass}>
                      <option value="">No preference</option>
                      <option value="Relaxed / Loose">Relaxed / Loose</option>
                      <option value="Regular / Straight">Regular / Straight</option>
                      <option value="Slim / Fitted">Slim / Fitted</option>
                      <option value="Bootcut">Bootcut</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Color <span className="font-normal normal-case">(optional)</span></label>
                    <select value={form.pantColor} onChange={set("pantColor")} className={selectClass}>
                      <option value="">No preference (we pick dark)</option>
                      <option value="Dark">Dark wash</option>
                      <option value="Medium">Medium wash</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Brand <span className="font-normal normal-case">(optional)</span></label>
                    <select value={form.pantBrand} onChange={set("pantBrand")} className={selectClass}>
                      <option value="">No preference</option>
                      <option value="Lee">Lee — American-made, classic fit</option>
                      <option value="Wrangler">Wrangler — American-made, durable</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Almost there.</h3>
                <p className="text-sm text-muted-foreground">A little background helps us reach veterans most in need. Everything here is optional.</p>
              </div>

              {/* Household info — soft ask */}
              <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Household Info <span className="font-normal normal-case">(optional — kept confidential)</span></p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Household Size</label>
                    <Input type="number" min="1" value={form.householdSize} onChange={set("householdSize")} className={inputClass} placeholder="1" />
                  </div>
                  <div>
                    <label className={labelClass}>Annual Income</label>
                    <Input value={form.annualIncome} onChange={set("annualIncome")} className={inputClass} placeholder="e.g. $18,000" />
                  </div>
                </div>
              </div>

              {/* ID upload */}
              <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Verify Service <span className="font-normal normal-case">(optional — speeds up approval)</span></p>
                <p className="text-sm text-foreground">Upload your <strong>DD-214</strong> or <strong>Veteran ID</strong> to skip the verification call.</p>
                {!idFile ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-primary/50 text-primary text-sm font-semibold hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <span>📎</span> Upload DD-214 or Veteran ID
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-xl px-4 py-2 text-sm text-green-700 font-semibold">
                      <span>✅</span> {idFile.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIdFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {!idFile && (
                  <p className="text-xs text-muted-foreground">No file? No problem — we'll call you to verify instead.</p>
                )}
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => setIdFile(e.target.files?.[0] || null)} />
              </div>

              {/* Notes */}
              <div>
                <label className={labelClass}>Anything else? <span className="font-normal normal-case">(optional)</span></label>
                <textarea
                  value={form.notes}
                  onChange={set("notes")}
                  rows={3}
                  className="w-full rounded-xl border-2 border-border focus:border-primary bg-background text-sm px-4 py-3 focus:outline-none resize-none"
                  placeholder="Share your situation, any special needs, how you heard about us..."
                />
              </div>

              {/* Follow-up call toggle */}
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, wantsFollowUpCall: !prev.wantsFollowUpCall }))}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  form.wantsFollowUpCall
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40 bg-muted/30"
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  form.wantsFollowUpCall ? "bg-primary border-primary" : "border-muted-foreground"
                }`}>
                  {form.wantsFollowUpCall && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">I'd welcome a follow-up call 📞</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sometimes we just want to hear your story. No obligation — just a conversation.</p>
                </div>
              </button>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-14 rounded-2xl bg-primary text-white font-extrabold text-lg hover:bg-primary/90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20"
              >
                {submitting ? "Submitting..." : "Submit My Request →"}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                Your information is kept confidential and only used to fulfill your request. We do not sell or share personal data.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      {step < 5 && (
        <div className="flex items-center gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="h-12 px-6 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all"
            >
              ← Back
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="flex-1 h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            {step === 4 ? "Review & Submit →" : "Continue →"}
          </button>
        </div>
      )}

      {step === 5 && step > 1 && (
        <button
          type="button"
          onClick={back}
          className="w-full h-10 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-primary transition-all"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
