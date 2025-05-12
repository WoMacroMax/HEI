// 📦 Import required modules
const functions = require('firebase-functions');
const { google } = require('googleapis');
const { DateTime } = require('luxon');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const path = require('path');

// 📅 Initialize Google Calendar API
const calendar = google.calendar('v3');

// 📁 Define log file location (temp for serverless env)
const LOG_FILE = path.join('/tmp', 'booking.log');

// 🚀 Export a Firebase HTTPS function named "book"
exports.book = functions.https.onRequest((req, res) => {
  // ✅ Enable CORS for cross-origin requests
  cors(req, res, async () => {
    // 📝 Log the incoming request body
    console.log("📥 Incoming request:", JSON.stringify(req.body, null, 2));

    // 🧾 Extract fields from the request
    const { date, time, duration, summary, description, attendees } = req.body;

    // ⚠️ Validate required fields
    if (!date || !time || !duration) {
      const errorMsg = '❌ Missing required fields: date, time, or duration';
      console.error(errorMsg);
      return res.status(400).json({ success: false, error: errorMsg });
    }

    try {
      // 🔐 Authorize using service account credentials
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/calendar']
      });

      const authClient = await auth.getClient();

      // ⏰ Convert date/time input into EST/EDT timezone
      const start = DateTime.fromISO(`${date}T${time}`, { zone: 'America/New_York' });
      const end = start.plus({ minutes: parseInt(duration) });

      // 📅 Debug log of computed event time
      console.log("📅 Booking Event:");
      console.log("▶️ Start:", start.toFormat('yyyy-LL-dd HH:mm ZZZZ'));
      console.log("⏹️ End:", end.toFormat('yyyy-LL-dd HH:mm ZZZZ'));

      // 📧 Prepare attendee email list (if provided)
      const attendeeList = Array.isArray(attendees)
        ? attendees.map(email => ({ email }))
        : [];

      // 🗓️ Construct the calendar event object
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
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },   // Send email 1 hour before
            { method: 'popup', minutes: 10 }    // Popup 10 minutes before
          ]
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,    // Unique ID for Meet link
            conferenceSolutionKey: { type: "hangoutsMeet" }
          }
        }
      };

      // 📤 Insert event into Google Calendar
      const response = await calendar.events.insert({
        auth: authClient,
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all' // ✅ Send invites to attendees
      });

      // 🔗 Retrieve Google Meet link if generated
      const meetLink = response.data.hangoutLink || 'No Meet link generated';

      // 🗃️ Log successful booking to file
      const logMsg = `[${start.toFormat('yyyy-LL-dd HH:mm')}] BOOKED: ${summary || 'No Title'} → ${meetLink}\n`;
      console.log("✅ Event created:", response.data.id);
      fs.appendFileSync(LOG_FILE, logMsg);

      // 📩 Return success response
      return res.status(200).json({
        success: true,
        eventId: response.data.id,
        meetLink,
        attendees: attendeeList
      });

    } catch (error) {
      // ❌ Handle unexpected errors
      console.error('❌ Unexpected Error:', error.message);
      fs.appendFileSync(LOG_FILE, `[ERROR] ${new Date().toISOString()} - ${error.message}\n`);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
});
