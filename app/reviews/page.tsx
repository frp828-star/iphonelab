"use client";

import { useState } from "react";
import Link from "next/link";

type Review = {
  name: string;
  rating: number;
  comment: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      name: "Rahim Ahmed",
      rating: 5,
      comment: "Excellent quality. Original product. Highly recommended!",
    },
    {
      name: "Karim Hasan",
      rating: 4,
      comment: "Good product and fast delivery.",
    },
  ]);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !comment) {
      alert("Please fill all fields.");
      return;
    }

    setReviews([
      {
        name,
        rating,
        comment,
      },
      ...reviews,
    ]);

    setName("");
    setRating(5);
    setComment("");
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          ⭐ Customer Reviews
        </h1>

        {/* Review Form */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Write a Review
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-4"
            />

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-lg p-4"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>

            <textarea
              rows={5}
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-4"
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition"
            >
              Submit Review
            </button>

          </form>

        </div>

        {/* Reviews */}

        <div className="space-y-6">

          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold">
                {review.name}
              </h3>

              <div className="text-yellow-500 mt-2">
                {"⭐".repeat(review.rating)}
              </div>

              <p className="text-gray-600 mt-4">
                {review.comment}
              </p>
            </div>
          ))}

        </div>

        <div className="mt-10 text-center">

          <Link
            href="/"
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold"
          >
            ← Back Home
          </Link>

        </div>

      </div>
    </main>
  );
}