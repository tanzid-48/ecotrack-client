"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import { clearAuthToken } from "@/lib/api/client";

const loggedOutLinks = [
  { href: "/", label: "Home" },
  { href: "/challenges", label: "Explore" },
  { href: "/about", label: "About" },
];

const loggedInLinks = [
  { href: "/", label: "Home" },
  { href: "/challenges", label: "Explore" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/challenges/add", label: "Add Challenge" },
  { href: "/challenges/manage", label: "Manage" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const links = session ? loggedInLinks : loggedOutLinks;

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe theme icon (next-themes standard pattern)
  useEffect(() => setMounted(true), []);

  // Close mobile menu on ANY route change — covers link clicks, redirects
  // after form submits, back/forward nav, programmatic router.push, etc.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing menu state with external router state
    setOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    clearAuthToken();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-semibold text-lg text-foreground">
            EcoTrack
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-primary bg-primary-light"
                  : "text-foreground/70 hover:text-primary hover:bg-primary-light"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-primary-light transition-colors"
            aria-label="Toggle dark mode"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          {session ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-primary-light transition-colors"
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <button
            className="p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-primary-light"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {session ? (
            <button
              onClick={handleSignOut}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium border border-border"
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white text-center"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
