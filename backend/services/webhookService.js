const axios = require('axios');

async function sendWebhook(url, payload) {
  if (!url) {
    console.error('Webhook URL not configured');
    return;
  }

  try {
    // Fire and forget - don't wait for webhook response
    axios.post(url, payload, { timeout: 5000 }).then(() => {
      console.log('Webhook sent successfully');
    }).catch(err => {
      console.error('Webhook failed:', err.message);
    });
  } catch (err) {
    console.error('Webhook error:', err.message);
  }
}

module.exports = { sendWebhook };
