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
      const isLoggedIn = localStorage.getItem("customerLoggedIn");
      const savedCustomer = localStorage.getItem("customer");

      if (isLoggedIn === "true" && savedCustomer) {
        try {
          const customer = JSON.parse(savedCustomer);

          setLoggedIn(true);
          setCustomerName(customer.name || "");
        } catch (error) {
          console.error(error);
          setLoggedIn(false);
          setCustomerName("");
        }
      } else {
        setLoggedIn(false);
        setCustomerName("");
      }
    };

    checkCustomer();

    window.addEventListener("customerLoginChanged", checkCustomer);
    window.addEventListener("storage", checkCustomer);

    return () => {
      window.removeEventListener(
        "customerLoginChanged",
        checkCustomer
      );

      window.removeEventListener("storage", checkCustomer);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("customerLoggedIn");
    localStorage.removeItem("customer");

    setLoggedIn(false);
    setCustomerName("");
    setMenuOpen(false);

    window.dispatchEvent(new Event("customerLoginChanged"));

    window.location.href = "/";
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* =========================================
            MAIN HEADER
        ========================================== */}

        <div className="min-h-[78px] flex items-center justify-between gap-4">

          {/* =======================================
              iPhone Lab LOGO
          ======================================== */}

          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center shrink-0"
            aria-label="iPhone Lab Home"
          >
            <span className="flex items-center leading-none whitespace-nowrap">

              {/* iPhone */}

              <span
                className="
                  text-[28px]
                  sm:text-[31px]
                  font-black
                  tracking-[-1.5px]
                  text-gray-950
                  group-hover:text-gray-800
                  transition-colors
                "
              >
                iPhone
              </span>

              {/* Lab */}

              <span
                className="
                  ml-1
                  text-[28px]
                  sm:text-[31px]
                  font-black
                  tracking-[-1.5px]
                  text-red-600
                  group-hover:text-red-700
                  transition-colors
                "
              >
                Lab
              </span>

            </span>
          </Link>

          {/* =======================================
              DESKTOP SEARCH
          ======================================== */}

          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-3">

            <div
              className="
                flex
                w-full
                items-center
                overflow-hidden
                rounded-xl
                border
                border-gray-300
                bg-gray-50
                transition
                focus-within:border-red-500
                focus-within:ring-2
                focus-within:ring-red-100
              "
            >
              <span className="pl-4 text-gray-400 text-lg">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="
                  w-full
                  bg-transparent
                  px-3
                  py-3
                  outline-none
                  text-gray-900
                  placeholder:text-gray-400
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mr-3 text-gray-400 hover:text-red-600 transition"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* =======================================
              DESKTOP NAVIGATION
          ======================================== */}

          <nav className="hidden lg:flex items-center gap-1">

            <Link
              href="/"
              className="
                px-3
                py-2
                rounded-lg
                font-semibold
                text-gray-700
                hover:bg-red-50
                hover:text-red-600
                transition
              "
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="
                px-3
                py-2
                rounded-lg
                font-semibold
                text-gray-700
                hover:bg-red-50
                hover:text-red-600
                transition
              "
            >
              Shop
            </Link>

            <Link
              href="/wishlist"
              className="
                px-3
                py-2
                rounded-lg
                font-semibold
                text-gray-700
                hover:bg-red-50
                hover:text-red-600
                transition
              "
            >
              ❤️ Wishlist
            </Link>

            <Link
              href="/cart"
              className="
                px-3
                py-2
                rounded-lg
                font-semibold
                text-gray-700
                hover:bg-red-50
                hover:text-red-600
                transition
              "
            >
              🛒 Cart
            </Link>

          </nav>

          {/* =======================================
              CUSTOMER AREA
          ======================================== */}

          <div className="flex items-center gap-2 shrink-0">

            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    bg-gray-100
                    hover:bg-gray-200
                    px-4
                    py-2.5
                    rounded-xl
                    font-semibold
                    text-gray-800
                    transition
                  "
                >
                  <span>👤</span>

                  <span className="max-w-[100px] truncate">
                    {customerName || "Account"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="
                    hidden
                    sm:block
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-4
                    py-2.5
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="
                    hidden
                    sm:block
                    border
                    border-red-600
                    text-red-600
                    hover:bg-red-50
                    px-4
                    py-2.5
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="
                    hidden
                    sm:block
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-4
                    py-2.5
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Signup
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                lg:hidden
                w-11
                h-11
                flex
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                bg-white
                text-2xl
                hover:bg-gray-50
                transition
              "
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>
        </div>

        {/* =========================================
            MOBILE SEARCH
        ========================================== */}

        <div className="md:hidden pb-4">

          <div
            className="
              flex
              items-center
              overflow-hidden
              rounded-xl
              border
              border-gray-300
              bg-gray-50
              focus-within:border-red-500
              focus-within:ring-2
              focus-within:ring-red-100
              transition
            "
          >
            <span className="pl-4 text-gray-400 text-lg">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="
                flex-1
                bg-transparent
                px-3
                py-3
                outline-none
                text-gray-900
                placeholder:text-gray-400
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mr-3 text-gray-400 hover:text-red-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* =========================================
            MOBILE MENU
        ========================================== */}

        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">

            <nav className="flex flex-col gap-1">

              <Link
                href="/"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  font-semibold
                  text-gray-800
                  hover:bg-red-50
                  hover:text-red-600
                  transition
                "
              >
                🏠
                <span>Home</span>
              </Link>

              <Link
                href="/shop"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  font-semibold
                  text-gray-800
                  hover:bg-red-50
                  hover:text-red-600
                  transition
                "
              >
                🛍️
                <span>Shop</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  font-semibold
                  text-gray-800
                  hover:bg-red-50
                  hover:text-red-600
                  transition
                "
              >
                ❤️
                <span>Wishlist</span>
              </Link>

              <Link
                href="/cart"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  font-semibold
                  text-gray-800
                  hover:bg-red-50
                  hover:text-red-600
                  transition
                "
              >
                🛒
                <span>Cart</span>
              </Link>

              <div className="my-2 border-t border-gray-200" />

              {loggedIn ? (
                <>
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      font-semibold
                      text-gray-800
                      hover:bg-gray-100
                      transition
                    "
                  >
                    👤
                    <span>
                      {customerName || "Account"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      rounded-xl
                      font-semibold
                      text-red-600
                      hover:bg-red-50
                      transition
                    "
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-1">

                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="
                      border
                      border-red-600
                      text-red-600
                      hover:bg-red-50
                      py-3
                      rounded-xl
                      text-center
                      font-bold
                      transition
                    "
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      py-3
                      rounded-xl
                      text-center
                      font-bold
                      transition
                    "
                  >
                    Signup
                  </Link>

                </div>
              )}

            </nav>
          </div>
        )}

      </div>
    </header>
  );
}