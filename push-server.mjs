import dotenv from 'dotenv';
import express from 'express';
import webpush from 'web-push';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PUSH_SERVER_PORT || 8787);
const PUSH_PUBLIC_KEY = process.env.VITE_PUSH_PUBLIC_KEY || process.env.PUSH_PUBLIC_KEY;
const PUSH_PRIVATE_KEY = process.env.PUSH_PRIVATE_KEY;
const PUSH_CONTACT_EMAIL = process.env.PUSH_CONTACT_EMAIL || 'admin@dereu.local';

const subscriptions = new Map();

if (PUSH_PUBLIC_KEY && PUSH_PRIVATE_KEY) {
  webpush.setVapidDetails(`mailto:${PUSH_CONTACT_EMAIL}`, PUSH_PUBLIC_KEY, PUSH_PRIVATE_KEY);
} else {
  console.warn('Web Push disabled: missing VITE_PUSH_PUBLIC_KEY/PUSH_PUBLIC_KEY or PUSH_PRIVATE_KEY in environment.');
}

app.get('/api/push/health', (_req, res) => {
  res.json({
    ok: true,
    configured: Boolean(PUSH_PUBLIC_KEY && PUSH_PRIVATE_KEY),
    subscribers: subscriptions.size,
  });
});

app.post('/api/push/subscribe', (req, res) => {
  const { subscription } = req.body || {};
  if (!subscription?.endpoint) {
    return res.status(400).json({ ok: false, error: 'Invalid subscription payload' });
  }

  subscriptions.set(subscription.endpoint, subscription);
  return res.json({ ok: true, subscribers: subscriptions.size });
});

app.post('/api/push/send', async (req, res) => {
  if (!PUSH_PUBLIC_KEY || !PUSH_PRIVATE_KEY) {
    return res.status(503).json({ ok: false, error: 'Push server is not configured with VAPID keys' });
  }

  const title = req.body?.title || 'DEREU ескертуі';
  const body = req.body?.body || 'Жақын маңда жаңа қауіпсіздік ескертуі тіркелді.';
  const url = req.body?.url || '/notifications';
  const payload = JSON.stringify({ title, body, url });

  const tasks = [...subscriptions.values()].map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription, payload);
      return { ok: true };
    } catch (error) {
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        subscriptions.delete(subscription.endpoint);
      }
      return { ok: false, error: error?.message || 'Unknown web-push error' };
    }
  });

  const results = await Promise.all(tasks);
  const sent = results.filter((item) => item.ok).length;

  return res.json({
    ok: true,
    sent,
    failed: results.length - sent,
    subscribers: subscriptions.size,
  });
});

app.listen(PORT, () => {
  console.log(`Push server listening on http://localhost:${PORT}`);
});
