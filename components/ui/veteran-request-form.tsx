"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  branch: string;
  yearsServed: string;
  householdSize: string;
  annualIncome: string;
  pantType: string;
  pantSize: string;
  waist: string;
  inseam: string;
  referredBy: string;
  notes: string;
}

const BRANCHES = ["Army", "Navy", "Marine Corps", "Air Force", "Space Force", "Coast Guard", "National Guard", "Reserves"];

const INITIAL: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "", state: "", zip: "",
  branch: "", yearsServed: "", householdSize: "", annualIncome: "",
  pantType: "", pantSize: "", waist: "", inseam: "", referredBy: "", notes: "",
};

export function VeteranRequestForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIdFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();

      // Append all form fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append file if provided
      if (idFile) {
        formData.append("idFile", idFile);
      }

      const res = await fetch("/api/request", {
        method: "POST",
        body: formData,
        // No Content-Type header — browser sets it with boundary for multipart
      });

      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again or call (605) 277-2721.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "h-12 rounded-xl border-2 border-border focus:border-primary bg-background text-sm";
  const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5";

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
            : "We'll give you a call to verify your service, then ship directly to you at no cost if you qualify."}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1 — Personal Info */}
      <div>
        <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
          Personal Information
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <Input required value={form.firstName} onChange={set("firstName")} className={inputClass} placeholder="John" />
          </div>
          <div>
            <label className={labelClass}>Last Name *</label>
            <Input required value={form.lastName} onChange={set("lastName")} className={inputClass} placeholder="Smith" />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <Input required type="email" value={form.email} onChange={set("email")} className={inputClass} placeholder="john@email.com" />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <Input required type="tel" value={form.phone} onChange={set("phone")} className={inputClass} placeholder="(605) 555-0000" />
          </div>
        </div>
      </div>

      {/* Step 2 — Shipping Address */}
      <div>
        <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
          Shipping Address
        </p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Street Address *</label>
            <Input required value={form.address} onChange={set("address")} className={inputClass} placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className={labelClass}>City *</label>
              <Input required value={form.city} onChange={set("city")} className={inputClass} placeholder="Sioux Falls" />
            </div>
            <div>
              <label className={labelClass}>State *</label>
              <Input required value={form.state} onChange={set("state")} className={inputClass} placeholder="SD" maxLength={2} />
            </div>
            <div>
              <label className={labelClass}>ZIP *</label>
              <Input required value={form.zip} onChange={set("zip")} className={inputClass} placeholder="57104" />
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 — Military Service */}
      <div>
        <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
          Military Service
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Branch *</label>
            <select
              required
              value={form.branch}
              onChange={set("branch")}
              className="w-full h-12 rounded-xl border-2 border-border focus:border-primary bg-background text-sm px-3 focus:outline-none"
            >
              <option value="">Select branch...</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Years Served</label>
            <Input value={form.yearsServed} onChange={set("yearsServed")} className={inputClass} placeholder="e.g. 2005–2013" />
          </div>
        </div>
      </div>

      {/* Step 4 — Household Info */}
      <div>
        <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">4</span>
          Household Information
        </p>
        <p className="text-xs text-muted-foreground mb-4">This helps us prioritize veterans most in need. All information is kept confidential.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Household Size *</label>
            <Input required type="number" min="1" value={form.householdSize} onChange={set("householdSize")} className={inputClass} placeholder="1" />
          </div>
          <div>
            <label className={labelClass}>Annual Household Income *</label>
            <Input required value={form.annualIncome} onChange={set("annualIncome")} className={inputClass} placeholder="e.g. $18,000" />
          </div>
        </div>
      </div>

      {/* Step 5 — Pant Type */}
      <div>
        <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">5</span>
          Type of Pants Needed
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "jeans", label: "👖 Jeans", desc: "Lee jeans, denim" },
            { value: "sweatpants", label: "🩳 Sweatpants", desc: "Athletic, comfortable" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, pantType: opt.value }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                form.pantType === opt.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-bold text-sm">{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 6 — Sizing */}
      <div>
        <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">6</span>
          {form.pantType === "sweatpants" ? "Sweatpants Size" : "Jeans Size"}
        </p>

        {form.pantType === "sweatpants" ? (
          <div>
            <p className="text-xs text-muted-foreground mb-3">Select your size</p>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, pantSize: size }))}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                    form.pantSize === size
                      ? "bg-primary border-primary text-white"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!form.pantSize && form.pantType === "sweatpants" && (
              <p className="text-xs text-amber-500 mt-2">Please select a size</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Waist (inches) *</label>
              <Input required={form.pantType === "jeans"} value={form.waist} onChange={set("waist")} className={inputClass} placeholder="32" />
            </div>
            <div>
              <label className={labelClass}>Inseam (inches) *</label>
              <Input required={form.pantType === "jeans"} value={form.inseam} onChange={set("inseam")} className={inputClass} placeholder="30" />
            </div>
            <div>
              <label className={labelClass}>General Size</label>
              <Input value={form.pantSize} onChange={set("pantSize")} className={inputClass} placeholder="e.g. 32x30" />
            </div>
          </div>
        )}
      </div>

      {/* Step 7 — Verify Service (Optional) */}
      <div>
        <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">7</span>
          Verify Service
          <span className="text-xs font-normal text-muted-foreground">(Optional — but speeds up approval)</span>
        </p>

        <div className="rounded-xl border-2 border-border bg-muted/30 p-5 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            Upload your <strong>DD-214</strong> or <strong>Veteran ID card</strong> to speed up your approval.
            If you can&apos;t provide one right now, no problem — we&apos;ll give you a quick call to verify.
          </p>

          {!idFile ? (
            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-primary/50 text-primary text-sm font-semibold hover:border-primary hover:bg-primary/5 transition-all"
              >
                <span>📎</span> Choose File (PDF, JPG, PNG)
              </button>
              <p className="text-xs text-muted-foreground">
                No problem if you can&apos;t — we&apos;ll call you to verify instead.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-xl px-4 py-2.5 text-sm text-green-700 font-semibold">
                <span>✅</span>
                <span>ID uploaded: {idFile.name}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIdFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          {!idFile && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <span>📞</span>
              <span>No file? We&apos;ll call you to verify — just make sure your phone number above is correct.</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Referral + Notes */}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Referred By (optional)</label>
          <Input value={form.referredBy} onChange={set("referredBy")} className={inputClass} placeholder="Name of person or org who referred you" />
        </div>
        <div>
          <label className={labelClass}>Anything else you&apos;d like us to know? (optional)</label>
          <textarea
            value={form.notes}
            onChange={set("notes")}
            rows={3}
            className="w-full rounded-xl border-2 border-border focus:border-primary bg-background text-sm px-4 py-3 focus:outline-none resize-none"
            placeholder="Share your situation, any special needs, etc."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-14 rounded-2xl bg-primary text-white font-extrabold text-lg hover:bg-primary/90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20"
      >
        {submitting ? "Submitting..." : "Submit Request →"}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Your information is kept confidential and only used to fulfill your request.
        We do not sell or share personal data.
      </p>
    </form>
  );
}
