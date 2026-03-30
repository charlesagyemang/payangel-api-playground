"use client";
import { useState, useEffect } from "react";
import { useKeys, useApiCall, ResultPanel, Field, KeyStatus, inputStyle, btnStyle, cardStyle } from "@/lib/ui";

export default function CollectionPage() {
  const keys = useKeys();
  const momo = useApiCall();
  const card = useApiCall();
  const status = useApiCall();

  const [statusId, setStatusId] = useState("");

  const [momoParams, setMomoParams] = useState({
    mobileNetwork: "mtn",
    ipAddress: "",
    transactionId: "",
    country: "GH",
    amount: 1,
    customerAccount: "",
    currency: "GHS",
    itemDescription: "Test Order",
    callbackUrl: "https://example.com/webhooks/payangel",
  });

  const [cardParams, setCardParams] = useState({
    transactionId: "",
    country: "GH",
    customerAccount: "",
    currency: "GHS",
    amount: 10,
    itemDescription: "Test Payment",
    redirectUrl: "https://example.com/payment/complete",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = Date.now().toString();
    setMomoParams(p => ({ ...p, transactionId: `COLL-MOMO-${t}` }));
    setCardParams(p => ({ ...p, transactionId: `COLL-CARD-${t}` }));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Collection Tests</h1>
      <KeyStatus />
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Test mobile money collection, card collection, and status checks.</p>

      {/* Mobile Money */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>1. Mobile Money Collection</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(momoParams).map(([key, val]) => (
            <Field key={key} label={key}>
              <input
                value={String(val)}
                onChange={e => setMomoParams({ ...momoParams, [key]: key === "amount" ? Number(e.target.value) : e.target.value } as typeof momoParams)}
                style={inputStyle}
              />
            </Field>
          ))}
        </div>
        <button style={{ ...btnStyle, marginTop: 8 }} onClick={() => {
          const freshId = `COLL-MOMO-${Date.now()}`;
          setMomoParams(p => ({ ...p, transactionId: freshId }));
          momo.call("/api/collection/momo", { ...keys, params: { ...momoParams, transactionId: freshId } });
        }} disabled={momo.loading}>
          {momo.loading ? "Initiating..." : "Initiate MOMO Collection"}
        </button>
        <ResultPanel {...momo} />
      </div>

      {/* Card */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>2. Card Collection</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(cardParams).map(([key, val]) => (
            <Field key={key} label={key}>
              <input
                value={String(val)}
                onChange={e => setCardParams({ ...cardParams, [key]: key === "amount" ? Number(e.target.value) : e.target.value } as typeof cardParams)}
                style={inputStyle}
              />
            </Field>
          ))}
        </div>
        <button style={{ ...btnStyle, marginTop: 8 }} onClick={() => {
          const freshId = `COLL-CARD-${Date.now()}`;
          setCardParams(p => ({ ...p, transactionId: freshId }));
          card.call("/api/collection/card", { ...keys, params: { ...cardParams, transactionId: freshId } });
        }} disabled={card.loading}>
          {card.loading ? "Creating..." : "Create Card Collection"}
        </button>
        <ResultPanel {...card} />
      </div>

      {/* Status */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>3. Collection Status</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <Field label="Transaction ID">
            <input value={statusId} onChange={e => setStatusId(e.target.value)} placeholder="COLL-MOMO-..." style={{ ...inputStyle, width: 300 }} />
          </Field>
          <button style={{ ...btnStyle, marginBottom: 12 }} onClick={() => status.call("/api/collection/status", { ...keys, transactionId: statusId })} disabled={status.loading}>
            {status.loading ? "Checking..." : "Check Status"}
          </button>
        </div>
        <ResultPanel {...status} />
      </div>
    </div>
  );
}
