// /api/sheet.js  (Vercel Serverless Function)
export default async function handler(req, res) {
  try {
    const base = process.env.APPS_SCRIPT_URL; // set in Vercel env vars
    if (!base) {
      return res.status(500).json({ error: "Missing APPS_SCRIPT_URL env var" });
    }

    // action can come from query string or JSON body
    const action = req.query.action || (req.body && req.body.action);
    if (!action) return res.status(400).json({ error: "Missing action" });

    const url = new URL(base);
    url.searchParams.set("action", action);

    // Forward request to Apps Script
    const upstream = await fetch(url.toString(), {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "GET" ? undefined : JSON.stringify(req.body || {}),
      redirect: "follow",
    });

    const text = await upstream.text();

    // Try to return JSON, else return raw text
    try {
      const json = JSON.parse(text);
      return res.status(upstream.status).json(json);
    } catch {
      return res.status(upstream.status).send(text);
    }
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
