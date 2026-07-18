import { apiFetch } from "./client";
import { FootprintAnalysis, Recommendations } from "@/types";

export function analyzeFootprint(): Promise<FootprintAnalysis> {
  return apiFetch(`/api/ai/analyze-footprint`, { method: "POST" });
}

export function getRecommendations(
  categoryFilter?: string
): Promise<Recommendations> {
  return apiFetch(`/api/ai/recommend`, {
    method: "POST",
    body: JSON.stringify({ categoryFilter }),
  });
}

export function generateChallengeDescription(data: {
  title: string;
  category: string;
  keyPoints?: string;
}): Promise<{ shortDescription: string; fullDescription: string }> {
  return apiFetch(`/api/ai/generate-challenge-description`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
