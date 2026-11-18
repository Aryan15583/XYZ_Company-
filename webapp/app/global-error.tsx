"use client";

// Last-resort boundary: only used if the root layout itself crashes, so it can't
// rely on any site styles or components.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#191933", color: "#fdfdfd", textAlign: "center", padding: "20vh 24px" }}>
        <h1 style={{ color: "#ffdab9" }}>Arcana Crystals</h1>
        <p>Something went wrong on our side. Please try again in a moment.</p>
        <button
          onClick={reset}
          style={{ marginTop: 16, padding: "10px 20px", borderRadius: 8, border: 0, background: "#f4b400", color: "#191933", fontWeight: 700, cursor: "pointer" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
