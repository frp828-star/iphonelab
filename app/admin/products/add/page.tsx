"use client";

import Link from "next/link";
import { useState } from "react";

type QualityOption = {
  label: string;
  price: string;
};

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Display");

  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const [rating, setRating] = useState("5");
  const [reviews, setReviews] = useState("0");

  const [stock, setStock] = useState(true);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [warranty, setWarranty] = useState("");

  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [featured, setFeatured] = useState(true);

  const [hotSale, setHotSale] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [premiumProduct, setPremiumProduct] = useState(false);

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);


  // ===============================
  // QUALITY OPTIONS
  // Only Display Category
  // ===============================

  const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([
    {
      label: "",
      price: "",
    },
  ]);


  const addQualityOption = () => {
    setQualityOptions([
      ...qualityOptions,
      {
        label: "",
        price: "",
      },
    ]);
  };


  const removeQualityOption = (index: number) => {
    setQualityOptions(
      qualityOptions.filter((_, i) => i !== index)
    );
  };


  const updateQualityOption = (
    index: number,
    field: "label" | "price",
    value: string
  ) => {
    const updated = [...qualityOptions];

    updated[index][field] = value;

    setQualityOptions(updated);
  };


  // Image Select

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;


    if (!file.type.startsWith("image/")) {
      alert("❌ Please select an image file.");
      return;
    }


    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Image must be smaller than 5MB.");
      return;
    }


    setSelectedFile(file);


    const previewUrl =
      URL.createObjectURL(file);


    setPreview(previewUrl);

    setImage("");
  };



  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    if (!selectedFile) {
      alert("❌ Please select a product image.");
      return;
    }


    setLoading(true);


    try {


      // ===============================
      // Upload Image
      // ===============================


      setUploading(true);


      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );


      const uploadRes =
        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });



      const uploadData =
        await uploadRes.json();



      setUploading(false);



      if (
        !uploadRes.ok ||
        !uploadData.url
      ) {

        alert(
          uploadData.error ||
          "Image upload failed"
        );

        setLoading(false);

        return;
      }


      const uploadedImageUrl =
        uploadData.url;



      setImage(uploadedImageUrl);



            // ===============================
      // Create Product Data
      // ===============================


      const product = {

        name,

        category,


        price:
          Number(price),


        oldPrice:
          oldPrice
            ? Number(oldPrice)
            : undefined,


        discount:
          discount
            ? Number(discount)
            : undefined,


        rating:
          rating
            ? Number(rating)
            : 5,


        reviews:
          reviews
            ? Number(reviews)
            : 0,


        stock,

        freeDelivery,

        warranty,


        image:
          uploadedImageUrl,


        featured,


        hotSale,

        bestSeller,

        premiumProduct,


        description,


        // ===========================
        // Quality Pricing System
        // Display Only
        // ===========================

        quality_options:
          category === "Display"
            ? qualityOptions
                .filter(
                  (item) =>
                    item.label &&
                    item.price
                )
                .map((item) => ({
                  label:
                    item.label,

                  price:
                    Number(item.price),
                }))
            : [],

      };



      const res =
        await fetch(
          "/api/products",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(product),
          }
        );



      const data =
        await res.json();



      if (res.ok) {

        alert(
          "✅ Product Added Successfully!"
        );


        window.location.href =
          "/admin/products";


      } else {

        console.error(
          "Product add error:",
          data
        );


        alert(
          data.error ||
          "Failed to add product"
        );

      }



    } catch (error) {


      console.error(error);


      alert(
        "❌ Something went wrong."
      );


    } finally {


      setUploading(false);

      setLoading(false);

    }


  };



  return (

    <main className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-6xl mx-auto px-4">


        {/* Page Header */}

        <div className="mb-6">

          <Link
            href="/admin/products"
            className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 mb-4"
          >
            ← Back to Products
          </Link>


          <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">


            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


              <div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  ➕ Add New Product
                </h1>


                <p className="text-gray-500 mt-2">
                  Add a new product to your iPhone Lab store.
                </p>


              </div>


              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold">
                🛍️ Product Management
              </div>


            </div>


          </div>


        </div>



        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >



          {/* Basic Information */}

          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">


            <div className="mb-6">

              <h2 className="text-xl md:text-2xl font-bold">
                📋 Basic Information
              </h2>


              <p className="text-gray-500 text-sm mt-1">
                Enter the main information about your product.
              </p>


            </div>


            <div className="space-y-6">


              <div>

                <label className="block font-semibold mb-2">
                  Product Name
                </label>


                <input

                  type="text"

                  placeholder="iPhone 16 Battery"

                  value={name}

                  onChange={(e)=>
                    setName(e.target.value)
                  }

                  required

                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"

                />


              </div>



              <div>

                <label className="block font-semibold mb-2">
                  Category
                </label>


                <select

                  value={category}

                  onChange={(e)=>
                    setCategory(e.target.value)
                  }

                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"

                >

                  <option value="Display">
                    Display
                  </option>

                  <option value="Battery">
                    Battery
                  </option>

                  <option value="Charger">
                    Charger
                  </option>

                  <option value="AirPods">
                    AirPods
                  </option>

                  <option value="Back Glass">
                    Back Glass
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>


                </select>


              </div>


            </div>


          </section>
                    {/* Pricing */}

          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">


            <div className="mb-6">

              <h2 className="text-xl md:text-2xl font-bold">
                💰 Pricing
              </h2>


              <p className="text-gray-500 text-sm mt-1">
                Set product pricing information.
              </p>


            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              <div>

                <label className="block font-semibold mb-2">
                  Current Price (৳)
                </label>


                <input

                  type="number"

                  min="0"

                  placeholder="18500"

                  value={price}

                  onChange={(e)=>
                    setPrice(e.target.value)
                  }

                  required

                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"

                />


              </div>



              <div>

                <label className="block font-semibold mb-2">
                  Old Price (৳)
                </label>


                <input

                  type="number"

                  min="0"

                  placeholder="20000"

                  value={oldPrice}

                  onChange={(e)=>
                    setOldPrice(e.target.value)
                  }


                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"

                />


              </div>



              <div>

                <label className="block font-semibold mb-2">
                  Discount (%)
                </label>


                <input

                  type="number"

                  min="0"

                  max="100"

                  placeholder="8"

                  value={discount}

                  onChange={(e)=>
                    setDiscount(e.target.value)
                  }


                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"

                />


              </div>



              <div>

                <label className="block font-semibold mb-2">
                  Warranty
                </label>


                <input

                  type="text"

                  placeholder="6 Months"

                  value={warranty}

                  onChange={(e)=>
                    setWarranty(e.target.value)
                  }


                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"

                />


              </div>


            </div>



            {/* ============================
                QUALITY OPTIONS
                DISPLAY ONLY
            ============================== */}


            {category === "Display" && (

              <div className="mt-8 border-t pt-6">


                <div className="flex items-center justify-between mb-4">


                  <div>

                    <h3 className="text-xl font-bold">
                      🎨 Display Quality Options
                    </h3>


                    <p className="text-sm text-gray-500">
                      Add different display quality prices.
                    </p>


                  </div>



                  <button

                    type="button"

                    onClick={addQualityOption}

                    className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700"

                  >

                    + Add Quality

                  </button>


                </div>



                <div className="space-y-4">


                  {qualityOptions.map(
                    (option,index)=>(


                    <div

                      key={index}

                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border rounded-xl p-4"

                    >


                      <div>

                        <label className="block font-semibold mb-2">
                          Quality Name
                        </label>


                        <input

                          type="text"

                          placeholder="Set Original"

                          value={option.label}

                          onChange={(e)=>
                            updateQualityOption(
                              index,
                              "label",
                              e.target.value
                            )
                          }


                          className="w-full border rounded-xl p-3"

                        />


                      </div>




                      <div>

                        <label className="block font-semibold mb-2">
                          Price (৳)
                        </label>


                        <input

                          type="number"

                          placeholder="9000"

                          value={option.price}

                          onChange={(e)=>
                            updateQualityOption(
                              index,
                              "price",
                              e.target.value
                            )
                          }


                          className="w-full border rounded-xl p-3"

                        />


                      </div>




                      <button

                        type="button"

                        onClick={()=>
                          removeQualityOption(index)
                        }

                        className="bg-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold"

                      >

                        Remove

                      </button>



                    </div>


                  ))}


                </div>


              </div>


            )}


          </section>
                    {/* Product Details */}

          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">


            <div className="mb-6">

              <h2 className="text-xl md:text-2xl font-bold">
                ⭐ Product Details
              </h2>


              <p className="text-gray-500 text-sm mt-1">
                Add rating, reviews and description.
              </p>


            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              <div>

                <label className="block font-semibold mb-2">
                  Rating
                </label>


                <input

                  type="number"

                  step="0.1"

                  min="0"

                  max="5"

                  value={rating}

                  onChange={(e)=>
                    setRating(e.target.value)
                  }


                  className="w-full border border-gray-300 rounded-xl p-4"

                />


              </div>



              <div>

                <label className="block font-semibold mb-2">
                  Reviews
                </label>


                <input

                  type="number"

                  min="0"

                  value={reviews}

                  onChange={(e)=>
                    setReviews(e.target.value)
                  }


                  className="w-full border border-gray-300 rounded-xl p-4"

                />


              </div>




              <div className="md:col-span-2">


                <label className="block font-semibold mb-2">
                  Description
                </label>


                <textarea

                  rows={6}

                  placeholder="Write product description..."

                  value={description}

                  onChange={(e)=>
                    setDescription(e.target.value)
                  }


                  className="w-full border border-gray-300 rounded-xl p-4 resize-none"

                />


              </div>


            </div>


          </section>





          {/* Product Image */}


          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">


            <div className="mb-6">


              <h2 className="text-xl md:text-2xl font-bold">
                🖼️ Product Image
              </h2>


              <p className="text-gray-500 text-sm mt-1">
                Select product image.
              </p>


            </div>




            <div className="border-2 border-dashed rounded-2xl p-6 text-center">


              <input

                id="product-image"

                type="file"

                accept="image/*"

                onChange={handleImageChange}

                className="hidden"

              />



              <label

                htmlFor="product-image"

                className="cursor-pointer block"

              >


                <div className="text-5xl mb-3">
                  🖼️
                </div>



                <p className="font-bold">
                  Click to select product image
                </p>



                {selectedFile && (

                  <p className="text-red-600 mt-3 font-semibold">

                    Selected:
                    {" "}
                    {selectedFile.name}

                  </p>

                )}


              </label>


            </div>




            {preview && (

              <div className="mt-6">


                <img

                  src={preview}

                  alt="Preview"

                  className="w-64 h-64 object-contain rounded-xl border mx-auto"

                />


              </div>

            )}


          </section>
                    {/* Product Labels */}

          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">


            <div className="mb-6">

              <h2 className="text-xl md:text-2xl font-bold">
                🏷️ Product Labels
              </h2>


            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">


                <input

                  type="checkbox"

                  checked={hotSale}

                  onChange={(e)=>
                    setHotSale(e.target.checked)
                  }

                  className="w-5 h-5 accent-red-600"

                />


                🔥 Hot Sale


              </label>




              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">


                <input

                  type="checkbox"

                  checked={bestSeller}

                  onChange={(e)=>
                    setBestSeller(e.target.checked)
                  }

                  className="w-5 h-5 accent-red-600"

                />


                🏆 Best Seller


              </label>




              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">


                <input

                  type="checkbox"

                  checked={premiumProduct}

                  onChange={(e)=>
                    setPremiumProduct(e.target.checked)
                  }

                  className="w-5 h-5 accent-red-600"

                />


                👑 Premium Product


              </label>


            </div>


          </section>





          {/* Inventory & Delivery */}


          <section className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">


            <h2 className="text-xl md:text-2xl font-bold mb-6">
              📦 Inventory & Delivery
            </h2>



            <div className="mb-6">


              <label className="block font-semibold mb-2">
                Stock Status
              </label>


              <select

                value={
                  stock
                  ? "In Stock"
                  : "Out of Stock"
                }

                onChange={(e)=>
                  setStock(
                    e.target.value === "In Stock"
                  )
                }


                className="w-full border rounded-xl p-4"

              >

                <option>
                  In Stock
                </option>


                <option>
                  Out of Stock
                </option>


              </select>


            </div>




            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


              <label className="flex items-center gap-3 border rounded-xl p-4">


                <input

                  type="checkbox"

                  checked={freeDelivery}

                  onChange={(e)=>
                    setFreeDelivery(e.target.checked)
                  }

                  className="w-5 h-5 accent-red-600"

                />


                🚚 Free Delivery


              </label>




              <label className="flex items-center gap-3 border rounded-xl p-4">


                <input

                  type="checkbox"

                  checked={featured}

                  onChange={(e)=>
                    setFeatured(e.target.checked)
                  }

                  className="w-5 h-5 accent-red-600"

                />


                ⭐ Featured Product


              </label>


            </div>


          </section>





          {/* Buttons */}


          <div className="bg-white rounded-2xl shadow-sm border p-6">


            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">


              <Link

                href="/admin/products"

                className="border-2 border-gray-300 px-8 py-3 rounded-xl font-semibold text-center"

              >

                Cancel

              </Link>




              <button

                type="submit"

                disabled={
                  loading ||
                  uploading
                }

                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold"

              >


                {
                  uploading

                  ? "Uploading Image..."

                  : loading

                  ? "Adding Product..."

                  : "➕ Add Product"
                }


              </button>


            </div>


          </div>



        </form>


      </div>


    </main>


  );


}