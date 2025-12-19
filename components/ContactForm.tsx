/* eslint-disable react/jsx-no-bind */
"use client";

import { useState } from "react";

type Props = { locale: string };

export default function ContactForm({ locale }: Props) {
  const [form, setForm] = useState({ name: "", email: "", message: "", nickname: "" });
  const [status, setStatus] = useState<
    { type: "idle" | "success" | "error" | "loading"; message?: string }
  >({
    type: "idle"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale })
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus({ type: "success", message: "Message sent. We'll get back to you soon." });
      setForm({ name: "", email: "", message: "", nickname: "" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Something went wrong" });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-text-primary">
        Name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-2 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none ring-accent/40 transition focus:ring-2"
          required
        />
      </label>
      <label className="block text-sm font-semibold text-text-primary">
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-2 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none ring-accent/40 transition focus:ring-2"
          required
        />
      </label>
      <label className="block text-sm font-semibold text-text-primary">
        Message
        <textarea
          name="message"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-2 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none ring-accent/40 transition focus:ring-2"
          required
        />
      </label>
      <div className="hidden">
        <label>
          Nickname
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={status.type === "loading"}
        className="rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        {status.type === "loading" ? "Sending..." : "Send message"}
      </button>
      {status.type === "success" ? (
        <p className="text-sm text-green-600">{status.message}</p>
      ) : null}
      {status.type === "error" ? (
        <p className="text-sm text-red-600">{status.message}</p>
      ) : null}
      <p className="text-xs text-text-secondary">
        Anti-spam: hidden honeypot and light rate-limit apply. For urgent matters email{" "}
        <a className="text-blue-700 dark:text-blue-300" href="mailto:hello@techskillsthatpay.com">
          hello@techskillsthatpay.com
        </a>
        .
      </p>
    </form>
  );
}
