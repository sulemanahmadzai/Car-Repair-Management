"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions";
import { ActionState } from "@/lib/auth/middleware";
import { Card, CardContent } from "@/components/ui/card";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === "signin" ? signIn : signUp,
    { error: "" }
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 opacity-30 animate-gradient"></div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="redirect" value={redirect || ""} />
            <input type="hidden" name="priceId" value={priceId || ""} />
            <input type="hidden" name="inviteId" value={inviteId || ""} />

            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-foreground mb-2 inline-block"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                className="h-11"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-foreground mb-2 inline-block"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                className="h-11"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me & Forgot Password (Sign In Only) */}
            {mode === "signin" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    Remember this Device
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Error Message */}
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Loading...
                </>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          {/* Switch Mode Link */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">
              {mode === "signin"
                ? "New to Modernize?"
                : "Already have an Account?"}
            </span>
            <Link
              href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                redirect ? `?redirect=${redirect}` : ""
              }${priceId ? `&priceId=${priceId}` : ""}`}
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              {mode === "signin" ? "Create an account" : "Sign In"}
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Gradient Animation CSS */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
