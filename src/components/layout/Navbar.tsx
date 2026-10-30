"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, LayoutDashboard, LogOut, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ScrollProgressBar } from "@/components/ui/PageMotion";

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={`w-8 h-8 ${className}`} />;
  return (
    <motion.button
      whileHover={{ rotate: 15, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`p-2 rounded-full hover:bg-foreground/10 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections", startsWith: true },
  { href: "/about", label: "About Us" },
  { href: "/careers", label: "Careers", startsWith: true },
];

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 20);
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") setIsDropdownOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDropdownOpen, handleEscape]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const firstName = session?.user?.name?.split(" ")[0];

  const isActive = (href: string, startsWith?: boolean) =>
    startsWith ? pathname.startsWith(href) : pathname === href;

  return (
    <>
      <ScrollProgressBar />
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-card-border"
            : "bg-background/85 backdrop-blur-md border-b border-card-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/" className="text-xl tracking-widest uppercase font-semibold">
                  HR Fashion
                </Link>
              </motion.div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center text-sm font-medium tracking-wide">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href, link.startsWith);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 nav-link-animated transition-colors duration-200 ${
                      active ? "text-accent font-semibold active" : "hover:text-accent"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center space-x-2 text-sm">
              <ThemeToggle />
              {session ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 pl-1 pr-3 py-1 rounded-full bg-card border border-card-border focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden text-xs font-medium uppercase">
                      {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{session.user.name?.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">{firstName}</span>
                  </motion.button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                        className="absolute right-0 mt-2 w-56 origin-top-right z-50 pt-2"
                      >
                        <div className="py-2 bg-card border border-card-border rounded-sm shadow-xl">
                          <div className="px-4 py-3 border-b border-card-border">
                            <p className="text-sm font-medium text-foreground truncate">{session.user.name}</p>
                            <p className="text-xs text-muted truncate">{session.user.email}</p>
                          </div>
                          <div className="py-1">
                            {session.user.role === "admin" ? (
                              <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-foreground/5 hover:text-foreground transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                Admin
                              </Link>
                            ) : (
                              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-foreground/5 hover:text-foreground transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                              </Link>
                            )}
                          </div>
                          <div className="py-1 border-t border-card-border">
                            <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                              <LogOut className="w-4 h-4" />
                              Log Out
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4 ml-2">
                  <Link href="/login" className="hover:text-accent transition-colors text-sm font-medium">
                    Login
                  </Link>
                  <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/register"
                      className="btn-shimmer px-4 py-2 bg-accent text-pure-white text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors"
                    >
                      Register
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-1">
              <ThemeToggle />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="p-2 text-foreground"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-6 h-6" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-6 h-6" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden border-t border-card-border bg-background overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(link.href, link.startsWith);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                    >
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        className={`block py-3 text-lg border-b border-card-border/50 ${active ? "text-accent font-semibold" : "text-foreground"}`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="pt-4 border-t border-card-border flex flex-col gap-4 mt-2">
                  {session ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center text-xl font-medium uppercase overflow-hidden border border-card-border">
                          {session.user.image ? (
                            <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{session.user.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">{firstName}</p>
                          <p className="text-sm text-muted">{session.user.email}</p>
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-3">
                        {session.user.role === "admin" ? (
                          <Link href="/admin" onClick={toggleMenu} className="flex items-center justify-center gap-2 w-full py-3 bg-card border border-card-border rounded-sm font-medium">
                            <LayoutDashboard className="w-4 h-4" />
                            Admin
                          </Link>
                        ) : (
                          <Link href="/dashboard" onClick={toggleMenu} className="flex items-center justify-center gap-2 w-full py-3 bg-card border border-card-border rounded-sm font-medium">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                        )}
                        <button onClick={() => { toggleMenu(); handleSignOut(); }} className="flex items-center justify-center gap-2 w-full py-3 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 pt-2">
                      <Link href="/login" onClick={toggleMenu} className="flex-1 text-center py-3 border border-card-border rounded-sm">Login</Link>
                      <Link href="/register" onClick={toggleMenu} className="flex-1 text-center py-3 bg-accent text-pure-white rounded-sm font-medium">Register</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
