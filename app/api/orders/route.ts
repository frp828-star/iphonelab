import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "data",
  "orders.json"
);

function getOrders() {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const file = fs.readFileSync(filePath, "utf-8");

  if (!file.trim()) {
    return [];
  }

  return JSON.parse(file);
}

function saveOrders(orders: any[]) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(orders, null, 2),
    "utf-8"
  );
}

// GET - সব Orders
export async function GET() {
  try {
    const orders = getOrders();

    return NextResponse.json(orders);
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
    const orders = getOrders();
    const body = await request.json();

    const newOrder = {
      id:
        orders.length > 0
          ? Math.max(...orders.map((order: any) => order.id)) + 1
          : 1,

      ...body,

      status: body.status || "Pending",

      createdAt:
        body.createdAt || new Date().toISOString(),
    };

    orders.push(newOrder);

    saveOrders(orders);

    return NextResponse.json(newOrder, {
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

// PUT - Order Status / তথ্য Update
export async function PUT(request: Request) {
  try {
    const orders = getOrders();
    const body = await request.json();

    const id = Number(body.id);

    const index = orders.findIndex(
      (order: any) => order.id === id
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    orders[index] = {
      ...orders[index],
      ...body,
      id,
    };

    saveOrders(orders);

    return NextResponse.json(orders[index]);
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
    const orders = getOrders();

    const { id } = await request.json();

    const orderId = Number(id);

    const filteredOrders = orders.filter(
      (order: any) => order.id !== orderId
    );

    if (filteredOrders.length === orders.length) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    saveOrders(filteredOrders);

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