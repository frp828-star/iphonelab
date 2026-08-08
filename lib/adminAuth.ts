import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type AdminAuthSuccess = {
  authorized: true;
};

type AdminAuthFailure = {
  authorized: false;
  response: NextResponse;
};

type AdminAuthResult =
  | AdminAuthSuccess
  | AdminAuthFailure;

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();

  const session =
    cookieStore.get("admin_session")?.value;

  return session === "authenticated";
}

export async function requireAdmin(): Promise<AdminAuthResult> {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      ),
    };
  }

  return {
    authorized: true,
  };
}