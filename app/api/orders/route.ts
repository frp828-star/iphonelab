import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET - সব Orders
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET orders error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}

// POST - নতুন Order তৈরি
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerId,
      customerName,
      phone,
      address,
      products,
      subtotal,
      shipping,
      discount,
      total,
      deliveryArea,
      paymentMethod,
      paymentNumber,
      transactionId,
      status,
      createdAt,
    } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    if (!customerName || !phone || !address) {
      return NextResponse.json(
        {
          error:
            "Customer name, phone and address are required",
        },
        { status: 400 }
      );
    }

    if (
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return NextResponse.json(
        { error: "Order products are required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    const newOrder = {
      customer_id: Number(customerId),

      customer_name: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),

      products,

      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      discount: Number(discount) || 0,
      total: Number(total) || 0,

      delivery_area: deliveryArea || "inside",
      payment_method: paymentMethod,

      payment_number:
        paymentNumber?.trim() || null,

      transaction_id:
        transactionId?.trim() || null,

      status: status || "Pending",

      created_at:
        createdAt || new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error("POST orders error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// PUT - Order Update
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      ...body,
    };

    delete updateData.id;

    // Frontend camelCase → Supabase snake_case

    if ("customerId" in updateData) {
      updateData.customer_id = Number(
        updateData.customerId
      );

      delete updateData.customerId;
    }

    if ("customerName" in updateData) {
      updateData.customer_name =
        updateData.customerName;

      delete updateData.customerName;
    }

    if ("deliveryArea" in updateData) {
      updateData.delivery_area =
        updateData.deliveryArea;

      delete updateData.deliveryArea;
    }

    if ("paymentMethod" in updateData) {
      updateData.payment_method =
        updateData.paymentMethod;

      delete updateData.paymentMethod;
    }

    if ("paymentNumber" in updateData) {
      updateData.payment_number =
        updateData.paymentNumber;

      delete updateData.paymentNumber;
    }

    if ("transactionId" in updateData) {
      updateData.transaction_id =
        updateData.transactionId;

      delete updateData.transactionId;
    }

    if ("createdAt" in updateData) {
      updateData.created_at =
        updateData.createdAt;

      delete updateData.createdAt;
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PUT orders error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Order Delete
export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("DELETE orders error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}