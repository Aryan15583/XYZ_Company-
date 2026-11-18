"use client";

export function PrintButton() {
  return (
    <button type="button" className="no-print" onClick={() => window.print()} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #c27b5c", background: "#c27b5c", color: "#10302c", fontWeight: 700, cursor: "pointer" }}>
      🖨 Print / Save as PDF
    </button>
  );
}
