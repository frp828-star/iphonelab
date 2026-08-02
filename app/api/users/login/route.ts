import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // Find user from Supabase
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select(
        "id, name, email, phone, password, created_at"
      )
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Login user query error:", error);

      return NextResponse.json(
        {
          error: "Login failed",
        },
        {
          status: 500,
        }
      );
    }

    // User not found
    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // Password check
    if (String(user.password) !== password) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // Login successful
    return NextResponse.json({
      success: true,

      user: {
        id: Number(user.id),
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}