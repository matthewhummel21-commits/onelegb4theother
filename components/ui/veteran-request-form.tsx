"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";

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
  pantSize: "", waist: "", inseam: "", referredBy: "", notes: "",
};

export function VeteranRequestForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Store to localStorage for now — replace with API call later
    const requests = JSON.parse(localStorage.getItem("olb4o_requests") || "[]");
    requests.push({ ...form, submittedAt: new Date().toISOString() });
    localStorage.setItem("olb4o_requests", JSON.stringify(requests));
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
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
          We&rsquo;ll review your request and reach out within a few days. If you qualify, we&rsquo;ll ship directly to you at no cost.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Info */}
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

      {/* Shipping Address */}
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

      {/* Service Info */}
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

      {/* Financial */}
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

      {/* Sizing */}
      <div>
        <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">5</span>
          Pant Sizing
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Waist (inches) *</label>
            <Input required value={form.waist} onChange={set("waist")} className={inputClass} placeholder="32" />
          </div>
          <div>
            <label className={labelClass}>Inseam (inches) *</label>
            <Input required value={form.inseam} onChange={set("inseam")} className={inputClass} placeholder="30" />
          </div>
          <div>
            <label className={labelClass}>General Size</label>
            <Input value={form.pantSize} onChange={set("pantSize")} className={inputClass} placeholder="e.g. 32x30" />
          </div>
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
