"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    // Temporary Admin Login
    if (
      email === "admin@iphonelab.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("adminLoggedIn", "true");

      router.push("/admin");
    } else {
      alert("❌ Invalid Admin Email or Password");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo / Title */}
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
              placeholder="admin@iphonelab.com"
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
              placeholder="Enter admin password"
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
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition"
          >
            {loading
              ? "Logging in..."
              : "🔐 Login to Admin Panel"}
          </button>

        </form>

        {/* Temporary Login Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">

          <p className="text-sm text-yellow-800 font-semibold mb-2">
            Temporary Login
          </p>

          <p className="text-sm text-gray-600">
            Email: admin@iphonelab.com
          </p>

          <p className="text-sm text-gray-600">
            Password: admin123
          </p>

        </div>

      </div>

    </main>
  );
}