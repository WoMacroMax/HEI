// get-token.js
const { google } = require('googleapis');
const fs = require('fs');

async function getToken() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  console.log(token.token);
}

getToken();
