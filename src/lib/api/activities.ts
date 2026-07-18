import { apiFetch } from "./client";
import { Activity } from "@/types";

export function getActivities(): Promise<Activity[]> {
  return apiFetch(`/api/activities`);
}

export function logActivity(
  data: Omit<Activity, "_id" | "userId" | "carbonFootprintKg" | "createdAt">
): Promise<Activity> {
  return apiFetch(`/api/activities`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteActivity(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/activities/${id}`, { method: "DELETE" });
}
