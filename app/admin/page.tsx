"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin-login");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-10">

          <h1 className="text-4xl font-bold text-red-600">
            🛠️ iPhone Lab Admin Panel
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            🚪 Logout
          </button>

        </div>

        {/* Admin Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Products */}
          <Link
            href="/admin/products"
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-2xl font-bold">
              Products
            </h2>

            <p className="text-gray-500 mt-2">
              Add • Edit • Delete Products
            </p>
          </Link>

          {/* Orders */}
          <Link
            href="/admin/orders"
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-4">
              🛒
            </div>

            <h2 className="text-2xl font-bold">
              Orders
            </h2>

            <p className="text-gray-500 mt-2">
              Manage Customer Orders
            </p>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-5xl mb-4">
              👤
            </div>

            <h2 className="text-2xl font-bold">
              Users
            </h2>

            <p className="text-gray-500 mt-2">
              Customer Accounts
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}