import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // Use POST to avoid GET body issues and align with typical semantics
  const res = await proxyToBackend("/content/share", { method: "POST", body: JSON.stringify(body) }, { includeAuth: true });
  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}


