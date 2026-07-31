"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("inside");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [paymentNumber, setPaymentNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [customerId, setCustomerId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);

  const { cart, clearCart } = useCart();

  // Load logged-in customer
  useEffect(() => {
    const savedCustomer = localStorage.getItem("customer");

    if (savedCustomer) {
      try {
        const customer = JSON.parse(savedCustomer);

        if (customer?.id) {
          setCustomerId(Number(customer.id));
        }

        if (customer?.name) {
          setCustomerName(customer.name);
        }

        if (customer?.phone) {
          setPhone(customer.phone);
        }
      } catch (error) {
        console.error("Failed to load customer:", error);
      }
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const shipping =
    subtotal > 0
      ? deliveryArea === "inside"
        ? 70
        : 120
      : 0;

  const total = subtotal + shipping - discount;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("❌ Your cart is empty.");
      return;
    }

    if (!customerId) {
      alert("❌ Please login before placing an order.");
      router.push("/login");
      return;
    }

    if (!customerName.trim()) {
      alert("❌ Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      alert("❌ Please enter your phone number.");
      return;
    }

    if (!address.trim()) {
      alert("❌ Please enter your delivery address.");
      return;
    }

    if (!paymentMethod) {
      alert("❌ Please select a payment method.");
      return;
    }

    if (
      (paymentMethod === "bkash" ||
        paymentMethod === "nagad") &&
      (!paymentNumber.trim() ||
        !transactionId.trim())
    ) {
      alert(
        "❌ Please enter payment number and transaction ID."
      );
      return;
    }

    setSaving(true);

    const order = {
      customerId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),

      products: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),

      subtotal,
      shipping,
      discount,
      total,
      deliveryArea,
      paymentMethod,

      paymentNumber:
        paymentMethod === "bkash" ||
        paymentMethod === "nagad"
          ? paymentNumber.trim()
          : "",

      transactionId:
        paymentMethod === "bkash" ||
        paymentMethod === "nagad"
          ? transactionId.trim()
          : "",

      status: "Pending",

      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to create order"
        );
      }

      clearCart();

      router.push("/order-success");
    } catch (error) {
      console.error(error);

      alert(
        "❌ Failed to place order. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-center mb-8">
          Checkout
        </h1>

        {/* Order Summary */}
        <div className="mb-8 border rounded-xl p-6 bg-gray-50">

          <h2 className="text-2xl font-bold mb-4">
            🛒 Order Summary
          </h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex justify-between border-b py-3"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold">
                    ৳{" "}
                    {(
                      item.price * item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="mt-6 border-t pt-4 space-y-2">

                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>
                    ৳ {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span>
                    ৳ {shipping.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>

                  <span>
                    -৳ {discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-xl font-bold text-red-600 border-t pt-3">
                  <span>Total</span>

                  <span>
                    ৳ {total.toLocaleString()}
                  </span>
                </div>

              </div>
            </>
          )}

        </div>

        {/* Checkout Form */}
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Customer Name */}
          <div>
            <label className="block mb-2 font-semibold">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Your Full Name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              className="w-full border rounded-lg p-4"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 font-semibold">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border rounded-lg p-4"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 font-semibold">
              Delivery Address
            </label>

            <textarea
              placeholder="Enter your complete delivery address"
              rows={4}
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="w-full border rounded-lg p-4"
              required
            />
          </div>

          {/* Delivery Area */}
          <div>
            <label className="block mb-2 font-semibold">
              Delivery Area
            </label>

            <select
              value={deliveryArea}
              onChange={(e) =>
                setDeliveryArea(e.target.value)
              }
              className="w-full border rounded-lg p-4"
            >
              <option value="inside">
                📍 Inside Dhaka (৳70)
              </option>

              <option value="outside">
                🚚 Outside Dhaka (৳120)
              </option>
            </select>
          </div>

          {/* Coupon */}
          <div>
            <label className="block mb-2 font-semibold">
              Coupon Code
            </label>

            <div className="flex gap-3">

              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) =>
                  setCoupon(e.target.value)
                }
                className="flex-1 border rounded-lg p-4"
              />

              <button
                type="button"
                onClick={() => {
                  if (coupon.trim()) {
                    alert(
                      "Coupon system will be connected later."
                    );
                  } else {
                    alert(
                      "Please enter a coupon code."
                    );
                  }
                }}
                className="bg-black text-white px-5 rounded-lg font-semibold"
              >
                Apply
              </button>

            </div>
          </div>

          {/* Payment */}
          <div>
            <label className="block mb-2 font-semibold">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="w-full border rounded-lg p-4"
              required
            >
              <option value="">
                Select Payment Method
              </option>

              <option value="bkash">
                📱 bKash
              </option>

              <option value="nagad">
                📱 Nagad
              </option>

              <option value="visa">
                💳 Visa Card
              </option>

              <option value="mastercard">
                💳 MasterCard
              </option>
            </select>
          </div>

          {/* bKash / Nagad */}
          {(paymentMethod === "bkash" ||
            paymentMethod === "nagad") && (
            <>
              <input
                type="tel"
                placeholder={
                  paymentMethod === "bkash"
                    ? "Enter bKash Number"
                    : "Enter Nagad Number"
                }
                value={paymentNumber}
                onChange={(e) =>
                  setPaymentNumber(e.target.value)
                }
                className="w-full border rounded-lg p-4"
                required
              />

              <input
                type="text"
                placeholder="Transaction ID"
                value={transactionId}
                onChange={(e) =>
                  setTransactionId(e.target.value)
                }
                className="w-full border rounded-lg p-4"
                required
              />
            </>
          )}

          {/* Card */}
          {(paymentMethod === "visa" ||
            paymentMethod === "mastercard") && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                Card payment integration will be
                connected later. No card number or CVV
                will be stored in our order database.
              </p>
            </div>
          )}

          {/* Place Order */}
          <button
            type="submit"
            disabled={saving || cart.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-center"
          >
            {saving
              ? "Placing Order..."
              : "🛍️ Place Order"}
          </button>

        </form>

      </div>
    </main>
  );
}