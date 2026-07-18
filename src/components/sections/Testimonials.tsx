const testimonials = [
  {
    quote:
      "Seeing my commute add up week over week made me switch to biking twice a week. The AI summary made it click in a way a spreadsheet never did.",
    name: "Rafiq H.",
    role: "Software Engineer",
  },
  {
    quote:
      "I joined a waste-reduction challenge with three coworkers. We're now composting as a team and comparing our numbers monthly.",
    name: "Nusrat J.",
    role: "Product Designer",
  },
  {
    quote:
      "The recommendation engine actually adapts — once I logged a few vegetarian days it stopped suggesting diet swaps and focused on my electricity use instead.",
    name: "Imran K.",
    role: "Graduate Student",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
            From the community
          </h2>
          <p className="text-muted">Real habits, changed gradually.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="p-6 rounded-lg border border-border bg-card flex flex-col h-full"
            >
              <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 pt-5 border-t border-border">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
