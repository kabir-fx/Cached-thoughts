import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const backendRes = await proxyToBackend("/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const json = await backendRes.json().catch(() => ({}));
    if (backendRes.ok && typeof json.msg === "string") {
      const res = NextResponse.json({ ok: true });
      res.cookies.set("token", json.msg, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }
    return NextResponse.json(json ?? { error: "Login failed" }, { status: backendRes.status });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


