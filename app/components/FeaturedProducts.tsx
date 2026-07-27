"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useWishlist } from "../context/WishlistContext";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";

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
  featured?: boolean;
  sale?: boolean;
};

export default function FeaturedProducts() {
  const router = useRouter();

  const { addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { search } = useSearch();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products.filter(
    (product) =>
      (product.featured ?? true) &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <section className="py-20 bg-gray-100">
        <div className="text-center text-xl font-semibold">
          Loading Products...
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            🔥 Featured Products
          </h2>

          <p className="text-gray-500 mt-3">
            Premium iPhone Parts & Accessories
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-600">
              No Products Found 😢
            </h3>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {product.sale && (
                  <span className="absolute left-3 top-3 z-20 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                    SALE
                  </span>
                )}

                <button
                  onClick={() =>
                    addToWishlist({
                      slug: String(product.id),
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  className="absolute right-3 top-3 z-20 rounded-full bg-white p-2 shadow-lg hover:bg-red-600 hover:text-white transition"
                >
                  ❤️
                </button>

                <Link href={`/product/${product.id}`}>
                  <div className="relative h-60 bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-5 transition duration-300 group-hover:scale-110"
                    />
                  </div>
                </Link>

                <div className="p-5">
                  <p className="text-sm font-medium text-red-600">
                    {product.category}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-3 flex-wrap">
  <span className="text-2xl font-bold text-red-600">
    ৳ {product.price.toLocaleString()}
  </span>

  {product.oldPrice && (
    <span className="text-gray-400 line-through">
      ৳ {product.oldPrice.toLocaleString()}
    </span>
  )}

  {product.discount && (
    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
      -{product.discount}%
    </span>
  )}
</div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() =>
                        addToCart({
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        })
                      }
                      className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      onClick={() => {
                        addToCart({
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        });

                        router.push("/checkout");
                      }}
                      className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                    >
                      ⚡ Buy Now
                    </button>

                    <Link
                      href={`/product/${product.id}`}
                      className="block w-full rounded-xl border-2 border-black py-3 text-center font-semibold transition hover:bg-black hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}