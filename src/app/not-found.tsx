import Link from "next/link";

export default function NotFound() {
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
      <h1
        className="gradient-text"
        style={{
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: 16,
          letterSpacing: -2,
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#0F172A",
          marginBottom: 12,
        }}
      >
        Pagina no encontrada
      </h2>
      <p
        style={{
          fontSize: 16,
          color: "#64748B",
          maxWidth: 440,
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        Lo sentimos, la pagina que buscas no existe o fue movida a otra
        ubicacion.
      </p>
      <Link href="/" className="btn btn-primary btn-lg">
        Volver al inicio
      </Link>
    </div>
  );
}
