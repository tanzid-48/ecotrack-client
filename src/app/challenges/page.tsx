"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getChallenges } from "@/lib/api/challenges";
import {
  ChallengeCard,
  ChallengeCardSkeleton,
} from "@/components/challenges/ChallengeCard";

const categories = ["energy", "transport", "food", "waste", "water"];
const difficulties = ["easy", "medium", "hard"];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "impact", label: "Highest impact" },
  { value: "rating", label: "Top rated" },
];

export default function ChallengesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["challenges", { search, category, difficulty, sort, page }],
    queryFn: () =>
      getChallenges({ search, category, difficulty, sort, page, limit: 8 }),
  });

  const resetPage = () => setPage(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">
          Explore challenges
        </h1>
        <p className="text-muted">
          Find a sustainability challenge that fits your lifestyle.
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Search challenges..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            resetPage();
          }}
          className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <FilterPill
          label="All categories"
          active={category === ""}
          onClick={() => {
            setCategory("");
            resetPage();
          }}
        />
        {categories.map((c) => (
          <FilterPill
            key={c}
            label={c}
            active={category === c}
            onClick={() => {
              setCategory(c);
              resetPage();
            }}
          />
        ))}
        <div className="w-px bg-border mx-1" />
        <FilterPill
          label="Any difficulty"
          active={difficulty === ""}
          onClick={() => {
            setDifficulty("");
            resetPage();
          }}
        />
        {difficulties.map((d) => (
          <FilterPill
            key={d}
            label={d}
            active={difficulty === d}
            onClick={() => {
              setDifficulty(d);
              resetPage();
            }}
          />
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ChallengeCardSkeleton key={i} />
            ))
          : data?.items.map((challenge) => (
              <ChallengeCard key={challenge._id} challenge={challenge} />
            ))}
      </div>

      {!isLoading && data?.items.length === 0 && (
        <p className="text-center text-muted py-16">
          No challenges match your filters. Try broadening your search.
        </p>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-40 hover:bg-primary-light transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted px-3">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(data.pagination.totalPages, p + 1))
            }
            disabled={page === data.pagination.totalPages}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-40 hover:bg-primary-light transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize border transition-colors ${
        active
          ? "bg-primary text-white border-primary"
          : "border-border text-foreground/70 hover:border-primary"
      }`}
    >
      {label}
    </button>
  );
}
