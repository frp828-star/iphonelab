import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET - সব Users
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, phone, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET users error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const users = (data ?? []).map((user) => ({
      id: Number(user.id),
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      createdAt: user.created_at,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET users error:", error);

    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

// POST - নতুন User তৈরি
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const phone = String(body.phone || "").trim();

    const password = String(body.password || "");

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Basic password length validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    // Duplicate email check
    const {
      data: existingUser,
      error: checkError,
    } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error(
        "Check existing user error:",
        checkError
      );

      return NextResponse.json(
        { error: checkError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // 🔐 Hash password before saving
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          name,
          email,
          phone,

          // Never save plain password
          password: hashedPassword,
        },
      ])
      .select(
        "id, name, email, phone, created_at"
      )
      .single();

    if (error) {
      console.error("POST users error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id: Number(data.id),
        name: data.name,
        email: data.email,
        phone: data.phone,
        createdAt: data.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST users error:", error);

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// DELETE - User Delete
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const userId = Number(id);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId)
      .select("id");

    if (error) {
      console.error("DELETE users error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE users error:", error);

    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}