"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await signIn.email({ email, password });
    setLoading(false);
    if (signInError) {
      const message = signInError.message || "Invalid email or password.";
      setError(message);
      toast.error(message);
      return;
    }
    toast.success("Logged in successfully");
    router.push("/dashboard");
  }

  function handleDemoLogin() {
    setEmail("demo@ecotrack.app");
    setPassword("demo1234");
    toast.info("Demo credentials filled — click Log in");
  }

  async function handleGoogleLogin() {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-3">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted mt-1">Log in to your EcoTrack account</p>
        </div>

        <div className="p-6 sm:p-8 rounded-lg border border-border bg-card">
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full mb-4 py-2.5 rounded-lg border border-dashed border-primary text-primary text-sm font-medium hover:bg-primary-light transition-colors"
          >
            Use demo credentials
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-11 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-2.5 rounded-lg border border-border flex items-center justify-center gap-2.5 text-sm font-medium hover:bg-primary-light transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path fill="#4285F4" d="M23.5 12.27c0-.85-.07-1.47-.22-2.12H12v3.85h6.5c-.13 1.06-.84 2.66-2.42 3.73l-.02.15 3.51 2.72.24.02c2.23-2.06 3.52-5.09 3.52-8.35Z" />
              <path fill="#34A853" d="M12 24c3.18 0 5.85-1.05 7.8-2.85l-3.72-2.89c-1 .69-2.34 1.17-4.08 1.17-3.12 0-5.77-2.06-6.71-4.9l-.14.01-3.66 2.84-.05.13C3.34 21.3 7.34 24 12 24Z" />
              <path fill="#FBBC05" d="M5.29 14.53c-.25-.74-.39-1.53-.39-2.53s.14-1.79.38-2.53l-.01-.15-3.71-2.88-.12.06A12 12 0 0 0 0 12c0 1.93.47 3.75 1.29 5.53l4-3Z" />
              <path fill="#EA4335" d="M12 4.75c2.21 0 3.7.95 4.55 1.75l3.32-3.24C17.83 1.19 15.18 0 12 0 7.34 0 3.34 2.7 1.29 6.47l4 3.1C6.23 6.81 8.88 4.75 12 4.75Z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
