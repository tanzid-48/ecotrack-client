"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Sparkles, Loader2, TrendingUp, TrendingDown, Minus, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getActivities, logActivity, deleteActivity } from "@/lib/api/activities";
import { analyzeFootprint, getRecommendations } from "@/lib/api/ai";
import { getChallengesByIds } from "@/lib/api/challenges";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Activity } from "@/types";

const commuteTypes = ["car", "motorbike", "bus", "train", "bike", "walk"];
const dietTypes = ["vegan", "vegetarian", "mixed", "heavy-meat"];

function DashboardContent() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    commuteType: "car",
    commuteDistanceKm: "",
    electricityUsageKwh: "",
    dietType: "mixed",
    wasteKg: "",
  });

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  const logMutation = useMutation({
    mutationFn: () =>
      logActivity({
        date: form.date,
        commuteType: form.commuteType as Activity["commuteType"],
        commuteDistanceKm: Number(form.commuteDistanceKm) || 0,
        electricityUsageKwh: Number(form.electricityUsageKwh) || 0,
        dietType: form.dietType as Activity["dietType"],
        wasteKg: Number(form.wasteKg) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setForm((f) => ({ ...f, commuteDistanceKm: "", electricityUsageKwh: "", wasteKg: "" }));
      toast.success("Activity logged");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to log activity"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Log deleted");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete log"),
  });

  const analysisMutation = useMutation({
    mutationFn: analyzeFootprint,
    onError: (err: Error) => toast.error(err.message || "Failed to analyze footprint"),
  });
  const recommendMutation = useMutation({
    mutationFn: () => getRecommendations(),
    onError: (err: Error) => toast.error(err.message || "Failed to get recommendations"),
  });

  const recommendedIds = recommendMutation.data?.recommendedChallengeIds || [];
  const { data: recommendedChallenges, isLoading: loadingRecommended } = useQuery({
    queryKey: ["challenges", "recommended", recommendedIds],
    queryFn: () => getChallengesByIds(recommendedIds),
    enabled: recommendedIds.length > 0,
  });

  function handleDownloadReport() {
    const report = analysisMutation.data;
    if (!report) return;

    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("EcoTrack — Carbon Footprint Report", margin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
    y += 12;

    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Summary", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(report.summary, 170);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Key Figures", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const figures = [
      `Total footprint: ${report.totalFootprintKg} kg CO2`,
      `Average daily footprint: ${report.averageDailyKg} kg CO2`,
      `Trend: ${report.trend}`,
      `Biggest contributor: ${report.biggestContributor}`,
    ];
    figures.forEach((line) => {
      doc.text(`- ${line}`, margin, y);
      y += 6;
    });
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("AI Insights", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    report.insights.forEach((insight) => {
      const lines = doc.splitTextToSize(`- ${insight}`, 170);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
    });

    doc.save(`ecotrack-footprint-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("Report downloaded");
  }

  const chartData = (activities || [])
    .slice()
    .reverse()
    .map((a) => ({ date: a.date.slice(5), kg: a.carbonFootprintKg }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-semibold mb-2">Your Dashboard</h1>
      <p className="text-muted mb-10">Log today&apos;s habits and track your footprint over time.</p>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Log form */}
        <div className="lg:col-span-1 p-6 rounded-lg border border-border bg-card h-fit">
          <h2 className="font-display text-lg font-semibold mb-4">Log today</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              logMutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-medium block mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Commute type</label>
              <select
                value={form.commuteType}
                onChange={(e) => setForm({ ...form, commuteType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none capitalize"
              >
                {commuteTypes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Commute distance (km)</label>
              <input
                type="number"
                min={0}
                value={form.commuteDistanceKm}
                onChange={(e) => setForm({ ...form, commuteDistanceKm: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Electricity used (kWh)</label>
              <input
                type="number"
                min={0}
                value={form.electricityUsageKwh}
                onChange={(e) => setForm({ ...form, electricityUsageKwh: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Diet type</label>
              <select
                value={form.dietType}
                onChange={(e) => setForm({ ...form, dietType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none capitalize"
              >
                {dietTypes.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Waste generated (kg)</label>
              <input
                type="number"
                min={0}
                value={form.wasteKg}
                onChange={(e) => setForm({ ...form, wasteKg: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={logMutation.isPending}
              className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {logMutation.isPending ? "Saving..." : "Log activity"}
            </button>
          </form>
        </div>

        {/* Chart + history */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h2 className="font-display text-lg font-semibold mb-4">Footprint trend</h2>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : chartData.length === 0 ? (
              <p className="text-sm text-muted text-center py-16">
                No logs yet — add your first entry to see your trend.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" fontSize={12} stroke="var(--muted)" />
                  <YAxis fontSize={12} stroke="var(--muted)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="kg"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--primary)", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {activities && activities.length > 0 && (
            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="font-display text-lg font-semibold mb-4">Recent logs</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activities.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0"
                  >
                    <span className="text-muted">{a.date}</span>
                    <span className="capitalize">{a.commuteType} · {a.dietType}</span>
                    <span className="font-medium text-primary">{a.carbonFootprintKg}kg</span>
                    <button
                      onClick={() => deleteMutation.mutate(a._id)}
                      className="p-1.5 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Features */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Data Analyzer */}
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" /> AI Footprint Analysis
            </h2>
          </div>
          <button
            onClick={() => analysisMutation.mutate()}
            disabled={analysisMutation.isPending}
            className="w-full mb-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-60"
          >
            {analysisMutation.isPending ? "Analyzing..." : "Analyze my footprint"}
          </button>

          {analysisMutation.isError && (
            <p className="text-sm text-red-600">{(analysisMutation.error as Error).message}</p>
          )}

          {analysisMutation.data && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 font-medium">
                {analysisMutation.data.trend === "increasing" && <TrendingUp className="w-4 h-4 text-red-600" />}
                {analysisMutation.data.trend === "decreasing" && <TrendingDown className="w-4 h-4 text-primary" />}
                {analysisMutation.data.trend === "stable" && <Minus className="w-4 h-4 text-muted" />}
                Trend: <span className="capitalize">{analysisMutation.data.trend}</span>
              </div>
              <p className="text-muted">
                Total: <b className="text-foreground">{analysisMutation.data.totalFootprintKg}kg</b> ·
                {" "}Avg/day: <b className="text-foreground">{analysisMutation.data.averageDailyKg}kg</b>
              </p>
              <p className="text-muted">
                Biggest contributor:{" "}
                <b className="text-foreground capitalize">{analysisMutation.data.biggestContributor}</b>
              </p>
              <p>{analysisMutation.data.summary}</p>
              <ul className="list-disc list-inside space-y-1 text-muted">
                {analysisMutation.data.insights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
              <button
                onClick={handleDownloadReport}
                className="w-full mt-2 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download report (PDF)
              </button>
            </div>
          )}
        </div>

        {/* AI Recommendation Engine */}
        <div className="p-6 rounded-lg border border-border bg-card">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Personalized Recommendations
          </h2>
          <button
            onClick={() => recommendMutation.mutate()}
            disabled={recommendMutation.isPending}
            className="w-full mb-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-60"
          >
            {recommendMutation.isPending ? "Thinking..." : "Get recommendations"}
          </button>

          {recommendMutation.isError && (
            <p className="text-sm text-red-600">{(recommendMutation.error as Error).message}</p>
          )}

          {recommendMutation.data && (
            <div className="space-y-3 text-sm">
              <ul className="list-disc list-inside space-y-1.5">
                {recommendMutation.data.personalizedTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
              <p className="text-muted italic pt-2 border-t border-border">
                {recommendMutation.data.reasoning}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended challenge cards */}
      {recommendedIds.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold mb-4">
            Challenges matched to you
          </h2>
          {loadingRecommended ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : recommendedChallenges && recommendedChallenges.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedChallenges.map((c) => (
                <ChallengeCard key={c._id} challenge={c} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              The suggested challenges couldn&apos;t be loaded right now.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
