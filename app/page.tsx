export default function Home() {
  return (
    <main style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Idea System
      </h1>

      <p style={{ marginTop: "10px", color: "#555" }}>
        Capture, refine, and execute your ideas.
      </p>

      <div style={{ marginTop: "20px" }}>
        <button style={{ padding: "10px 16px" }}>
          + New Idea
        </button>
      </div>
    </main>
  );
}
