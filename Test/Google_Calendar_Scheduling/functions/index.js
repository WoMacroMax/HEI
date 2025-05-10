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
    try {
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/calendar']
      });

      const authClient = await auth.getClient();

      const { date, time, duration, summary, description, attendees } = req.body;

      if (!date || !time || !duration) {
        return res.status(400).json({ success: false, error: 'Missing required fields.' });
      }

      const start = DateTime.fromISO(`${date}T${time}`, { zone: 'America/New_York' });
      const end = start.plus({ minutes: parseInt(duration) });

      // Build attendee list if provided
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

      const response = await calendar.events.insert({
        auth: authClient,
        calendarId: 'communications@womacromax-automation.network',
        resource: event,
        conferenceDataVersion: 1
      });

      const meetLink = response.data.hangoutLink || 'No Meet link generated';
      const logMsg = `[${start.toFormat('yyyy-LL-dd HH:mm')}] BOOKED: ${summary || 'No Title'} → ${meetLink}\n`;

      // Log to console + file
      console.log("📅 Booking Created:", logMsg.trim());
      fs.appendFileSync(LOG_FILE, logMsg);

      return res.status(200).json({
        success: true,
        eventId: response.data.id,
        meetLink,
        attendees: attendeeList
      });

    } catch (error) {
      console.error('❌ Booking failed:', error);
      fs.appendFileSync(LOG_FILE, `[ERROR] ${new Date().toISOString()} - ${error.message}\n`);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
});
