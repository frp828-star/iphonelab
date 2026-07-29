"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock?: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (product) => product.stock !== false
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock === false
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">
                Admin Management
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-red-600">
                📦 Product Management
              </h1>

              <p className="text-gray-500 mt-2">
                Add, edit and manage products available in your store.
              </p>
            </div>

            <Link
              href="/admin/products/add"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-lg transition text-center"
            >
              ➕ Add New Product
            </Link>

          </div>

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          {/* Total Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-semibold">
                  Total Products
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? "—" : totalProducts}
                </p>
              </div>

              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl">
                📦
              </div>

            </div>

          </div>

          {/* In Stock */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-semibold">
                  In Stock
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {loading ? "—" : inStockProducts}
                </p>
              </div>

              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">
                ✅
              </div>

            </div>

          </div>

          {/* Out of Stock */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 font-semibold">
                  Out of Stock
                </p>

                <p className="text-3xl font-bold text-red-600 mt-2">
                  {loading ? "—" : outOfStockProducts}
                </p>
              </div>

              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl">
                ❌
              </div>

            </div>

          </div>

        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Table Header */}
          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold text-gray-800">
              All Products
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your current product inventory.
            </p>

          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="bg-red-600 text-white">

                <tr>

                  <th className="p-4 text-left font-bold">
                    Image
                  </th>

                  <th className="p-4 text-left font-bold">
                    Product
                  </th>

                  <th className="p-4 text-left font-bold">
                    Price
                  </th>

                  <th className="p-4 text-left font-bold">
                    Stock
                  </th>

                  <th className="p-4 text-left font-bold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-16 text-gray-500"
                    >
                      <div className="text-4xl mb-3">
                        📦
                      </div>

                      <p className="font-semibold text-lg">
                        Loading Products...
                      </p>
                    </td>
                  </tr>

                ) : products.length === 0 ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-16 text-gray-500"
                    >
                      <div className="text-5xl mb-4">
                        📦
                      </div>

                      <p className="font-bold text-xl text-gray-700">
                        No Products Found
                      </p>

                      <p className="mt-2">
                        Add your first product to get started.
                      </p>

                    </td>
                  </tr>

                ) : (

                  products.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >

                      {/* Image */}
                      <td className="p-4">

                        <div className="w-20 h-20 bg-gray-50 border rounded-xl flex items-center justify-center">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-contain"
                          />

                        </div>

                      </td>

                      {/* Product Name */}
                      <td className="p-4">

                        <p className="font-bold text-gray-800 text-lg">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          Product ID: #{product.id}
                        </p>

                      </td>

                      {/* Price */}
                      <td className="p-4">

                        <span className="text-red-600 font-bold text-lg">
                          ৳ {Number(product.price).toLocaleString()}
                        </span>

                      </td>

                      {/* Stock */}
                      <td className="p-4">

                        {product.stock ? (

                          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-full font-semibold text-sm">
                            <span>●</span>
                            In Stock
                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-full font-semibold text-sm">
                            <span>●</span>
                            Out of Stock
                          </span>

                        )}

                      </td>

                      {/* Actions */}
                      <td className="p-4">

                        <div className="flex flex-wrap gap-2">

                          {/* Edit */}
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            ✏️ Edit
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={async () => {

                              const confirmed = window.confirm(
                                `Are you sure you want to delete "${product.name}"?`
                              );

                              if (!confirmed) return;

                              try {

                                const res = await fetch(
                                  "/api/products",
                                  {
                                    method: "DELETE",
                                    headers: {
                                      "Content-Type":
                                        "application/json",
                                    },
                                    body: JSON.stringify({
                                      id: product.id,
                                    }),
                                  }
                                );

                                const data =
                                  await res.json();

                                if (res.ok) {

                                  alert(
                                    "✅ Product Deleted Successfully"
                                  );

                                  setProducts((prev) =>
                                    prev.filter(
                                      (item) =>
                                        item.id !==
                                        product.id
                                    )
                                  );

                                } else {

                                  alert(
                                    `❌ ${
                                      data.error ||
                                      "Failed to delete product"
                                    }`
                                  );

                                }

                              } catch (error) {

                                console.error(error);

                                alert(
                                  "❌ Something went wrong"
                                );

                              }

                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Back */}
        <div className="mt-8">

          <Link
            href="/admin"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-bold"
          >
            ← Back to Admin Dashboard
          </Link>

        </div>

      </div>
    </main>
  );
}