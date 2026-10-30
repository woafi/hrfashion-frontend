"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, authClient } from "@/lib/auth-client";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleDemoFill = () => {
    setEmail(process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@hrfashion.com");
    setPassword(process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo1234!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn.email({ email, password });
      
      if (error) {
        toast.error(error.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      toast.success("Successfully logged in");
      
      await authClient.getSession({
        fetchOptions: { cache: "no-store" }
      });
      const targetUrl = callbackUrl || "/";
      
      router.push(targetUrl);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signIn.social({ provider: "google", callbackURL: callbackUrl || "/" });
      if (error) {
        toast.error(error.message || "Failed to sign in with Google");
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-12">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-accent blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-accent blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-md w-full bg-card rounded-2xl border border-card-border shadow-2xl p-8 relative overflow-hidden"
      >
        {/* Card top accent */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4 border border-accent/30 px-4 py-1.5 rounded-full"
          >
            Welcome Back
          </motion.div>
          <h1 className="text-3xl font-serif mb-2">Sign In</h1>
          <p className="text-muted text-sm">Access your HR Fashion account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted">Email Address</label>
            <motion.input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.01 }}
              className="input-focus-ring w-full px-4 py-3 bg-background border border-card-border rounded-sm text-sm"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-widest font-medium text-muted">Password</label>
              <Link href="#" className="text-xs text-muted hover:text-foreground underline underline-offset-4 transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus={{ scale: 1.01 }}
                className="input-focus-ring w-full px-4 py-3 bg-background border border-card-border rounded-sm text-sm pr-10"
                placeholder="••••••••"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {showPassword ? (
                    <motion.span key="off" initial={{ opacity: 0, rotate: 10 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                      <EyeOff className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <motion.span key="on" initial={{ opacity: 0, rotate: -10 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                      <Eye className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="btn-shimmer w-full py-3.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </motion.button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-card px-4 text-muted">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 border border-card-border text-sm font-medium rounded-sm hover:bg-background transition-colors flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60 cursor-pointer"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleDemoFill}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 border border-card-border text-sm font-medium rounded-sm hover:bg-background hover:border-accent/40 transition-colors cursor-pointer"
          >
            ✨ Use Demo Account
          </motion.button>
        </div>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-foreground hover:text-accent underline underline-offset-4 transition-colors font-medium">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
