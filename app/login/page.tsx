"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("❌ Please enter your email.");
      return;
    }

    if (!password) {
      alert("❌ Please enter your password.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Invalid email or password"
        );
      }

      localStorage.setItem(
        "customerLoggedIn",
        "true"
      );

      localStorage.setItem(
        "customer",
        JSON.stringify(data.user)
      );

      alert("✅ Login successful!");

      router.push("/");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Login failed."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-red-600">
            🔐 Customer Login
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your iPhone Lab account
          </p>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>

            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
            />

          </div>

          {/* Password */}
          <div>

            <label className="block font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
            />

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition"
          >
            {saving
              ? "Logging in..."
              : "🔐 Login"}
          </button>

        </form>

        {/* Signup */}
        <div className="text-center mt-6">

          <p className="text-gray-500">
            Don't have an account?
          </p>

          <Link
            href="/signup"
            className="text-red-600 font-semibold hover:underline"
          >
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}