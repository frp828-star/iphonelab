"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductGallery from "../../components/ProductGallery";

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

  hotSale?: boolean;
  bestSeller?: boolean;
  premiumProduct?: boolean;

  featured?: boolean;
  sale?: boolean;

  image: string;
  category: string;
  description?: string;
  slug?: string;
};

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

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

        const productList: Product[] = Array.isArray(data)
          ? data
          : [];

        setProducts(productList);

        const found = productList.find(
          (item) => item.id === Number(id)
        );

        setProduct(found || null);
      } catch (error) {
        console.error("Failed to load product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProducts();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center bg-white rounded-3xl border shadow-sm p-10">
          <div className="text-5xl mb-4">⏳</div>

          <h1 className="text-2xl font-bold text-gray-900">
            Loading Product...
          </h1>

          <p className="text-gray-500 mt-2">
            Please wait while product information is loading.
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center bg-white rounded-3xl border shadow-sm p-10 max-w-md w-full">
          <div className="text-6xl mb-5">😢</div>

          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            Sorry, this product could not be found.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-7 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-xl font-bold transition"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  const relatedProducts = products
    .filter(
      (item) =>
        item.category.toLowerCase() ===
          product.category.toLowerCase() &&
        item.id !== product.id
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity,
    });

    alert("✅ Product added to cart");
  };

  const handleBuyNow = () => {
    if (product.stock === false) return;

    addToCart({
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity,
    });

    router.push("/checkout");
  };

  const handleWishlist = () => {
    addToWishlist({
      slug: String(product.id),
      name: product.name,
      price: Number(product.price),
      image: product.image,
    });

    alert("❤️ Added to Wishlist");
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* =========================================
          TOP BREADCRUMB
      ========================================== */}

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="hover:text-red-600 transition"
          >
            Home
          </button>

          <span>›</span>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/category/${product.category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`
              )
            }
            className="hover:text-red-600 transition"
          >
            {product.category}
          </button>

          <span>›</span>

          <span className="text-gray-800 font-medium">
            {product.name}
          </span>
        </div>
      </div>

      {/* =========================================
          PRODUCT DETAILS
      ========================================== */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">

          {/* =====================================
              LEFT - PRODUCT GALLERY
          ====================================== */}

          <div className="relative">

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 md:p-8 sticky top-6">

              {/* Badges */}

              <div className="absolute top-8 left-8 z-10 flex flex-wrap gap-2 max-w-[80%]">

                {product.sale && (
                  <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow">
                    🏷️ SALE
                  </span>
                )}

                {product.hotSale && (
                  <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow">
                    🔥 HOT SALE
                  </span>
                )}

                {product.bestSeller && (
                  <span className="bg-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow">
                    🏆 BEST SELLER
                  </span>
                )}

                {product.premiumProduct && (
                  <span className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow">
                    👑 PREMIUM
                  </span>
                )}

              </div>

              <div className="min-h-[420px] md:min-h-[500px] flex items-center justify-center">

                <ProductGallery
                  images={[product.image]}
                />

              </div>

            </div>

          </div>

          {/* =====================================
              RIGHT - PRODUCT INFORMATION
          ====================================== */}

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">

            {/* Category */}

            <div className="flex items-center gap-3 mb-4">

              <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold">
                {product.category}
              </span>

              {product.stock !== false ? (
                <span className="text-green-600 text-sm font-semibold">
                  ● In Stock
                </span>
              ) : (
                <span className="text-red-600 text-sm font-semibold">
                  ● Out of Stock
                </span>
              )}

            </div>

            {/* Product Name */}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-5 flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg">
                  ★★★★★
                </span>
              </div>

              <span className="font-bold text-gray-900">
                {product.rating ?? 5}
              </span>

              <span className="text-gray-400">
                |
              </span>

              <span className="text-gray-500">
                {product.reviews ?? 0} Reviews
              </span>

            </div>

            {/* Divider */}

            <div className="border-t border-gray-200 my-6" />

            {/* Price */}

            <div>

              <div className="flex flex-wrap items-center gap-4">

                <span className="text-4xl md:text-5xl font-black text-red-600">
                  ৳ {Number(product.price).toLocaleString()}
                </span>

                {product.oldPrice &&
                  Number(product.oldPrice) >
                    Number(product.price) && (
                    <span className="text-xl md:text-2xl text-gray-400 line-through">
                      ৳{" "}
                      {Number(
                        product.oldPrice
                      ).toLocaleString()}
                    </span>
                  )}

                {product.discount &&
                  product.discount > 0 && (
                    <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </span>
                  )}

              </div>

              {product.oldPrice &&
                Number(product.oldPrice) >
                  Number(product.price) && (
                  <p className="text-green-600 font-semibold mt-2">
                    🎉 You are saving ৳{" "}
                    {(
                      Number(product.oldPrice) -
                      Number(product.price)
                    ).toLocaleString()}
                  </p>
                )}

            </div>

            {/* Description */}

            <div className="mt-7">

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Product Description
              </h2>

              <p className="text-gray-600 leading-7 whitespace-pre-line">
                {product.description ||
                  "Premium quality iPhone spare parts and accessories. Original quality product with reliable performance and fast delivery across Bangladesh."}
              </p>

            </div>

            {/* Product Benefits */}

            <div className="grid sm:grid-cols-2 gap-3 mt-7">

              <div className="rounded-2xl bg-gray-50 border p-4">
                <p className="font-bold text-gray-900">
                  ✅ Quality Product
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Premium quality guaranteed
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 border p-4">
                <p className="font-bold text-gray-900">
                  🚚 Delivery
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {product.freeDelivery
                    ? "Free delivery available"
                    : "Delivery charge applicable"}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 border p-4">
                <p className="font-bold text-gray-900">
                  🛡️ Warranty
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {product.warranty || "No Warranty"}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 border p-4">
                <p className="font-bold text-gray-900">
                  💳 Payment
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Secure Payment
                </p>
              </div>

            </div>

            {/* Quantity */}

            <div className="mt-8">

              <p className="font-bold text-gray-900 mb-3">
                Quantity
              </p>

              <div className="flex items-center">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  className="w-12 h-12 border border-gray-300 rounded-l-xl text-xl font-bold hover:bg-gray-100 transition"
                >
                  −
                </button>

                <div className="w-16 h-12 border-y border-gray-300 flex items-center justify-center font-bold text-lg bg-white">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => q + 1)
                  }
                  className="w-12 h-12 border border-gray-300 rounded-r-xl text-xl font-bold hover:bg-gray-100 transition"
                >
                  +
                </button>

              </div>

            </div>

            {/* Main Buttons */}

            <div className="mt-8 grid sm:grid-cols-2 gap-3">

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === false}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition shadow-sm"
              >
                🛒 Add To Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock === false}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition shadow-sm"
              >
                ⚡ Buy Now
              </button>

            </div>

            {/* Wishlist */}

            <button
              type="button"
              onClick={handleWishlist}
              className="mt-3 w-full border-2 border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white py-3.5 rounded-xl font-bold transition"
            >
              ❤️ Add To Wishlist
            </button>

            {/* Stock Notice */}

            <div className="mt-6">

              {product.stock === false ? (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="font-bold text-red-600">
                    ❌ This product is currently out of stock.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="font-bold text-green-600">
                    ✅ This product is currently available.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          RELATED PRODUCTS
      ========================================== */}

      {relatedProducts.length > 0 && (
        <section className="bg-white border-t">

          <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">

            <div className="flex items-end justify-between gap-4 mb-8">

              <div>
                <p className="text-red-600 font-bold text-sm uppercase tracking-wider">
                  You may also like
                </p>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
                  Related Products
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/category/${product.category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
                className="hidden sm:block text-red-600 font-bold hover:underline"
              >
                View All →
              </button>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {relatedProducts.map((item) => (

                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Image */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/product/${item.id}`
                      )
                    }
                    className="block w-full"
                  >
                    <div className="h-52 bg-gray-50 flex items-center justify-center p-5 overflow-hidden">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      />

                    </div>
                  </button>

                  <div className="p-5">

                    {/* Badge */}

                    <div className="min-h-7 flex flex-wrap gap-1">

                      {item.hotSale && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                          🔥 Hot Sale
                        </span>
                      )}

                      {item.bestSeller && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                          🏆 Best Seller
                        </span>
                      )}

                      {item.premiumProduct && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold">
                          👑 Premium
                        </span>
                      )}

                    </div>

                    {/* Category */}

                    <p className="text-sm text-gray-500 mt-3">
                      {item.category}
                    </p>

                    {/* Name */}

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/product/${item.id}`
                        )
                      }
                      className="text-left"
                    >
                      <h3 className="font-bold text-lg text-gray-900 mt-1 group-hover:text-red-600 transition line-clamp-2">
                        {item.name}
                      </h3>
                    </button>

                    {/* Rating */}

                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <span className="text-yellow-500">
                        ★★★★★
                      </span>

                      <span className="text-gray-500">
                        {item.rating ?? 5} (
                        {item.reviews ?? 0})
                      </span>
                    </div>

                    {/* Price */}

                    <div className="flex items-center gap-2 flex-wrap mt-3">

                      <span className="text-red-600 text-xl font-black">
                        ৳{" "}
                        {Number(
                          item.price
                        ).toLocaleString()}
                      </span>

                      {item.oldPrice &&
                        Number(item.oldPrice) >
                          Number(item.price) && (
                          <span className="text-gray-400 line-through text-sm">
                            ৳{" "}
                            {Number(
                              item.oldPrice
                            ).toLocaleString()}
                          </span>
                        )}

                    </div>

                    {/* Button */}

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/product/${item.id}`
                        )
                      }
                      className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
                    >
                      View Details
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>
      )}

    </main>
  );
}