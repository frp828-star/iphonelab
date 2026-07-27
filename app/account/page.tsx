"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
};

type OrderProduct = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: number;
  customerId?: number;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  subtotal?: number;
  shipping?: number;
  discount?: number;
  total: number;
  deliveryArea?: string;
  paymentMethod?: string;
  status:
    | "Pending"
    | "Confirmed"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  createdAt: string;
};

export default function AccountPage() {
  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCustomer =
      localStorage.getItem("customer");

    const loggedIn =
      localStorage.getItem("customerLoggedIn");

    if (!savedCustomer || loggedIn !== "true") {
      setLoading(false);
      return;
    }

    try {
      const parsedCustomer = JSON.parse(
        savedCustomer
      );

      setCustomer(parsedCustomer);

      fetch("/api/orders", {
        cache: "no-store",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to load orders");
          }

          return res.json();
        })
        .then((data) => {
          const allOrders: Order[] =
            Array.isArray(data) ? data : [];

          const customerOrders =
            allOrders.filter(
              (order) =>
                Number(order.customerId) ===
                Number(parsedCustomer.id)
            );

          setOrders(customerOrders);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  const getStatusClass = (
    status: Order["status"]
  ) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const logout = () => {
    localStorage.removeItem("customerLoggedIn");
    localStorage.removeItem("customer");

    window.location.href = "/";
  };

  const totalSpent = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold">
          Loading Account...
        </p>
      </main>
    );
  }

  if (!customer) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">

          <div className="text-6xl mb-5">
            🔐
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Login Required
          </h1>

          <p className="text-gray-500 mb-6">
            Please login to view your account.
          </p>

          <Link
            href="/login"
            className="block w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold"
          >
            🔐 Login
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">

          <div>

            <h1 className="text-4xl font-bold text-red-600">
              👤 My Account
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back, {customer.name}
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href="/"
              className="border-2 border-black px-5 py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition"
            >
              ← Home
            </Link>

            <button
              type="button"
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Logout
            </button>

          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {/* Total Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Orders
                </p>

                <p className="text-3xl font-bold mt-2">
                  {orders.length}
                </p>

              </div>

              <div className="text-4xl">
                📦
              </div>

            </div>

          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Spent
                </p>

                <p className="text-2xl font-bold mt-2 text-red-600">
                  ৳ {totalSpent.toLocaleString()}
                </p>

              </div>

              <div className="text-4xl">
                💰
              </div>

            </div>

          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Pending Orders
                </p>

                <p className="text-3xl font-bold mt-2 text-yellow-600">
                  {pendingOrders}
                </p>

              </div>

              <div className="text-4xl">
                ⏳
              </div>

            </div>

          </div>

          {/* Delivered */}
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Delivered
                </p>

                <p className="text-3xl font-bold mt-2 text-green-600">
                  {deliveredOrders}
                </p>

              </div>

              <div className="text-4xl">
                ✅
              </div>

            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            ⚡ Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Link
              href="/account/orders"
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-5 font-semibold text-center transition"
            >
              📦
              <br />
              My Orders
            </Link>

            <Link
              href="/wishlist"
              className="bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl p-5 font-semibold text-center transition"
            >
              ❤️
              <br />
              Wishlist
            </Link>

            <Link
              href="/cart"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl p-5 font-semibold text-center transition"
            >
              🛒
              <br />
              My Cart
            </Link>

            <Link
              href="/shop"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl p-5 font-semibold text-center transition"
            >
              🛍️
              <br />
              Continue Shopping
            </Link>

          </div>

        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            👤 Personal Information
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Customer ID */}
            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Customer ID
              </p>

              <p className="font-bold text-lg mt-1">
                #{customer.id}
              </p>

            </div>

            {/* Name */}
            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Full Name
              </p>

              <p className="font-bold text-lg mt-1">
                {customer.name}
              </p>

            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Email
              </p>

              <p className="font-bold text-lg mt-1 break-all">
                {customer.email}
              </p>

            </div>

            {/* Phone */}
            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Phone
              </p>

              <p className="font-bold text-lg mt-1">
                {customer.phone}
              </p>

            </div>

          </div>

        </div>

        {/* Order Status Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            📊 Order Status
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-yellow-50 rounded-xl p-5 text-center">

              <p className="text-3xl font-bold text-yellow-600">
                {pendingOrders}
              </p>

              <p className="font-semibold text-yellow-700 mt-1">
                Pending
              </p>

            </div>

            <div className="bg-blue-50 rounded-xl p-5 text-center">

              <p className="text-3xl font-bold text-blue-600">
                {confirmedOrders}
              </p>

              <p className="font-semibold text-blue-700 mt-1">
                Confirmed
              </p>

            </div>

            <div className="bg-purple-50 rounded-xl p-5 text-center">

              <p className="text-3xl font-bold text-purple-600">
                {shippedOrders}
              </p>

              <p className="font-semibold text-purple-700 mt-1">
                Shipped
              </p>

            </div>

            <div className="bg-green-50 rounded-xl p-5 text-center">

              <p className="text-3xl font-bold text-green-600">
                {deliveredOrders}
              </p>

              <p className="font-semibold text-green-700 mt-1">
                Delivered
              </p>

            </div>

          </div>

        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

            <div>

              <h2 className="text-2xl font-bold">
                📦 Recent Orders
              </h2>

              <p className="text-gray-500 mt-1">
                Your latest order history
              </p>

            </div>

            <div className="flex items-center gap-3">

              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold">
                {orders.length} Orders
              </span>

              <Link
                href="/account/orders"
                className="text-red-600 font-semibold hover:underline"
              >
                View All →
              </Link>

            </div>

          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">

              <div className="text-6xl mb-5">
                📦
              </div>

              <h3 className="text-2xl font-bold mb-2">
                No Orders Yet
              </h3>

              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet.
              </p>

              <Link
                href="/shop"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                🛍️ Start Shopping
              </Link>

            </div>
          ) : (
            <div className="space-y-5">

              {orders
                .slice()
                .reverse()
                .slice(0, 5)
                .map((order) => (

                  <div
                    key={order.id}
                    className="border rounded-2xl p-5 hover:shadow-md transition"
                  >

                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-5">

                      <div>

                        <p className="font-bold text-xl">
                          Order #{order.id}
                        </p>

                        <p className="text-sm text-gray-500">
                          {new Date(
                            order.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      <div className="flex items-center gap-3">

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                        <span className="text-red-600 font-bold text-lg">
                          ৳{" "}
                          {Number(
                            order.total
                          ).toLocaleString()}
                        </span>

                      </div>

                    </div>

                    {/* Products */}
                    <div className="space-y-3">

                      {order.products.map(
                        (product, index) => (

                          <div
                            key={`${order.id}-${index}`}
                            className="flex justify-between items-center bg-gray-50 rounded-xl p-4"
                          >

                            <div>

                              <p className="font-semibold">
                                {product.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                ৳{" "}
                                {Number(
                                  product.price
                                ).toLocaleString()}{" "}
                                × {product.quantity}
                              </p>

                            </div>

                            <p className="font-bold">
                              ৳{" "}
                              {(
                                Number(
                                  product.price
                                ) *
                                Number(
                                  product.quantity
                                )
                              ).toLocaleString()}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                    {/* Order Info */}
                    <div className="mt-5 pt-5 border-t grid md:grid-cols-3 gap-4 text-sm">

                      <div>

                        <p className="text-gray-500">
                          Delivery
                        </p>

                        <p className="font-semibold">
                          {order.deliveryArea ===
                          "inside"
                            ? "Inside Dhaka"
                            : order.deliveryArea ===
                              "outside"
                            ? "Outside Dhaka"
                            : "Not provided"}
                        </p>

                      </div>

                      <div>

                        <p className="text-gray-500">
                          Payment
                        </p>

                        <p className="font-semibold capitalize">
                          {order.paymentMethod ||
                            "Not provided"}
                        </p>

                      </div>

                      <div>

                        <p className="text-gray-500">
                          Address
                        </p>

                        <p className="font-semibold">
                          {order.address}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}