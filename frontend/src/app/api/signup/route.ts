import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const backendRes = await proxyToBackend("/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const json = await backendRes.json().catch(() => ({}));
    return NextResponse.json(json, { status: backendRes.status });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


