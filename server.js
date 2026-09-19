/**
 * Invoice Generator, an APIVerve template.
 *
 * Turns a form into a PDF invoice with line items, tax and a download link.
 * The API key stays on the server: the browser only ever talks to /api routes.
 *
 * Invoice Generator: https://apiverve.com/marketplace/invoicegenerator
 */

const express = require('express');
const path = require('path');

// Set APIVERVE_API_KEY in .env (local) or your host's environment variables.
// Get a free key at https://dashboard.apiverve.com
const API_KEY = process.env.APIVERVE_API_KEY;
const PORT = process.env.PORT || 3000;

// ============================================
// Rate limit
// Once deployed, anyone who finds this URL can call it with YOUR key.
// This caps each visitor at RATE_LIMIT requests per minute. It is kept in
// memory, so it resets on cold starts and isn't shared between instances:
// good enough for a demo. For production, use a shared store (e.g. Upstash
// Redis) or put the app behind your own auth.
// ============================================
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

/** Calls an APIVerve API and returns its data, or throws with its error message. */
async function callApi(api, { query, body } = {}) {
  const url = `https://api.apiverve.com/v1/${api}${query ? `?${new URLSearchParams(query)}` : ''}`;
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: { 'x-api-key': API_KEY, ...(body && { 'Content-Type': 'application/json' }) },
    body: body && JSON.stringify(body)
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.status !== 'ok') {
    const err = json?.error;
    const message = err?.missing ? `Missing: ${err.missing.join(', ')}` : typeof err === 'string' ? err : `APIVerve returned ${res.status}`;
    throw Object.assign(new Error(message), { status: res.status === 429 ? 429 : 502 });
  }
  return json.data;
}

/** A trimmed string, capped at max characters. */
const str = (v, max) => String(v ?? '').trim().slice(0, max);

const app = express();
app.use(express.json({ limit: '50kb' }));
// Serves the page locally. On Vercel, public/ is served from the CDN instead.
app.use(express.static(path.join(__dirname, 'public')));

// Every /api route needs the key, and counts against the visitor's limit.
app.use('/api', (req, res, next) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Missing APIVERVE_API_KEY. Add it to .env, or to your host’s environment variables, then restart.' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'local';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Wait a minute and try again.' });
  }
  next();
});

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const num = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : undefined;
};
const party = (p, b) => ({
  [`${p}_name`]: str(b[`${p}_name`], 100),
  [`${p}_street`]: str(b[`${p}_street`], 100),
  [`${p}_city`]: str(b[`${p}_city`], 60),
  [`${p}_state`]: str(b[`${p}_state`], 2).toUpperCase(),
  [`${p}_zip`]: str(b[`${p}_zip`], 10)
});

// POST /api/generate: only the fields the Invoice Generator accepts are passed on.
app.post('/api/generate', async (req, res) => {
  const b = req.body || {};
  const items = (Array.isArray(b.items) ? b.items : []).slice(0, 25)
    .map((i) => ({ description: str(i.description, 120), qty: num(i.qty, 1, 100000) ?? 1, unit_price: num(i.unit_price, 0, 10_000_000) ?? 0 }))
    .filter((i) => i.description && i.unit_price > 0);
  if (!items.length) return res.status(400).json({ error: 'Add at least one line item with a price.' });

  const invoice = {
    invoiceNumber: str(b.invoiceNumber, 40) || 'INV-001',
    ...(DATE.test(b.date) && { date: b.date }),
    ...(DATE.test(b.dueDate) && { dueDate: b.dueDate }),
    ...party('from', b),
    ...party('to', b),
    ...(str(b.job, 100) && { job: str(b.job, 100) }),
    ...(str(b.paymentTerms, 100) && { paymentTerms: str(b.paymentTerms, 100) }),
    ...(num(b.salesTax, 0, 100) && { salesTax: num(b.salesTax, 0, 100) }),
    ...(num(b.discount, 0, 10_000_000) && { discount: num(b.discount, 0, 10_000_000) }),
    currency: /^[A-Z]{3}$/.test(b.currency) ? b.currency : 'USD',
    items
  };

  try {
    const data = await callApi('invoicegenerator', { body: invoice });
    res.json({ success: true, pdfUrl: data.downloadURL, invoiceNumber: invoice.invoiceNumber });
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Invoice Generator running at http://localhost:${PORT}`);
});
