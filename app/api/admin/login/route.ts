import { NextResponse } from "next/server";

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

    // Admin credentials from environment variables
    const adminEmail =
      process.env.ADMIN_EMAIL?.trim().toLowerCase();

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error(
        "ADMIN_EMAIL or ADMIN_PASSWORD is missing"
      );

      return NextResponse.json(
        {
          error: "Admin authentication is not configured",
        },
        {
          status: 500,
        }
      );
    }

    // Verify admin credentials
    if (
      email !== adminEmail ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        {
          error: "Invalid admin email or password",
        },
        {
          status: 401,
        }
      );
    }

    // Login successful
    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
    });

    // Secure HttpOnly session cookie
    // Session expires after 1 hour
    response.cookies.set({
      name: "admin_session",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        error: "Admin login failed",
      },
      {
        status: 500,
      }
    );
  }
}