"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 sm:p-10 text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center text-5xl">
          ✅
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mt-6 text-green-600">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-4">
          Thank you for shopping with{" "}
          <span className="font-bold text-red-600">
            iPhone Lab
          </span>
          .
        </p>

        {/* Order Information */}
        <div className="mt-10 border rounded-2xl p-5 sm:p-6 text-left space-y-4">

          <div className="flex justify-between items-center gap-4">
            <span className="font-semibold text-gray-700">
              Order ID
            </span>

            <span className="text-red-600 font-bold">
              {orderId ? `#${orderId}` : "Processing"}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="font-semibold text-gray-700">
              Status
            </span>

            <span className="text-yellow-600 font-bold">
              Pending
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="font-semibold text-gray-700">
              Payment
            </span>

            <span className="text-gray-700 text-right">
              Pending Verification
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="font-semibold text-gray-700">
              Delivery
            </span>

            <span className="text-gray-700">
              Processing
            </span>
          </div>

        </div>

        {/* Message */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 text-blue-700">
          📞 Our team will contact you shortly to confirm your order.
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">

          <Link
            href="/"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition"
          >
            🛍️ Continue Shopping
          </Link>

          <Link
            href="/account"
            className="flex-1 border-2 border-gray-900 hover:bg-gray-900 hover:text-white py-4 rounded-xl font-bold transition"
          >
            👤 My Account
          </Link>

        </div>

      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="text-5xl mb-4">⏳</div>

            <h1 className="text-2xl font-bold text-gray-900">
              Loading...
            </h1>

            <p className="text-gray-500 mt-2">
              Please wait.
            </p>
          </div>
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}