const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { google } = require("googleapis");
const fs = require("fs");

exports.book = onRequest({ region: "us-central1", cpu: 1 }, async (req, res) => {
  logger.log("📥 Incoming request:", req.body);

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "service-account.json",
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const authClient = await auth.getClient();

    const calendar = google.calendar({ version: "v3", auth: authClient });

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
      calendarId: "communications@womacromax-automation.network",
      resource: event,
    });

    res.status(200).json({
      message: "Event created successfully",
      eventLink: response.data.htmlLink,
    });

  } catch (error) {
    logger.error("❌ Error creating event:", error);
    res.status(500).json({ error: error.message });
  }
});
