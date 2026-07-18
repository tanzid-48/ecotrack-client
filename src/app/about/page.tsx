import { Leaf, Target, Users, Sparkles } from "lucide-react";

const values = [
  { icon: Target, title: "Clarity over guesswork", desc: "Real emission factors turn vague habits into a concrete daily number." },
  { icon: Sparkles, title: "AI that adapts", desc: "Recommendations shift as your logged data changes — not a static checklist." },
  { icon: Users, title: "Community-driven", desc: "Challenges are published by real users, for real, achievable habit change." },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
        <Leaf className="w-4 h-4" /> About EcoTrack
      </span>
      <h1 className="font-display text-4xl font-semibold mb-6">
        Turning daily habits into visible impact
      </h1>
      <p className="text-muted leading-relaxed mb-4">
        EcoTrack started from a simple frustration: most sustainability advice is
        generic. &quot;Use less energy&quot; and &quot;eat less meat&quot; are true,
        but they don&apos;t tell you which of your own habits matters most.
      </p>
      <p className="text-muted leading-relaxed mb-12">
        So we built a tool that logs your actual commute, energy use, diet, and
        waste, turns it into a real carbon footprint number, and uses AI to tell
        you specifically what would help — then connects you with a community
        challenge to act on it.
      </p>

      <div className="grid sm:grid-cols-3 gap-6">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-6 rounded-lg border border-border bg-card">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
