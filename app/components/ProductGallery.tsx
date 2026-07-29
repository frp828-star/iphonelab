"use client";

import { useState } from "react";

type Props = {
  images: string[];
};

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      {/* Main Image */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border">
        <img
          src={selectedImage}
          alt="Product"
          className="w-full h-[450px] object-contain transition-all duration-300"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-4 mt-5 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`border-2 rounded-xl p-2 transition ${
              selectedImage === image
                ? "border-red-600"
                : "border-gray-300 hover:border-red-400"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-20 h-20 object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}