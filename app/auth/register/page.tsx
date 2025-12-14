"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconEye, IconEyeOff } from "@/components/icons";

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to create account");
      } else {
        router.replace(data.redirectTo ?? "/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fef7f5] px-4 py-12 text-[#1f1e2a]">
      <div className="w-full max-w-md rounded-3xl border border-[#1f1e2a]/10 bg-white px-8 py-10 shadow-lg">
        <h1 className="text-3xl font-semibold">Create your Myreliq</h1>
        <p className="mt-2 text-sm text-[#5d5b66]">
          Build a proof-of-work profile powered by Solana.
        </p>
        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">First name</label>
              <input
                className="mt-1 w-full rounded-2xl border border-[#1f1e2a]/15 px-4 py-3"
                placeholder="Ada"
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Last name</label>
              <input
                className="mt-1 w-full rounded-2xl border border-[#1f1e2a]/15 px-4 py-3"
                placeholder="Bello"
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-2xl border border-[#1f1e2a]/15 px-4 py-3"
              placeholder="you@mail.com"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full rounded-2xl border border-[#1f1e2a]/15 px-4 py-3 pr-10"
                placeholder="At least 8 characters"
                required
                minLength={8}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-[40%] text-[#1f1e2a]/40 hover:text-[#1f1e2a]"
              >
                {showPassword ? (
                  <IconEyeOff className="h-5 w-5" />
                ) : (
                  <IconEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-[#ff4521] py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,69,33,0.35)]"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#5d5b66]">
          Already have an account?{" "}
          <a className="font-semibold text-[#ff4521]" href="/auth/login">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
