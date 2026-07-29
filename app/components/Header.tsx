"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { search, setSearch } = useSearch();

  useEffect(() => {
    const checkCustomer = () => {
      const isLoggedIn =
        localStorage.getItem("customerLoggedIn");

      const savedCustomer =
        localStorage.getItem("customer");

      if (isLoggedIn === "true" && savedCustomer) {
        try {
          const customer = JSON.parse(savedCustomer);

          setLoggedIn(true);
          setCustomerName(customer.name || "");
        } catch (error) {
          console.error(error);
        }
      } else {
        setLoggedIn(false);
        setCustomerName("");
      }
    };

    checkCustomer();

    window.addEventListener(
      "customerLoginChanged",
      checkCustomer
    );

    window.addEventListener(
      "storage",
      checkCustomer
    );

    return () => {
      window.removeEventListener(
        "customerLoginChanged",
        checkCustomer
      );

      window.removeEventListener(
        "storage",
        checkCustomer
      );
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("customerLoggedIn");
    localStorage.removeItem("customer");

    setLoggedIn(false);
    setCustomerName("");
    setMenuOpen(false);

    window.dispatchEvent(
      new Event("customerLoginChanged")
    );

    window.location.href = "/";
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

        {/* Main Header */}
        <div className="flex items-center justify-between gap-5">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="text-3xl font-bold text-red-600 whitespace-nowrap"
          >
            iPhone Lab
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="px-5 py-3 w-56 lg:w-72 outline-none text-base"
            />

            <span className="px-4 text-gray-500 text-2xl">
              🔍
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">

            <Link
              href="/"
              className="font-bold text-lg hover:text-red-600 transition"
            >
              🏠 Home
            </Link>

            <Link
              href="/shop"
              className="font-bold text-lg hover:text-red-600 transition"
            >
              🛍️ Shop
            </Link>

            <Link
              href="/wishlist"
              className="font-bold text-lg hover:text-red-600 transition"
            >
              ❤️ Wishlist
            </Link>

            <Link
              href="/cart"
              className="font-bold text-lg hover:text-red-600 transition"
            >
              🛒 Cart
            </Link>

          </nav>

          {/* Customer Area */}
          <div className="flex items-center gap-3">

            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-xl font-bold text-base hidden sm:block transition"
                >
                  👤 {customerName || "Account"}
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-base transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border border-red-600 text-red-600 hover:bg-red-50 px-5 py-3 rounded-xl font-bold text-base transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-base transition"
                >
                  Signup
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-3xl font-bold ml-1 px-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>

        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-5">
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-5 py-3 outline-none text-base"
            />

            <span className="px-4 text-gray-500 text-2xl">
              🔍
            </span>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-5 border-t pt-4">

            <nav className="flex flex-col gap-1">

              <Link
                href="/"
                onClick={closeMenu}
                className="font-bold text-lg py-3 px-3 rounded-lg hover:bg-red-50 hover:text-red-600"
              >
                🏠 Home
              </Link>

              <Link
                href="/shop"
                onClick={closeMenu}
                className="font-bold text-lg py-3 px-3 rounded-lg hover:bg-red-50 hover:text-red-600"
              >
                🛍️ Shop
              </Link>

              <Link
                href="/wishlist"
                onClick={closeMenu}
                className="font-bold text-lg py-3 px-3 rounded-lg hover:bg-red-50 hover:text-red-600"
              >
                ❤️ Wishlist
              </Link>

              <Link
                href="/cart"
                onClick={closeMenu}
                className="font-bold text-lg py-3 px-3 rounded-lg hover:bg-red-50 hover:text-red-600"
              >
                🛒 Cart
              </Link>

              {loggedIn && (
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="sm:hidden font-bold text-lg py-3 px-3 rounded-lg hover:bg-gray-100"
                >
                  👤 {customerName || "Account"}
                </Link>
              )}

            </nav>

          </div>
        )}

      </div>

    </header>
  );
}