import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { ftpApi } from "@/lib/api/ftp";

export async function GET(req: NextRequest) {
  try {
    const token = await requireAuth();
    const domain = req.nextUrl.searchParams.get("domain");
    if (!domain) return NextResponse.json({ error: "Doména je povinná" }, { status: 400 });

    const data = await ftpApi.list(domain, token);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Neautorizovaný" }, { status: 401 });
    }
    return NextResponse.json({ error: "Chyba servera" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await requireAuth();
    const { domain, ...ftpData } = await req.json();
    if (!domain) return NextResponse.json({ error: "Doména je povinná" }, { status: 400 });

    const data = await ftpApi.create(domain, ftpData, token);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Neautorizovaný" }, { status: 401 });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Chyba servera" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await requireAuth();
    const domain = req.nextUrl.searchParams.get("domain");
    const userId = req.nextUrl.searchParams.get("userId");
    if (!domain || !userId) {
      return NextResponse.json({ error: "Doména a userId sú povinné" }, { status: 400 });
    }

    const data = await ftpApi.destroy(domain, Number(userId), token);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Neautorizovaný" }, { status: 401 });
    }
    return NextResponse.json({ error: "Chyba servera" }, { status: 500 });
  }
}
