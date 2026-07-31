"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  rating?: number | null;
  reviews?: number | null;
  stock?: boolean;
  freeDelivery?: boolean;
  warranty?: string | null;
  image: string;
  featured?: boolean;
  sale?: boolean;
  hotSale?: boolean;
  bestSeller?: boolean;
  premiumProduct?: boolean;
  description?: string | null;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Basic Information
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Display");

  // Pricing
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");

  // Product Details
  const [rating, setRating] = useState("5");
  const [reviews, setReviews] = useState("0");
  const [warranty, setWarranty] = useState("");

  // Image
  const [image, setImage] = useState("");

  // Description
  const [description, setDescription] = useState("");

  // Product Options
  const [stock, setStock] = useState(true);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [featured, setFeatured] = useState(true);
  const [sale, setSale] = useState(false);

  // Product Labels
  const [hotSale, setHotSale] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [premiumProduct, setPremiumProduct] = useState(false);

  // Load Product
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);

        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data: Product[] = await res.json();

        const found = data.find((item) => item.id === id);

        if (!found) {
          setProduct(null);
          return;
        }

        setProduct(found);

        // Basic Information
        setName(found.name);
        setCategory(found.category);

        // Pricing
        setPrice(String(found.price));

        setOldPrice(
          found.oldPrice !== null &&
            found.oldPrice !== undefined
            ? String(found.oldPrice)
            : ""
        );

        setDiscount(
          found.discount !== null &&
            found.discount !== undefined
            ? String(found.discount)
            : ""
        );

        // Product Details
        setRating(
          found.rating !== null &&
            found.rating !== undefined
            ? String(found.rating)
            : "5"
        );

        setReviews(
          found.reviews !== null &&
            found.reviews !== undefined
            ? String(found.reviews)
            : "0"
        );

        setWarranty(found.warranty ?? "");

        // Image
        setImage(found.image);

        // Description
        setDescription(found.description ?? "");

        // Options
        setStock(found.stock ?? true);
        setFreeDelivery(found.freeDelivery ?? false);
        setFeatured(found.featured ?? true);
        setSale(found.sale ?? false);

        // Product Labels
        setHotSale(found.hotSale ?? false);
        setBestSeller(found.bestSeller ?? false);
        setPremiumProduct(found.premiumProduct ?? false);
      } catch (error) {
        console.error("Load product error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Save Changes
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);

    const updatedProduct = {
      id,

      // Basic Information
      name: name.trim(),
      category,

      // Pricing
      price: Number(price),

      oldPrice:
        oldPrice.trim() !== ""
          ? Number(oldPrice)
          : null,

      discount:
        discount.trim() !== ""
          ? Number(discount)
          : null,

      // Product Details
      rating:
        rating.trim() !== ""
          ? Number(rating)
          : 5,

      reviews:
        reviews.trim() !== ""
          ? Number(reviews)
          : 0,

      warranty:
        warranty.trim() !== ""
          ? warranty.trim()
          : null,

      // Image
      image: image.trim(),

      // Description
      description:
        description.trim() !== ""
          ? description.trim()
          : null,

      // Options
      stock,
      freeDelivery,
      featured,
      sale,

      // Product Labels
      hotSale,
      bestSeller,
      premiumProduct,
    };

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Failed to update product"
        );
      }

      alert("✅ Product Updated Successfully");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Update product error:", error);

      alert(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="text-5xl mb-4">
            ⏳
          </div>

          <h1 className="text-2xl font-bold">
            Loading Product...
          </h1>

          <p className="text-gray-500 mt-2">
            Please wait while product information is loading.
          </p>
        </div>
      </main>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-5">
            😢
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Product Not Found
          </h1>

          <p className="text-gray-500 mb-7">
            The product you are trying to edit does not exist.
          </p>

          <Link
            href="/admin/products"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Admin Panel / Products / Edit
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-red-600">
              ✏️ Edit Product
            </h1>

            <p className="text-gray-500 mt-2">
              Update product information and settings.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="border-2 border-gray-300 bg-white hover:bg-gray-100 px-5 py-3 rounded-xl font-semibold transition text-center"
          >
            ← Back to Products
          </Link>

        </div>

        <form onSubmit={handleSubmit}>

          {/* ============================= */}
          {/* Product Information */}
          {/* ============================= */}

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="border-b pb-5 mb-6">

              <h2 className="text-2xl font-bold">
                📋 Product Information
              </h2>

              <p className="text-gray-500 mt-1">
                Update the basic information of this product.
              </p>

            </div>

            {/* Product Name */}
            <div className="mb-6">

              <label className="block font-semibold mb-2">
                Product Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                placeholder="iPhone 16 Display"
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />

            </div>

            {/* Category */}
            <div>

              <label className="block font-semibold mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              >
                <option value="Display">
                  Display
                </option>

                <option value="Battery">
                  Battery
                </option>

                <option value="Charger">
                  Charger
                </option>

                <option value="AirPods">
                  AirPods
                </option>

                <option value="Back Glass">
                  Back Glass
                </option>

                <option value="Accessories">
                  Accessories
                </option>
              </select>

            </div>

          </section>

          {/* ============================= */}
          {/* Pricing */}
          {/* ============================= */}

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="border-b pb-5 mb-6">

              <h2 className="text-2xl font-bold">
                💰 Pricing
              </h2>

              <p className="text-gray-500 mt-1">
                Manage current price, old price and discount.
              </p>

            </div>

            <div className="grid md:grid-cols-3 gap-5">

              {/* Current Price */}
              <div>

                <label className="block font-semibold mb-2">
                  Current Price (৳)
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  required
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
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
                  value={oldPrice}
                  onChange={(e) =>
                    setOldPrice(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
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
                  value={discount}
                  onChange={(e) =>
                    setDiscount(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
                />

              </div>

            </div>

          </section>

          {/* ============================= */}
          {/* Product Details */}
          {/* ============================= */}

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="border-b pb-5 mb-6">

              <h2 className="text-2xl font-bold">
                ⭐ Product Details
              </h2>

              <p className="text-gray-500 mt-1">
                Update rating, reviews and warranty information.
              </p>

            </div>

            <div className="grid md:grid-cols-3 gap-5">

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
                  value={rating}
                  onChange={(e) =>
                    setRating(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
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
                  value={reviews}
                  onChange={(e) =>
                    setReviews(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
                />

              </div>

              {/* Warranty */}
              <div>

                <label className="block font-semibold mb-2">
                  Warranty
                </label>

                <input
                  type="text"
                  value={warranty}
                  onChange={(e) =>
                    setWarranty(e.target.value)
                  }
                  placeholder="6 Months"
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
                />

              </div>

            </div>

          </section>

          {/* ============================= */}
          {/* Product Image */}
          {/* ============================= */}

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="border-b pb-5 mb-6">

              <h2 className="text-2xl font-bold">
                🖼️ Product Image
              </h2>

              <p className="text-gray-500 mt-1">
                Update the product image URL and preview it.
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">

              {/* Image URL */}
              <div>

                <label className="block font-semibold mb-2">
                  Product Image URL
                </label>

                <input
                  type="text"
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                  required
                  placeholder="/products/product.jpg"
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
                />

                <p className="text-sm text-gray-500 mt-2">
                  Example: /products/battery.jpg
                </p>

              </div>

              {/* Preview */}
              <div className="border rounded-2xl bg-gray-50 min-h-[220px] flex items-center justify-center p-5">

                {image ? (

                  <img
                    src={image}
                    alt={name || "Product preview"}
                    className="max-h-52 max-w-full object-contain"
                  />

                ) : (

                  <div className="text-center text-gray-400">

                    <div className="text-5xl mb-2">
                      🖼️
                    </div>

                    <p>
                      Image Preview
                    </p>

                  </div>

                )}

              </div>

            </div>

          </section>

          {/* ============================= */}
          {/* Description */}
          {/* ============================= */}

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="border-b pb-5 mb-6">

              <h2 className="text-2xl font-bold">
                📝 Description
              </h2>

              <p className="text-gray-500 mt-1">
                Write a clear description for customers.
              </p>

            </div>

            <textarea
              rows={7}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Write product description..."
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 resize-y"
            />

          </section>

          {/* ============================= */}
          {/* Stock & Product Options */}
          {/* ============================= */}

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="border-b pb-5 mb-6">

              <h2 className="text-2xl font-bold">
                📦 Stock & Product Options
              </h2>

              <p className="text-gray-500 mt-1">
                Control availability and product visibility.
              </p>

            </div>

            {/* Stock */}
            <div className="mb-6">

              <label className="block font-semibold mb-2">
                Stock Status
              </label>

              <select
                value={
                  stock
                    ? "In Stock"
                    : "Out of Stock"
                }
                onChange={(e) =>
                  setStock(
                    e.target.value === "In Stock"
                  )
                }
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"
              >

                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>

              </select>

            </div>

            {/* Options */}
            <div className="grid md:grid-cols-3 gap-4">

              {/* Free Delivery */}
              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">

                <input
                  type="checkbox"
                  checked={freeDelivery}
                  onChange={(e) =>
                    setFreeDelivery(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>

                  <p className="font-semibold">
                    🚚 Free Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Offer free delivery
                  </p>

                </div>

              </label>

              {/* Featured */}
              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">

                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>

                  <p className="font-semibold">
                    ⭐ Featured Product
                  </p>

                  <p className="text-sm text-gray-500">
                    Show as featured
                  </p>

                </div>

              </label>

              {/* Sale */}
              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">

                <input
                  type="checkbox"
                  checked={sale}
                  onChange={(e) =>
                    setSale(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>

                  <p className="font-semibold">
                    🔥 Sale Product
                  </p>

                  <p className="text-sm text-gray-500">
                    Show as sale item
                  </p>

                </div>

              </label>

            </div>

          </section>

          {/* ============================= */}
          {/* Product Labels */}
          {/* ============================= */}

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

            <div className="border-b pb-5 mb-6">

              <h2 className="text-2xl font-bold">
                🏷️ Product Labels
              </h2>

              <p className="text-gray-500 mt-1">
                Choose badges that should appear on this product.
              </p>

            </div>

            <div className="grid md:grid-cols-3 gap-4">

              {/* Hot Sale */}
              <label className="flex items-center gap-3 border border-red-200 bg-red-50 rounded-xl p-4 cursor-pointer hover:bg-red-100 transition">

                <input
                  type="checkbox"
                  checked={hotSale}
                  onChange={(e) =>
                    setHotSale(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>

                  <p className="font-bold text-red-600">
                    🔥 Hot Sale
                  </p>

                  <p className="text-sm text-gray-500">
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
                    setBestSeller(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>

                  <p className="font-bold text-yellow-700">
                    🏆 Best Seller
                  </p>

                  <p className="text-sm text-gray-500">
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
                    setPremiumProduct(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <div>

                  <p className="font-bold text-purple-700">
                    👑 Premium Product
                  </p>

                  <p className="text-sm text-gray-500">
                    Premium quality product
                  </p>

                </div>

              </label>

            </div>

          </section>

          {/* ============================= */}
          {/* Bottom Actions */}
          {/* ============================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col-reverse md:flex-row md:justify-between gap-4">

            <Link
              href="/admin/products"
              className="border-2 border-gray-300 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition text-center"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              {saving
                ? "⏳ Saving..."
                : "💾 Save Changes"}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}