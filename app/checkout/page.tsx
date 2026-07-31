"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

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

  // ==========================================
  // LOAD LOGGED-IN CUSTOMER
  // ==========================================

  useEffect(() => {
    const savedCustomer = localStorage.getItem("customer");

    if (!savedCustomer) {
      return;
    }

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

      if (customer?.address) {
        setAddress(customer.address);
      }
    } catch (error) {
      console.error(
        "Failed to load customer:",
        error
      );
    }
  }, []);

  // ==========================================
  // ORDER CALCULATIONS
  // ==========================================

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const shipping =
    subtotal > 0
      ? deliveryArea === "inside"
        ? 70
        : 120
      : 0;

  const total = Math.max(
    0,
    subtotal + shipping - discount
  );

  // ==========================================
  // APPLY COUPON
  // ==========================================

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (!code) {
      setDiscount(0);

      alert("❌ Please enter a coupon code.");

      return;
    }

    // Demo coupon
    if (code === "IPHONE10") {
      const couponDiscount = Math.min(
        Math.round(subtotal * 0.1),
        1000
      );

      setDiscount(couponDiscount);

      alert(
        `✅ Coupon applied! You saved ৳${couponDiscount.toLocaleString()}`
      );

      return;
    }

    setDiscount(0);

    alert("❌ Invalid coupon code.");
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Empty cart
    if (cart.length === 0) {
      alert("❌ Your cart is empty.");
      return;
    }

    // Login required
    if (!customerId) {
      alert(
        "❌ Please login before placing an order."
      );

      router.push("/login");

      return;
    }

    // Name
    if (!customerName.trim()) {
      alert("❌ Please enter your full name.");
      return;
    }

    // Phone
    if (!phone.trim()) {
      alert(
        "❌ Please enter your phone number."
      );

      return;
    }

    // Address
    if (!address.trim()) {
      alert(
        "❌ Please enter your delivery address."
      );

      return;
    }

    // Payment
    if (!paymentMethod) {
      alert(
        "❌ Please select a payment method."
      );

      return;
    }

    // bKash / Nagad validation
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

    // ==========================================
    // ORDER DATA
    // ==========================================

    const order = {
      customerId,

      customerName:
        customerName.trim(),

      phone:
        phone.trim(),

      address:
        address.trim(),

      products: cart.map((item) => ({
        name: item.name,

        price: Number(item.price),

        quantity: Number(item.quantity),

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

      createdAt:
        new Date().toISOString(),
    };

    // ==========================================
    // SEND TO API
    // ==========================================

    try {
      const res = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(order),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to create order"
        );
      }

      // Clear cart
      clearCart();

      // Success page
      router.push("/order-success");
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      alert(
        "❌ Failed to place order. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8">

        {/* =====================================
            TITLE
        ====================================== */}

        <div className="text-center mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Complete your order securely
          </p>

        </div>

        {/* =====================================
            ORDER SUMMARY
        ====================================== */}

        <div className="mb-8 border rounded-xl p-5 sm:p-6 bg-gray-50">

          <h2 className="text-2xl font-bold mb-5">
            🛒 Order Summary
          </h2>

          {cart.length === 0 ? (

            <div className="text-center py-8">

              <p className="text-gray-500 mb-5">
                Your cart is empty.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/shop")
                }
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                🛍️ Go to Shop
              </button>

            </div>

          ) : (

            <>

              {/* Products */}

              <div className="space-y-1">

                {cart.map((item, index) => (

                  <div
                    key={`${item.name}-${index}`}
                    className="flex justify-between gap-4 border-b py-4"
                  >

                    <div className="min-w-0">

                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-bold whitespace-nowrap">
                      ৳{" "}
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString()}
                    </p>

                  </div>

                ))}

              </div>

              {/* Price Summary */}

              <div className="mt-6 border-t pt-5 space-y-3">

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    ৳ {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-semibold">
                    ৳ {shipping.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Discount
                  </span>

                  <span className="font-semibold text-green-600">
                    -৳ {discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-xl font-bold text-red-600 border-t pt-4">
                  <span>
                    Total
                  </span>

                  <span>
                    ৳ {total.toLocaleString()}
                  </span>
                </div>

              </div>

            </>

          )}

        </div>

        {/* =====================================
            CHECKOUT FORM
        ====================================== */}

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
                setCustomerName(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 resize-none"
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
                setDeliveryArea(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
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

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) =>
                  setCoupon(
                    e.target.value
                  )
                }
                className="flex-1 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
              />

              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-xl font-semibold"
              >
                Apply
              </button>

            </div>

            <p className="text-sm text-gray-500 mt-2">
              Demo coupon:{" "}
              <span className="font-bold text-gray-700">
                IPHONE10
              </span>
            </p>

          </div>

          {/* Payment Method */}

          <div>

            <label className="block mb-2 font-semibold">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
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

            </select>

          </div>

          {/* bKash / Nagad */}

          {(paymentMethod === "bkash" ||
            paymentMethod === "nagad") && (

            <div className="space-y-4 bg-gray-50 border rounded-xl p-5">

              <div>

                <label className="block mb-2 font-semibold">
                  {paymentMethod === "bkash"
                    ? "bKash Number"
                    : "Nagad Number"}
                </label>

                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={paymentNumber}
                  onChange={(e) =>
                    setPaymentNumber(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 font-semibold">
                  Transaction ID
                </label>

                <input
                  type="text"
                  placeholder="Enter Transaction ID"
                  value={transactionId}
                  onChange={(e) =>
                    setTransactionId(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
                  required
                />

              </div>

            </div>

          )}

          {/* Security Notice */}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

            <p className="text-sm text-blue-800">
              🔒 Your payment information is
              used only for order verification.
              Card details are not stored in
              the database.
            </p>

          </div>

          {/* Final Total */}

          <div className="bg-gray-50 border rounded-xl p-5">

            <div className="flex justify-between text-gray-600">
              <span>
                Subtotal
              </span>

              <span>
                ৳ {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 mt-2">
              <span>
                Delivery
              </span>

              <span>
                ৳ {shipping.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-green-600 mt-2">
              <span>
                Discount
              </span>

              <span>
                -৳ {discount.toLocaleString()}
              </span>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between text-xl sm:text-2xl font-bold">

              <span>
                Grand Total
              </span>

              <span className="text-red-600">
                ৳ {total.toLocaleString()}
              </span>

            </div>

          </div>

          {/* Place Order */}

          <button
            type="submit"
            disabled={
              saving ||
              cart.length === 0
            }
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg transition"
          >

            {saving
              ? "⏳ Placing Order..."
              : "🛍️ Place Order"}

          </button>

        </form>

      </div>

    </main>
  );
}