"use client";

import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

        {/* Admin Logo */}
        <div className="flex items-center">
          <Link
            href="/admin"
            className="text-3xl font-bold text-red-600 whitespace-nowrap"
          >
            🛠️ iPhone Lab Admin
          </Link>
        </div>

        {/* Admin Navigation */}
        <nav className="flex flex-wrap items-center gap-3 sm:gap-6 mt-5 border-t pt-4">

          {/* Dashboard */}
          <Link
            href="/admin"
            className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            🏠 Dashboard
          </Link>

          {/* Products */}
          <Link
            href="/admin/products"
            className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            📦 Products
          </Link>

          {/* Banners */}
          <Link
            href="/admin/banners"
            className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            🖼️ Banners
          </Link>

          {/* Orders */}
          <Link
            href="/admin/orders"
            className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            🛒 Orders
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            👤 Users
          </Link>

          {/* Website */}
          <Link
            href="/"
            className="text-lg font-semibold px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            🌐 Website
          </Link>

        </nav>

      </div>
    </header>
  );
}