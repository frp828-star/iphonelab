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

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();

  const { addToCart } = useCart();
const { addToWishlist } = useWishlist();

const [product, setProduct] = useState<Product | null>(null);
const [products, setProducts] = useState<Product[]>([]);
const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    async function loadProduct() {
      const res = await fetch("/api/products");
      const data = await res.json();
setProducts(data);
      const found = data.find(
        (item: Product) => item.id === Number(id)
      );

      setProduct(found || null);
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    );
  }
const relatedProducts = products
  .filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  )
  .slice(0, 4);
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">

        <div className="bg-white rounded-2xl shadow-lg p-8">
  <ProductGallery images={[product.image]} />
</div>

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-3">
            Category: {product.category}
          </p>

          <div className="mt-5">

  {/* Rating */}
  <div className="flex items-center gap-2 mb-3">
    <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>

    <span className="font-semibold">
      {product.rating ?? 5}
    </span>

    <span className="text-gray-500">
      ({product.reviews ?? 0} Reviews)
    </span>
  </div>

  {/* Price */}
  <div className="flex items-center gap-4 flex-wrap">

    <h2 className="text-red-600 text-4xl font-bold">
      ৳ {product.price.toLocaleString()}
    </h2>

    {product.oldPrice && (
      <span className="text-2xl text-gray-400 line-through">
        ৳ {product.oldPrice.toLocaleString()}
      </span>
    )}

    {product.discount && (
      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
        -{product.discount}%
      </span>
    )}

  </div>

</div>

          <p className="mt-8 text-gray-600 leading-8">
  {product.description ||
    "Premium quality iPhone spare parts. Original quality with fast delivery all over Bangladesh."}
</p>
<div className="mt-8">
  <p className="mb-3 font-semibold text-lg">Quantity</p>

  <div className="flex items-center gap-4">
    <button
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      className="w-10 h-10 rounded-lg border border-gray-300 text-xl font-bold hover:bg-gray-100"
    >
      -
    </button>

    <span className="w-10 text-center text-xl font-bold">
      {quantity}
    </span>

    <button
      onClick={() => setQuantity((q) => q + 1)}
      className="w-10 h-10 rounded-lg border border-gray-300 text-xl font-bold hover:bg-gray-100"
    >
      +
    </button>
  </div>
</div>
          <div className="mt-10 flex flex-col gap-4">

            <button
              onClick={() =>
                addToCart({
  name: product.name,
  price: product.price,
  image: product.image,
  quantity,
})
              }
              className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold"
            >
              🛒 Add To Cart
            </button>

            <button
              onClick={() =>
                addToWishlist({
                  slug: String(product.id),
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
              className="bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-bold"
            >
              ❤️ Add To Wishlist
            </button>

            <button
              onClick={() => {
                addToCart({
  name: product.name,
  price: product.price,
  image: product.image,
  quantity,
});

router.push("/checkout");
              }}
              className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold"
            >
              ⚡ Buy Now
            </button>

          </div>

          <div className="mt-10 border-t pt-6 space-y-3 text-gray-700">

  <p>✅ 100% Original Product</p>

  <p>
    📦 Stock :
    <span className="font-semibold text-green-600">
      {" "}
      {product.stock ? "In Stock" : "Out of Stock"}
    </span>
  </p>

  <p>
    🚚{" "}
    {product.freeDelivery
      ? "Free Delivery Available"
      : "Delivery Charge Applicable"}
  </p>

  <p>
    🛡 Warranty :
    {" "}
    {product.warranty ?? "No Warranty"}
  </p>

  <p>💳 Secure Payment</p>

</div>

        </div>

      </div>


<section className="mt-20">
  <h2 className="text-3xl font-bold mb-8">
    Related Products
  </h2>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {relatedProducts.map((item) => (
      <div
        key={item.id}
        className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-contain"
        />

        <h3 className="font-bold text-lg mt-4">
          {item.name}
        </h3>

        <p className="text-gray-500">
          {item.category}
        </p>

        <p className="text-red-600 text-xl font-bold mt-2">
          ৳ {item.price.toLocaleString()}
        </p>

        <button
          onClick={() => router.push(`/product/${item.id}`)}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
        >
          View Details
        </button>
      </div>
    ))}
  </div>
</section>
</main>
  );
}