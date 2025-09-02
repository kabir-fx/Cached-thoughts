import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/auth";

export async function GET() {
  const res = await proxyToBackend("/content", { method: "GET" }, { includeAuth: true });
  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const res = await proxyToBackend(
    "/content",
    { method: "POST", body: JSON.stringify(body) },
    { includeAuth: true }
  );
  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => ({}));
  const res = await proxyToBackend(
    "/content",
    { method: "DELETE", body: JSON.stringify(body) },
    { includeAuth: true }
  );
  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}
