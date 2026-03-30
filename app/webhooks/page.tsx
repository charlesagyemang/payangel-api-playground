"use client";
import { useState } from "react";
import { useApiCall, ResultPanel, Field, inputStyle, btnStyle, cardStyle } from "@/lib/ui";

const DEFAULT_SECRET = "whsec_test_secret_123";

const SAMPLE_PAYLOAD = JSON.stringify({
  event: "disbursement.completed",
  data: {
    transaction_id: "txn_123456789",
    reference: "REF-001",
    status: "COMPLETED",
    amount: 1000,
    currency: "GHS",
    fee: 10,
    total: 1010,
    created_at: "2023-06-15T14:30:00Z",
    completed_at: "2023-06-15T15:30:00Z",
  },
}, null, 2);

export default function WebhooksPage() {
  const verify = useApiCall();
  const [secret, setSecret] = useState(DEFAULT_SECRET);
  const [payload, setPayload] = useState(SAMPLE_PAYLOAD);
  const [signature, setSignature] = useState("");
  const [autoSign, setAutoSign] = useState(true);

  async function computeSignature(body: string, sec: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(sec), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function runVerify(tamper: boolean) {
    const body = tamper ? payload.replace("1000", "99999") : payload;
    const sig = autoSign ? await computeSignature(payload, secret) : signature;
    verify.call("/api/webhook/verify", { payload: body, signature: sig, secret });
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Webhook Verification Tests</h1>
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Test HMAC-SHA256 webhook signature verification (no API keys needed).</p>

      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Configuration</h2>
        <Field label="Webhook Secret">
          <input value={secret} onChange={e => setSecret(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Payload (JSON)">
          <textarea value={payload} onChange={e => setPayload(e.target.value)} rows={14} style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }} />
        </Field>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: "#888", cursor: "pointer" }}>
            <input type="checkbox" checked={autoSign} onChange={e => setAutoSign(e.target.checked)} style={{ marginRight: 6 }} />
            Auto-compute signature (uncheck to provide manually)
          </label>
        </div>
        {!autoSign && (
          <Field label="Signature (hex)">
            <input value={signature} onChange={e => setSignature(e.target.value)} placeholder="HMAC-SHA256 hex string" style={inputStyle} />
          </Field>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button style={btnStyle} onClick={() => runVerify(false)} disabled={verify.loading}>
          Test Valid Signature
        </button>
        <button style={{ ...btnStyle, background: "#dc2626" }} onClick={() => runVerify(true)} disabled={verify.loading}>
          Test Tampered Body
        </button>
        <button style={{ ...btnStyle, background: "#7c3aed" }} onClick={() => {
          setAutoSign(false);
          setSignature("badbadbadbadbadbad");
          verify.call("/api/webhook/verify", { payload, signature: "badbadbadbadbadbad", secret });
        }} disabled={verify.loading}>
          Test Wrong Signature
        </button>
        <button style={{ ...btnStyle, background: "#d97706" }} onClick={() => {
          verify.call("/api/webhook/verify", { payload, signature: "", secret });
        }} disabled={verify.loading}>
          Test Missing Signature
        </button>
      </div>

      <ResultPanel {...verify} />
    </div>
  );
}
