"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

type Order = {
  id: number;
  customerId?: number;
  customerName: string;
  phone: string;
  address: string;
  products: {
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  deliveryArea: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/orders"),
        ]);

        const usersData = await usersRes.json();
        const ordersData = await ordersRes.json();

        if (usersRes.ok) {
          setUsers(usersData);
        }

        if (ordersRes.ok) {
          setOrders(ordersData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedUserOrders = selectedUser
    ? orders.filter(
        (order) =>
          Number(order.customerId) ===
          Number(selectedUser.id)
      )
    : [];

  const totalSpent = selectedUserOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const closeDetails = () => {
    setSelectedUser(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-bold text-red-600">
              👤 Manage Users
            </h1>

            <p className="text-gray-500 mt-2">
              View and manage customer accounts
            </p>
          </div>

          <Link
            href="/admin"
            className="border-2 border-black px-5 py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition"
          >
            ← Admin Dashboard
          </Link>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <p className="text-gray-500">
              Loading users...
            </p>
          </div>
        ) : (
          <>

            {/* Users Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">

              <table className="w-full">

                <thead className="bg-red-600 text-white">

                  <tr>

                    <th className="p-4 text-left">
                      User
                    </th>

                    <th className="p-4 text-left">
                      Email
                    </th>

                    <th className="p-4 text-left">
                      Phone
                    </th>

                    <th className="p-4 text-left">
                      Orders
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-10 text-center text-gray-500"
                      >
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {

                      const userOrders = orders.filter(
                        (order) =>
                          Number(order.customerId) ===
                          Number(user.id)
                      );

                      return (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-gray-50"
                        >

                          {/* User */}
                          <td className="p-4">

                            <div className="flex items-center gap-3">

                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                                👤
                              </div>

                              <div>

                                <p className="font-semibold">
                                  {user.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                  Customer ID: {user.id}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Email */}
                          <td className="p-4 text-gray-600">
                            {user.email}
                          </td>

                          {/* Phone */}
                          <td className="p-4 text-gray-600">
                            {user.phone}
                          </td>

                          {/* Orders */}
                          <td className="p-4 font-semibold">
                            {userOrders.length}
                          </td>

                          {/* Status */}
                          <td className="p-4">

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              Active
                            </span>

                          </td>

                          {/* Actions */}
                          <td className="p-4">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedUser(user)
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                              👁️ View
                            </button>

                          </td>

                        </tr>
                      );
                    })
                  )}

                </tbody>

              </table>

            </div>

          </>
        )}

        {/* User Details */}
        {selectedUser && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">

            {/* Details Header */}
            <div className="flex justify-between items-start mb-8">

              <div>

                <h2 className="text-3xl font-bold text-red-600">
                  👤 Customer Details
                </h2>

                <p className="text-gray-500 mt-1">
                  Customer ID: {selectedUser.id}
                </p>

              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
              >
                ✕ Close
              </button>

            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="border rounded-xl p-5">
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="text-xl font-bold mt-1">
                  {selectedUser.name}
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="text-xl font-bold mt-1 break-all">
                  {selectedUser.email}
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="text-xl font-bold mt-1">
                  {selectedUser.phone}
                </p>
              </div>

              <div className="border rounded-xl p-5">
                <p className="text-sm text-gray-500">
                  Registration Date
                </p>

                <p className="text-xl font-bold mt-1">
                  {new Date(
                    selectedUser.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

                <p className="text-gray-500">
                  Total Orders
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {selectedUserOrders.length}
                </p>

              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">

                <p className="text-gray-500">
                  Total Spent
                </p>

                <p className="text-3xl font-bold text-green-600 mt-1">
                  ৳ {totalSpent.toLocaleString()}
                </p>

              </div>

            </div>

            {/* Order History */}
            <div className="mt-10">

              <h3 className="text-2xl font-bold mb-5">
                🛒 Order History
              </h3>

              {selectedUserOrders.length === 0 ? (
                <div className="border rounded-xl p-8 text-center text-gray-500">
                  This customer has no orders yet.
                </div>
              ) : (
                <div className="space-y-4">

                  {selectedUserOrders.map((order) => (

                    <div
                      key={order.id}
                      className="border rounded-xl p-5"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                          <p className="font-bold text-lg">
                            Order #{order.id}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(
                              order.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>

                        <div className="flex items-center gap-4">

                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {order.status}
                          </span>

                          <span className="text-xl font-bold text-red-600">
                            ৳{" "}
                            {Number(
                              order.total
                            ).toLocaleString()}
                          </span>

                        </div>

                      </div>

                      {/* Products */}
                      <div className="mt-4 border-t pt-4 space-y-3">

                        {order.products.map(
                          (product, index) => (

                            <div
                              key={`${order.id}-${index}`}
                              className="flex justify-between items-center"
                            >

                              <div>

                                <p className="font-semibold">
                                  {product.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                  Qty: {product.quantity}
                                </p>

                              </div>

                              <p className="font-semibold">
                                ৳{" "}
                                {(
                                  product.price *
                                  product.quantity
                                ).toLocaleString()}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  ))}

                </div>
              )}

            </div>

          </div>
        )}

        {/* Notice */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5">

          <p className="text-green-800">
            ✅ Customer accounts and orders are now
            connected using Customer ID.
          </p>

        </div>

      </div>
    </main>
  );
}