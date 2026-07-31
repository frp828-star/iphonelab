"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  button_text: string;
  button_link: string;
  active: boolean;
};

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await fetch("/api/banners", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load banners");
        }

        const data = await res.json();

        setBanners(
          Array.isArray(data)
            ? data.filter((banner: Banner) => banner.active)
            : []
        );
      } catch (error) {
        console.error("Banner loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBanners();
  }, []);

  // Auto slide
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const previousSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + banners.length) % banners.length
    );
  };

  if (loading) {
    return (
      <section className="text-center py-24 px-6">
        <h2 className="text-5xl font-bold mb-6">
          Premium iPhone Parts & Accessories
        </h2>

        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Original Battery • Display • Back Glass • Charger • AirPods
        </p>

        <Link
          href="/shop"
          className="inline-block mt-10 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold"
        >
          Shop Now
        </Link>
      </section>
    );
  }

  // যদি কোনো banner না থাকে তাহলে আগের design
  if (banners.length === 0) {
    return (
      <section className="text-center py-24 px-6">
        <h2 className="text-5xl font-bold mb-6">
          Premium iPhone Parts & Accessories
        </h2>

        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Original Battery • Display • Back Glass • Charger • AirPods
        </p>

        <Link
          href="/shop"
          className="inline-block mt-10 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold"
        >
          Shop Now
        </Link>
      </section>
    );
  }

  const banner = banners[current];

  return (
    <section className="relative overflow-hidden bg-white">

      {/* ================= BANNER ================= */}

      <div className="relative h-[420px] sm:h-[480px] md:h-[560px]">

        {/* Image */}
        {banners.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.title || "iPhone Lab Banner"}
            className={`
              absolute inset-0
              w-full h-full
              object-cover
              transition-all duration-700 ease-in-out
              ${
                index === current
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }
            `}
          />
        ))}

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* ================= CENTER TEXT ================= */}

        <div className="absolute inset-0 flex items-center justify-center px-6">

          <div
            key={banner.id}
            className="text-center text-white max-w-3xl"
          >

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 drop-shadow-lg">
              {banner.title ||
                "Premium iPhone Parts & Accessories"}
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl font-medium drop-shadow-md">
              {banner.subtitle ||
                "Original Battery • Display • Back Glass • Charger • AirPods"}
            </p>

            <Link
              href={banner.button_link || "/shop"}
              className="inline-block mt-9 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition hover:scale-105"
            >
              {banner.button_text || "Shop Now"}
            </Link>

          </div>

        </div>

        {/* ================= PREVIOUS ================= */}

        {banners.length > 1 && (
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous banner"
            className="
              absolute left-4 md:left-8
              top-1/2 -translate-y-1/2
              w-11 h-11 md:w-12 md:h-12
              rounded-full
              bg-white/80 hover:bg-white
              text-gray-900
              text-3xl
              shadow-lg
              transition
              z-20
            "
          >
            ‹
          </button>
        )}

        {/* ================= NEXT ================= */}

        {banners.length > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next banner"
            className="
              absolute right-4 md:right-8
              top-1/2 -translate-y-1/2
              w-11 h-11 md:w-12 md:h-12
              rounded-full
              bg-white/80 hover:bg-white
              text-gray-900
              text-3xl
              shadow-lg
              transition
              z-20
            "
          >
            ›
          </button>
        )}

        {/* ================= SLIDER DOTS ================= */}

        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">

            {banners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to banner ${index + 1}`}
                className={`
                  h-2.5 rounded-full
                  transition-all duration-300
                  ${
                    index === current
                      ? "w-9 bg-red-600"
                      : "w-2.5 bg-white/80 hover:bg-white"
                  }
                `}
              />
            ))}

          </div>
        )}

      </div>

    </section>
  );
}