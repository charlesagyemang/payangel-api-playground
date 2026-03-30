"use client";
import { useState, useEffect, ReactNode } from "react";

// --- Styles ---
export const inputStyle: React.CSSProperties = {
  background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "10px 12px", color: "#eee", fontSize: 14, width: "100%", boxSizing: "border-box",
};
export const btnStyle: React.CSSProperties = {
  background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600,
};
export const cardStyle: React.CSSProperties = {
  background: "#111", border: "1px solid #333", borderRadius: 8, padding: 20, marginBottom: 16,
};

// --- Hooks ---
export function useKeys() {
  const [keys, setKeys] = useState(() => {
    if (typeof window === "undefined") return { publicKey: "", secretKey: "", env: "sandbox" };
    try {
      return JSON.parse(localStorage.getItem("payangel_keys") || "{}");
    } catch {
      return { publicKey: "", secretKey: "", env: "sandbox" };
    }
  });
  return keys as { publicKey: string; secretKey: string; env: string };
}

export function useApiCall() {
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(url: string, body: unknown) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) {
        setError(`${data.name || "Error"}: ${data.message}${data.code ? ` (${data.code})` : ""}`);
        setResult(data);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, call };
}

// --- Components ---
export function ResultPanel({ result, loading, error }: { result: unknown; loading: boolean; error: string | null }) {
  return (
    <div style={{ ...cardStyle, marginTop: 16 }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#888" }}>Result</h3>
      {loading && <p style={{ color: "#f59e0b" }}>Loading...</p>}
      {error && <p style={{ color: "#ef4444", wordBreak: "break-word" }}>{error}</p>}
      {result !== null && (
        <pre style={{ background: "#0a0a0a", padding: 12, borderRadius: 6, overflow: "auto", fontSize: 12, maxHeight: 500, margin: 0 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      {!loading && !error && result === null && <p style={{ color: "#555" }}>No result yet. Run a test above.</p>}
    </div>
  );
}

export function KeyStatus() {
  const keys = useKeys();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const hasPub = keys.publicKey.length > 0;
  const hasSec = keys.secretKey.length > 0;
  return (
    <div style={{ ...cardStyle, padding: 12, marginBottom: 16, fontSize: 12, color: "#888" }}>
      <strong>Loaded Keys:</strong>{" "}
      Public: <span style={{ color: hasPub ? "#22c55e" : "#ef4444" }}>
        {hasPub ? `${keys.publicKey.slice(0, 8)}...${keys.publicKey.slice(-4)}` : "MISSING"}
      </span>{" | "}
      Secret: <span style={{ color: hasSec ? "#22c55e" : "#ef4444" }}>
        {hasSec ? `${keys.secretKey.slice(0, 8)}...${keys.secretKey.slice(-4)}` : "MISSING"}
      </span>{" | "}
      Env: <span style={{ color: "#f59e0b" }}>{keys.env}</span>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}
