import { NextRequest, NextResponse } from "next/server";
import { setToken, clearToken, getToken } from "@/lib/auth";
import { apiRequest, ApiError } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token je povinný" }, { status: 400 });
    }

    // Verify token by calling a test endpoint
    try {
      await apiRequest("/domain/list", { token });
    } catch (verifyError) {
      // Log the actual error for debugging
      console.error("Token verification error:", verifyError);

      // If it's a 401/403, token is truly invalid
      if (
        verifyError instanceof ApiError &&
        (verifyError.status === 401 || verifyError.status === 403)
      ) {
        return NextResponse.json(
          { error: "Neplatný API token" },
          { status: 401 }
        );
      }
      // For other errors (404, 500, network), token might be valid
      // but endpoint differs - allow login
      console.log("Token verification endpoint returned non-auth error, allowing login");
    }

    await setToken(token);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Neplatný API token" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  await clearToken();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const token = await getToken();
  return NextResponse.json({ authenticated: !!token });
}
