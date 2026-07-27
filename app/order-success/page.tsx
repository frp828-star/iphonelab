"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  const orderId =
    "IPL" + Math.floor(100000 + Math.random() * 900000);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-10 text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center text-5xl">
          ✅
        </div>

        <h1 className="text-4xl font-bold mt-6 text-green-600">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-4">
          Thank you for shopping with
          <span className="font-bold text-red-600">
            {" "}iPhone Lab
          </span>.
        </p>

        {/* Order Info */}
        <div className="mt-10 border rounded-2xl p-6 text-left space-y-4">

          <div className="flex justify-between">
            <span className="font-semibold">
              Order ID
            </span>

            <span className="text-red-600 font-bold">
              #{orderId}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Status
            </span>

            <span className="text-green-600 font-bold">
              Confirmed
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Payment
            </span>

            <span>
              Pending Verification
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Delivery
            </span>

            <span>
              Processing
            </span>
          </div>

        </div>

        {/* Message */}
        <div className="mt-8 bg-blue-50 rounded-xl p-5 text-blue-700">
          📞 Our team will contact you shortly to confirm your order.
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">

          <Link
            href="/"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/cart"
            className="flex-1 border-2 border-black hover:bg-black hover:text-white py-4 rounded-xl font-bold transition"
          >
            View Cart
          </Link>

        </div>

      </div>
    </main>
  );
}