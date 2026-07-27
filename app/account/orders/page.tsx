"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  transactionId?: string;
  status:
    | "Pending"
    | "Confirmed"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  createdAt: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedCustomer =
          localStorage.getItem("customer");

        if (!savedCustomer) {
          setLoading(false);
          return;
        }

        const customer = JSON.parse(savedCustomer);

        const customerId = Number(customer.id);

        if (!customerId) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/orders", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load orders");
        }

        const data = await res.json();

        const customerOrders = Array.isArray(data)
          ? data.filter(
              (order: Order) =>
                Number(order.customerId) === customerId
            )
          : [];

        setOrders(customerOrders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusClass = (status: Order["status"]) => {
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

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-red-600">
              📦 My Orders
            </h1>

            <p className="text-gray-500 mt-2">
              View your order history and order status
            </p>
          </div>

          <Link
            href="/account"
            className="border-2 border-black px-5 py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition text-center"
          >
            ← My Account
          </Link>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <p className="text-xl font-semibold">
              Loading your orders...
            </p>

          </div>
        ) : orders.length === 0 ? (
          /* No Orders */
          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <div className="text-6xl mb-5">
              📦
            </div>

            <h2 className="text-2xl font-bold mb-2">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mb-6">
              You have not placed any orders yet.
            </p>

            <Link
              href="/shop"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              🛍️ Start Shopping
            </Link>

          </div>
        ) : (
          /* Orders */
          <div className="space-y-5">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >

                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">

                  <div>

                    <p className="text-xl font-bold">
                      Order #{order.id}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <p className="text-xl font-bold text-red-600">
                      ৳ {Number(order.total).toLocaleString()}
                    </p>

                  </div>

                </div>

                {/* Products */}
                <div className="py-5 space-y-3">

                  {order.products.map(
                    (product, index) => (

                      <div
                        key={`${order.id}-${index}`}
                        className="flex justify-between items-center border-b last:border-b-0 pb-3"
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
                            Number(product.price) *
                            Number(product.quantity)
                          ).toLocaleString()}
                        </p>

                      </div>

                    )
                  )}

                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-5">

                  <div className="text-sm text-gray-500">

                    <p>
                      📍{" "}
                      {order.deliveryArea === "inside"
                        ? "Inside Dhaka"
                        : order.deliveryArea ===
                          "outside"
                        ? "Outside Dhaka"
                        : "Delivery"}
                    </p>

                    <p className="mt-1">
                      💳{" "}
                      {order.paymentMethod ||
                        "Payment"}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    👁️ View Details
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">

              <div>

                <h2 className="text-2xl font-bold">
                  Order #{selectedOrder.id}
                </h2>

                <p className="text-gray-500">
                  Order Details
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="text-2xl font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>

            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">

              {/* Status */}
              <div>

                <h3 className="text-lg font-bold mb-3">
                  📌 Order Status
                </h3>

                <span
                  className={`px-4 py-2 rounded-full font-semibold ${getStatusClass(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>

              </div>

              {/* Customer */}
              <div>

                <h3 className="text-lg font-bold mb-3">
                  👤 Delivery Information
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">

                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.customerName}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedOrder.phone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {selectedOrder.address}
                  </p>

                </div>

              </div>

              {/* Products */}
              <div>

                <h3 className="text-lg font-bold mb-3">
                  📦 Products
                </h3>

                <div className="border rounded-xl overflow-hidden">

                  {selectedOrder.products.map(
                    (product, index) => (

                      <div
                        key={`${selectedOrder.id}-${index}`}
                        className="flex justify-between items-center p-4 border-b last:border-b-0"
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
                            Number(product.price) *
                            Number(product.quantity)
                          ).toLocaleString()}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* Payment */}
              <div>

                <h3 className="text-lg font-bold mb-3">
                  💳 Payment
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">

                  <p>
                    <strong>Method:</strong>{" "}
                    {selectedOrder.paymentMethod ||
                      "Not provided"}
                  </p>

                  {selectedOrder.transactionId && (
                    <p>
                      <strong>
                        Transaction ID:
                      </strong>{" "}
                      {selectedOrder.transactionId}
                    </p>
                  )}

                </div>

              </div>

              {/* Price Summary */}
              <div>

                <h3 className="text-lg font-bold mb-3">
                  💰 Price Summary
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">

                  <div className="flex justify-between">
                    <span>Subtotal</span>

                    <span>
                      ৳{" "}
                      {Number(
                        selectedOrder.subtotal || 0
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>

                    <span>
                      ৳{" "}
                      {Number(
                        selectedOrder.shipping || 0
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount</span>

                    <span>
                      -৳{" "}
                      {Number(
                        selectedOrder.discount || 0
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-3 text-xl font-bold text-red-600">

                    <span>Total</span>

                    <span>
                      ৳{" "}
                      {Number(
                        selectedOrder.total
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

              {/* Date */}
              <p className="text-sm text-gray-500">
                Order Date:{" "}
                {new Date(
                  selectedOrder.createdAt
                ).toLocaleString()}
              </p>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t flex justify-end">

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}