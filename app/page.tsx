"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [keys, setKeys] = useState({ publicKey: "", secretKey: "", env: "production" });
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("payangel_keys") || "{}");
      setKeys({
        publicKey: stored.publicKey || "",
        secretKey: stored.secretKey || "",
        env: stored.env || "production",
      });
    } catch {}
    setMounted(true);
  }, []);

  function saveKeys() {
    localStorage.setItem("payangel_keys", JSON.stringify(keys));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clearKeys() {
    localStorage.removeItem("payangel_keys");
    setKeys({ publicKey: "", secretKey: "", env: "production" });
  }

  if (!mounted) return null;

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>PayAngel SDK Playground</h1>
      <p style={{ color: "#888", marginBottom: 8 }}>
        Interactive playground to test the <a href="https://www.npmjs.com/package/payangel" target="_blank" rel="noopener" style={{ color: "#2563eb", textDecoration: "none" }}>payangel</a> SDK against the live API.
      </p>
      <p style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>
        Get your API keys from <a href="https://business.payangel.com" target="_blank" rel="noopener" style={{ color: "#2563eb", textDecoration: "none" }}>business.payangel.com</a>.
        Keys are stored in your browser only and sent per request — never stored on the server.
      </p>

      <div style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: 20, marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>API Keys</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Public Key"
            value={keys.publicKey}
            onChange={(e) => setKeys({ ...keys, publicKey: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Secret Key"
            type="password"
            value={keys.secretKey}
            onChange={(e) => setKeys({ ...keys, secretKey: e.target.value })}
            style={inputStyle}
          />
          <select
            value={keys.env}
            onChange={(e) => setKeys({ ...keys, env: e.target.value })}
            style={inputStyle}
          >
            <option value="sandbox">Sandbox (payconnect.payangel.org)</option>
            <option value="production">Production (payconnect.payangel.com)</option>
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={saveKeys} style={btnStyle}>
              {saved ? "Saved!" : "Save Keys"}
            </button>
            <button onClick={clearKeys} style={{ ...btnStyle, background: "#333" }}>
              Clear Keys
            </button>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Test Features</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        <FeatureCard href="/disbursement" title="Disbursement" desc="Send money (bank & mobile), query transactions, check balance, get bank codes, verify account names" />
        <FeatureCard href="/collection" title="Collection" desc="Mobile money collection, card payments, check collection status" />
        <FeatureCard href="/webhooks" title="Webhooks" desc="Test HMAC-SHA256 webhook signature verification — no API keys needed" />
      </div>

      <div style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: 20 }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Install the SDK</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <p style={{ color: "#888", fontSize: 12, margin: "0 0 6px" }}>JavaScript / TypeScript</p>
            <code style={{ background: "#0a0a0a", padding: "8px 12px", borderRadius: 6, fontSize: 13, display: "block" }}>npm install payangel</code>
          </div>
          <div>
            <p style={{ color: "#888", fontSize: 12, margin: "0 0 6px" }}>Python</p>
            <code style={{ background: "#0a0a0a", padding: "8px 12px", borderRadius: 6, fontSize: 13, display: "block" }}>pip install payangel</code>
          </div>
          <div>
            <p style={{ color: "#888", fontSize: 12, margin: "0 0 6px" }}>Ruby</p>
            <code style={{ background: "#0a0a0a", padding: "8px 12px", borderRadius: 6, fontSize: 13, display: "block" }}>gem install payangel</code>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a href={href} style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: 16, textDecoration: "none", color: "inherit" }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>{title}</h3>
      <p style={{ margin: 0, color: "#888", fontSize: 13 }}>{desc}</p>
    </a>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "10px 12px", color: "#eee", fontSize: 14,
};
const btnStyle: React.CSSProperties = {
  background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "10px 16px", cursor: "pointer", fontSize: 14, fontWeight: 600,
};
