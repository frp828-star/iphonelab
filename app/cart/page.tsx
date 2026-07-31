"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const deliveryCharge =
    subtotal > 0 ? 100 : 0;

  const total =
    subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border p-10 md:p-16 text-center">
            <div className="text-7xl mb-6">
              🛒
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="text-gray-500 mt-3">
              You haven't added any products to your cart yet.
            </p>

            <Link
              href="/"
              className="inline-block mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition"
            >
              🛍️ Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            ← Continue Shopping
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            🛒 Shopping Cart
          </h1>

          <p className="text-gray-500 mt-2">
            Review your products before checkout.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <section className="lg:col-span-2 space-y-5">

            {cart.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-2xl shadow-sm border p-5 md:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-5">

                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-50 border rounded-xl flex items-center justify-center shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {item.name}
                        </h2>

                        <p className="text-red-600 font-bold text-lg mt-2">
                          ৳ {item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.name)
                        }
                        className="text-red-600 hover:text-red-700 font-semibold self-start"
                      >
                        🗑️ Remove
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="mt-5 flex items-center gap-4">

                      <span className="font-semibold">
                        Quantity:
                      </span>

                      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">

                        {/* Minus */}
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.name)
                          }
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-300 text-xl font-bold transition"
                        >
                          −
                        </button>

                        {/* Quantity */}
                        <span className="w-12 h-10 flex items-center justify-center border-x border-gray-300 font-bold">
                          {item.quantity}
                        </span>

                        {/* Plus */}
                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.name)
                          }
                          className="w-10 h-10 hover:bg-gray-100 text-xl font-bold transition"
                        >
                          +
                        </button>

                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-5 text-right">

                      <span className="text-gray-500">
                        Item Total:
                      </span>

                      <span className="ml-2 text-xl font-bold text-gray-900">
                        ৳{" "}
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </span>

                    </div>

                  </div>
                </div>
              </div>
            ))}

          </section>

          {/* Order Summary */}
          <aside className="lg:col-span-1">

            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6">

              <h2 className="text-2xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="border-t my-5" />

              {/* Subtotal */}
              <div className="flex justify-between gap-4 mb-4">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between gap-4 mb-4">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span className="font-semibold">
                  ৳ {deliveryCharge.toLocaleString()}
                </span>
              </div>

              <div className="border-t my-5" />

              {/* Total */}
              <div className="flex justify-between gap-4">
                <span className="text-xl font-bold">
                  Total
                </span>

                <span className="text-2xl font-bold text-red-600">
                  ৳ {total.toLocaleString()}
                </span>
              </div>

              {/* Checkout */}
              <Link
                href="/checkout"
                className="block text-center bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold mt-7 transition"
              >
                ⚡ Proceed to Checkout
              </Link>

              {/* Continue */}
              <Link
                href="/"
                className="block text-center border-2 border-gray-300 hover:bg-gray-50 text-gray-800 py-3 rounded-xl font-semibold mt-3 transition"
              >
                🛍️ Continue Shopping
              </Link>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}