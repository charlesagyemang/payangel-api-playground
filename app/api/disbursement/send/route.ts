import { NextRequest, NextResponse } from "next/server";
import { createClient, errorResponse } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = createClient(body);
    const result = await client.disbursement.send(body.params);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
