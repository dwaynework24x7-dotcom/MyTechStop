import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#070708", color: "#f4f4f5", fontFamily: "sans-serif" }}>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "8rem 1.25rem" }}>
          <p style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12 }}>404</p>
          <h1 style={{ fontWeight: 500, fontSize: 40 }}>Page not found</h1>
          <p>The page is not available. Return to My Tech Stop.</p>
          <Link href="/en" style={{ color: "#fff" }}>
            My Tech Stop
          </Link>
        </main>
      </body>
    </html>
  );
}
