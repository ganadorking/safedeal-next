"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <i
          className="fas fa-exclamation-triangle"
          style={{ fontSize: 28, color: "#ef4444" }}
        />
      </div>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#0F172A",
          marginBottom: 12,
        }}
      >
        Algo salio mal
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "#64748B",
          maxWidth: 440,
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        {error?.message || "Ocurrio un error inesperado. Intenta de nuevo o vuelve mas tarde."}
      </p>
      <button onClick={reset} className="btn btn-primary btn-lg">
        Intentar de nuevo
      </button>
    </div>
  );
}
