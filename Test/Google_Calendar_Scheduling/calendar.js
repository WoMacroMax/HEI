// netlify/functions/createEvent.js
const { google } = require('googleapis');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_CALENDAR_ID } = process.env;
    const body = JSON.parse(event.body || '{}');
    const { title, start, end } = body;

    if (!title || !start || !end) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing title, start, or end' }),
      };
    }

    const oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const newEvent = {
      summary: title,
      start: { dateTime: new Date(start).toISOString(), timeZone: 'America/New_York' },
      end: { dateTime: new Date(end).toISOString(), timeZone: 'America/New_York' },
    };

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      resource: newEvent,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Event created!',
        eventLink: response.data.htmlLink,
      }),
    };
  } catch (err) {
    console.error('Google API error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Google API error' }),
    };
  }
};
