"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { GradientBackground } from "@/components/translate-tool";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Zap,
  Globe,
  Upload,
  Eye,
  CheckCircle2,
  ArrowRight,
  Github,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Aurora Gradient Background */}
      <GradientBackground />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-4 pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-200">
                  Powered by Gemini AI
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                Break Language{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Barriers
                </span>{" "}
                with AI
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-cyan-100/80 md:text-xl">
                Instantly translate manga and comics into Vietnamese with
                context-aware AI. Seamless, gapless, and immersive reading
                experience.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/translate-tool">
                  <Button
                    className="gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-6 text-lg font-semibold text-white shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-cyan-500/60"
                  >
                    <Zap className="h-5 w-5" />
                    Start Translating Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-6 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/10"
                  onClick={() =>
                    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Eye className="h-5 w-5" />
                  View Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-slate-950 bg-gradient-to-br from-cyan-400 to-purple-500"
                    />
                  ))}
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-semibold text-white">1,000+</span> pages
                  translated daily
                </div>
              </div>
            </div>

            {/* Right: Visual Demo */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
              {/* Floating glass card with comparison */}
              <div className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-20 blur-3xl transition-opacity group-hover:opacity-30" />

                {/* Glass card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl transform rotate-2 transition-transform hover:rotate-0">
                  <div className="space-y-4">
                    {/* Before/After labels */}
                    <div className="flex justify-between text-sm font-semibold text-white">
                      <span className="rounded-lg bg-red-500/20 px-3 py-1">
                        Before
                      </span>
                      <ArrowRight className="h-5 w-5 text-cyan-400" />
                      <span className="rounded-lg bg-green-500/20 px-3 py-1">
                        After
                      </span>
                    </div>

                    {/* Mock comparison boxes */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 flex items-center justify-center">
                        <span className="text-4xl">🗾</span>
                      </div>
                      <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-600 p-4 flex items-center justify-center">
                        <span className="text-4xl">🇻🇳</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-around border-t border-white/10 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">
                          &lt;2s
                        </div>
                        <div className="text-xs text-white/60">
                          Per page
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          98%
                        </div>
                        <div className="text-xs text-white/60">
                          Accuracy
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid (Bento Style) */}
        <section id="features" className="container mx-auto max-w-7xl px-4 py-20">
          <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                MangaAI
              </span>
            </h2>
            <p className="text-lg text-cyan-100/70">
              Built for creators, readers, and translators
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 md:col-span-2">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="relative space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Smart Context Awareness
                </h3>
                <p className="text-cyan-100/70">
                  Gemini AI understands manga context, preserving character
                  names, sound effects, and cultural nuances in translation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="relative space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Gapless Reader
                </h3>
                <p className="text-cyan-100/70">
                  Zero gaps between images. Smooth vertical scrolling for an
                  immersive manga reading experience.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="relative space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/50">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Batch Processing
                </h3>
                <p className="text-cyan-100/70">
                  Translate entire chapters at once. Process up to 10 images
                  simultaneously with parallel AI processing.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 md:col-span-2">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="relative space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-600 shadow-lg shadow-orange-500/50">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Compare Mode
                </h3>
                <p className="text-cyan-100/70">
                  Slide between original and translated versions in real-time.
                  Perfect for learning or quality checking translations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="container mx-auto max-w-5xl px-4 py-20">
          <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              How It Works
            </h2>
            <p className="text-lg text-cyan-100/70">
              Three simple steps to translated manga
            </p>
          </div>

          <div className="relative space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {/* Connecting Line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-30 hidden md:block" />

            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row gap-6 items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/50 z-10">
                1
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-2xl font-bold text-white">
                    Upload Your Manga
                  </h3>
                </div>
                <p className="text-cyan-100/70">
                  Drag & drop your manga pages, or paste a MangaDex chapter URL
                  to import all pages instantly.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row gap-6 items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-purple-500/50 z-10">
                2
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">
                    AI Translation Magic
                  </h3>
                </div>
                <p className="text-cyan-100/70">
                  Our Gemini AI analyzes context, detects text, and translates
                  into natural Vietnamese in under 2 seconds per page.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row gap-6 items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-2xl font-bold text-white shadow-lg shadow-pink-500/50 z-10">
                3
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-pink-400" />
                  <h3 className="text-2xl font-bold text-white">
                    Read & Enjoy
                  </h3>
                </div>
                <p className="text-cyan-100/70">
                  Switch to Reader Mode for an immersive, gapless reading
                  experience. Compare original and translated versions anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link href="/translate-tool">
              <Button
                className="gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 px-12 py-6 text-lg font-semibold text-white shadow-2xl shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-purple-500/60"
              >
                <CheckCircle2 className="h-5 w-5" />
                Start Your First Translation
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto max-w-7xl px-4 py-12">
          <div className="rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">MangaAI</h3>
                  <p className="text-xs text-white/50">
                    Powered by Gemini AI
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-6 text-sm text-white/70">
                <Link href="#features" className="hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
                <Link href="/translate-tool" className="hover:text-white transition-colors">
                  Try Demo
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-white/50">
              © 2025 MangaAI. Built with Next.js & Gemini AI.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
