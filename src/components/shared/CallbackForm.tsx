"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, PhoneCall } from "lucide-react";

// Extend Window interface for Meta Pixel
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      data?: object,
      options?: object,
    ) => void;
  }
}

const budgetOptions = [
  "Under 2 Crore",
  "2 - 4 Crore",
  "4 - 6 Crore",
  "6 - 8 Crore",
  "8 - 10 Crore",
  "10 - 12 Crore",
  "Above 12 Crore",
];

const purposeOptions = ["Personal Use", "Investment"];

const lookingForOptions = ["Plot", "House", "Either", "Guide Me"];

const PHONE_PATTERN = /^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$/;

const emptyForm = {
  fullName: "",
  phoneNumber: "",
  budgetRange: "",
  purpose: "",
  lookingFor: "",
};

type FormData = typeof emptyForm;

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={selected}
              className={`h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors ${
                selected
                  ? "border-[#1a1714] bg-[#1a1714] text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const inputClass =
  "h-14 w-full rounded-sm border border-stone-200 bg-white px-5 text-base outline-none transition-colors placeholder:text-stone-400 focus:border-[#9a7a1e]";

// Lead capture form shared by /request-callback and /contactus. Saves to the
// leads table, sends the EmailJS notification and fires the Meta Pixel event.
export default function CallbackForm({
  trackingCategory = "Landing Page Lead",
}: {
  trackingCategory?: string;
}) {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState("");

  const set = (key: keyof FormData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.lookingFor ||
      !formData.budgetRange ||
      !formData.purpose
    ) {
      setValidationError("Please fill in every field so we can prepare for your call.");
      return;
    }
    if (!PHONE_PATTERN.test(formData.phoneNumber.trim())) {
      setValidationError("Please enter your number as 03XX-XXXXXXX.");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      // 1. Submit lead to database API
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          budget_range: formData.budgetRange,
          purpose: formData.purpose,
          looking_for: formData.lookingFor,
        }),
      });

      const responseData = await res.json();
      if (!res.ok || responseData.success === false) {
        throw new Error(responseData.message || "Failed to submit lead");
      }

      // 2. EmailJS Integration (REST API client)
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicKey,
              template_params: {
                full_name: formData.fullName,
                phone_number: formData.phoneNumber,
                budget_range: formData.budgetRange,
                purpose: formData.purpose,
                looking_for: formData.lookingFor,
                submitted_at: new Date().toLocaleString(),
              },
            }),
          });
        } catch (emailErr) {
          console.error("Failed to send email notification via EmailJS:", emailErr);
        }
      } else {
        console.warn("⚠️ EmailJS environment variables are not configured. Email submission skipped.");
      }

      // 3. Meta Pixel Tracking
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("trackCustom", "Form Submit", {
          content_name: "Call Back Request",
          content_category: trackingCategory,
          value: 0,
          currency: "PKR",
          predicted_ltv: 0,
        });
      }

      setStatus("success");
      setFormData(emptyForm);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="py-10 text-center animate-in fade-in duration-300">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#9a7a1e]/30 bg-[#faf8f3] text-[#9a7a1e]">
          <Check size={28} strokeWidth={1.5} />
        </span>
        <h3 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
          Thank you
        </h3>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-stone-600">
          Your request has been received. One of our advisors will call you
          shortly to arrange your site visit.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 cursor-pointer text-sm font-semibold text-[#9a7a1e] underline-offset-4 hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Full name</span>
          <input
            type="text"
            autoComplete="name"
            placeholder="Full name"
            value={formData.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="sr-only">Phone number</span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="03XX-XXXXXXX"
            value={formData.phoneNumber}
            onChange={(e) => set("phoneNumber")(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <ChoiceGroup
        label="I'm looking for"
        options={lookingForOptions}
        value={formData.lookingFor}
        onChange={set("lookingFor")}
      />
      <ChoiceGroup
        label="Purpose"
        options={purposeOptions}
        value={formData.purpose}
        onChange={set("purpose")}
      />
      <ChoiceGroup
        label="Budget"
        options={budgetOptions}
        value={formData.budgetRange}
        onChange={set("budgetRange")}
      />

      {(validationError || status === "error") && (
        <p role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {validationError ||
            "Something went wrong sending your request. Please try again, or call us directly."}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#1a1714] text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e] disabled:cursor-wait disabled:opacity-80"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <PhoneCall size={17} strokeWidth={1.75} />
          )}
          {loading ? "Sending…" : "Request a call back"}
          {!loading && (
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          )}
        </button>
        <p className="mt-4 text-center text-xs text-stone-500">
          We&apos;ll call you within business hours. Your details stay private.
        </p>
      </div>
    </form>
  );
}
