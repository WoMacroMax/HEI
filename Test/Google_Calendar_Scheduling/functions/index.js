const functions = require("firebase-functions");
const { google } = require("googleapis");
const cors = require("cors")({ origin: true });
const { GoogleAuth } = require("google-auth-library");
const key = require("./service-account.json");

exports.book = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { date, time, duration, summary, description } = req.body;

      if (!date || !time || !duration) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const auth = new GoogleAuth({
        credentials: key,
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });

      const authClient = await auth.getClient();
      const calendar = google.calendar({ version: "v3", auth: authClient });

      const event = {
        summary,
        description,
        start: { dateTime: startDateTime.toISOString() },
        end: { dateTime: endDateTime.toISOString() },
      };

      const response = await calendar.events.insert({
        calendarId: "communications@womacromax-automation.network", // or your custom calendar ID
        requestBody: event,
      });

      res.status(200).json({
        success: true,
        eventLink: response.data.htmlLink,
      });
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
