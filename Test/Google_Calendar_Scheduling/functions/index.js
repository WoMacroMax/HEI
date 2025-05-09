const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Load service account
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "service-account.json"),
  scopes: ["https://www.googleapis.com/auth/calendar"]
});

const calendarId = "primary"; // Or use full address like "communications@yourdomain.com"

app.post("/book", async (req, res) => {
  try {
    const { summary, description, start, end } = req.body;

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const event = {
      summary,
      description,
      start: { dateTime: start },
      end: { dateTime: end }
    };

    const response = await calendar.events.insert({
      calendarId,
      resource: event
    });

    res.json({ success: true, eventId: response.data.id });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

exports.api = functions.https.onRequest(app);
