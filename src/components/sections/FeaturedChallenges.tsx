"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "@/lib/api/challenges";
import { ChallengeCard, ChallengeCardSkeleton } from "@/components/challenges/ChallengeCard";
import { ArrowRight } from "lucide-react";

export function FeaturedChallenges() {
  const { data, isLoading } = useQuery({
    queryKey: ["challenges", "featured"],
    queryFn: () => getChallenges({ sort: "impact", limit: 4 }),
  });

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
              Featured challenges
            </h2>
            <p className="text-muted">
              The highest-impact actions the community is taking right now.
            </p>
          </div>
          <Link
            href="/challenges"
            className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:gap-2.5 transition-all shrink-0"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ChallengeCardSkeleton key={i} />
              ))
            : data?.items.map((challenge) => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
          {!isLoading && data?.items.length === 0 && (
            <p className="col-span-full text-center text-muted py-12">
              No challenges yet — be the first to add one.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
