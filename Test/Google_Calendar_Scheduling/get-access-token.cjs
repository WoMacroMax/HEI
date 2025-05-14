const { google } = require('googleapis');
const key = require('./service-account.json'); // Make sure your JSON key is saved as this

const auth = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar']
});

auth.authorize((err, tokens) => {
  if (err) {
    console.error('❌ Error authorizing:', err);
    return;
  }
  console.log('✅ Access Token:\n', tokens.access_token);
});
