import { apiFetch } from "./client";
import { Challenge, PaginatedChallenges } from "@/types";

export interface ChallengeFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function getChallenges(
  filters: ChallengeFilters = {}
): Promise<PaginatedChallenges> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return apiFetch(`/api/challenges?${params.toString()}`);
}

export function getChallengeById(id: string): Promise<{
  challenge: Challenge;
  related: Challenge[];
  reviews: import("@/types").Review[];
}> {
  return apiFetch(`/api/challenges/${id}`);
}

export async function getChallengesByIds(ids: string[]): Promise<Challenge[]> {
  const results = await Promise.allSettled(
    ids.map((id) => getChallengeById(id))
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getChallengeById>>> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value.challenge);
}

export function getMyChallenges(): Promise<Challenge[]> {
  return apiFetch(`/api/challenges/mine/list`);
}

export function createChallenge(data: Partial<Challenge>): Promise<Challenge> {
  return apiFetch(`/api/challenges`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteChallenge(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/challenges/${id}`, { method: "DELETE" });
}

export function joinChallenge(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/challenges/${id}/join`, { method: "POST" });
}
