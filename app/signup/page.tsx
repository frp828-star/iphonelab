"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to create account"
        );
      }

      alert("✅ Account created successfully!");

      router.push("/login");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">
            🛍️ Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Create your iPhone Lab customer account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

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

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-semibold mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition"
          >
            {saving
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <div className="text-center mt-6">

          <p className="text-gray-500">
            Already have an account?
          </p>

          <Link
            href="/login"
            className="text-red-600 font-semibold hover:underline"
          >
            Login Here
          </Link>

        </div>

      </div>

    </main>
  );
}