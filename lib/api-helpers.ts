import { NextRequest, NextResponse } from "next/server";
import { PayAngel, PayAngelError } from "payangel";

export function createClient(body: { publicKey?: string; secretKey?: string; env?: string }) {
  const baseURL = process.env.PAYANGEL_BASE_URL;
  return new PayAngel({
    publicKey: body.publicKey || process.env.PAYANGEL_PUBLIC_KEY || "",
    secretKey: body.secretKey || process.env.PAYANGEL_SECRET_KEY || "",
    env: (body.env || process.env.PAYANGEL_ENV || "sandbox") as "sandbox" | "production",
    ...(baseURL ? { baseURL } : {}),
  });
}

export function errorResponse(err: unknown) {
  if (err instanceof PayAngelError) {
    return NextResponse.json({
      error: true,
      name: err.name,
      message: err.message,
      code: err.code,
      httpStatus: err.httpStatus,
      fields: err.fields,
      raw: err.raw,
    }, { status: 400 });
  }
  const message = err instanceof Error ? err.message : "Unknown error";
  return NextResponse.json({ error: true, message }, { status: 500 });
}
