"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  stock?: number;
};

type Customer = {
  id: number;
  name: string;
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [ordersRes, productsRes, usersRes] =
        await Promise.all([
          fetch("/api/orders", {
            cache: "no-store",
          }),
          fetch("/api/products", {
            cache: "no-store",
          }),
          fetch("/api/users", {
            cache: "no-store",
          }),
        ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const usersData = await usersRes.json();

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setCustomers(
        Array.isArray(usersData)
          ? usersData
          : []
      );
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const res = await fetch(
        "/api/admin/logout",
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Logout failed"
        );
      }

      // Remove old client-side admin flag if it exists
      localStorage.removeItem("adminLoggedIn");

      // Go to admin login page
      window.location.href = "/admin-login";
    } catch (error) {
      console.error(
        "Admin logout error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Logout failed"
      );

      setLoggingOut(false);
    }
  };

  const totalSales = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const recentOrders = orders
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg px-10 py-8 text-center">
          <div className="text-4xl mb-3">
            ⏳
          </div>

          <p className="font-semibold text-gray-700">
            Loading Dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* =================================
            HEADER
        ================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              🏠 Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome to iPhone Lab administration.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {/* Refresh */}

            <button
              type="button"
              onClick={loadDashboard}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              🔄 Refresh
            </button>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {loggingOut
                ? "Logging out..."
                : "🚪 Logout"}
            </button>

          </div>

        </div>

        {/* =================================
            MAIN STATS
        ================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          {/* Sales */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Sales
                </p>

                <p className="text-2xl md:text-3xl font-bold text-red-600 mt-2">
                  ৳ {totalSales.toLocaleString()}
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-3xl">
                💰
              </div>

            </div>
          </div>

          {/* Orders */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Orders
                </p>

                <p className="text-3xl font-bold mt-2">
                  {orders.length}
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
                📦
              </div>

            </div>
          </div>

          {/* Customers */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Customers
                </p>

                <p className="text-3xl font-bold mt-2">
                  {customers.length}
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl">
                👥
              </div>

            </div>
          </div>

          {/* Products */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Products
                </p>

                <p className="text-3xl font-bold mt-2">
                  {products.length}
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">
                🛍️
              </div>

            </div>
          </div>

        </div>

        {/* =================================
            ORDER STATUS
        ================================= */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

            <div>
              <h2 className="text-2xl font-bold">
                📊 Order Overview
              </h2>

              <p className="text-gray-500 mt-1">
                Current order status summary
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="text-red-600 font-semibold hover:underline"
            >
              Manage Orders →
            </Link>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {/* Pending */}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <p className="text-yellow-700 text-sm">
                Pending
              </p>

              <p className="text-3xl font-bold text-yellow-700 mt-2">
                {pendingOrders}
              </p>
            </div>

            {/* Processing */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-blue-700 text-sm">
                Processing
              </p>

              <p className="text-3xl font-bold text-blue-700 mt-2">
                {processingOrders}
              </p>
            </div>

            {/* Completed */}

            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-green-700 text-sm">
                Completed
              </p>

              <p className="text-3xl font-bold text-green-700 mt-2">
                {completedOrders}
              </p>
            </div>

            {/* Cancelled */}

            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="text-red-700 text-sm">
                Cancelled
              </p>

              <p className="text-3xl font-bold text-red-700 mt-2">
                {cancelledOrders}
              </p>
            </div>

          </div>

        </div>

        {/* =================================
            QUICK ACTIONS
        ================================= */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            ⚡ Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Link
              href="/admin/orders"
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-5 text-center font-semibold transition"
            >
              📦
              <br />
              Manage Orders
            </Link>

            <Link
              href="/admin/products"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl p-5 text-center font-semibold transition"
            >
              🛍️
              <br />
              Manage Products
            </Link>

            <Link
              href="/admin/users"
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl p-5 text-center font-semibold transition"
            >
              👥
              <br />
              Manage Customers
            </Link>

            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl p-5 text-center font-semibold transition"
            >
              🌐
              <br />
              View Website
            </Link>

          </div>

        </div>

        {/* =================================
            RECENT ORDERS
        ================================= */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

            <div>
              <h2 className="text-2xl font-bold">
                🧾 Recent Orders
              </h2>

              <p className="text-gray-500 mt-1">
                Latest customer orders
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="text-red-600 font-semibold hover:underline"
            >
              View All →
            </Link>

          </div>

          {recentOrders.length === 0 ? (

            <div className="text-center py-10">

              <div className="text-5xl mb-4">
                📦
              </div>

              <p className="text-gray-500">
                No orders yet.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="border-b text-left">

                    <th className="pb-4 text-sm text-gray-500">
                      Order
                    </th>

                    <th className="pb-4 text-sm text-gray-500">
                      Customer
                    </th>

                    <th className="pb-4 text-sm text-gray-500">
                      Date
                    </th>

                    <th className="pb-4 text-sm text-gray-500">
                      Status
                    </th>

                    <th className="pb-4 text-sm text-gray-500 text-right">
                      Total
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {recentOrders.map(
                    (order) => (

                      <tr
                        key={order.id}
                        className="border-b last:border-b-0"
                      >

                        <td className="py-4">
                          <span className="font-bold text-red-600">
                            #{order.id}
                          </span>
                        </td>

                        <td className="py-4">
                          <p className="font-semibold">
                            {order.customer_name}
                          </p>
                        </td>

                        <td className="py-4 text-sm text-gray-500">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td className="py-4">

                          <span
                            className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${
                              order.status ===
                              "Completed"
                                ? "bg-green-100 text-green-700"
                                : order.status ===
                                  "Processing"
                                ? "bg-blue-100 text-blue-700"
                                : order.status ===
                                  "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>

                        </td>

                        <td className="py-4 text-right font-bold">
                          ৳{" "}
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </main>
  );
}