"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary text-white p-10 sm:p-14 grid lg:grid-cols-2 gap-8 items-center overflow-hidden relative">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
              Start your first ring today
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Get a monthly digest of your footprint trend and new community
              challenges worth joining.
            </p>
            {submitted ? (
              <p className="text-sm font-medium bg-white/10 rounded-lg px-4 py-3 inline-block">
                You&apos;re subscribed — thanks for joining in.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-3 rounded-lg text-foreground bg-white placeholder:text-muted text-sm outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-medium hover:bg-white/90 transition-colors"
            >
              Create free account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
