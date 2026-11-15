export async function onRequestGet(): Promise<Response> {
  return new Response(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
