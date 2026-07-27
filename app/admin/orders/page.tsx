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

const statuses: Order["status"][] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await res.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const updateStatus = async (
    orderId: number,
    newStatus: Order["status"]
  ) => {
    try {
      setUpdatingId(orderId);

      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to update order"
        );
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
              }
            : null
        );
      }

      alert("✅ Order status updated successfully");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(orderId);

      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete order"
        );
      }

      setOrders((prev) =>
        prev.filter((order) => order.id !== orderId)
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }

      alert("✅ Order deleted successfully");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-10">

          <div>
            <h1 className="text-4xl font-bold text-red-600">
              🛒 Manage Orders
            </h1>

            <p className="text-gray-500 mt-2">
              View and manage customer orders
            </p>
          </div>

          <Link
            href="/admin"
            className="border-2 border-black px-5 py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition text-center"
          >
            ← Admin Dashboard
          </Link>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-xl font-semibold">
              Loading Orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          /* No Orders */
          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <div className="text-6xl mb-5">
              🛒
            </div>

            <h2 className="text-2xl font-bold mb-2">
              No Orders Found
            </h2>

            <p className="text-gray-500">
              Customer orders will appear here.
            </p>

          </div>
        ) : (
          /* Orders Table */
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-red-600 text-white">
                <tr>

                  <th className="p-4 text-left">
                    Order ID
                  </th>

                  <th className="p-4 text-left">
                    Customer
                  </th>

                  <th className="p-4 text-left">
                    Products
                  </th>

                  <th className="p-4 text-left">
                    Total
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Order ID */}
                    <td className="p-4 font-bold">
                      #{order.id}
                    </td>

                    {/* Customer */}
                    <td className="p-4">

                      {order.customerId && (
  <p className="text-sm text-gray-500">
    🆔 Customer ID: {order.customerId}
  </p>
)}

                      <p className="text-sm text-gray-500">
                        📞 {order.phone}
                      </p>

                      <p className="text-sm text-gray-500 max-w-xs">
                        📍 {order.address}
                      </p>

                    </td>

                    {/* Products */}
                    <td className="p-4">

                      <div className="space-y-1">

                        {order.products.map(
                          (product, index) => (
                            <p
                              key={`${product.name}-${index}`}
                              className="text-sm"
                            >
                              {product.name} ×{" "}
                              {product.quantity}
                            </p>
                          )
                        )}

                      </div>

                    </td>

                    {/* Total */}
                    <td className="p-4">

                      <span className="text-red-600 font-bold">
                        ৳{" "}
                        {Number(order.total).toLocaleString()}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="p-4">

                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className={`px-3 py-2 rounded-lg font-semibold border cursor-pointer ${getStatusClass(
                          order.status
                        )}`}
                      >

                        {statuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}

                      </select>

                    </td>

                    {/* Date */}
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-4">

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          👁️ View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteOrder(order.id)
                          }
                          disabled={
                            deletingId === order.id
                          }
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          {deletingId === order.id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

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
                onClick={() => setSelectedOrder(null)}
                className="text-2xl font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>

            </div>

            <div className="p-6 space-y-6">

              {/* Customer Information */}
              <div>

                <h3 className="text-lg font-bold mb-3">
                  👤 Customer Information
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
{selectedOrder.customerId && (
  <p>
    <strong>Customer ID:</strong>{" "}
    {selectedOrder.customerId}
  </p>
)}
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
                        key={`${product.name}-${index}`}
                        className="flex justify-between items-center p-4 border-b last:border-b-0"
                      >

                        <div>
                          <p className="font-semibold">
                            {product.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            ৳{" "}
                            {product.price.toLocaleString()}{" "}
                            × {product.quantity}
                          </p>
                        </div>

                        <p className="font-bold">
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

              {/* Payment */}
              <div>

                <h3 className="text-lg font-bold mb-3">
                  💳 Payment Information
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">

                  <p>
                    <strong>Method:</strong>{" "}
                    {selectedOrder.paymentMethod ||
                      "Not provided"}
                  </p>

                  {selectedOrder.transactionId && (
                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {selectedOrder.transactionId}
                    </p>
                  )}

                </div>

              </div>

              {/* Delivery */}
              <div>

                <h3 className="text-lg font-bold mb-3">
                  🚚 Delivery Information
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">

                  <p>
                    <strong>Area:</strong>{" "}
                    {selectedOrder.deliveryArea ===
                    "inside"
                      ? "Inside Dhaka"
                      : selectedOrder.deliveryArea ===
                        "outside"
                      ? "Outside Dhaka"
                      : "Not provided"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>

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
              <div className="text-sm text-gray-500">
                Order Date:{" "}
                {new Date(
                  selectedOrder.createdAt
                ).toLocaleString()}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t flex justify-end">

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
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