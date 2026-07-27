"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Display");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("5");
  const [reviews, setReviews] = useState("0");
  const [stock, setStock] = useState(true);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [warranty, setWarranty] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(true);
  const [sale, setSale] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const product = {
      name,
      category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      discount: discount ? Number(discount) : undefined,
      rating: rating ? Number(rating) : 5,
      reviews: reviews ? Number(reviews) : 0,
      stock,
      freeDelivery,
      warranty,
      image,
      featured,
      sale,
      description,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        alert("✅ Product Added Successfully");
        window.location.href = "/admin/products";
      } else {
        alert("❌ Failed to Add Product");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-red-600 mb-8">
          ➕ Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product Name */}
          <div>
            <label className="block font-semibold mb-2">
              Product Name
            </label>

            <input
              type="text"
              placeholder="iPhone 16 Battery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-xl p-4"
            >
              <option value="Display">Display</option>
              <option value="Battery">Battery</option>
              <option value="Charger">Charger</option>
              <option value="AirPods">AirPods</option>
              <option value="Back Glass">Back Glass</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Price */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block font-semibold mb-2">
                Current Price (৳)
              </label>

              <input
                type="number"
                placeholder="18500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full border rounded-xl p-4"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Old Price (৳)
              </label>

              <input
                type="number"
                placeholder="20000"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="w-full border rounded-xl p-4"
              />
            </div>

          </div>

          {/* Discount + Rating */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block font-semibold mb-2">
                Discount (%)
              </label>

              <input
                type="number"
                placeholder="8"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full border rounded-xl p-4"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Rating
              </label>

              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full border rounded-xl p-4"
              />
            </div>

          </div>

          {/* Reviews + Warranty */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block font-semibold mb-2">
                Reviews
              </label>

              <input
                type="number"
                placeholder="12"
                value={reviews}
                onChange={(e) => setReviews(e.target.value)}
                className="w-full border rounded-xl p-4"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Warranty
              </label>

              <input
                type="text"
                placeholder="6 Months"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="w-full border rounded-xl p-4"
              />
            </div>

          </div>

          {/* Image */}
          <div>
            <label className="block font-semibold mb-2">
              Product Image URL
            </label>

            <input
              type="text"
              placeholder="/products/product.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="w-full border rounded-xl p-4"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Write product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-xl p-4"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block font-semibold mb-2">
              Stock Status
            </label>

            <select
              value={stock ? "In Stock" : "Out of Stock"}
              onChange={(e) => setStock(e.target.value === "In Stock")}
              className="w-full border rounded-xl p-4"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="grid md:grid-cols-3 gap-5">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={freeDelivery}
                onChange={(e) => setFreeDelivery(e.target.checked)}
                className="w-5 h-5"
              />
              <span>Free Delivery</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5"
              />
              <span>Featured Product</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={sale}
                onChange={(e) => setSale(e.target.checked)}
                className="w-5 h-5"
              />
              <span>Sale Product</span>
            </label>

          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "Adding..." : "➕ Add Product"}
            </button>

            <Link
              href="/admin/products"
              className="border-2 border-black px-8 py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition"
            >
              Cancel
            </Link>

          </div>

        </form>
      </div>
    </main>
  );
}