const functions = require('firebase-functions');
const { google } = require('googleapis');
const admin = require('firebase-admin');
admin.initializeApp();

const calendar = google.calendar('v3');

// Service account credentials should be stored in Firebase functions config
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/calendar'],
  credentials: {
    client_email: functions.config().google.client_email,
    private_key: functions.config().google.private_key.replace(/\\n/g, '\n'),
  }
});

exports.book = functions.https.onRequest(async (req, res) => {
  try {
    const { date, time, duration, summary, description } = req.body;

    const authClient = await auth.getClient();
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/New_York',
      },
    };

    const calendarId = 'communications@womacromax-automation.network'; // 👈 Target calendar

    await calendar.events.insert({
      auth: authClient,
      calendarId,
      resource: event,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Booking failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
