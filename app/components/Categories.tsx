"use client";

import Link from "next/link";

export default function Categories() {
  const categories = [
    {
      name: "Battery",
      icon: "🔋",
      slug: "battery",
    },
    {
      name: "Display",
      icon: "📱",
      slug: "display",
    },
    {
      name: "Back Glass",
      icon: "📦",
      slug: "back-glass",
    },
    {
      name: "Charger",
      icon: "🔌",
      slug: "charger",
    },
    {
      name: "AirPods",
      icon: "🎧",
      slug: "airpods",
    },
    {
      name: "Cable",
      icon: "🔌",
      slug: "cable",
    },
  ];

  return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="border rounded-2xl p-6 text-center shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white"
            >
              <div className="text-5xl mb-4">
                {category.icon}
              </div>

              <h3 className="font-bold text-lg">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}