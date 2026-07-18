"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Users, Leaf, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getChallengeById, joinChallenge } from "@/lib/api/challenges";
import { useSession } from "@/lib/auth-client";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { apiFetch } from "@/lib/api/client";

const difficultyStyles: Record<string, string> = {
  easy: "bg-primary-light text-primary-dark",
  medium: "bg-accent-light text-accent",
  hard: "bg-red-50 text-red-700",
};

export default function ChallengeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [joinMessage, setJoinMessage] = useState("");
  const [imgError, setImgError] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["challenge", id],
    queryFn: () => getChallengeById(id),
  });

  const joinMutation = useMutation({
    mutationFn: () => joinChallenge(id),
    onSuccess: () => {
      setJoinMessage("You've joined this challenge!");
      toast.success("Joined challenge!");
      queryClient.invalidateQueries({ queryKey: ["challenge", id] });
    },
    onError: (err: Error) => {
      setJoinMessage(err.message);
      toast.error(err.message || "Failed to join challenge");
    },
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/api/reviews`, {
        method: "POST",
        body: JSON.stringify({
          challengeId: id,
          rating: reviewRating,
          comment: reviewText,
        }),
      }),
    onSuccess: () => {
      setReviewText("");
      toast.success("Review posted");
      queryClient.invalidateQueries({ queryKey: ["challenge", id] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to post review"),
  });

  const handleJoin = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    joinMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center text-muted">
        Challenge not found.
      </div>
    );
  }

  const { challenge, related, reviews } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Image */}
      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-primary-light mb-8">
        {challenge.imageUrl && !imgError ? (
          <Image
            src={challenge.imageUrl}
            alt={challenge.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-14 h-14 text-primary/40" />
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${difficultyStyles[challenge.difficulty]}`}
            >
              {challenge.difficulty}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-light text-primary capitalize">
              {challenge.category}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
            {challenge.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-muted mb-8">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-accent text-accent" />
              {challenge.rating || "No ratings yet"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {challenge.participantsCount} participants
            </span>
            <span className="font-medium text-primary">
              -{challenge.impactScore}kg CO₂/month
            </span>
          </div>

          {/* Description */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold mb-3">
              Overview
            </h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
              {challenge.fullDescription}
            </p>
          </section>

          {/* Reviews */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold mb-4">
              Reviews ({reviews.length})
            </h2>

            {session && (
              <div className="mb-6 p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setReviewRating(n)}
                      aria-label={`Rate ${n} stars`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          n <= reviewRating
                            ? "fill-accent text-accent"
                            : "text-border"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this challenge..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary resize-y mb-2"
                />
                <button
                  onClick={() => reviewMutation.mutate()}
                  disabled={!reviewText || reviewMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {reviewMutation.isPending ? "Posting..." : "Post review"}
                </button>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {reviews.length === 0 && (
                <p className="text-sm text-muted">
                  No reviews yet — be the first to share your experience.
                </p>
              )}
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-3.5 h-3.5 ${
                          n <= review.rating
                            ? "fill-accent text-accent"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl border border-border bg-card">
            <h3 className="font-medium mb-1">Join this challenge</h3>
            <p className="text-sm text-muted mb-4">
              Track your progress alongside {challenge.participantsCount}{" "}
              others.
            </p>
            <button
              onClick={handleJoin}
              disabled={joinMutation.isPending}
              className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {joinMutation.isPending ? "Joining..." : "Join Challenge"}
            </button>
            {joinMessage && (
              <p className="text-xs text-muted mt-3 text-center">
                {joinMessage}
              </p>
            )}
            {!session && (
              <p className="text-xs text-muted mt-3 text-center">
                <Link href="/login" className="text-primary underline">
                  Log in
                </Link>{" "}
                to join and track this challenge.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold mb-6">
            Related challenges
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rc) => (
              <ChallengeCard key={rc._id} challenge={rc} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
