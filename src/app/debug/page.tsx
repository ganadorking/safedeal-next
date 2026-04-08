"use client";

import { useState, useEffect } from "react";

export default function DebugPage() {
  const [results, setResults] = useState<Record<string, string>>({});
  const [clientErrors, setClientErrors] = useState<string[]>([]);

  useEffect(() => {
    const errors: string[] = [];

    // 1. Check env vars on client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const stripePk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const envStatus: Record<string, string> = {
      "NEXT_PUBLIC_SUPABASE_URL": supabaseUrl || "MISSING",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": supabaseKey ? `${supabaseKey.slice(0, 20)}...` : "MISSING",
      "NEXT_PUBLIC_SITE_URL": siteUrl || "MISSING",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": stripePk ? `${stripePk.slice(0, 15)}...` : "MISSING",
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME": cloudName || "MISSING",
    };

    // 2. Check Supabase connection
    if (supabaseUrl && supabaseKey) {
      fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: { apikey: supabaseKey },
      })
        .then((r) => {
          envStatus["Supabase Auth"] = r.ok ? `OK (${r.status})` : `ERROR (${r.status})`;
          setResults({ ...envStatus });
        })
        .catch((e) => {
          envStatus["Supabase Auth"] = `FETCH ERROR: ${e.message}`;
          setResults({ ...envStatus });
        });
    }

    // 3. Test API routes
    fetch("/api/categories")
      .then((r) => r.json().then((d) => {
        envStatus["API /api/categories"] = r.ok ? `OK (${d.categories?.length || 0} cats)` : `ERROR: ${JSON.stringify(d).slice(0, 100)}`;
        setResults({ ...envStatus });
      }))
      .catch((e) => {
        envStatus["API /api/categories"] = `FETCH ERROR: ${e.message}`;
        setResults({ ...envStatus });
      });

    // 4. Test Supabase client import
    try {
      const { createClient } = require("@/lib/supabase/client");
      const client = createClient();
      envStatus["Supabase Client"] = client ? "CREATED OK" : "NULL";
      client.auth.getUser().then(({ data, error }: { data: { user: unknown }; error: unknown }) => {
        envStatus["Supabase getUser"] = error ? `ERROR: ${(error as Error).message}` : data.user ? "LOGGED IN" : "NO SESSION (ok)";
        setResults({ ...envStatus });
      });
    } catch (e) {
      envStatus["Supabase Client"] = `IMPORT ERROR: ${(e as Error).message}`;
      errors.push(`Supabase client: ${(e as Error).message}`);
    }

    // 5. Global error catcher
    const origError = window.onerror;
    window.onerror = (msg, src, line, col, err) => {
      setClientErrors((prev) => [...prev, `${msg} (${src}:${line}:${col})`]);
      if (origError) return origError(msg, src, line, col, err);
      return false;
    };

    const origUnhandled = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
      setClientErrors((prev) => [...prev, `Unhandled: ${event.reason?.message || event.reason}`]);
      if (origUnhandled) origUnhandled.call(window, event);
    };

    setClientErrors(errors);
    setResults(envStatus);

    return () => {
      window.onerror = origError;
      window.onunhandledrejection = origUnhandled;
    };
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", fontFamily: "monospace" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>SafeDeal Debug</h1>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#4A7CF7" }}>Environment Variables</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30, fontSize: 13 }}>
        <tbody>
          {Object.entries(results).map(([key, val]) => (
            <tr key={key} style={{ borderBottom: "1px solid #E2E8F0" }}>
              <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>{key}</td>
              <td style={{
                padding: "8px 12px",
                color: val === "MISSING" || val.startsWith("ERROR") || val.startsWith("FETCH ERROR") || val.startsWith("IMPORT ERROR")
                  ? "#ef4444" : "#10b981",
              }}>
                {val}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#ef4444" }}>
        Client Errors ({clientErrors.length})
      </h2>
      {clientErrors.length === 0 ? (
        <p style={{ color: "#10b981", fontSize: 13 }}>No errors detected</p>
      ) : (
        <ul style={{ fontSize: 12, color: "#ef4444", lineHeight: 1.8 }}>
          {clientErrors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 30, padding: 16, background: "#F8FAFC", borderRadius: 10, fontSize: 12, color: "#64748B" }}>
        <strong>Next steps:</strong> Comparte una captura de esta pagina y sabré exactamente qué falla.
      </div>
    </div>
  );
}
