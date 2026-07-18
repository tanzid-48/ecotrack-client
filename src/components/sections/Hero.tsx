import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[65vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center w-full">
        <div>
          <span className="inline-block text-xs font-medium tracking-wide uppercase text-primary bg-primary-light px-3 py-1.5 rounded-full mb-6">
            Your daily habits, measured
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-foreground mb-6">
            Every habit leaves
            <span className="italic text-primary"> a ring.</span>
          </h1>
          <p className="text-lg text-muted max-w-lg mb-8 leading-relaxed">
            Log your commute, energy use, diet, and waste. EcoTrack turns it
            into a clear picture of your carbon footprint — and an AI-guided
            path to shrink it, one ring at a time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Start tracking <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border font-medium hover:bg-primary-light transition-colors"
            >
              Browse challenges
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ImpactRingIllustration />
        </div>
      </div>
    </section>
  );
}

function ImpactRingIllustration() {
  const rings = [
    { r: 150, color: "#0f6d5f", opacity: 0.15, dash: undefined },
    { r: 115, color: "#0f6d5f", opacity: 0.3, dash: undefined },
    { r: 80, color: "#0f6d5f", opacity: 0.55, dash: undefined },
    { r: 45, color: "#b45309", opacity: 1, dash: "4 6" },
  ];

  return (
    <svg
      viewBox="0 0 360 360"
      className="w-full max-w-md aspect-square"
      role="img"
      aria-label="Concentric rings representing shrinking carbon footprint over time"
    >
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx="180"
          cy="180"
          r={ring.r}
          fill="none"
          stroke={ring.color}
          strokeOpacity={ring.opacity}
          strokeWidth={i === rings.length - 1 ? 2 : 22}
          strokeDasharray={ring.dash}
        />
      ))}
      <circle cx="180" cy="180" r="20" fill="#0f6d5f" />
      <text
        x="180"
        y="185"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="600"
      >
        CO₂
      </text>
    </svg>
  );
}
