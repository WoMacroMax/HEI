const functions = require("firebase-functions");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const express = require("express");
const cors = require("cors");
const key = require("./service-account.json");

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: true }));
app.use(express.json());

// Always respond to OPTIONS preflight requests
app.options("*", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.status(204).send("");
});

app.post("/", async (req, res) => {
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
      calendarId: "communications@womacromax-automation.network",
      requestBody: event,
    });

    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      success: true,
      eventLink: response.data.htmlLink,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.set("Access-Control-Allow-Origin", "*");
    res.status(500).json({ success: false, error: error.message });
  }
});

exports.book = functions.https.onRequest(app);
