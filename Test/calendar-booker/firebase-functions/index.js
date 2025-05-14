const functions = require("firebase-functions");
const { google } = require("googleapis");
const { DateTime } = require("luxon");
const cors = require("cors")({ origin: true });
const fs = require("fs");
const path = require("path");

const calendar = google.calendar("v3");
const LOG_FILE = path.join("/tmp", "booking.log");

exports.book = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Log incoming request
    console.log("📥 Incoming request:");
    console.log(JSON.stringify(req.body, null, 2));

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: "service-account.json",
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });

      const authClient = await auth.getClient();

      const { summary, description, start, end } = req.body;

      const event = {
        summary,
        description,
        start: {
          dateTime: start,
          timeZone: "America/New_York",
        },
        end: {
          dateTime: end,
          timeZone: "America/New_York",
        },
      };

      const response = await calendar.events.insert({
        auth: authClient,
        calendarId: "communications@womacromax-automation.network",
        resource: event,
      });

      res.status(200).json({
        message: "Event created successfully",
        eventLink: response.data.htmlLink,
      });

    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
