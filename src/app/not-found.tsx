import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#F5F6F4",
          color: "#161B22",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main style={{ margin: "auto", maxWidth: 720, padding: "96px 24px", textAlign: "center" }}>
          <p style={{ color: "#8A6D3F", fontWeight: 700, letterSpacing: 2 }}>VISA EXPEDITOR</p>
          <h1 style={{ fontSize: 40 }}>Page not found</h1>
          <p>The page you are looking for does not exist or has moved.</p>
          <Link href="/" style={{ color: "#0F2444", fontWeight: 700 }}>Back to home</Link>
        </main>
      </body>
    </html>
  );
}
