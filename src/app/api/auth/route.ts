import { NextRequest, NextResponse } from "next/server";
import { setToken, clearToken, getToken } from "@/lib/auth";
import { apiRequest } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token je povinný" }, { status: 400 });
    }

    // Verify token by calling a test endpoint
    await apiRequest("/domain/list", { token });

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
