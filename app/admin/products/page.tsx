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
      const res = await fetch("/api/products");
      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-red-600">
            📦 Manage Products
          </h1>

          <Link
            href="/admin/products/add"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            ➕ Add Product
          </Link>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="w-full">

            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500"
                  >
                    Loading Products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500"
                  >
                    No Products Found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Image */}
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-contain"
                      />
                    </td>

                    {/* Product Name */}
                    <td className="p-4 font-semibold">
                      {product.name}
                    </td>

                    {/* Price */}
                    <td className="p-4 text-red-600 font-bold">
                      ৳ {product.price.toLocaleString()}
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      {product.stock ? (
                        <span className="text-green-600 font-semibold">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-3">

                        {/* Edit */}
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Product Deleted Successfully");

        setProducts((prev) =>
          prev.filter((item) => item.id !== product.id)
        );
      } else {
        alert(`❌ ${data.error || "Failed to delete product"}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong");
    }
  }}
  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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

        {/* Back */}
        <div className="mt-8">
          <Link
            href="/admin"
            className="text-red-600 font-semibold"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}