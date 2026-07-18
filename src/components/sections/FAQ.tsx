"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How is my carbon footprint calculated?",
    a: "We use standard emission factors for commute type and distance, electricity usage, diet category, and waste generated, then combine them into a daily CO₂ estimate specific to your logged data.",
  },
  {
    q: "Do I need to log every single day?",
    a: "No — log whenever you can. More entries give the AI analyzer a clearer trend, but even occasional logging gives you a useful baseline.",
  },
  {
    q: "Is EcoTrack free to use?",
    a: "Yes, tracking your footprint, joining challenges, and getting AI recommendations are all free.",
  },
  {
    q: "Can I create my own challenge for others to join?",
    a: "Yes — once logged in, use Add Challenge to publish a sustainability challenge with an AI-assisted description, then track how many people join.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-card">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
            Frequently asked questions
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {faqs.map((faq, i) => (
            <div key={faq.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-muted transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <p className="text-sm text-muted leading-relaxed pb-5 pr-8">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
