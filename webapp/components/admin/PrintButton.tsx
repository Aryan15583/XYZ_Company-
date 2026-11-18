"use client";

export function PrintButton() {
  return (
    <button type="button" className="no-print" onClick={() => window.print()} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #f4b400", background: "#f4b400", color: "#191933", fontWeight: 700, cursor: "pointer" }}>
      🖨 Print / Save as PDF
    </button>
  );
}
