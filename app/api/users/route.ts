import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "data",
  "users.json"
);

function getUsers() {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const file = fs.readFileSync(filePath, "utf-8");

  if (!file.trim()) {
    return [];
  }

  return JSON.parse(file);
}

function saveUsers(users: any[]) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(users, null, 2),
    "utf-8"
  );
}

// GET - সব Users
export async function GET() {
  try {
    const users = getUsers();

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

// POST - নতুন User তৈরি
export async function POST(request: Request) {
  try {
    const users = getUsers();
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

    // Duplicate email check
    const existingUser = users.find(
      (user: any) =>
        String(user.email).toLowerCase() === email
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const newUser = {
      id:
        users.length > 0
          ? Math.max(
              ...users.map((user: any) => user.id)
            ) + 1
          : 1,

      name,
      email,
      phone,
      password,

      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    saveUsers(users);

    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// DELETE - User Delete
export async function DELETE(request: Request) {
  try {
    const users = getUsers();

    const { id } = await request.json();

    const userId = Number(id);

    const filteredUsers = users.filter(
      (user: any) => user.id !== userId
    );

    if (filteredUsers.length === users.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    saveUsers(filteredUsers);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}