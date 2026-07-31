"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useSearch } from "../context/SearchContext";

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  rating?: number | null;
  reviews?: number | null;
  stock?: boolean;
  freeDelivery?: boolean;
  warranty?: string | null;
  image: string;
  category: string;
  description?: string | null;
  slug?: string;

  featured?: boolean;
  sale?: boolean;
  hotSale?: boolean;
  bestSeller?: boolean;
  premiumProduct?: boolean;
};

type SortOption =
  | "default"
  | "price-low"
  | "price-high"
  | "rating-high"
  | "name-az"
  | "name-za";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { search, setSearch } = useSearch();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(50000);

  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] =
    useState<SortOption>("default");

  const [saleOnly, setSaleOnly] = useState(false);
  const [freeDeliveryOnly, setFreeDeliveryOnly] =
    useState(false);
  const [bestSellerOnly, setBestSellerOnly] =
    useState(false);
  const [hotSaleOnly, setHotSaleOnly] =
    useState(false);
  const [premiumOnly, setPremiumOnly] =
    useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          products
            .map((product) => product.category)
            .filter(Boolean)
        )
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const productName = product.name.toLowerCase();
      const searchText = search.toLowerCase();

      const matchesSearch =
        productName.includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesPrice =
        Number(product.price) <= maxPrice;

      const matchesRating =
        Number(product.rating ?? 0) >= minRating;

      const matchesSale =
        !saleOnly || product.sale === true;

      const matchesFreeDelivery =
        !freeDeliveryOnly ||
        product.freeDelivery === true;

      const matchesBestSeller =
        !bestSellerOnly ||
        product.bestSeller === true;

      const matchesHotSale =
        !hotSaleOnly ||
        product.hotSale === true;

      const matchesPremium =
        !premiumOnly ||
        product.premiumProduct === true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesSale &&
        matchesFreeDelivery &&
        matchesBestSeller &&
        matchesHotSale &&
        matchesPremium
      );
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case "price-low":
        sorted.sort(
          (a, b) =>
            Number(a.price) - Number(b.price)
        );
        break;

      case "price-high":
        sorted.sort(
          (a, b) =>
            Number(b.price) - Number(a.price)
        );
        break;

      case "rating-high":
        sorted.sort(
          (a, b) =>
            Number(b.rating ?? 0) -
            Number(a.rating ?? 0)
        );
        break;

      case "name-az":
        sorted.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "name-za":
        sorted.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      default:
        break;
    }

    return sorted;
  }, [
    products,
    search,
    category,
    maxPrice,
    minRating,
    sortBy,
    saleOnly,
    freeDeliveryOnly,
    bestSellerOnly,
    hotSaleOnly,
    premiumOnly,
  ]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice(50000);
    setMinRating(0);
    setSortBy("default");

    setSaleOnly(false);
    setFreeDeliveryOnly(false);
    setBestSellerOnly(false);
    setHotSaleOnly(false);
    setPremiumOnly(false);
  };

  const activeFilterCount = [
    category !== "All",
    maxPrice !== 50000,
    minRating > 0,
    sortBy !== "default",
    saleOnly,
    freeDeliveryOnly,
    bestSellerOnly,
    hotSaleOnly,
    premiumOnly,
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-red-600">
                🛍️ Shop
              </h1>

              <p className="text-gray-500 mt-2">
                Find premium iPhone parts and accessories
              </p>
            </div>

            <Link
              href="/"
              className="border-2 border-black px-5 py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition text-center"
            >
              ← Home
            </Link>

          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">

        {/* Filter Box */}
        <section className="bg-white rounded-2xl shadow-lg p-5 md:p-7 mb-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

            <div>
              <h2 className="text-2xl font-bold">
                🔎 Product Filters
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Find exactly what you need
              </p>
            </div>

            {activeFilterCount > 0 && (
              <span className="inline-flex w-fit bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                {activeFilterCount} filter
                {activeFilterCount > 1 ? "s" : ""} active
              </span>
            )}

          </div>

          {/* Main Filters */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Search */}
            <div>
              <label className="block font-semibold mb-2">
                🔎 Search Product
              </label>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-2">
                📂 Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Maximum Price */}
            <div>
              <label className="block font-semibold mb-2">
                💰 Maximum Price
              </label>

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block font-semibold mb-2">
                ⭐ Minimum Rating
              </label>

              <select
                value={minRating}
                onChange={(e) =>
                  setMinRating(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value={0}>
                  All Ratings
                </option>
                <option value={4}>
                  ⭐ 4+ Rating
                </option>
                <option value={4.5}>
                  ⭐ 4.5+ Rating
                </option>
                <option value={5}>
                  ⭐ 5 Rating
                </option>
              </select>
            </div>

          </div>

          {/* Sort */}
          <div className="mt-5">

            <label className="block font-semibold mb-2">
              ↕️ Sort Products
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as SortOption
                )
              }
              className="w-full md:w-80 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="default">
                Default
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating-high">
                Highest Rated
              </option>

              <option value="name-az">
                Name: A to Z
              </option>

              <option value="name-za">
                Name: Z to A
              </option>
            </select>

          </div>

          {/* Advanced Filters */}
          <div className="mt-7 border-t pt-6">

            <h3 className="font-bold text-lg mb-4">
              🏷️ Advanced Filters
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">

              {/* Sale */}
              <label className="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer hover:bg-red-50 transition">

                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) =>
                    setSaleOnly(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-semibold">
                  🔥 Sale Only
                </span>

              </label>

              {/* Free Delivery */}
              <label className="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer hover:bg-green-50 transition">

                <input
                  type="checkbox"
                  checked={freeDeliveryOnly}
                  onChange={(e) =>
                    setFreeDeliveryOnly(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-semibold">
                  🚚 Free Delivery
                </span>

              </label>

              {/* Best Seller */}
              <label className="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer hover:bg-yellow-50 transition">

                <input
                  type="checkbox"
                  checked={bestSellerOnly}
                  onChange={(e) =>
                    setBestSellerOnly(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-semibold">
                  🏆 Best Seller
                </span>

              </label>

              {/* Hot Sale */}
              <label className="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer hover:bg-orange-50 transition">

                <input
                  type="checkbox"
                  checked={hotSaleOnly}
                  onChange={(e) =>
                    setHotSaleOnly(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-semibold">
                  🔥 Hot Sale
                </span>

              </label>

              {/* Premium */}
              <label className="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer hover:bg-purple-50 transition">

                <input
                  type="checkbox"
                  checked={premiumOnly}
                  onChange={(e) =>
                    setPremiumOnly(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-semibold">
                  💎 Premium
                </span>

              </label>

            </div>

          </div>

          {/* Filter Bottom */}
          <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t pt-5">

            <p className="text-gray-500">
              Showing{" "}
              <span className="font-bold text-black">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-black">
                {products.length}
              </span>{" "}
              products
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold transition"
            >
              🔄 Reset All Filters
            </button>

          </div>

        </section>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <div className="text-5xl mb-5">
              ⏳
            </div>

            <p className="text-xl font-semibold">
              Loading Products...
            </p>

          </div>
        ) : filteredProducts.length === 0 ? (

          /* No Products */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <div className="text-6xl mb-5">
              🔍
            </div>

            <h2 className="text-2xl font-bold mb-2">
              No Products Found
            </h2>

            <p className="text-gray-500 mb-6">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold"
            >
              🔄 Clear Filters
            </button>

          </div>

        ) : (

          /* Products */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map((product) => (

              <div
                key={product.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >

                {/* Badges */}
                <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">

                  {product.sale && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      SALE
                    </span>
                  )}

                  {product.hotSale && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🔥 HOT
                    </span>
                  )}

                  {product.bestSeller && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🏆 BEST SELLER
                    </span>
                  )}

                  {product.premiumProduct && (
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      💎 PREMIUM
                    </span>
                  )}

                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() =>
                    addToWishlist({
                      slug: String(product.id),
                      name: product.name,
                      price: Number(product.price),
                      image: product.image,
                    })
                  }
                  className="absolute right-3 top-3 z-20 rounded-full bg-white p-2.5 shadow-lg hover:bg-red-600 hover:text-white transition"
                  aria-label="Add to wishlist"
                >
                  ❤️
                </button>

                {/* Image */}
                <Link
                  href={`/product/${product.id}`}
                  className="block bg-gray-50 p-5"
                >
                  <div className="relative h-56 overflow-hidden">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />

                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5">

                  <p className="text-sm font-semibold text-red-600">
                    {product.category}
                  </p>

                  <Link
                    href={`/product/${product.id}`}
                  >
                    <h2 className="text-xl font-bold mt-1 line-clamp-2 hover:text-red-600 transition">
                      {product.name}
                    </h2>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">

                    <span className="text-yellow-500">
                      {"⭐".repeat(
                        Math.min(
                          5,
                          Math.max(
                            0,
                            Math.round(
                              Number(
                                product.rating ?? 0
                              )
                            )
                          )
                        )
                      )}
                    </span>

                    <span className="text-sm text-gray-500">
                      {Number(
                        product.rating ?? 0
                      ).toFixed(1)}{" "}
                      (
                      {product.reviews ?? 0}
                      )
                    </span>

                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mt-4 flex-wrap">

                    <span className="text-red-600 text-2xl font-bold">
                      ৳{" "}
                      {Number(
                        product.price
                      ).toLocaleString()}
                    </span>

                    {product.oldPrice &&
                      Number(product.oldPrice) >
                        Number(product.price) && (
                        <span className="text-gray-400 line-through">
                          ৳{" "}
                          {Number(
                            product.oldPrice
                          ).toLocaleString()}
                        </span>
                      )}

                    {product.discount &&
                      Number(product.discount) > 0 && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                          -{product.discount}%
                        </span>
                      )}

                  </div>

                  {/* Extra Info */}
                  <div className="mt-3 space-y-1 text-sm">

                    {product.stock === false ? (
                      <p className="text-red-600 font-semibold">
                        ❌ Out of Stock
                      </p>
                    ) : (
                      <p className="text-green-600 font-semibold">
                        ✅ In Stock
                      </p>
                    )}

                    {product.freeDelivery && (
                      <p className="text-green-600 font-semibold">
                        🚚 Free Delivery
                      </p>
                    )}

                    {product.warranty && (
                      <p className="text-gray-500">
                        🛡️ Warranty:{" "}
                        <span className="font-semibold text-gray-700">
                          {product.warranty}
                        </span>
                      </p>
                    )}

                  </div>

                  {/* Buttons */}
                  <div className="mt-5 space-y-3">

                    <button
                      type="button"
                      disabled={
                        product.stock === false
                      }
                      onClick={() =>
                        addToCart({
                          name: product.name,
                          price: Number(
                            product.price
                          ),
                          image: product.image,
                          quantity: 1,
                        })
                      }
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition"
                    >
                      🛒 Add To Cart
                    </button>

                    <div className="grid grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          addToWishlist({
                            slug: String(
                              product.id
                            ),
                            name: product.name,
                            price: Number(
                              product.price
                            ),
                            image: product.image,
                          })
                        }
                        className="bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition"
                      >
                        ❤️ Wishlist
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        className="bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-center transition"
                      >
                        👁️ Details
                      </Link>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}