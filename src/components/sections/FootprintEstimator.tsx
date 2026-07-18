"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";

// Same emission factors as the backend calculation (src/routes/activities.ts)
// so the landing-page estimate matches what a signed-up user would see.
const EMISSION_FACTORS = {
  commute: { car: 0.192, motorbike: 0.103, bus: 0.089, train: 0.041, bike: 0, walk: 0 },
  electricityPerKwh: 0.42,
  diet: { vegan: 1.5, vegetarian: 2.5, mixed: 4.0, "heavy-meat": 6.5 },
};

const commuteOptions = [
  { value: "car", label: "Car" },
  { value: "motorbike", label: "Motorbike" },
  { value: "bus", label: "Bus" },
  { value: "train", label: "Train" },
  { value: "bike", label: "Bike" },
  { value: "walk", label: "Walk" },
] as const;

const dietOptions = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "mixed", label: "Mixed" },
  { value: "heavy-meat", label: "Heavy meat" },
] as const;

export function FootprintEstimator() {
  const [commuteType, setCommuteType] =
    useState<keyof typeof EMISSION_FACTORS.commute>("car");
  const [distance, setDistance] = useState(10);
  const [electricity, setElectricity] = useState(5);
  const [dietType, setDietType] =
    useState<keyof typeof EMISSION_FACTORS.diet>("mixed");

  const estimate = useMemo(() => {
    const commute = EMISSION_FACTORS.commute[commuteType] * distance;
    const electricityKg = EMISSION_FACTORS.electricityPerKwh * electricity;
    const diet = EMISSION_FACTORS.diet[dietType];
    return Math.round((commute + electricityKg + diet) * 10) / 10;
  }, [commuteType, distance, electricity, dietType]);

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 grid lg:grid-cols-2 gap-10">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
              <Calculator className="w-4 h-4" /> No sign-up needed
            </span>
            <h2 className="font-display text-3xl font-semibold mb-3">
              Estimate your footprint in 10 seconds
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              Answer three quick questions to see a rough daily estimate.
              Create a free account to track it properly and get AI-guided
              tips to bring it down.
            </p>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  How do you usually commute?
                </label>
                <select
                  value={commuteType}
                  onChange={(e) =>
                    setCommuteType(e.target.value as typeof commuteType)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  {commuteOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Daily commute distance: <b>{distance} km</b>
                </label>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Daily electricity use: <b>{electricity} kWh</b>
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={electricity}
                  onChange={(e) => setElectricity(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">Diet type</label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value as typeof dietType)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  {dietOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center bg-primary-light rounded-xl p-8">
            <p className="text-sm text-muted mb-2">Your estimated daily footprint</p>
            <p className="font-display text-5xl font-semibold text-primary mb-1">
              {estimate}
              <span className="text-xl align-top ml-1">kg</span>
            </p>
            <p className="text-xs text-muted mb-8">CO₂ equivalent</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Track it properly <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
