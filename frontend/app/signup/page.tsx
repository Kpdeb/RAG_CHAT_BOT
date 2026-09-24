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
  User,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ================= LEFT PANEL ================= */}

        <section className="relative hidden overflow-hidden bg-[#213145] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">

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


          {/* Main content */}

          <div className="relative z-10 max-w-xl">

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-indigo-200">
              <Sparkles size={14} />
              Build your personal AI knowledge base
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Your knowledge.
              <br />

              <span className="text-indigo-300">
                Your AI assistant.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/60">
              Create an account and start connecting your documents,
              websites and knowledge into one intelligent workspace.
            </p>


            {/* Benefits */}

            <div className="mt-10 space-y-5">

              <Benefit
                title="Connect your knowledge"
                text="Upload documents and add websites to your knowledge base."
              />

              <Benefit
                title="Ask questions naturally"
                text="Search your knowledge using conversational questions."
              />

              <Benefit
                title="Keep your conversations"
                text="Return to previous conversations whenever you need them."
              />

            </div>

          </div>


          {/* Footer */}

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
              className="mb-10 flex items-center gap-3 lg:hidden"
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
              className="mb-7 inline-flex items-center gap-2 text-sm text-[#777586] transition hover:text-[#4338ca]"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>


            {/* Heading */}

            <div>

              <h2 className="text-3xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#777586]">
                Start building your AI-powered knowledge workspace.
              </p>

            </div>


            {/* Form */}

            <form
              className="mt-7 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();

                // Authentication will be connected later.
                console.log("Signup submitted");
              }}
            >

              {/* Name */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9997a7]"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="h-11 w-full rounded-xl border border-[#dcdcea] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-[#aaa8b7] focus:border-[#4338ca] focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </div>


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
                    className="h-11 w-full rounded-xl border border-[#dcdcea] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-[#aaa8b7] focus:border-[#4338ca] focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </div>


              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9997a7]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    required
                    className="h-11 w-full rounded-xl border border-[#dcdcea] bg-white pl-10 pr-12 text-sm outline-none transition placeholder:text-[#aaa8b7] focus:border-[#4338ca] focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9997a7] hover:text-[#4338ca]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* Confirm password */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold"
                >
                  Confirm password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9997a7]"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    required
                    className="h-11 w-full rounded-xl border border-[#dcdcea] bg-white pl-10 pr-12 text-sm outline-none transition placeholder:text-[#aaa8b7] focus:border-[#4338ca] focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9997a7] hover:text-[#4338ca]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* Terms */}

              <div className="flex items-start gap-2 pt-1">

                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#4338ca]"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-[#777586]"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-semibold text-[#4338ca]"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-semibold text-[#4338ca]"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>

              </div>


              {/* Create account */}

              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#2a14b4] font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-[#4338ca] active:scale-[0.99]"
              >
                Create Account
              </button>

            </form>


            {/* Divider */}

            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-[#e1e0e8]" />

              <span className="text-xs text-[#9997a7]">
                OR
              </span>

              <div className="h-px flex-1 bg-[#e1e0e8]" />

            </div>


            {/* Google */}

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-[#dcdcea] bg-white text-sm font-semibold transition hover:bg-[#f8f9ff]"
            >
              <span className="text-base font-bold">
                G
              </span>

              Continue with Google
            </button>


            {/* Login */}

            <p className="mt-7 text-center text-sm text-[#777586]">

              Already have an account?{" "}

              <Link
                href="/login"
                className="font-semibold text-[#4338ca] hover:text-[#2a14b4]"
              >
                Sign in
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}


/* ================= BENEFIT COMPONENT ================= */

function Benefit({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">

      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-400/10 text-indigo-300">
        <CheckCircle2 size={16} />
      </div>

      <div>

        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/50">
          {text}
        </p>

      </div>

    </div>
  );
}