"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("❌ Please enter admin email.");
      return;
    }

    if (!password) {
      alert("❌ Please enter admin password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Invalid admin email or password"
        );
      }

      alert("✅ Admin login successful!");

      // Full navigation so the new HttpOnly
      // cookie is included in the next request.
      window.location.href = "/admin";
    } catch (error) {
      console.error("Admin login error:", error);

      alert(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Admin login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}

        <div className="text-center mb-8">

          <div className="text-6xl mb-4">
            🛠️
          </div>

          <h1 className="text-3xl font-bold text-red-600">
            iPhone Lab
          </h1>

          <p className="text-gray-500 mt-2">
            Admin Panel Login
          </p>

        </div>

        {/* Login Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          {/* Email */}

          <div>

            <label className="block font-semibold mb-2">
              Admin Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              autoComplete="username"
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
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              autoComplete="current-password"
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
            />

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition"
          >
            {loading
              ? "Logging in..."
              : "🔐 Login to Admin Panel"}
          </button>

        </form>

        {/* Security Notice */}

        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">

          <p className="text-sm text-green-800 font-semibold">
            🔒 Secure Admin Login
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Admin authentication is protected
            using a secure HttpOnly session.
          </p>

        </div>

      </div>

    </main>
  );
}