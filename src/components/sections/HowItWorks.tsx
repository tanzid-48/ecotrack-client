const steps = [
  {
    n: "01",
    title: "Log your day",
    desc: "Commute, electricity, meals, waste — a two-minute daily entry.",
  },
  {
    n: "02",
    title: "See your footprint",
    desc: "We calculate your CO₂ output and chart it against your own history.",
  },
  {
    n: "03",
    title: "Act on AI insight",
    desc: "Get a personalized breakdown and challenges matched to what would help most.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
            How it works
          </h2>
          <p className="text-muted">
            A simple daily loop that compounds into real change.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-3xl text-primary/30 font-semibold">
                  {step.n}
                </span>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block h-px flex-1 bg-border" />
                )}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
