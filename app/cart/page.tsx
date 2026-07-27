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
const total = cart.reduce((sum, item) => {
  return sum + item.price * item.quantity;
}, 0);
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        🛒 Shopping Cart
      </h1>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {cart.length === 0 ? (
          <h2 className="text-center text-2xl font-bold">
            Your Cart is Empty
          </h2>
        ) : (
          <>
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-6 mb-6"
              >
                <div className="flex gap-5 items-center">
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
  ৳ {item.price.toLocaleString()}
</p>

                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => decreaseQuantity(item.name)}
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        -
                      </button>

                      <span className="text-xl font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.name)}
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="mt-4 text-red-600 font-semibold hover:underline"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
<div className="flex justify-between items-center mt-8 border-t pt-6">
  <h2 className="text-2xl font-bold">
    Total
  </h2>

  <p className="text-3xl font-bold text-red-600">
    ৳ {total.toLocaleString()}
  </p>
</div>
            <Link
  href="/checkout"
  className="block w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-center"
>
  Proceed to Checkout
</Link>
          </>
        )}
      </div>
    </main>
  );
}