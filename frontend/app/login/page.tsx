"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Mail,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ================= LEFT PANEL ================= */}

        <section className="relative hidden overflow-hidden bg-[#213145] lg:flex lg:flex-col lg:justify-between p-12 xl:p-16">

          {/* Background decoration */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-3 text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4338ca]">
              <Sparkles size={20} />
            </div>

            <span className="font-bold">
              AI Knowledge Assistant
            </span>
          </Link>

          {/* Product preview */}
          <div className="relative z-10 max-w-xl">

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-indigo-200">
              <Sparkles size={14} />
              Your knowledge, intelligently connected
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Welcome back to your{" "}
              <span className="text-indigo-300">
                knowledge.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/60">
              Continue exploring your documents, websites and
              conversations with an AI assistant built around your
              own knowledge.
            </p>

            {/* Mini application preview */}
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">

              <div className="flex items-center justify-between bg-[#323a4f] px-4 py-3">
                <span className="text-xs font-semibold text-white">
                  Knowledge Workspace
                </span>

                <span className="rounded-full bg-green-400/10 px-2 py-1 text-[9px] text-green-300">
                  Knowledge Base Active
                </span>
              </div>

              <div className="p-5">

                <div className="flex gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4338ca] text-white">
                    <Sparkles size={14} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#0b1c30]">
                      AI Knowledge Assistant
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#777586]">
                      Your knowledge base is ready. Ask questions
                      about your documents and websites.
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eff4ff] px-3 py-1.5 text-[10px] text-[#4338ca]">
                    24 Documents
                  </span>

                  <span className="rounded-full bg-[#eff4ff] px-3 py-1.5 text-[10px] text-[#4338ca]">
                    1,284 Chunks
                  </span>

                  <span className="rounded-full bg-[#eff4ff] px-3 py-1.5 text-[10px] text-[#4338ca]">
                    8 Websites
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom */}
          <p className="relative z-10 text-xs text-white/40">
            AI Knowledge Assistant © 2026
          </p>

        </section>


        {/* ================= RIGHT PANEL ================= */}

        <section className="flex min-h-screen items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <Link
              href="/"
              className="mb-12 flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4338ca] text-white">
                <Sparkles size={18} />
              </div>

              <span className="font-bold">
                AI Knowledge Assistant
              </span>
            </Link>


            {/* Back */}
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-[#777586] transition hover:text-[#4338ca]"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>


            {/* Heading */}

            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#777586]">
                Sign in to continue to your knowledge assistant.
              </p>
            </div>


            {/* Form */}

            <form
              className="mt-8 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();

                // Authentication will be connected later.
                console.log("Login submitted");
              }}
            >

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9997a7]"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-[#dcdcea] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-[#aaa8b7] focus:border-[#4338ca] focus:ring-4 focus:ring-indigo-100"
                  />

                </div>
              </div>


              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </label>

                  <a
                    href="#"
                    className="text-xs font-semibold text-[#4338ca] hover:text-[#2a14b4]"
                  >
                    Forgot password?
                  </a>

                </div>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9997a7]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="h-12 w-full rounded-xl border border-[#dcdcea] bg-white pl-10 pr-12 text-sm outline-none transition placeholder:text-[#aaa8b7] focus:border-[#4338ca] focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9997a7] hover:text-[#4338ca]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>


              {/* Remember */}

              <div className="flex items-center gap-2">

                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-[#4338ca]"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-[#777586]"
                >
                  Remember me
                </label>

              </div>


              {/* Login */}

              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#2a14b4] font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-[#4338ca] active:scale-[0.99]"
              >
                Sign In
              </button>

            </form>


            {/* Divider */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-[#e1e0e8]" />

              <span className="text-xs text-[#9997a7]">
                OR
              </span>

              <div className="h-px flex-1 bg-[#e1e0e8]" />

            </div>


            {/* Google */}

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#dcdcea] bg-white text-sm font-semibold transition hover:bg-[#f8f9ff]"
            >
              <span className="text-base font-bold">
                G
              </span>

              Continue with Google
            </button>


            {/* Signup */}

            <p className="mt-8 text-center text-sm text-[#777586]">

              Don't have an account?{" "}

              <Link
                href="/signup"
                className="font-semibold text-[#4338ca] hover:text-[#2a14b4]"
              >
                Create an account
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}