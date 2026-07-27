"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

type Props = {
  product: {
    name: string;
    price: number;
    image: string;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(product);
        router.push("/cart");
      }}
      className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl"
    >
      Add to Cart
    </button>
  );
}