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
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Dashboard Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">
                Welcome to
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-red-600">
                iPhone Lab Admin Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your products, orders and customers from here.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              🚪 Logout
            </button>

          </div>

        </div>

        {/* Quick Management */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Quick Management
          </h2>

          <p className="text-gray-500 mt-1">
            Choose an option to manage your store.
          </p>

        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Products */}
          <Link
            href="/admin/products"
            className="group bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-4xl mb-5 group-hover:scale-105 transition">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Products
            </h2>

            <p className="text-gray-500 mt-2">
              Add, edit and delete products.
            </p>

            <div className="mt-5 text-red-600 font-semibold">
              Manage Products →
            </div>
          </Link>

          {/* Orders */}
          <Link
            href="/admin/orders"
            className="group bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-5 group-hover:scale-105 transition">
              🛒
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Orders
            </h2>

            <p className="text-gray-500 mt-2">
              View and manage customer orders.
            </p>

            <div className="mt-5 text-blue-600 font-semibold">
              Manage Orders →
            </div>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className="group bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mb-5 group-hover:scale-105 transition">
              👤
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Users
            </h2>

            <p className="text-gray-500 mt-2">
              View customer accounts and history.
            </p>

            <div className="mt-5 text-green-600 font-semibold">
              Manage Users →
            </div>
          </Link>

        </div>

        {/* Dashboard Notice */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <div className="flex items-start gap-4">

            <div className="text-3xl">
              💡
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Admin Dashboard
              </h3>

              <p className="text-gray-500 mt-1">
                Use the navigation above or the cards to manage
                your iPhone Lab store.
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}