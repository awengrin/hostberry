import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { domainsApi } from "@/lib/api/domains";

export async function GET(req: NextRequest) {
  try {
    const token = await requireAuth();
    const type = req.nextUrl.searchParams.get("type");

    if (type === "hosted") {
      const data = await domainsApi.listHosted(token);
      return NextResponse.json(data);
    }

    const data = await domainsApi.list(token);
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
    const body = await req.json();
    const { action, ...params } = body;

    let data;
    switch (action) {
      case "check":
        data = await domainsApi.check(params.domain, token);
        break;
      case "register":
        data = await domainsApi.register(params, token);
        break;
      case "transfer":
        data = await domainsApi.transfer(params, token);
        break;
      case "renew":
        data = await domainsApi.renew(params.domain, token);
        break;
      case "prune-cache":
        data = await domainsApi.pruneCache(params.domain, token);
        break;
      case "verify":
        data = await domainsApi.verify(params.domain, token);
        break;
      default:
        return NextResponse.json({ error: "Neznáma akcia" }, { status: 400 });
    }

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
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID je povinné" }, { status: 400 });

    const data = await domainsApi.destroy(id, token);
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Neautorizovaný" }, { status: 401 });
    }
    return NextResponse.json({ error: "Chyba servera" }, { status: 500 });
  }
}
