"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getMyChallenges, deleteChallenge } from "@/lib/api/challenges";

function ManageChallengesContent() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["challenges", "mine"],
    queryFn: getMyChallenges,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChallenge(id),
    onSuccess: () => {
      toast.success("Challenge deleted");
      queryClient.invalidateQueries({ queryKey: ["challenges", "mine"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete challenge"),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1">
            Manage your challenges
          </h1>
          <p className="text-muted text-sm">
            Challenges you&apos;ve published to the community.
          </p>
        </div>
        <Link
          href="/challenges/add"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          + Add Challenge
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead className="bg-primary-light text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Participants</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3 capitalize hidden sm:table-cell text-muted">
                    {c.category}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted">
                    {c.participantsCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/challenges/${c._id}`}
                        className="p-2 rounded-lg hover:bg-primary-light transition-colors"
                        aria-label="View"
                      >
                        <Eye className="w-4 h-4 text-primary" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${c.title}"?`)) {
                            deleteMutation.mutate(c._id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border border-dashed border-border">
          <p className="text-muted mb-4">You haven&apos;t published any challenges yet.</p>
          <Link href="/challenges/add" className="text-primary font-medium text-sm">
            Publish your first challenge →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ManageChallengesPage() {
  return (
    <ProtectedRoute>
      <ManageChallengesContent />
    </ProtectedRoute>
  );
}
