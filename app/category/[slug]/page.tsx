"use client";

import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

export default function CategoryPage() {
  const { addToCart } = useCart();

  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);

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

  const filteredProducts = products.filter(
    (product) =>
      product.category.toLowerCase() === slug.toLowerCase()
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Loading Products...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          {slug}
        </h1>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-5">
              No Products Found 😢
            </h2>

            <Link
              href="/"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Back Home
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
              >

                {/* SALE Badge */}
                {product.sale && (
                  <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    SALE
                  </span>
                )}

                {/* Product Image */}
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-contain"
                  />
                </Link>

                {/* Category */}
                <p className="text-gray-500 mt-4">
                  {product.category}
                </p>

                {/* Product Name */}
                <h2 className="text-xl font-bold mt-1">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="mt-3 flex items-center gap-3 flex-wrap">

                  {/* Current Price */}
                  <p className="text-red-600 text-2xl font-bold">
                    ৳ {product.price.toLocaleString()}
                  </p>

                  {/* Old Price */}
                  {product.oldPrice && (
                    <p className="text-gray-400 line-through">
                      ৳ {product.oldPrice.toLocaleString()}
                    </p>
                  )}

                  {/* Discount */}
                  {product.discount && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  )}

                </div>

                {/* Buttons */}
                <div className="mt-5 space-y-3">

                  {/* Add To Cart */}
                  <button
                    onClick={() =>
                      addToCart({
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
                  >
                    🛒 Add to Cart
                  </button>

                  {/* View Details */}
                  <Link
                    href={`/product/${product.id}`}
                    className="block text-center border-2 border-black hover:bg-black hover:text-white py-3 rounded-xl font-semibold transition"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}