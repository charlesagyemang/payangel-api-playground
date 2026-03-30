import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PayAngel SDK Playground",
  description: "Interactive playground to test the PayAngel payments SDK — disbursement, collection, and webhooks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#0a0a0a", color: "#ededed" }}>
        <nav style={{ background: "#111", borderBottom: "1px solid #333", padding: "12px 24px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#fff", fontWeight: 700, fontSize: 18, textDecoration: "none" }}>PayAngel Playground</a>
          <a href="/disbursement" style={{ color: "#888", textDecoration: "none", fontSize: 14 }}>Disbursement</a>
          <a href="/collection" style={{ color: "#888", textDecoration: "none", fontSize: 14 }}>Collection</a>
          <a href="/webhooks" style={{ color: "#888", textDecoration: "none", fontSize: 14 }}>Webhooks</a>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12, fontSize: 12 }}>
            <a href="https://www.npmjs.com/package/payangel" target="_blank" rel="noopener" style={{ color: "#888", textDecoration: "none" }}>npm</a>
            <a href="https://pypi.org/project/payangel/" target="_blank" rel="noopener" style={{ color: "#888", textDecoration: "none" }}>PyPI</a>
            <a href="https://rubygems.org/gems/payangel" target="_blank" rel="noopener" style={{ color: "#888", textDecoration: "none" }}>RubyGems</a>
          </div>
        </nav>
        <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
          {children}
        </main>
        <footer style={{ borderTop: "1px solid #222", padding: "16px 24px", textAlign: "center", color: "#555", fontSize: 12 }}>
          <a href="https://payangel.com" target="_blank" rel="noopener" style={{ color: "#888", textDecoration: "none" }}>payangel.com</a>
          {" | "}
          <a href="https://business.payangel.com" target="_blank" rel="noopener" style={{ color: "#888", textDecoration: "none" }}>Get API Keys</a>
        </footer>
      </body>
    </html>
  );
}
