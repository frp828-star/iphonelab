"use client";

import Link from "next/link";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        ❤️ My Wishlist
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {wishlist.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Your Wishlist is Empty
            </h2>

            <Link
              href="/"
              className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {wishlist.map((item) => (
              <div
                key={item.slug}
                className="flex justify-between items-center border-b py-6"
              >
                <div className="flex items-center gap-5">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain"
                  />

                  <div>
                    <h2 className="text-2xl font-bold">
                      {item.name}
                    </h2>

                    <p className="text-red-600 font-bold">
                      {item.price}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => removeFromWishlist(item.slug)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </>
        )}

      </div>
    </main>
  );
}