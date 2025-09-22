export async function safeJson(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new SyntaxError(
      `Expected JSON, got: ${ct || "unknown"}; starts with: ${text.slice(0, 30)}`
    );
  }
  return res.json();
}
