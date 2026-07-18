"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 12400, suffix: "kg", label: "CO₂ saved by the community" },
  { value: 860, suffix: "", label: "Daily logs recorded" },
  { value: 45, suffix: "", label: "Active sustainability challenges" },
  { value: 3.2, suffix: "kg", label: "Avg. daily footprint per user" },
];

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress * 10) / 10);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [active, target]);

  return value;
}

export function ImpactStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
            Community impact
          </h2>
          <p className="text-white/60">
            Small daily logs, added together, move real numbers.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  stat,
  inView,
}: {
  stat: (typeof stats)[number];
  inView: boolean;
}) {
  const value = useCountUp(stat.value, inView);
  return (
    <div>
      <p className="font-display text-3xl sm:text-4xl font-semibold mb-1">
        {value.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="text-sm text-white/60">{stat.label}</p>
    </div>
  );
}
