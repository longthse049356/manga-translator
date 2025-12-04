"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 animate-in fade-in slide-in-from-top-5 duration-500">
      <div className="mx-4 mt-4">
        <div className="mx-auto max-w-7xl">
          {/* Glass container */}
          <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-pink-500/5" />
            
            {/* Content */}
            <div className="relative flex items-center justify-between px-6 py-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50 transition-transform group-hover:scale-110">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    MangaAI
                  </h1>
                  <p className="text-xs text-cyan-200/60">
                    Translate instantly
                  </p>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href="#features" 
                  className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  Features
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  How It Works
                </Link>
                <Link 
                  href="/translate-tool" 
                  className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  Try Demo
                </Link>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-3">
                <Link href="/sign-in" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    className="gap-2 rounded-xl px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    className="gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/60"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

