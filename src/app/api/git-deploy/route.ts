import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { gitDeployApi } from "@/lib/api/git-deploy";

export async function GET(req: NextRequest) {
  try {
    const token = await requireAuth();
    const domain = req.nextUrl.searchParams.get("domain");
    if (!domain) return NextResponse.json({ error: "Doména je povinná" }, { status: 400 });

    const data = await gitDeployApi.get(domain, token);
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
    const { domain, ...deployData } = await req.json();
    if (!domain) return NextResponse.json({ error: "Doména je povinná" }, { status: 400 });

    const data = await gitDeployApi.configure(domain, deployData, token);
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
    if (!domain) return NextResponse.json({ error: "Doména je povinná" }, { status: 400 });

    const data = await gitDeployApi.destroy(domain, token);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Neautorizovaný" }, { status: 401 });
    }
    return NextResponse.json({ error: "Chyba servera" }, { status: 500 });
  }
}
