import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { google } from "googleapis";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load your service account key
const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/calendar"]
});

const calendarId = "primary"; // or e.g. "communications@yourdomain.com"

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

app.listen(3000, () => {
  console.log("🚀 Calendar API server running on http://localhost:3000");
});
