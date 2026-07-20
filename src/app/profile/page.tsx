"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, Mail, Calendar, Leaf, Flame, TrendingDown } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { getActivities } from "@/lib/api/activities";
import { getMyChallenges, getJoinedChallenges } from "@/lib/api/challenges";
import { ChallengeCard, ChallengeCardSkeleton } from "@/components/challenges/ChallengeCard";

function ProfileContent() {
  const { data: session } = useSession();

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  const { data: myChallenges, isLoading: loadingMine } = useQuery({
    queryKey: ["challenges", "mine"],
    queryFn: getMyChallenges,
  });

  const { data: joinedChallenges, isLoading: loadingJoined } = useQuery({
    queryKey: ["challenges", "joined"],
    queryFn: getJoinedChallenges,
  });

  const totalFootprint =
    activities?.reduce((sum, a) => sum + a.carbonFootprintKg, 0) ?? 0;
  const avgDaily =
    activities && activities.length > 0
      ? Math.round((totalFootprint / activities.length) * 10) / 10
      : 0;

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const joinDate = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
        <div className="w-20 h-20 rounded-full bg-primary text-white text-2xl font-semibold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">
            {session?.user?.name || "Your Profile"}
          </h1>
          <p className="text-sm text-muted flex items-center justify-center sm:justify-start gap-1.5 mb-1">
            <Mail className="w-3.5 h-3.5" /> {session?.user?.email}
          </p>
          {joinDate && (
            <p className="text-sm text-muted flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Joined {joinDate}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        <div className="p-5 rounded-lg border border-border bg-card text-center">
          <Flame className="w-5 h-5 text-accent mx-auto mb-2" />
          <p className="font-display text-2xl font-semibold">
            {loadingActivities ? "…" : activities?.length ?? 0}
          </p>
          <p className="text-xs text-muted mt-1">Activities logged</p>
        </div>
        <div className="p-5 rounded-lg border border-border bg-card text-center">
          <TrendingDown className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="font-display text-2xl font-semibold">
            {loadingActivities ? "…" : `${Math.round(totalFootprint)}kg`}
          </p>
          <p className="text-xs text-muted mt-1">Total footprint</p>
        </div>
        <div className="p-5 rounded-lg border border-border bg-card text-center">
          <Leaf className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="font-display text-2xl font-semibold">
            {loadingActivities ? "…" : `${avgDaily}kg`}
          </p>
          <p className="text-xs text-muted mt-1">Avg. daily footprint</p>
        </div>
        <div className="p-5 rounded-lg border border-border bg-card text-center">
          <Leaf className="w-5 h-5 text-accent mx-auto mb-2" />
          <p className="font-display text-2xl font-semibold">
            {loadingJoined ? "…" : joinedChallenges?.length ?? 0}
          </p>
          <p className="text-xs text-muted mt-1">Challenges joined</p>
        </div>
      </div>

      {/* Joined Challenges */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">Challenges you&apos;ve joined</h2>
          <Link href="/challenges" className="text-sm text-primary font-medium">
            Explore more →
          </Link>
        </div>
        {loadingJoined ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ChallengeCardSkeleton key={i} />
            ))}
          </div>
        ) : joinedChallenges && joinedChallenges.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedChallenges.map((c) => (
              <ChallengeCard key={c._id} challenge={c} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted p-6 rounded-lg border border-dashed border-border text-center">
            You haven&apos;t joined any challenges yet.
          </p>
        )}
      </section>

      {/* My Published Challenges */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">Your published challenges</h2>
          <Link href="/challenges/manage" className="text-sm text-primary font-medium">
            Manage →
          </Link>
        </div>
        {loadingMine ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : myChallenges && myChallenges.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myChallenges.map((c) => (
              <ChallengeCard key={c._id} challenge={c} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted p-6 rounded-lg border border-dashed border-border text-center">
            You haven&apos;t published any challenges yet.{" "}
            <Link href="/challenges/add" className="text-primary font-medium">
              Add one →
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
