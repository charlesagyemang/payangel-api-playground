import { NextRequest, NextResponse } from "next/server";
import { PayAngel, WebhookSignatureError } from "payangel";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload, signature, secret } = body;
    const event = PayAngel.webhooks.verify(payload, signature, secret);
    return NextResponse.json({ verified: true, event });
  } catch (err) {
    if (err instanceof WebhookSignatureError) {
      return NextResponse.json({ verified: false, error: err.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ verified: false, error: message }, { status: 500 });
  }
}
