import { NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/config";

export async function GET(
  _req: Request,
  { params }: { params: { sharelink: string } }
) {
  const base = getBackendBaseUrl();
  const res = await fetch(`${base}/content/${encodeURIComponent(params.sharelink)}`);
  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}


