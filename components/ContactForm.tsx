"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/data/site";

// TODO: wire to a backend / email service (e.g. Resend, Formspree).
// Until then, submitting opens the visitor's mail app with the message prefilled.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  const inputClasses =
    "w-full rounded-2xl border border-edge bg-background px-4 py-3 text-foreground placeholder:text-muted/60 transition-colors focus:border-brand";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Name
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClasses}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClasses}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Message
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would you like to build together?"
          className={`${inputClasses} resize-y`}
        />
      </label>
      <button
        type="submit"
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-7 py-3 font-display text-lg font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-md"
      >
        <Send className="size-4" />
        Send message
      </button>
    </form>
  );
}
