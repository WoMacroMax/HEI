const fs = require('fs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// LOAD SERVICE ACCOUNT KEY
const serviceAccount = require('./service-account-key.json'); // path to your JSON key

const now = Math.floor(Date.now() / 1000);
const payload = {
  iss: serviceAccount.client_email,
  scope: 'https://www.googleapis.com/auth/gmail.send',
  aud: 'https://oauth2.googleapis.com/token',
  exp: now + 3600,
  iat: now,
  sub: 'your-user@gmail.com' // impersonated user
};

const token = jwt.sign(payload, serviceAccount.private_key, { algorithm: 'RS256' });

axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
  grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  assertion: token
}).toString(), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(async res => {
  const accessToken = res.data.access_token;

  // Compose Email (RFC 2822), encode base64url
  const message = [
    'To: recipient@example.com',
    'Subject: Gmail API Test',
    '',
    'This email was sent using a service account via JWT.'
  ].join('\n');

  const encodedMessage = Buffer.from(message).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const sendResult = await axios.post('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    raw: encodedMessage
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('Email sent:', sendResult.data);
}).catch(err => {
  console.error('Error:', err.response ? err.response.data : err);
});