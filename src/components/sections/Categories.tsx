import Link from "next/link";
import { Zap, Leaf, Utensils, Trash2, Droplet } from "lucide-react";

const categories = [
  { key: "energy", label: "Energy", icon: Zap, desc: "Home & electricity" },
  { key: "transport", label: "Transport", icon: Leaf, desc: "Commute & travel" },
  { key: "food", label: "Food", icon: Utensils, desc: "Diet & sourcing" },
  { key: "waste", label: "Waste", icon: Trash2, desc: "Reduce & reuse" },
  { key: "water", label: "Water", icon: Droplet, desc: "Conservation" },
];

export function Categories() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
            Explore by category
          </h2>
          <p className="text-muted">
            Every footprint breaks down into five levers you can pull.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(({ key, label, icon: Icon, desc }) => (
            <Link
              key={key}
              href={`/challenges?category=${key}`}
              className="group flex flex-col items-center text-center gap-3 p-6 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
