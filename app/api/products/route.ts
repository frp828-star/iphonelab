import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "data",
  "products.json"
);

function getProducts() {
  const file = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(file);
}

function saveProducts(products: any[]) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(products, null, 2),
    "utf-8"
  );
}

// GET - সব Product
export async function GET() {
  try {
    const products = getProducts();

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

// POST - নতুন Product Add
export async function POST(request: Request) {
  try {
    const products = getProducts();
    const body = await request.json();

    const newProduct = {
      id:
        products.length > 0
          ? Math.max(...products.map((p: any) => p.id)) + 1
          : 1,
      ...body,
    };

    products.push(newProduct);

    saveProducts(products);

    return NextResponse.json(newProduct, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}

// PUT - Product Edit
export async function PUT(request: Request) {
  try {
    const products = getProducts();
    const body = await request.json();

    const id = Number(body.id);

    const index = products.findIndex(
      (product: any) => product.id === id
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    products[index] = {
      ...products[index],
      ...body,
      id,
    };

    saveProducts(products);

    return NextResponse.json(products[index]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Product Delete
export async function DELETE(request: Request) {
  try {
    const products = getProducts();

    const { id } = await request.json();

    const productId = Number(id);

    const filteredProducts = products.filter(
      (product: any) => product.id !== productId
    );

    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    saveProducts(filteredProducts);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}