"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Zap, Utensils, Trash2, Droplet, Star, Users } from "lucide-react";
import { Challenge } from "@/types";

const categoryIcons = {
  energy: Zap,
  transport: Leaf,
  food: Utensils,
  waste: Trash2,
  water: Droplet,
};

const difficultyStyles = {
  easy: "bg-primary-light text-primary-dark",
  medium: "bg-accent-light text-accent",
  hard: "bg-red-50 text-red-700",
};

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const Icon = categoryIcons[challenge.category] || Leaf;
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/challenges/${challenge._id}`}
      className="group flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative w-full aspect-[4/3] bg-primary-light overflow-hidden">
        {challenge.imageUrl && !imgError ? (
          <Image
            src={challenge.imageUrl}
            alt={challenge.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary/40" />
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${difficultyStyles[challenge.difficulty]}`}
        >
          {challenge.difficulty}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-2 capitalize">
          <Icon className="w-3.5 h-3.5" />
          {challenge.category}
        </div>
        <h3 className="font-display font-semibold text-base text-foreground mb-1.5 line-clamp-2">
          {challenge.title}
        </h3>
        <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
          {challenge.shortDescription}
        </p>

        <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-border">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            {challenge.rating || "New"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {challenge.participantsCount}
          </span>
          <span className="font-medium text-primary">
            -{challenge.impactScore}kg CO₂/mo
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ChallengeCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-border" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 w-16 bg-border rounded" />
        <div className="h-4 w-3/4 bg-border rounded" />
        <div className="h-3 w-full bg-border rounded" />
        <div className="h-3 w-2/3 bg-border rounded" />
      </div>
    </div>
  );
}
