console.log("✅ Cloud Function `api` is running and ready.");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// ✅ Only allow requests from your Netlify domain
app.use(cors({
  origin: ["https://scheduling.womacromax.com"],
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());

// ✅ Load your service account key securely
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Replace with your calendar ID or use "primary"
const calendarId = "primary";

// ✅ Route: POST /book
app.post("/book", async (req, res) => {
  console.log("📥 Received booking request");
  console.log("Payload:", req.body);

  try {
    const { summary, description, start, end } = req.body;

    if (!summary || !start || !end) {
      console.warn("⚠️ Missing required fields");
      throw new Error("Missing required fields");
    }

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

    console.log("✅ Event created:", response.data);
    res.json({ success: true, eventId: response.data.id });

  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
