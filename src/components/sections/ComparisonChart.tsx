"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

// Illustrative daily CO2 estimates derived from commonly cited annual per-capita
// figures (Global Carbon Project / World Bank, approximate). Shown for context,
// not exact real-time measurements.
const data = [
  { label: "Bangladesh avg.", kg: 1.4, fill: "var(--muted)" },
  { label: "Global avg.", kg: 12.9, fill: "var(--accent)" },
  { label: "Sustainable target", kg: 6.3, fill: "var(--primary)" },
];

export function ComparisonChart() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
            Where does a daily footprint usually land?
          </h2>
          <p className="text-muted">
            Rough daily CO₂ benchmarks for context — see how your own number
            compares once you start logging.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" fontSize={12} stroke="var(--muted)" />
              <YAxis fontSize={12} stroke="var(--muted)" unit="kg" />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value} kg CO₂/day`, ""]}
              />
              <Bar dataKey="kg" radius={[6, 6, 0, 0]} maxBarSize={80}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted mt-4 text-center">
            Illustrative figures based on commonly cited national and global
            per-capita emission averages — not precise real-time data.
          </p>
        </div>
      </div>
    </section>
  );
}
