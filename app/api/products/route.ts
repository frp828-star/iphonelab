import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - সব Product
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("GET products error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("GET products error:", error);

    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

// POST - নতুন Product Add
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      category,
      price,
      oldPrice,
      discount,
      rating,
      reviews,
      stock,
      freeDelivery,
      warranty,
      image,
      featured,
      sale,
      hotSale,
      bestSeller,
      premiumProduct,
      description,
    } = body;

    if (
      !name ||
      !category ||
      price === undefined ||
      price === "" ||
      !image
    ) {
      return NextResponse.json(
        {
          error: "Name, category, price and image are required",
        },
        { status: 400 }
      );
    }

    // সর্বশেষ ID বের করা
    const { data: lastProduct, error: lastProductError } =
      await supabase
        .from("products")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (lastProductError) {
      console.error(
        "Last product error:",
        lastProductError
      );

      return NextResponse.json(
        { error: lastProductError.message },
        { status: 500 }
      );
    }

    const newId = lastProduct
      ? Number(lastProduct.id) + 1
      : 1;

    const productData = {
      id: newId,
      name: name.trim(),
      category,
      price: Number(price),

      oldPrice:
        oldPrice !== undefined && oldPrice !== ""
          ? Number(oldPrice)
          : null,

      discount:
        discount !== undefined && discount !== ""
          ? Number(discount)
          : null,

      rating:
        rating !== undefined && rating !== ""
          ? Number(rating)
          : 5,

      reviews:
        reviews !== undefined && reviews !== ""
          ? Number(reviews)
          : 0,

      stock: stock ?? true,
      freeDelivery: freeDelivery ?? false,
      warranty: warranty?.trim() || null,
      image: image.trim(),

      featured: featured ?? true,
      sale: sale ?? false,
      hotSale: hotSale ?? false,
      bestSeller: bestSeller ?? false,
      premiumProduct: premiumProduct ?? false,

      description: description?.trim() || null,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("POST products error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error("POST products error:", error);

    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}

// PUT - Product Edit
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const productId = Number(body.id);

    if (!productId || Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Valid Product ID is required" },
        { status: 400 }
      );
    }

    // শুধুমাত্র database-এর প্রয়োজনীয় fields update করব
    const updates = {
      name:
        body.name !== undefined
          ? String(body.name).trim()
          : undefined,

      category:
        body.category !== undefined
          ? String(body.category)
          : undefined,

      price:
        body.price !== undefined && body.price !== ""
          ? Number(body.price)
          : undefined,

      oldPrice:
        body.oldPrice !== undefined &&
        body.oldPrice !== ""
          ? Number(body.oldPrice)
          : null,

      discount:
        body.discount !== undefined &&
        body.discount !== ""
          ? Number(body.discount)
          : null,

      rating:
        body.rating !== undefined &&
        body.rating !== ""
          ? Number(body.rating)
          : 5,

      reviews:
        body.reviews !== undefined &&
        body.reviews !== ""
          ? Number(body.reviews)
          : 0,

      stock:
        body.stock !== undefined
          ? Boolean(body.stock)
          : true,

      freeDelivery:
        body.freeDelivery !== undefined
          ? Boolean(body.freeDelivery)
          : false,

      warranty:
        body.warranty !== undefined
          ? String(body.warranty).trim() || null
          : null,

      image:
        body.image !== undefined
          ? String(body.image).trim()
          : undefined,

      featured:
        body.featured !== undefined
          ? Boolean(body.featured)
          : true,

      sale:
        body.sale !== undefined
          ? Boolean(body.sale)
          : false,

      hotSale:
        body.hotSale !== undefined
          ? Boolean(body.hotSale)
          : false,

      bestSeller:
        body.bestSeller !== undefined
          ? Boolean(body.bestSeller)
          : false,

      premiumProduct:
        body.premiumProduct !== undefined
          ? Boolean(body.premiumProduct)
          : false,

      description:
        body.description !== undefined
          ? String(body.description).trim() || null
          : null,
    };

    // undefined field বাদ দেওয়া
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(
        ([, value]) => value !== undefined
      )
    );

    console.log("Updating product:", productId);
    console.log("Update data:", cleanUpdates);

    const { data, error } = await supabase
      .from("products")
      .update(cleanUpdates)
      .eq("id", productId)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("PUT products error:", error);

      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Product was not updated. Product may not exist or database permission may be blocking the update.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("PUT products error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update product",
      },
      { status: 500 }
    );
  }
}

// DELETE - Product Delete
export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const productId = Number(body.id);

    if (!productId || Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Valid Product ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("DELETE products error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      product: data,
    });
  } catch (error) {
    console.error("DELETE products error:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}