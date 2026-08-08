"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


type QualityOption = {
  label: string;
  price: string;
};


type Product = {
  id: number;

  name: string;

  category: string;

  price: number;

  oldPrice?: number | null;

  discount?: number | null;

  rating?: number | null;

  reviews?: number | null;

  stock?: boolean;

  freeDelivery?: boolean;

  warranty?: string | null;

  image: string;

  featured?: boolean;

  sale?: boolean;

  hotSale?: boolean;

  bestSeller?: boolean;

  premiumProduct?: boolean;

  description?: string | null;


  // ⭐ New Quality Pricing System

  quality_options?: {
    label: string;
    price: number;
  }[];

};



export default function EditProductPage() {


  const params = useParams();

  const router = useRouter();


  const id = Number(params.id);



  const [product, setProduct] =
    useState<Product | null>(null);



  const [loading, setLoading] =
    useState(true);



  const [saving, setSaving] =
    useState(false);



  // ==========================
  // Basic Information
  // ==========================


  const [name, setName] =
    useState("");


  const [category, setCategory] =
    useState("Display");




  // ==========================
  // Pricing
  // ==========================


  const [price, setPrice] =
    useState("");


  const [oldPrice, setOldPrice] =
    useState("");


  const [discount, setDiscount] =
    useState("");




  // ==========================
  // ⭐ Quality Options
  // ==========================


  const [qualityOptions, setQualityOptions] =
    useState<QualityOption[]>([]);



  const addQualityOption = () => {

    setQualityOptions([
      ...qualityOptions,

      {
        label: "",
        price: "",
      }

    ]);

  };



  const removeQualityOption = (
    index:number
  ) => {


    setQualityOptions(
      qualityOptions.filter(
        (_,i)=> i !== index
      )
    );


  };



  const updateQualityOption = (
    index:number,
    field:"label"|"price",
    value:string
  ) => {


    const updated =
      [...qualityOptions];


    updated[index][field] =
      value;


    setQualityOptions(updated);

  };




  // ==========================
  // Product Details
  // ==========================


  const [rating,setRating] =
    useState("5");


  const [reviews,setReviews] =
    useState("0");


  const [warranty,setWarranty] =
    useState("");




  // ==========================
  // Image
  // ==========================


  const [image,setImage] =
    useState("");




  // ==========================
  // Description
  // ==========================


  const [description,setDescription] =
    useState("");




  // ==========================
  // Options
  // ==========================


  const [stock,setStock] =
    useState(true);


  const [freeDelivery,setFreeDelivery] =
    useState(false);


  const [featured,setFeatured] =
    useState(true);


  const [sale,setSale] =
    useState(false);




  // ==========================
  // Labels
  // ==========================


  const [hotSale,setHotSale] =
    useState(false);


  const [bestSeller,setBestSeller] =
    useState(false);


  const [premiumProduct,setPremiumProduct] =
    useState(false);




  // ==========================
  // Load Product
  // ==========================


  useEffect(() => {


    async function loadProduct() {


      try {


        setLoading(true);



        const res =
          await fetch(
            "/api/products",
            {
              cache:"no-store",
            }
          );



        if(!res.ok){

          throw new Error(
            "Failed to load products"
          );

        }



        const data:Product[] =
          await res.json();



        const found =
          data.find(
            (item)=>
              item.id === id
          );



        if(!found){

          setProduct(null);

          return;

        }



        setProduct(found);



        // Basic

        setName(found.name);

        setCategory(found.category);



        // Pricing

        setPrice(
          String(found.price)
        );



        setOldPrice(
          found.oldPrice !== null &&
          found.oldPrice !== undefined

          ? String(found.oldPrice)

          : ""
        );



        setDiscount(
          found.discount !== null &&
          found.discount !== undefined

          ? String(found.discount)

          : ""
        );




        // ⭐ Quality Options Load


        setQualityOptions(

          found.quality_options

          ?

          found.quality_options.map(
            (item)=>({

              label:
                item.label,

              price:
                String(item.price),

            })
          )

          :

          []

        );





        // Details


        setRating(

          found.rating !== null &&
          found.rating !== undefined

          ?

          String(found.rating)

          :

          "5"

        );



        setReviews(

          found.reviews !== null &&
          found.reviews !== undefined

          ?

          String(found.reviews)

          :

          "0"

        );



        setWarranty(
          found.warranty ?? ""
        );




        // Image

        setImage(
          found.image
        );




        // Description


        setDescription(
          found.description ?? ""
        );





        // Options


        setStock(
          found.stock ?? true
        );


        setFreeDelivery(
          found.freeDelivery ?? false
        );


        setFeatured(
          found.featured ?? true
        );


        setSale(
          found.sale ?? false
        );




        // Labels


        setHotSale(
          found.hotSale ?? false
        );


        setBestSeller(
          found.bestSeller ?? false
        );


        setPremiumProduct(
          found.premiumProduct ?? false
        );



      } catch(error){


        console.error(
          "Load product error:",
          error
        );


      } finally {


        setLoading(false);


      }


    }



    if(id){

      loadProduct();

    }else{

      setLoading(false);

    }



  },[id]);






  // ==========================
  // Save Changes
  // ==========================


  const handleSubmit = async(
    e:React.FormEvent
  )=>{


    e.preventDefault();


    setSaving(true);




    const updatedProduct = {


      id,



      name:
        name.trim(),



      category,




      price:
        Number(price),




      oldPrice:

        oldPrice.trim() !== ""

        ?

        Number(oldPrice)

        :

        null,




      discount:

        discount.trim() !== ""

        ?

        Number(discount)

        :

        null,





      // ⭐ Save Quality Options


      quality_options:

        category === "Display"

        ?

        qualityOptions

        .filter(
          item =>
            item.label &&
            item.price
        )

        .map(
          item=>({

            label:
              item.label,

            price:
              Number(item.price),

          })
        )

        :

        [],




      rating:

        rating.trim() !== ""

        ?

        Number(rating)

        :

        5,



      reviews:

        reviews.trim() !== ""

        ?

        Number(reviews)

        :

        0,



      warranty:

        warranty.trim() !== ""

        ?

        warranty.trim()

        :

        null,



      image:
        image.trim(),




      description:

        description.trim() !== ""

        ?

        description.trim()

        :

        null,



      stock,

      freeDelivery,

      featured,

      sale,

      hotSale,

      bestSeller,

      premiumProduct,


    };



    try{


      const res =
        await fetch(
          "/api/products",
          {

            method:"PUT",

            headers:{

              "Content-Type":
                "application/json",

            },


            body:
              JSON.stringify(
                updatedProduct
              ),

          }
        );



      const data =
        await res.json();




      if(!res.ok){

        throw new Error(
          data.error ||
          "Failed to update product"
        );

      }




      alert(
        "✅ Product Updated Successfully"
      );



      router.push(
        "/admin/products"
      );


      router.refresh();



    }catch(error){


      console.error(
        error
      );


      alert(
        error instanceof Error
        ?
        error.message
        :
        "Something went wrong"
      );


    }finally{


      setSaving(false);


    }



  };

  // ==========================
  // Loading
  // ==========================


  if(loading){

    return (

      <main className="min-h-screen bg-gray-50 py-10">

        <div className="max-w-6xl mx-auto px-4">

          <div className="bg-white rounded-2xl shadow p-8 text-center">


            <div className="text-5xl mb-4">
              ⏳
            </div>


            <h1 className="text-2xl font-bold">
              Loading Product...
            </h1>


            <p className="text-gray-500 mt-2">
              Please wait while product information is loading.
            </p>


          </div>

        </div>

      </main>

    );

  }





  // ==========================
  // Product Not Found
  // ==========================


  if(!product){


    return (

      <main className="min-h-screen bg-gray-50 py-10">


        <div className="max-w-6xl mx-auto px-4">


          <div className="bg-white rounded-2xl shadow p-8 text-center">


            <div className="text-5xl mb-4">
              😢
            </div>



            <h1 className="text-3xl font-bold mb-3">
              Product Not Found
            </h1>



            <p className="text-gray-500 mb-7">
              The product you are trying to edit does not exist.
            </p>



            <Link

              href="/admin/products"

              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"

            >

              ← Back to Products

            </Link>



          </div>


        </div>


      </main>

    );


  }







  return (

    <main className="min-h-screen bg-gray-50 py-10">


      <div className="max-w-6xl mx-auto px-4">



        {/* Header */}


        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">



          <div>


            <p className="text-sm text-gray-500 mb-1">
              Admin Panel / Products / Edit
            </p>



            <h1 className="text-3xl md:text-4xl font-bold text-red-600">
              ✏️ Edit Product
            </h1>



            <p className="text-gray-500 mt-2">
              Update product information and settings.
            </p>


          </div>




          <Link

            href="/admin/products"

            className="border-2 border-gray-300 bg-white hover:bg-gray-100 px-5 py-3 rounded-xl font-semibold text-center"

          >

            ← Back to Products

          </Link>



        </div>





        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >





          {/* Product Information */}


          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">


            <div className="border-b pb-5 mb-6">


              <h2 className="text-2xl font-bold">
                📋 Product Information
              </h2>



              <p className="text-gray-500 mt-1">
                Update the basic information of this product.
              </p>


            </div>





            <div className="mb-6">


              <label className="block font-semibold mb-2">
                Product Name
              </label>



              <input

                type="text"

                value={name}

                onChange={(e)=>
                  setName(e.target.value)
                }

                required

                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500"

              />


            </div>






            <div>


              <label className="block font-semibold mb-2">
                Category
              </label>



              <select

                value={category}

                onChange={(e)=>{

                  setCategory(
                    e.target.value
                  );


                  if(
                    e.target.value !== "Display"
                  ){

                    setQualityOptions([]);

                  }


                }}

                className="w-full border border-gray-300 rounded-xl p-4"

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




          </section>
          
          {/* Pricing */}


          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">


            <div className="border-b pb-5 mb-6">


              <h2 className="text-2xl font-bold">
                💰 Pricing
              </h2>


              <p className="text-gray-500 mt-1">
                Manage price and quality options.
              </p>


            </div>




            <div className="grid md:grid-cols-3 gap-5">


              <div>


                <label className="block font-semibold mb-2">
                  Current Price (৳)
                </label>



                <input

                  type="number"

                  min="0"

                  value={price}

                  onChange={(e)=>
                    setPrice(e.target.value)
                  }


                  className="w-full border rounded-xl p-4"

                />


              </div>





              <div>


                <label className="block font-semibold mb-2">
                  Old Price (৳)
                </label>



                <input

                  type="number"

                  min="0"

                  value={oldPrice}

                  onChange={(e)=>
                    setOldPrice(e.target.value)
                  }


                  className="w-full border rounded-xl p-4"

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

                  value={discount}

                  onChange={(e)=>
                    setDiscount(e.target.value)
                  }


                  className="w-full border rounded-xl p-4"

                />


              </div>


            </div>






            {/* =================================
                QUALITY OPTIONS EDIT
                DISPLAY ONLY
            ================================= */}




            {category === "Display" && (


              <div className="mt-8 border-t pt-6">


                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">


                  <div>


                    <h3 className="text-xl font-bold">
                      🎨 Display Quality Options
                    </h3>


                    <p className="text-sm text-gray-500">
                      Edit different display quality prices.
                    </p>


                  </div>





                  <button

                    type="button"

                    onClick={addQualityOption}

                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold"

                  >

                    + Add Quality

                  </button>



                </div>






                <div className="space-y-4">



                  {qualityOptions.map(
                    (option,index)=>(


                      <div

                        key={index}

                        className="grid md:grid-cols-3 gap-4 border rounded-xl p-4"


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








                        <div className="flex items-end">


                          <button

                            type="button"

                            onClick={()=>
                              removeQualityOption(index)
                            }


                            className="w-full bg-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold"

                          >

                            Remove

                          </button>



                        </div>




                      </div>


                    )

                  )}



                  {qualityOptions.length === 0 && (


                    <p className="text-gray-500 text-sm">
                      No quality options added.
                    </p>


                  )}



                </div>



              </div>


            )}




          </section>







          {/* Product Details */}



          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">


            <div className="border-b pb-5 mb-6">


              <h2 className="text-2xl font-bold">
                ⭐ Product Details
              </h2>



            </div>




            <div className="grid md:grid-cols-3 gap-5">



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


                  className="w-full border rounded-xl p-4"

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


                  className="w-full border rounded-xl p-4"

                />


              </div>





              <div>


                <label className="block font-semibold mb-2">
                  Warranty
                </label>



                <input

                  type="text"

                  value={warranty}

                  onChange={(e)=>
                    setWarranty(e.target.value)
                  }


                  className="w-full border rounded-xl p-4"

                />


              </div>



            </div>



          </section>
                    {/* Product Image */}

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">


            <h2 className="text-2xl font-bold mb-5">
              🖼️ Product Image
            </h2>



            <div className="grid md:grid-cols-2 gap-6 items-center">


              <input

                type="text"

                value={image}

                onChange={(e)=>
                  setImage(e.target.value)
                }

                required

                className="w-full border rounded-xl p-4"

              />



              <div className="border rounded-xl p-5 flex justify-center">


                {image && (

                  <img

                    src={image}

                    alt={name}

                    className="max-h-56 object-contain"

                  />

                )}


              </div>


            </div>



          </section>





          {/* Description */}


          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">


            <h2 className="text-2xl font-bold mb-5">
              📝 Description
            </h2>



            <textarea

              rows={6}

              value={description}

              onChange={(e)=>
                setDescription(e.target.value)
              }


              className="w-full border rounded-xl p-4"

            />



          </section>







          {/* Stock & Options */}


          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">


            <h2 className="text-2xl font-bold mb-5">
              📦 Stock & Options
            </h2>



            <select

              value={
                stock
                ?
                "In Stock"
                :
                "Out of Stock"
              }


              onChange={(e)=>
                setStock(
                  e.target.value === "In Stock"
                )
              }


              className="w-full border rounded-xl p-4 mb-5"

            >


              <option>
                In Stock
              </option>


              <option>
                Out of Stock
              </option>


            </select>





            <div className="grid md:grid-cols-3 gap-4">



              <label className="border rounded-xl p-4 flex gap-3">

                <input

                  type="checkbox"

                  checked={freeDelivery}

                  onChange={(e)=>
                    setFreeDelivery(
                      e.target.checked
                    )
                  }

                />


                🚚 Free Delivery


              </label>





              <label className="border rounded-xl p-4 flex gap-3">

                <input

                  type="checkbox"

                  checked={featured}

                  onChange={(e)=>
                    setFeatured(
                      e.target.checked
                    )
                  }

                />


                ⭐ Featured


              </label>





              <label className="border rounded-xl p-4 flex gap-3">


                <input

                  type="checkbox"

                  checked={sale}

                  onChange={(e)=>
                    setSale(
                      e.target.checked
                    )
                  }

                />


                🔥 Sale


              </label>



            </div>


          </section>






          {/* Labels */}



          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">


            <h2 className="text-2xl font-bold mb-5">
              🏷️ Product Labels
            </h2>




            <div className="grid md:grid-cols-3 gap-4">



              <label className="border rounded-xl p-4 flex gap-3">

                <input

                  type="checkbox"

                  checked={hotSale}

                  onChange={(e)=>
                    setHotSale(
                      e.target.checked
                    )
                  }

                />

                🔥 Hot Sale


              </label>





              <label className="border rounded-xl p-4 flex gap-3">

                <input

                  type="checkbox"

                  checked={bestSeller}

                  onChange={(e)=>
                    setBestSeller(
                      e.target.checked
                    )
                  }

                />

                🏆 Best Seller


              </label>






              <label className="border rounded-xl p-4 flex gap-3">

                <input

                  type="checkbox"

                  checked={premiumProduct}

                  onChange={(e)=>
                    setPremiumProduct(
                      e.target.checked
                    )
                  }

                />


                👑 Premium


              </label>



            </div>



          </section>






          {/* Buttons */}



          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between gap-4">



            <Link

              href="/admin/products"

              className="border px-8 py-3 rounded-xl text-center font-semibold"

            >

              Cancel

            </Link>




            <button

              type="submit"

              disabled={saving}

              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"

            >

              {saving
              ?
              "⏳ Saving..."
              :
              "💾 Save Changes"}

            </button>




          </div>





        </form>


      </div>


    </main>


  );

}