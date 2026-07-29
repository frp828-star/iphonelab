"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useSearch } from "../context/SearchContext";
type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  stock?: boolean;
  freeDelivery?: boolean;
  warranty?: string;
  image: string;
  category: string;
  description?: string;
  slug?: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { search, setSearch } = useSearch();
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(50000);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    async function loadProducts() {
      try {
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
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((product) => product.category))
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    const matchesPrice = product.price <= maxPrice;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice
    );
  });

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h1 className="text-4xl font-bold text-red-600">
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

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">

          <div className="grid md:grid-cols-3 gap-5">

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
                className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
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

          </div>

          {/* Filter Info */}
          <div className="mt-5 flex flex-col sm:flex-row sm:justify-between gap-3">

            <p className="text-gray-500">
              Showing{" "}
              <span className="font-bold text-black">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setMaxPrice(50000);
              }}
              className="text-red-600 font-semibold hover:underline text-left sm:text-right"
            >
              Reset Filters
            </button>

          </div>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

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

            <p className="text-gray-500">
              Try changing your search or filters.
            </p>

          </div>
        ) : (
          /* Products */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >

                {/* Image */}
                <Link
                  href={`/product/${product.id}`}
                  className="block bg-gray-50 p-5"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-contain hover:scale-105 transition"
                  />
                </Link>

                {/* Product Info */}
                <div className="p-5">

                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>

                  <Link
                    href={`/product/${product.id}`}
                  >
                    <h2 className="text-xl font-bold mt-1 hover:text-red-600">
                      {product.name}
                    </h2>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">

                    <span className="text-yellow-500">
                      ⭐⭐⭐⭐⭐
                    </span>

                    <span className="text-sm text-gray-500">
                      {product.rating ?? 5} (
                      {product.reviews ?? 0})
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

                    {product.oldPrice && (
                      <span className="text-gray-400 line-through">
                        ৳{" "}
                        {Number(
                          product.oldPrice
                        ).toLocaleString()}
                      </span>
                    )}

                    {product.discount && (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                        -{product.discount}%
                      </span>
                    )}

                  </div>

                  {/* Stock */}
                  <div className="mt-3">

                    {product.stock === false ? (
                      <span className="text-red-600 font-semibold text-sm">
                        ❌ Out of Stock
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold text-sm">
                        ✅ In Stock
                      </span>
                    )}

                  </div>

                  {/* Buttons */}
                  <div className="mt-5 space-y-3">

                    <button
                      type="button"
                      disabled={product.stock === false}
                      onClick={() =>
                        addToCart({
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          quantity: 1,
                        })
                      }
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold"
                    >
                      🛒 Add To Cart
                    </button>

                    <div className="grid grid-cols-2 gap-3">

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
                        className="bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold"
                      >
                        ❤️ Wishlist
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        className="bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-center"
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