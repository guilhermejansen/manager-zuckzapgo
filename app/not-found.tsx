import Link from "next/link"

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", padding: "2rem", maxWidth: "500px" }}>
        <h1
          style={{
            fontSize: "6rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Página não encontrada
        </h2>
        <p style={{ marginBottom: "2rem", opacity: 0.7 }}>
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  )
}
