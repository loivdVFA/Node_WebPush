import express from 'express';
import bodyParser from 'body-parser';
import webpush from 'web-push';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: "*"
}))
app.use(bodyParser.json());

const publicVapidKey = 'BGDVQhQc-2zf5P0zFJOsQQyV2AdAsZ2e2OPdv9fpkMJiJJQEBzLNtgknJltW-_V3VPEycknwc5jIK-8jYuH8gBM';
const privateVapidKey = 'VCDUx4x5ZVSBsB4tXneSga4O3R5BOW6iXbDS2GcBSK0';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  publicVapidKey,
  privateVapidKey
);

// Chỉ 1 user → lưu subscription tạm
let currentSubscription = null;

// Route lưu subscription
app.post('/subscribe', (req, res) => {
  currentSubscription = req.body.subscription;
  console.log('Saved subscription:', currentSubscription);

  res.status(201).json({});
});

// Route gửi push
app.post('/send', async (req, res) => {
  if (!currentSubscription) {
    return res.status(400).json({ error: 'No subscription saved' });
  }
  console.log(req.body);
  
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    await webpush.sendNotification(currentSubscription, payload);
    console.log('Push sent!');
    res.json({ success: true });
  } catch (err) {
    console.error('Push error:', err);
    res.status(500).json({ error: 'Push failed' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
