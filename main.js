import express from 'express';
import bodyParser from 'body-parser';
import Ably from "ably";
import webpush from 'web-push';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: "*"
}))
app.use(bodyParser.json());

let dataDevice = null;
const ably = new Ably.Realtime('CtgqHw.hG694A:KrC9gf0LMS7xkfnQtYUDmXhIyPESDjTUAUeoogMWYRw');

app.post('/get-device', (req, res) => {
  dataDevice = req.body.push.recipient;
  res.json(dataDevice);
})

app.post('/send-notification', async (req, res) => {
  if (!dataDevice) {
    return res.status(400).json({ error: 'No device registered' });
  }
  const { title, body } = req.body;
  console.log('deviceId:', dataDevice);
  var data = {
    notification: {
      title: "Hello from Ably!",
      body: "Example push notification from Ably.",
      ttl: 3600
    }
  }

  ably.push.admin.publish(
    {
      transportType: 'web',
      targetUrl: 'aHR0cHM6Ly9mY20uZ29vZ2xlYXBpcy5jb20vZmNtL3NlbmQvZEcxd2lELVpqeVU6QVBBOTFiRkN5TS1fbVl4X2R6T2JqdWJjc0gwTWZlSmZfWVA3dk1jZ2JBRnlldjk5V1VyRjZuS0FPVHNZREVOT3phWGVpSzEzMlJfRzVLNWZZMEhTY190a0xxQlZTbW1hUVZlYWdhLWxVM3gwZTRxbFd4Z3VWZzlpazJvSU9PT1lJZFNmdzBTMUI4RHY=',
      publicVapidKey: 'BMxOlgYi0zd5-Za8zqmtdfeDTIrD5a4ICr6FW-toQP_DisPoKz_PsZzd0Q5O271gXUiqiwmHv4uCawpV958elV4',
      encryptionKey: {
        p256dh: 'BJsh2qsoeXDY0VvyW/F6wgYsmpDIj0JHeMk7n1NSz0mhSSFxjsTrpO2oXDnDwA1isnyuFXWtFsKe+AGsznYTYBM=',
        auth: 'IARDnA4BxRXqLuV87b8BKg=='
      }
    }
    , data);

  // try {
  // await ably.push.admin.publish(
  //   { deviceId: dataDevice } ,
  //  {
  //     title: title || 'Test Notification',
  //     body: body || 'This is a test notification',
  //     ttl: 3600
  //     // icon: 'https://your-domain.com/text.png',
  //     // data: { custom: 'data' }
  //   }
  // );
  res.json({ success: true });

  // } catch (err) {
  //   console.error('Ably push error:', err);
  //   res.status(500).json({ error: 'Push failed' });
  // }
});

// const publicVapidKey = 'BGDVQhQc-2zf5P0zFJOsQQyV2AdAsZ2e2OPdv9fpkMJiJJQEBzLNtgknJltW-_V3VPEycknwc5jIK-8jYuH8gBM';
// const privateVapidKey = 'VCDUx4x5ZVSBsB4tXneSga4O3R5BOW6iXbDS2GcBSK0';

// webpush.setVapidDetails(
//   'mailto:your-email@example.com',
//   publicVapidKey,
//   privateVapidKey
// );

// // Chỉ 1 user → lưu subscription tạm
// let currentSubscription = null;

// // Route lưu subscription
// app.post('/subscribe', (req, res) => {
//   currentSubscription = req.body.subscription;
//   console.log('Saved subscription:', currentSubscription);

//   res.status(201).json({});
// });

// // Route gửi push
// app.post('/send', async (req, res) => {
//   if (!currentSubscription) {
//     return res.status(400).json({ error: 'No subscription saved' });
//   }
//   console.log(req.body);

//   const { title, body } = req.body;
//   const payload = JSON.stringify({ title, body });

//   try {
//     await webpush.sendNotification(currentSubscription, payload);
//     console.log('Push sent!');
//     res.json({ success: true });
//   } catch (err) {
//     console.error('Push error:', err);
//     res.status(500).json({ error: 'Push failed' });
//   }
// });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
