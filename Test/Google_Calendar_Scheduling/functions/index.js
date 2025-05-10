const functions = require('firebase-functions');
const { google } = require('googleapis');
const { DateTime } = require('luxon');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const path = require('path');

const calendar = google.calendar('v3');
const LOG_FILE = path.join('/tmp', 'booking.log');

exports.book = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Log incoming request
    console.log("📥 Incoming request:");
    console.log(JSON.stringify(req.body, null, 2));

    try {
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/calendar']
      });

      const authClient = await auth.getClient();

      const { date, time, duration, summary, description, attendees } = req.body;

      if (!date || !time || !duration) {
        const errorMsg = '❌ Missing required fields: date, time, or duration';
        console.error(errorMsg);
        return res.status(400).json({ success: false, error: errorMsg });
      }

      // 🔹 Force all time math to Eastern Time (EST/EDT)
      const start = DateTime.fromISO(`${date}T${time}`, { zone: 'America/New_York' });
      const end = start.plus({ minutes: parseInt(duration) });

      console.log("📅 Booking Event:");
      console.log("▶️ Start:", start.toFormat('yyyy-LL-dd HH:mm ZZZZ'));
      console.log("⏹️ End:", end.toFormat('yyyy-LL-dd HH:mm ZZZZ'));

      const attendeeList = Array.isArray(attendees)
        ? attendees.map(email => ({ email }))
        : [];

      const event = {
        summary: summary || 'Scheduled Appointment',
        description: description || '',
        start: {
          dateTime: start.toISO(),
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: end.toISO(),
          timeZone: 'America/New_York'
        },
        attendees: attendeeList,
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" }
          }
        }
      };

      let response;
      try {
        response = await calendar.events.insert({
          auth: authClient,
          calendarId: 'communications@womacromax-automation.network',
          resource: event,
          conferenceDataVersion: 1
        });
      } catch (apiError) {
        const gError = apiError?.errors?.[0]?.message || apiError.message;
        console.error("❌ Google Calendar API Error:", gError);
        fs.appendFileSync(LOG_FILE, `[API ERROR] ${new Date().toISOString()} - ${gError}\n`);
        return res.status(500).json({ success: false, error: gError });
      }

      const meetLink = response.data.hangoutLink || 'No Meet link generated';
      const logMsg = `[${start.toFormat('yyyy-LL-dd HH:mm')}] BOOKED: ${summary || 'No Title'} → ${meetLink}\n`;

      // Log to file + console
      console.log("✅ Event created:", response.data.id);
      fs.appendFileSync(LOG_FILE, logMsg);

      return res.status(200).json({
        success: true,
        eventId: response.data.id,
        meetLink,
        attendees: attendeeList
      });

    } catch (error) {
      console.error('❌ Unexpected Error:', error);
      fs.appendFileSync(LOG_FILE, `[ERROR] ${new Date().toISOString()} - ${error.message}\n`);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
});
