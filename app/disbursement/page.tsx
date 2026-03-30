"use client";
import { useState, useEffect } from "react";
import { useKeys, useApiCall, ResultPanel, Field, KeyStatus, inputStyle, btnStyle, cardStyle } from "@/lib/ui";

function ts() { return Date.now().toString(); }

export default function DisbursementPage() {
  const keys = useKeys();
  const balance = useApiCall();
  const bankCodes = useApiCall();
  const nameCheck = useApiCall();
  const sendBank = useApiCall();
  const sendMobile = useApiCall();
  const query = useApiCall();

  const [country, setCountry] = useState("GH");
  const [queryId, setQueryId] = useState("");

  // Name check state
  const [nc, setNc] = useState({ country: "GH", accountNumber: "", payangelCode: "", accountType: "bank" });

  // Bank send state
  const [bank, setBank] = useState({
    transactionId: "",
    senderFirstName: "John", senderLastName: "Doe",
    countryFrom: "GH", countryTo: "GH",
    sendingCurrency: "GHS", receivingCurrency: "GHS",
    destinationAmount: 5,
    beneficiaryFirstName: "Jane", beneficiaryLastName: "Mensah",
    transferType: "bank" as const,
    bankAccountNumber: "", bankName: "",
    bankBranch: "", bankCode: "",
    transferReason: "Family Support", customerRef: "",
    callbackUrl: "https://example.com/webhooks/payangel",
  });

  // Mobile send state
  const [mobile, setMobile] = useState({
    transactionId: "",
    senderFirstName: "John", senderLastName: "Doe",
    countryFrom: "GH", countryTo: "GH",
    sendingCurrency: "GHS", receivingCurrency: "GHS",
    destinationAmount: 5,
    beneficiaryFirstName: "Jane", beneficiaryLastName: "Mensah",
    transferType: "mobile" as const,
    mobileNetwork: "MTN", mobileNumber: "",
    transferReason: "Family Support", customerRef: "",
    callbackUrl: "https://example.com/webhooks/payangel",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = ts();
    setBank(b => ({ ...b, transactionId: `PAY-BANK-${t}`, customerRef: `REF-${t}` }));
    setMobile(m => ({ ...m, transactionId: `PAY-MOMO-${t}`, customerRef: `REF-M-${t}` }));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Disbursement Tests</h1>
      <KeyStatus />
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Test all disbursement SDK methods against the live sandbox.</p>

      {/* Balance */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>1. Account Balance</h2>
        <button style={btnStyle} onClick={() => balance.call("/api/disbursement/balance", keys)} disabled={balance.loading}>
          {balance.loading ? "Loading..." : "Get Balance"}
        </button>
        <ResultPanel {...balance} />
      </div>

      {/* Bank Codes */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>2. Bank Codes</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <Field label="Country">
            <input value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, width: 100 }} />
          </Field>
          <button style={{ ...btnStyle, marginBottom: 12 }} onClick={() => bankCodes.call("/api/disbursement/bank-codes", { ...keys, country })} disabled={bankCodes.loading}>
            {bankCodes.loading ? "Loading..." : "Get Bank Codes"}
          </button>
        </div>
        <ResultPanel {...bankCodes} />
      </div>

      {/* Name Check */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>3. Name Check</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Country"><input value={nc.country} onChange={e => setNc({ ...nc, country: e.target.value })} style={inputStyle} /></Field>
          <Field label="Account Number"><input value={nc.accountNumber} onChange={e => setNc({ ...nc, accountNumber: e.target.value })} style={inputStyle} /></Field>
          <Field label="PayAngel Code"><input value={nc.payangelCode} onChange={e => setNc({ ...nc, payangelCode: e.target.value })} style={inputStyle} /></Field>
          <Field label="Account Type">
            <select value={nc.accountType} onChange={e => setNc({ ...nc, accountType: e.target.value })} style={inputStyle}>
              <option value="bank">Bank</option>
              <option value="mobile">Mobile</option>
            </select>
          </Field>
        </div>
        <button style={{ ...btnStyle, marginTop: 8 }} onClick={() => nameCheck.call("/api/disbursement/name-check", { ...keys, params: nc })} disabled={nameCheck.loading}>
          {nameCheck.loading ? "Checking..." : "Check Name"}
        </button>
        <ResultPanel {...nameCheck} />
      </div>

      {/* Send Bank */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>4. Send Money — Bank Transfer</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(bank).map(([key, val]) => (
            <Field key={key} label={key}>
              <input
                value={String(val)}
                onChange={e => setBank({ ...bank, [key]: key === "destinationAmount" ? Number(e.target.value) : e.target.value } as typeof bank)}
                style={inputStyle}
              />
            </Field>
          ))}
        </div>
        <button style={{ ...btnStyle, marginTop: 8 }} onClick={() => {
          const freshId = `PAY-BANK-${Date.now()}`;
          const ref = `REF-${Date.now()}`;
          setBank(b => ({ ...b, transactionId: freshId, customerRef: ref }));
          sendBank.call("/api/disbursement/send", { ...keys, params: { ...bank, transactionId: freshId, customerRef: ref } });
        }} disabled={sendBank.loading}>
          {sendBank.loading ? "Sending..." : "Send Bank Transfer"}
        </button>
        <ResultPanel {...sendBank} />
      </div>

      {/* Send Mobile */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>5. Send Money — Mobile Money</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(mobile).map(([key, val]) => (
            <Field key={key} label={key}>
              <input
                value={String(val)}
                onChange={e => setMobile({ ...mobile, [key]: key === "destinationAmount" ? Number(e.target.value) : e.target.value } as typeof mobile)}
                style={inputStyle}
              />
            </Field>
          ))}
        </div>
        <button style={{ ...btnStyle, marginTop: 8 }} onClick={() => {
          const freshId = `PAY-MOMO-${Date.now()}`;
          const ref = `REF-M-${Date.now()}`;
          setMobile(m => ({ ...m, transactionId: freshId, customerRef: ref }));
          sendMobile.call("/api/disbursement/send", { ...keys, params: { ...mobile, transactionId: freshId, customerRef: ref } });
        }} disabled={sendMobile.loading}>
          {sendMobile.loading ? "Sending..." : "Send Mobile Money"}
        </button>
        <ResultPanel {...sendMobile} />
      </div>

      {/* Query */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>6. Query Transaction</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <Field label="Transaction ID">
            <input value={queryId} onChange={e => setQueryId(e.target.value)} placeholder="PAY-BANK-..." style={{ ...inputStyle, width: 300 }} />
          </Field>
          <button style={{ ...btnStyle, marginBottom: 12 }} onClick={() => query.call("/api/disbursement/query", { ...keys, transactionId: queryId })} disabled={query.loading}>
            {query.loading ? "Querying..." : "Query"}
          </button>
        </div>
        <ResultPanel {...query} />
      </div>
    </div>
  );
}
