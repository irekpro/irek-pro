const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, PORT = "8766", HOST = "127.0.0.1" } = Bun.env;

async function submitContact(request) {
  const size = Number(request.headers.get("content-length"));
  if (!Number.isSafeInteger(size) || size < 1 || size > 16_384) {
    return new Response(null, { status: 400 });
  }

  const fields = await request.json().catch(() => null);
  const name = typeof fields?.name === "string" ? fields.name.trim() : "";
  const phone = typeof fields?.phone === "string" ? fields.phone.trim() : "";
  const message = typeof fields?.message === "string" ? fields.message.trim() : "";
  if (!name || name.length > 100 || phone.length > 32 ||
      !/^\+?[\d ().-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7 ||
      !message || message.length > 2000) {
    return new Response(null, { status: 400 });
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return new Response(null, { status: 503 });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `Новая заявка с irek.pro\n\nИмя: ${name}\nТелефон: ${phone}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) return new Response(null, { status: 204 });
  } catch {
    // Leave the form filled so the visitor can retry.
  }
  return new Response(null, { status: 502 });
}

Bun.serve({
  hostname: HOST,
  port: Number(PORT),
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact" && request.method === "POST") {
      return submitContact(request);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, { status: 405 });
    }

    const path = pathname === "/" ? "/index.html" : pathname;
    if (!/^\/(?:index\.html|sitemap\.xml|style\.css|player\.js|contact\.js|(?:img|video)\/[\w.-]+)$/.test(path)) {
      return new Response(null, { status: 404 });
    }
    const file = Bun.file(import.meta.dir + path);
    return await file.exists()
      ? new Response(file)
      : new Response(null, { status: 404 });
  },
});
