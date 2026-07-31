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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [featured, setFeatured] = useState(true);

  // Product Labels
  const [hotSale, setHotSale] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [premiumProduct, setPremiumProduct] = useState(false);

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Image select
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert("❌ Please select an image file.");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Image must be smaller than 5MB.");
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Clear old URL if any
    setImage("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("❌ Please select a product image.");
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // STEP 1: Upload image to Supabase Storage
      // ==========================================

      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      setUploading(false);

      if (!uploadRes.ok || !uploadData.url) {
        console.error("Upload response:", uploadData);

        alert(
          `❌ Image upload failed: ${
            uploadData.error || "Unknown error"
          }`
        );

        setLoading(false);
        return;
      }

      const uploadedImageUrl = uploadData.url;

      setImage(uploadedImageUrl);

      // ==========================================
      // STEP 2: Create product
      // ==========================================

      const product = {
        name,
        category,

        price: Number(price),

        oldPrice: oldPrice
          ? Number(oldPrice)
          : undefined,

        discount: discount
          ? Number(discount)
          : undefined,

        rating: rating
          ? Number(rating)
          : 5,

        reviews: reviews
          ? Number(reviews)
          : 0,

        stock,
        freeDelivery,
        warranty,

        // Automatically uploaded image URL
        image: uploadedImageUrl,

        featured,

        // Product Labels
        hotSale,
        bestSeller,
        premiumProduct,

        description,
      };

      const res = await fetch("/api/products", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Product Added Successfully!");

        window.location.href = "/admin/products";
      } else {
        console.error("Product add error:", data);

        alert(
          `❌ Failed to Add Product: ${
            data.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error(error);

      alert("❌ Something went wrong.");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 md:px-10">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 mb-4"
          >
            ← Back to Products
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  ➕ Add New Product
                </h1>

                <p className="text-gray-500 mt-2">
                  Add a new product to your iPhone Lab store.
                </p>
              </div>

              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold">
                🛍️ Product Management
              </div>

            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Basic Information */}
          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                📋 Basic Information
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Enter the main information about your product.
              </p>
            </div>

            <div className="space-y-6">

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
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="Display">Display</option>
                  <option value="Battery">Battery</option>
                  <option value="Charger">Charger</option>
                  <option value="AirPods">AirPods</option>
                  <option value="Back Glass">Back Glass</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                💰 Pricing
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Set the current price and discount information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Current Price */}
              <div>
                <label className="block font-semibold mb-2">
                  Current Price (৳)
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="18500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Old Price */}
              <div>
                <label className="block font-semibold mb-2">
                  Old Price (৳)
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="20000"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block font-semibold mb-2">
                  Discount (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="8"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Warranty */}
              <div>
                <label className="block font-semibold mb-2">
                  Warranty
                </label>

                <input
                  type="text"
                  placeholder="6 Months"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

            </div>
          </section>

          {/* Product Details */}
          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                ⭐ Product Details
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Add rating, reviews and product description.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Rating */}
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
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Reviews */}
              <div>
                <label className="block font-semibold mb-2">
                  Reviews
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="12"
                  value={reviews}
                  onChange={(e) => setReviews(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">

                <label className="block font-semibold mb-2">
                  Description
                </label>

                <textarea
                  rows={6}
                  placeholder="Write product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />

              </div>

            </div>
          </section>

          {/* Product Image */}
          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                🖼️ Product Image
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Select a product image. It will be uploaded automatically.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-red-400 transition">

              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <label
                htmlFor="product-image"
                className="cursor-pointer block"
              >

                <div className="text-5xl mb-3">
                  🖼️
                </div>

                <p className="font-bold text-gray-800">
                  Click to select product image
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG, WEBP or other image formats • Max 5MB
                </p>

                {selectedFile && (
                  <p className="text-sm text-red-600 font-semibold mt-3">
                    Selected: {selectedFile.name}
                  </p>
                )}

              </label>

            </div>

            {/* Image Preview */}
            {preview && (
              <div className="mt-6 border rounded-2xl p-5 bg-gray-50">

                <p className="text-sm font-bold mb-4">
                  👁️ Image Preview
                </p>

                <div className="flex justify-center">

                  <img
                    src={preview}
                    alt="Product preview"
                    className="w-64 h-64 object-contain bg-white rounded-2xl border"
                  />

                </div>

              </div>
            )}

          </section>

          {/* Product Labels */}
          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                🏷️ Product Labels
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Select badges that should appear on this product.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Hot Sale */}
              <label className="flex items-center gap-3 border border-red-200 bg-red-50 rounded-xl p-4 cursor-pointer hover:bg-red-100 transition">

                <input
                  type="checkbox"
                  checked={hotSale}
                  onChange={(e) =>
                    setHotSale(e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>
                  <p className="font-bold text-red-600">
                    🔥 Hot Sale
                  </p>

                  <p className="text-xs text-gray-500">
                    Special sale product
                  </p>
                </div>

              </label>

              {/* Best Seller */}
              <label className="flex items-center gap-3 border border-yellow-200 bg-yellow-50 rounded-xl p-4 cursor-pointer hover:bg-yellow-100 transition">

                <input
                  type="checkbox"
                  checked={bestSeller}
                  onChange={(e) =>
                    setBestSeller(e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>
                  <p className="font-bold text-yellow-700">
                    🏆 Best Seller
                  </p>

                  <p className="text-xs text-gray-500">
                    Popular customer choice
                  </p>
                </div>

              </label>

              {/* Premium Product */}
              <label className="flex items-center gap-3 border border-purple-200 bg-purple-50 rounded-xl p-4 cursor-pointer hover:bg-purple-100 transition">

                <input
                  type="checkbox"
                  checked={premiumProduct}
                  onChange={(e) =>
                    setPremiumProduct(e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>
                  <p className="font-bold text-purple-700">
                    👑 Premium Product
                  </p>

                  <p className="text-xs text-gray-500">
                    Premium quality product
                  </p>
                </div>

              </label>

            </div>

          </section>

          {/* Inventory & Delivery */}
          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                📦 Inventory & Delivery
              </h2>
            </div>

            {/* Stock */}
            <div className="mb-6">

              <label className="block font-semibold mb-2">
                Stock Status
              </label>

              <select
                value={stock ? "In Stock" : "Out of Stock"}
                onChange={(e) =>
                  setStock(e.target.value === "In Stock")
                }
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>
              </select>

            </div>

            {/* Free Delivery + Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">

                <input
                  type="checkbox"
                  checked={freeDelivery}
                  onChange={(e) =>
                    setFreeDelivery(e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-medium">
                  🚚 Free Delivery
                </span>

              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">

                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-medium">
                  ⭐ Featured Product
                </span>

              </label>

            </div>

          </section>

          {/* Buttons */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">

              <Link
                href="/admin/products"
                className="border-2 border-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading || uploading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                {uploading
                  ? "Uploading Image..."
                  : loading
                  ? "Adding Product..."
                  : "➕ Add Product"}
              </button>

            </div>

          </div>

        </form>
      </div>
    </main>
  );
}