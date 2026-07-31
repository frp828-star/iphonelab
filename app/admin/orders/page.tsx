"use client";

import { useEffect, useState } from "react";

type Product = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: number;
  customer_id: number;
  customer_name: string;
  phone: string;
  address: string;
  products: Product[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  delivery_area: string;
  payment_method: string;
  payment_number?: string | null;
  transaction_id?: string | null;
  status: string;
  created_at: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Selected order for View Modal
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to load orders"
        );
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Orders loading error:", error);
      alert("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    try {
      setUpdatingId(id);

      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to update order"
        );
      }

      setOrders((previous) =>
        previous.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      // Update modal also
      setSelectedOrder((previous) =>
        previous && previous.id === id
          ? {
              ...previous,
              status,
            }
          : previous
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const deleteOrder = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete order"
        );
      }

      setOrders((previous) =>
        previous.filter((order) => order.id !== id)
      );

      // Close modal if deleted
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Delete order error:", error);
      alert("Failed to delete order.");
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredOrders = orders.filter((order) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    return (
      order.customer_name
        ?.toLowerCase()
        .includes(keyword) ||
      order.phone
        ?.toLowerCase()
        .includes(keyword) ||
      String(order.id).includes(keyword) ||
      order.transaction_id
        ?.toLowerCase()
        .includes(keyword)
    );
  });

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const statusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================
  // STATUS COUNTS
  // ==========================================

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingCount = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 md:px-8">

      <div className="max-w-7xl mx-auto">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              📦 Orders
            </h1>

            <p className="text-gray-500 mt-2">
              Manage customer orders from here.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold"
          >
            🔄 Refresh
          </button>

        </div>

        {/* =====================================
            SEARCH
        ====================================== */}

        <div className="bg-white border rounded-2xl p-5 mb-6">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by order ID, customer name, phone or transaction ID..."
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />

        </div>

        {/* =====================================
            STATS
        ====================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* Total */}

          <div className="bg-white border rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Total Orders
            </p>

            <p className="text-3xl font-bold mt-2">
              {orders.length}
            </p>

          </div>

          {/* Pending */}

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">

            <p className="text-yellow-700 text-sm">
              Pending
            </p>

            <p className="text-3xl font-bold mt-2 text-yellow-700">
              {pendingCount}
            </p>

          </div>

          {/* Processing */}

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">

            <p className="text-blue-700 text-sm">
              Processing
            </p>

            <p className="text-3xl font-bold mt-2 text-blue-700">
              {processingCount}
            </p>

          </div>

          {/* Completed */}

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">

            <p className="text-green-700 text-sm">
              Completed
            </p>

            <p className="text-3xl font-bold mt-2 text-green-700">
              {completedCount}
            </p>

          </div>

        </div>

        {/* =====================================
            ORDER LIST
        ====================================== */}

        {loading ? (

          <div className="bg-white border rounded-2xl p-12 text-center">

            <p className="text-gray-500">
              Loading orders...
            </p>

          </div>

        ) : filteredOrders.length === 0 ? (

          <div className="bg-white border rounded-2xl p-12 text-center">

            <div className="text-6xl mb-4">
              📦
            </div>

            <h2 className="text-2xl font-bold">
              No orders found
            </h2>

            <p className="text-gray-500 mt-2">
              There are no matching orders.
            </p>

          </div>

        ) : (

          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">

            {/* Table Header */}

            <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-bold text-gray-600">

              <div>
                Order
              </div>

              <div>
                Customer
              </div>

              <div>
                Date
              </div>

              <div>
                Status
              </div>

              <div>
                Total
              </div>

              <div>
                Action
              </div>

            </div>

            {/* Orders */}

            <div>

              {filteredOrders.map((order) => (

                <div
                  key={order.id}
                  className="border-b last:border-b-0"
                >

                  {/* Desktop */}

                  <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-5">

                    {/* Order ID */}

                    <div>

                      <p className="font-bold text-red-600 text-lg">
                        #{order.id}
                      </p>

                    </div>

                    {/* Customer */}

                    <div className="min-w-0">

                      <p className="font-semibold truncate">
                        {order.customer_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.phone}
                      </p>

                    </div>

                    {/* Date */}

                    <div>

                      <p className="text-sm text-gray-600">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(
                          order.created_at
                        ).toLocaleTimeString()}
                      </p>

                    </div>

                    {/* Status */}

                    <div>

                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${statusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    {/* Total */}

                    <div>

                      <p className="font-bold text-gray-900">
                        ৳{" "}
                        {Number(
                          order.total
                        ).toLocaleString()}
                      </p>

                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition"
                      >
                        👁️ View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteOrder(order.id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                  {/* Mobile */}

                  <div className="md:hidden p-5">

                    <div className="flex justify-between items-start gap-3">

                      <div>

                        <p className="text-sm text-gray-500">
                          Order ID
                        </p>

                        <p className="text-xl font-bold text-red-600">
                          #{order.id}
                        </p>

                      </div>

                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-bold ${statusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    <div className="mt-4 space-y-2">

                      <p>
                        <span className="text-gray-500">
                          Customer:
                        </span>{" "}
                        <span className="font-semibold">
                          {order.customer_name}
                        </span>
                      </p>

                      <p>
                        <span className="text-gray-500">
                          Phone:
                        </span>{" "}
                        {order.phone}
                      </p>

                      <p>
                        <span className="text-gray-500">
                          Total:
                        </span>{" "}
                        <span className="font-bold">
                          ৳{" "}
                          {Number(
                            order.total
                          ).toLocaleString()}
                        </span>
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          order.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="flex gap-2 mt-4">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-xl font-semibold"
                      >
                        👁️ View Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteOrder(order.id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

      {/* ==========================================
          ORDER DETAILS MODAL
      =========================================== */}

      {selectedOrder && (

        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="sticky top-0 z-10 bg-white border-b px-6 py-5 flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Order Details
                </p>

                <h2 className="text-2xl font-bold text-red-600">
                  #{selectedOrder.id}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold"
              >
                ×
              </button>

            </div>

            <div className="p-6 space-y-6">

              {/* =================================
                  CUSTOMER INFORMATION
              ================================== */}

              <div className="border rounded-2xl p-5">

                <h3 className="text-xl font-bold mb-5">
                  👤 Customer Information
                </h3>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <p className="text-sm text-gray-500">
                      Customer ID
                    </p>

                    <p className="font-semibold mt-1">
                      #{selectedOrder.customer_id}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Customer Name
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedOrder.customer_name}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Phone Number
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedOrder.phone}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Delivery Area
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedOrder.delivery_area ===
                      "inside"
                        ? "📍 Inside Dhaka"
                        : "🚚 Outside Dhaka"}
                    </p>

                  </div>

                  <div className="md:col-span-2">

                    <p className="text-sm text-gray-500">
                      Delivery Address
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedOrder.address}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================
                  ORDERED PRODUCTS
              ================================== */}

              <div className="border rounded-2xl p-5">

                <h3 className="text-xl font-bold mb-5">
                  🛒 Ordered Products
                </h3>

                <div className="space-y-3">

                  {selectedOrder.products.map(
                    (product, index) => (

                      <div
                        key={`${selectedOrder.id}-${index}`}
                        className="flex items-center justify-between gap-4 bg-gray-50 border rounded-xl p-4"
                      >

                        <div className="min-w-0">

                          <p className="font-semibold">
                            {product.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            ৳{" "}
                            {Number(
                              product.price
                            ).toLocaleString()}{" "}
                            × {product.quantity}
                          </p>

                        </div>

                        <p className="font-bold whitespace-nowrap">
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

              {/* =================================
                  PAYMENT INFORMATION
              ================================== */}

              <div className="border rounded-2xl p-5">

                <h3 className="text-xl font-bold mb-5">
                  💳 Payment Information
                </h3>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <p className="text-sm text-gray-500">
                      Payment Method
                    </p>

                    <p className="font-semibold mt-1 capitalize">
                      {selectedOrder.payment_method ||
                        "Not provided"}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Payment Number
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedOrder.payment_number ||
                        "Not provided"}
                    </p>

                  </div>

                  <div className="md:col-span-2">

                    <p className="text-sm text-gray-500">
                      Transaction ID
                    </p>

                    <p className="font-semibold mt-1 break-all">
                      {selectedOrder.transaction_id ||
                        "Not provided"}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================
                  PRICE SUMMARY
              ================================== */}

              <div className="border rounded-2xl p-5">

                <h3 className="text-xl font-bold mb-5">
                  💰 Price Summary
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">

                    <span className="text-gray-600">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      ৳{" "}
                      {Number(
                        selectedOrder.subtotal || 0
                      ).toLocaleString()}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-600">
                      Shipping
                    </span>

                    <span className="font-semibold">
                      ৳{" "}
                      {Number(
                        selectedOrder.shipping || 0
                      ).toLocaleString()}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-600">
                      Discount
                    </span>

                    <span className="font-semibold text-green-600">
                      -৳{" "}
                      {Number(
                        selectedOrder.discount || 0
                      ).toLocaleString()}
                    </span>

                  </div>

                  <div className="border-t pt-4 flex justify-between text-xl font-bold">

                    <span>
                      Grand Total
                    </span>

                    <span className="text-red-600">
                      ৳{" "}
                      {Number(
                        selectedOrder.total || 0
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================
                  ORDER STATUS
              ================================== */}

              <div className="border rounded-2xl p-5">

                <h3 className="text-xl font-bold mb-5">
                  📦 Order Status
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">

                  <span
                    className={`w-fit px-4 py-2 rounded-full font-bold ${statusClass(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>

                  <select
                    value={selectedOrder.status}
                    disabled={
                      updatingId ===
                      selectedOrder.id
                    }
                    onChange={(e) =>
                      updateStatus(
                        selectedOrder.id,
                        e.target.value
                      )
                    }
                    className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>

              {/* =================================
                  ORDER DATE
              ================================== */}

              <div className="border-t pt-5 text-sm text-gray-500">

                Order placed:{" "}

                {new Date(
                  selectedOrder.created_at
                ).toLocaleString()}

              </div>

            </div>

            {/* Modal Footer */}

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  deleteOrder(
                    selectedOrder.id
                  )
                }
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                🗑️ Delete Order
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold"
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