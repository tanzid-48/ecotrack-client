"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { createChallenge } from "@/lib/api/challenges";
import { generateChallengeDescription } from "@/lib/api/ai";

const categories = ["energy", "transport", "food", "waste", "water"];
const difficulties = ["easy", "medium", "hard"];

function AddChallengeForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState("energy");
  const [difficulty, setDifficulty] = useState("easy");
  const [impactScore, setImpactScore] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [keyPoints, setKeyPoints] = useState("");

  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!title || !category) {
      const msg = "Add a title first so AI has something to work with.";
      setError(msg);
      toast.error(msg);
      return;
    }
    setError("");
    setGenerating(true);
    try {
      const result = await generateChallengeDescription({
        title,
        category,
        keyPoints,
      });
      setShortDescription(result.shortDescription);
      setFullDescription(result.fullDescription);
      toast.success("Descriptions generated");
    } catch {
      const msg = "Couldn't generate a description right now. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !shortDescription || !fullDescription) {
      const msg = "Please fill in title and both descriptions.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    try {
      const created = await createChallenge({
        title,
        shortDescription,
        fullDescription,
        category: category as never,
        difficulty: difficulty as never,
        impactScore: Number(impactScore) || 0,
        imageUrl: imageUrl || undefined,
      });
      toast.success("Challenge published!");
      router.push(`/challenges/${created._id}`);
    } catch (err) {
      const msg = (err as Error).message || "Failed to create challenge.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-semibold mb-2">Add a challenge</h1>
      <p className="text-muted mb-8">
        Publish a sustainability challenge for the community to join.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium block mb-1.5">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bike to work twice a week"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm outline-none capitalize"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm outline-none capitalize"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">
            Key points for AI <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="e.g. saves money, good for beginners, takes 10 min a day"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-2.5 rounded-lg border border-dashed border-primary text-primary text-sm font-medium hover:bg-primary-light transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {generating ? "Generating with AI..." : "Generate descriptions with AI"}
        </button>

        <div>
          <label className="text-sm font-medium block mb-1.5">Short description</label>
          <textarea
            required
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="One or two sentences shown on the card"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Full description</label>
          <textarea
            required
            rows={7}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder="Full explanation shown on the details page"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Impact score <span className="text-muted font-normal">(kg CO₂/mo)</span>
            </label>
            <input
              type="number"
              min={0}
              value={impactScore}
              onChange={(e) => setImpactScore(e.target.value)}
              placeholder="15"
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Image URL <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Publishing..." : "Publish challenge"}
        </button>
      </form>
    </div>
  );
}

export default function AddChallengePage() {
  return (
    <ProtectedRoute>
      <AddChallengeForm />
    </ProtectedRoute>
  );
}
