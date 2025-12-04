"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GradientBackground } from "@/components/translate-tool";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, Lock, User, Github, Chrome, ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock registration - redirect to translate tool after 1 second
    setTimeout(() => {
      router.push("/translate-tool");
    }, 1000);
  };

  const handleSocialSignup = (provider: string) => {
    setIsLoading(true);
    // Mock social auth
    setTimeout(() => {
      router.push("/translate-tool");
    }, 1000);
  };

  return (
    <>
      <GradientBackground />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        {/* Back to Home */}
        <Link
          href="/"
          className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Auth Card */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />

            {/* Content */}
            <div className="relative space-y-8">
              {/* Logo & Title */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  Create Account
                </h1>
                <p className="mt-2 text-sm text-cyan-200/70">
                  Start translating manga with AI
                </p>
              </div>

              {/* Social Signup */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleSocialSignup("google")}
                  disabled={isLoading}
                  className="w-full gap-2 rounded-xl border border-white/20 bg-white/5 py-6 font-semibold text-white hover:bg-white/10"
                  variant="ghost"
                >
                  <Chrome className="h-5 w-5" />
                  Continue with Google
                </Button>
                <Button
                  onClick={() => handleSocialSignup("github")}
                  disabled={isLoading}
                  className="w-full gap-2 rounded-xl border border-white/20 bg-white/5 py-6 font-semibold text-white hover:bg-white/10"
                  variant="ghost"
                >
                  <Github className="h-5 w-5" />
                  Continue with GitHub
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-950 px-2 text-white/50">
                    Or sign up with email
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 rounded-xl border-white/20 bg-white/5 pl-10 text-white placeholder:text-white/40 focus-visible:ring-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl border-white/20 bg-white/5 pl-10 text-white placeholder:text-white/40 focus-visible:ring-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-12 rounded-xl border-white/20 bg-white/5 pl-10 text-white placeholder:text-white/40 focus-visible:ring-cyan-500/50"
                    />
                  </div>
                  <p className="text-xs text-white/50">
                    Must be at least 8 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 py-6 text-lg font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/60 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-xs text-center text-white/50">
                  By signing up, you agree to our{" "}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300">
                    Privacy Policy
                  </a>
                </p>
              </form>

              {/* Sign In Link */}
              <div className="text-center text-sm text-white/70">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

