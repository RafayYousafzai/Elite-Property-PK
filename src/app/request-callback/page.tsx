"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  Input,
  Select,
  SelectItem,
  Button,
  Card,
  CardBody,
} from "@heroui/react";

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

const purposeOptions = [
  { value: "Personal Use", label: "Personal Use" },
  { value: "Investment", label: "Investment" },
];

const lookingForOptions = [
  { value: "Plot", label: "Plot" },
  { value: "House", label: "House" },
  { value: "Either", label: "Either" },
  { value: "Guide Me", label: "Guide Me" },
];

export default function RequestCallbackPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    budgetRange: budgetOptions[0],
    purpose: purposeOptions[0].value,
    lookingFor: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.lookingFor) {
      setStatus("error");
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

      // 2. Meta Pixel & Conversions API Tracking
      const eventId = crypto.randomUUID();

      // Browser-side Pixel
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq(
          "track",
          "Lead",
          {
            content_name: "Call Back Request",
            content_category: "Landing Page Lead",
            value: 0,
            currency: "PKR",
            predicted_ltv: 0,
          },
          {
            eventID: eventId,
          },
        );
      }

      // Server-side Conversions API (CAPI)
      try {
        await fetch("/api/meta-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_name: "Lead",
            event_id: eventId,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: window.location.href,
            user_data: {
              client_user_agent: navigator.userAgent,
            },
            custom_data: {
              content_name: "Call Back Request",
              content_category: "Landing Page Lead",
              value: 0,
              currency: "PKR",
            },
          }),
        });
      } catch (error) {
        console.error("Failed to send Meta CAPI event:", error);
      }

      setStatus("success");
      setFormData({
        fullName: "",
        phoneNumber: "",
        budgetRange: budgetOptions[0],
        purpose: purposeOptions[0].value,
        lookingFor: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background glow circles for premium touch */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Brand Logo */}
      <div className="relative z-10 mb-8 transform hover:scale-105 transition-transform duration-300">
        <Link href="/">
          <Image
            src="/elite-logo-brown.png"
            alt="Elite Property"
            width={200}
            height={80}
            priority
            className="h-16 w-auto object-contain"
          />
        </Link>
      </div>

      <Card className="relative z-10 w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border-none shadow-2xl p-2 sm:p-4">
        <CardBody className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Tell us what you&apos;re looking for
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Submit your requirements and our property consultants will reach
              out.
            </p>
            <div className="h-1 w-20 bg-amber-500 rounded-full mx-auto mt-4" />
          </div>

          {status === "success" && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <Icon
                icon="ph:check-circle-fill"
                className="text-emerald-600 dark:text-emerald-500 w-6 h-6 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-semibold">
                Thank you — your request has been received. Our team will call
                you shortly to arrange your site visit.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <Icon
                icon="ph:warning-circle-fill"
                className="text-red-600 dark:text-red-500 w-6 h-6 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
                Something went wrong sending your request. Please try again, or
                call us directly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <Input
              isRequired
              type="text"
              label="Full Name"
              placeholder="Your full name"
              value={formData.fullName}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, fullName: val }))
              }
              variant="flat"
              size="lg"
              className="w-full"
            />

            {/* Phone Number */}
            <Input
              isRequired
              type="text"
              label="Phone Number"
              placeholder="03XX-XXXXXXX"
              value={formData.phoneNumber}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, phoneNumber: val }))
              }
              variant="flat"
              size="lg"
              className="w-full"
              pattern="^03[0-9]{2}-[0-9]{7}$|^03[0-9]{9}$"
              description="Format: 03XX-XXXXXXX"
            />

            {/* Budget Range */}
            <Select
              isRequired
              label="Budget Range"
              variant="flat"
              size="lg"
              selectedKeys={[formData.budgetRange]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFormData((prev) => ({
                  ...prev,
                  budgetRange: selected as string,
                }));
              }}
              className="w-full"
            >
              {budgetOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </Select>

            {/* Purpose */}
            <Select
              isRequired
              label="Purpose"
              variant="flat"
              size="lg"
              selectedKeys={[formData.purpose]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFormData((prev) => ({
                  ...prev,
                  purpose: selected as string,
                }));
              }}
              className="w-full"
            >
              {purposeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>

            {/* Looking For */}
            <Select
              isRequired
              label="Looking For"
              placeholder="Select Option"
              variant="flat"
              size="lg"
              selectedKeys={formData.lookingFor ? [formData.lookingFor] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFormData((prev) => ({
                  ...prev,
                  lookingFor: selected as string,
                }));
              }}
              className="w-full"
            >
              {lookingForOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={loading}
                startContent={
                  !loading && (
                    <Icon
                      icon="ph:phone-call"
                      className="w-5 h-5 animate-pulse"
                    />
                  )
                }
                className="w-full font-extrabold text-base bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-lg shadow-amber-500/20 py-7 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Request a Call Back
              </Button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 font-semibold tracking-wide">
                We&apos;ll call within business hours.
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
