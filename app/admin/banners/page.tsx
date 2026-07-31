"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

type Banner = {
  id: number;
  title: string | null;
  subtitle: string | null;
  image: string;
  button_text: string | null;
  button_link: string | null;
  active: boolean;
  created_at: string;
};

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [buttonText, setButtonText] = useState("Shop Now");
  const [buttonLink, setButtonLink] = useState("/shop");
  const [active, setActive] = useState(true);

  const loadBanners = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/banners", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to load banners"
        );
      }

      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setImageFile(null);
    setImagePreview("");
    setButtonText("Shop Now");
    setButtonLink("/shop");
    setActive(true);
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ Please select an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("❌ Image must be smaller than 20MB.");
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingId && !imageFile) {
      alert("❌ Please select a banner image.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("subtitle", subtitle.trim());

      formData.append(
        "button_text",
        buttonText.trim() || "Shop Now"
      );

      formData.append(
        "button_link",
        buttonLink.trim() || "/shop"
      );

      formData.append("active", String(active));

      if (editingId) {
        formData.append("id", String(editingId));
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/banners", {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to save banner"
        );
      }

      alert(
        editingId
          ? "✅ Banner updated successfully."
          : "✅ Banner added successfully."
      );

      resetForm();
      await loadBanners();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Failed to save banner."
      );
    } finally {
      setSaving(false);
    }
  };

  const editBanner = (banner: Banner) => {
    setEditingId(banner.id);
    setTitle(banner.title || "");
    setSubtitle(banner.subtitle || "");
    setImageFile(null);
    setImagePreview(banner.image);

    setButtonText(
      banner.button_text || "Shop Now"
    );

    setButtonLink(
      banner.button_link || "/shop"
    );

    setActive(banner.active);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteBanner = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this banner?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch("/api/banners", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete banner"
        );
      }

      alert("✅ Banner deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadBanners();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Failed to delete banner."
      );
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const formData = new FormData();

      formData.append(
        "id",
        String(banner.id)
      );

      formData.append(
        "title",
        banner.title || ""
      );

      formData.append(
        "subtitle",
        banner.subtitle || ""
      );

      formData.append(
        "button_text",
        banner.button_text || "Shop Now"
      );

      formData.append(
        "button_link",
        banner.button_link || "/shop"
      );

      formData.append(
        "active",
        String(!banner.active)
      );

      const res = await fetch("/api/banners", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to update banner"
        );
      }

      await loadBanners();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Failed to update banner."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            🎨 Banner Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your iPhone Lab homepage banners.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-10">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              {editingId
                ? "✏️ Edit Banner"
                : "➕ Add New Banner"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid lg:grid-cols-2 gap-6"
          >

            {/* Title */}
            <div>
              <label className="block font-semibold mb-2">
                Banner Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Premium iPhone Parts & Accessories"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block font-semibold mb-2">
                Banner Subtitle
              </label>

              <input
                type="text"
                value={subtitle}
                onChange={(e) =>
                  setSubtitle(e.target.value)
                }
                placeholder="Original Battery • Display • Back Glass"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Image */}
            <div className="lg:col-span-2">

              <label className="block font-semibold mb-2">
                Banner Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-xl px-4 py-3 bg-white"
              />

              <p className="text-sm text-gray-500 mt-2">
                Maximum image size: 20MB
              </p>

              {imagePreview && (
                <div className="mt-4 border rounded-xl overflow-hidden bg-gray-50">

                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="w-full h-56 object-cover"
                  />

                </div>
              )}

            </div>

            {/* Button Text */}
            <div>
              <label className="block font-semibold mb-2">
                Button Text
              </label>

              <input
                type="text"
                value={buttonText}
                onChange={(e) =>
                  setButtonText(e.target.value)
                }
                placeholder="Shop Now"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Button Link */}
            <div>
              <label className="block font-semibold mb-2">
                Button Link
              </label>

              <input
                type="text"
                value={buttonLink}
                onChange={(e) =>
                  setButtonLink(e.target.value)
                }
                placeholder="/shop"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            {/* Active */}
            <div className="lg:col-span-2">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) =>
                    setActive(e.target.checked)
                  }
                  className="w-5 h-5"
                />

                <span className="font-semibold">
                  Active Banner
                </span>

              </label>

            </div>

            {/* Buttons */}
            <div className="lg:col-span-2 flex gap-3">

              <button
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold"
              >
                {saving
                  ? "Uploading..."
                  : editingId
                  ? "Update Banner"
                  : "Add Banner"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border px-8 py-4 rounded-xl font-bold hover:bg-gray-50"
                >
                  Clear
                </button>
              )}

            </div>

          </form>
        </section>

        {/* Existing Banners */}
        <section>

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold">
              Existing Banners
            </h2>

            <span className="bg-gray-200 px-3 py-1 rounded-full font-semibold">
              {banners.length}
            </span>

          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border p-10 text-center">
              Loading banners...
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-white rounded-2xl border p-10 text-center">

              <div className="text-5xl mb-4">
                🖼️
              </div>

              <h3 className="text-xl font-bold">
                No banners yet
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first banner above.
              </p>

            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">

              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden"
                >

                  <div className="relative">

                    <img
                      src={banner.image}
                      alt={
                        banner.title ||
                        "Banner"
                      }
                      className="w-full h-56 object-cover"
                    />

                    <span
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${
                        banner.active
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {banner.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  <div className="p-5">

                    <h3 className="text-xl font-bold">
                      {banner.title ||
                        "Untitled Banner"}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      {banner.subtitle ||
                        "No subtitle"}
                    </p>

                    <div className="mt-4 text-sm text-gray-500 space-y-1">

                      <p>
                        Button:{" "}
                        <span className="font-semibold text-gray-800">
                          {banner.button_text ||
                            "Shop Now"}
                        </span>
                      </p>

                      <p>
                        Link:{" "}
                        <span className="font-semibold text-gray-800">
                          {banner.button_link ||
                            "/shop"}
                        </span>
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">

                      <button
                        type="button"
                        onClick={() =>
                          editBanner(banner)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleActive(banner)
                        }
                        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        {banner.active
                          ? "⏸️ Disable"
                          : "▶️ Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteBanner(banner.id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}