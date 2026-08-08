"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductGallery from "../../components/ProductGallery";

type QualityOption = {
  label: string;
  price: number;
};

type Product = {
  id: number;
  name: string;

  price: number;

  quality_options?: QualityOption[];

  oldPrice?: number | null;
  discount?: number | null;

  rating?: number | null;
  reviews?: number | null;

  stock?: boolean;
  freeDelivery?: boolean;
  warranty?: string | null;

  hotSale?: boolean;
  bestSeller?: boolean;
  premiumProduct?: boolean;

  featured?: boolean;
  sale?: boolean;

  image: string;
  category: string;
  description?: string;
  slug?: string;
};

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const id = params.id;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(true);


  const [selectedQuality, setSelectedQuality] =
    useState<QualityOption | null>(null);


  useEffect(() => {

    async function loadProducts() {

      try {

        setLoading(true);

        const res = await fetch(
          "/api/products",
          {
            cache: "no-store",
          }
        );


        if (!res.ok) {
          throw new Error(
            "Failed to load products"
          );
        }


        const data = await res.json();


        const productList: Product[] =
          Array.isArray(data)
            ? data
            : [];


        setProducts(productList);


        const found =
          productList.find(
            (item) =>
              item.id === Number(id)
          );


        setProduct(found || null);


        if (
          found &&
          found.quality_options &&
          found.quality_options.length > 0
        ) {

          setSelectedQuality(
            found.quality_options[0]
          );

        }


      } catch (error) {

        console.error(
          "Failed to load product:",
          error
        );

        setProduct(null);


      } finally {

        setLoading(false);

      }

    }


    if (id) {
      loadProducts();
    }


  }, [id]);



  if (loading) {

    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="text-5xl mb-4">
            ⏳
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Loading Product...
          </h1>

          <p className="text-gray-500 mt-2">
            Please wait while product information is loading.
          </p>

        </div>

      </main>
    );

  }


  if (!product) {

    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="text-5xl mb-4">
            😢
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>


          <p className="text-gray-500 mt-3">
            Sorry, this product could not be found.
          </p>


          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="mt-7 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-xl font-bold transition"
          >
            ← Back to Home
          </button>

        </div>

      </main>
    );

  }


  const currentPrice =
    selectedQuality
      ? selectedQuality.price
      : product.price;


  const relatedProducts =
    products
      .filter(
        (item) =>
          item.category.toLowerCase() ===
            product.category.toLowerCase() &&
          item.id !== product.id
      )
      .slice(0,4);



  const handleAddToCart = () => {

    addToCart({

      name: product.name,

      price: Number(currentPrice),

      image: product.image,

      quantity,

      quality:
        selectedQuality?.label || null,

    });


    alert(
      "✅ Product added to cart"
    );

  };



  const handleBuyNow = () => {

    if (product.stock === false)
      return;


    addToCart({

      name: product.name,

      price: Number(currentPrice),

      image: product.image,

      quantity,

      quality:
        selectedQuality?.label || null,

    });


    router.push("/checkout");

  };  const handleWishlist = () => {

    addToWishlist({

      slug: String(product.id),

      name: product.name,

      price: Number(currentPrice),

      image: product.image,

    });


    alert(
      "❤️ Added to Wishlist"
    );

  };


  return (

    <main className="min-h-screen bg-gray-50">


      {/* TOP BREADCRUMB */}

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-6">

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">

          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="hover:text-red-600 transition"
          >
            Home
          </button>


          <span>
            ›
          </span>


          <button
            type="button"
            onClick={() =>
              router.push(
                `/category/${product.category
                  .toLowerCase()
                  .replace(/\s+/g,"-")}`
              )
            }
            className="hover:text-red-600 transition"
          >
            {product.category}
          </button>


          <span>
            ›
          </span>


          <span className="text-gray-800 font-medium">
            {product.name}
          </span>


        </div>

      </div>



      {/* PRODUCT DETAILS */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">


        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">



          {/* LEFT IMAGE */}

          <div className="relative">


            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 md:p-8 sticky top-6">


              <div className="absolute top-8 left-8 z-10 flex flex-wrap gap-2">


                {product.sale && (

                  <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">

                    🏷️ SALE

                  </span>

                )}



                {product.hotSale && (

                  <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">

                    🔥 HOT SALE

                  </span>

                )}



                {product.bestSeller && (

                  <span className="bg-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">

                    🏆 BEST SELLER

                  </span>

                )}



                {product.premiumProduct && (

                  <span className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">

                    👑 PREMIUM

                  </span>

                )}


              </div>



              <div className="min-h-[420px] md:min-h-[500px] flex items-center justify-center">


                <ProductGallery

                  images={[
                    product.image
                  ]}

                />


              </div>


            </div>


          </div>





          {/* RIGHT INFORMATION */}


          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">


            <div className="flex items-center gap-3 mb-4">


              <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold">

                {product.category}

              </span>



              {
                product.stock !== false ? (

                  <span className="text-green-600 text-sm font-semibold">

                    ● In Stock

                  </span>

                ) : (

                  <span className="text-red-600 text-sm font-semibold">

                    ● Out of Stock

                  </span>

                )
              }


            </div>





            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">

              {product.name}

            </h1>





            <div className="mt-5 flex items-center gap-3">


              <span className="text-yellow-500 text-lg">

                ★★★★★

              </span>


              <span className="font-bold">

                {product.rating ?? 5}

              </span>


              <span className="text-gray-500">

                ({product.reviews ?? 0} Reviews)

              </span>


            </div>





            <div className="border-t my-6" />





            {/* QUALITY DROPDOWN */}

            {
              
              product.quality_options &&
              product.quality_options.length > 0 && (

                <div className="mb-6">


                  <label className="block font-bold mb-3">

                    Select Quality

                  </label>



                  <select

                    value={
                      selectedQuality?.label || ""
                    }

                    onChange={(e)=>{

                      const option =
                        product.quality_options?.find(
                          (item)=>
                            item.label === e.target.value
                        );


                      if(option){

                        setSelectedQuality(option);

                      }

                    }}

                    className="w-full border rounded-xl p-4 font-semibold focus:ring-2 focus:ring-red-500"

                  >

                    {
                      product.quality_options.map(
                        (item,index)=>(

                          <option
                            key={index}
                            value={item.label}
                          >

                            {item.label} - ৳ {item.price.toLocaleString()}

                          </option>

                        )
                      )
                    }


                  </select>


                </div>

              )
            }            {/* PRICE */}

            <div className="flex flex-wrap items-center gap-4">


              <span className="text-4xl md:text-5xl font-black text-red-600">

                ৳ {Number(currentPrice).toLocaleString()}

              </span>



              {
                product.oldPrice &&
                Number(product.oldPrice) >
                Number(currentPrice) && (

                  <span className="text-xl text-gray-400 line-through">

                    ৳ {Number(product.oldPrice).toLocaleString()}

                  </span>

                )
              }



            </div>





            {/* DESCRIPTION */}


            <div className="mt-7">


              <h2 className="text-lg font-bold mb-2">

                Product Description

              </h2>


              <p className="text-gray-600 leading-7 whitespace-pre-line">

                {
                  product.description ||
                  "Premium quality iPhone spare parts and accessories."
                }

              </p>


            </div>





            {/* BENEFITS */}


            <div className="grid sm:grid-cols-2 gap-3 mt-7">


              <div className="rounded-2xl bg-gray-50 border p-4">

                <p className="font-bold">
                  ✅ Quality Product
                </p>

                <p className="text-sm text-gray-500">
                  Premium quality guaranteed
                </p>

              </div>



              <div className="rounded-2xl bg-gray-50 border p-4">

                <p className="font-bold">
                  🚚 Delivery
                </p>

                <p className="text-sm text-gray-500">

                  {
                    product.freeDelivery
                    ? "Free delivery available"
                    : "Delivery charge applicable"
                  }

                </p>

              </div>



              <div className="rounded-2xl bg-gray-50 border p-4">

                <p className="font-bold">
                  🛡️ Warranty
                </p>

                <p className="text-sm text-gray-500">

                  {
                    product.warranty ||
                    "No Warranty"
                  }

                </p>

              </div>



              <div className="rounded-2xl bg-gray-50 border p-4">

                <p className="font-bold">
                  💳 Payment
                </p>

                <p className="text-sm text-gray-500">
                  Secure Payment
                </p>

              </div>


            </div>





            {/* QUANTITY */}


            <div className="mt-8">


              <p className="font-bold mb-3">
                Quantity
              </p>


              <div className="flex items-center">


                <button

                  type="button"

                  onClick={() =>
                    setQuantity((q)=>
                      Math.max(1,q-1)
                    )
                  }

                  className="w-12 h-12 border rounded-l-xl text-xl font-bold"

                >
                  −
                </button>



                <div className="w-16 h-12 border-y flex items-center justify-center font-bold">

                  {quantity}

                </div>



                <button

                  type="button"

                  onClick={() =>
                    setQuantity((q)=>q+1)
                  }

                  className="w-12 h-12 border rounded-r-xl text-xl font-bold"

                >
                  +
                </button>


              </div>


            </div>





            {/* BUTTONS */}


            <div className="mt-8 grid sm:grid-cols-2 gap-3">


              <button

                type="button"

                onClick={handleAddToCart}

                disabled={
                  product.stock === false
                }

                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold"

              >

                🛒 Add To Cart

              </button>



              <button

                type="button"

                onClick={handleBuyNow}

                disabled={
                  product.stock === false
                }

                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold"

              >

                ⚡ Buy Now

              </button>


            </div>





            <button

              type="button"

              onClick={handleWishlist}

              className="mt-3 w-full border-2 border-pink-500 text-pink-600 py-3 rounded-xl font-bold"

            >

              ❤️ Add To Wishlist

            </button>



          </div>


        </div>


      </section>
            {/* RELATED PRODUCTS */}

      {
        relatedProducts.length > 0 && (

          <section className="bg-white border-t">


            <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">


              <div className="flex items-end justify-between mb-8">


                <div>

                  <p className="text-red-600 font-bold text-sm uppercase">

                    You may also like

                  </p>


                  <h2 className="text-3xl font-black mt-1">

                    Related Products

                  </h2>


                </div>


              </div>





              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


                {
                  relatedProducts.map((item)=>(


                    <div

                      key={item.id}

                      className="bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition"

                    >


                      <button

                        type="button"

                        onClick={()=>
                          router.push(
                            `/product/${item.id}`
                          )
                        }

                        className="w-full"

                      >


                        <div className="h-52 bg-gray-50 flex items-center justify-center p-5">


                          <img

                            src={item.image}

                            alt={item.name}

                            className="w-full h-full object-contain"

                          />


                        </div>


                      </button>





                      <div className="p-5">


                        <p className="text-sm text-gray-500">

                          {item.category}

                        </p>




                        <h3 className="font-bold text-lg mt-2">

                          {item.name}

                        </h3>




                        <div className="mt-3 text-red-600 font-black text-xl">

                          ৳ {Number(item.price).toLocaleString()}

                        </div>





                        <button

                          type="button"

                          onClick={()=>
                            router.push(
                              `/product/${item.id}`
                            )
                          }

                          className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"

                        >

                          View Details

                        </button>


                      </div>


                    </div>


                  ))
                }


              </div>


            </div>


          </section>


        )
      }


    </main>

  );

}