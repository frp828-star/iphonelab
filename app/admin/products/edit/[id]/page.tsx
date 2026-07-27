"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  stock?: boolean;
  freeDelivery?: boolean;
  warranty?: string;
  image: string;
  featured?: boolean;
  sale?: boolean;
  description?: string;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data: Product[] = await res.json();

        const found = data.find((item) => item.id === id);

        if (!found) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(found);

        setName(found.name);
        setCategory(found.category);
        setPrice(String(found.price));
        setOldPrice(found.oldPrice ? String(found.oldPrice) : "");
        setDiscount(found.discount ? String(found.discount) : "");
        setRating(found.rating ? String(found.rating) : "5");
        setReviews(found.reviews ? String(found.reviews) : "0");
        setStock(found.stock ?? true);
        setFreeDelivery(found.freeDelivery ?? false);
        setWarranty(found.warranty ?? "");
        setImage(found.image);
        setFeatured(found.featured ?? true);
        setSale(found.sale ?? false);
        setDescription(found.description ?? "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);

    const updatedProduct = {
      id,
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        alert("✅ Product Updated Successfully");
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("❌ Failed to Update Product");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl font-bold">Loading Product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-5">
            Product Not Found 😢
          </h1>

          <Link
            href="/admin/products"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-red-600 mb-8">
          ✏️ Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product Name */}
          <div>
            <label className="block font-semibold mb-2">
              Product Name
            </label>

            <input
              type="text"
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

          {/* Options */}
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
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {saving ? "Saving..." : "💾 Save Changes"}
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