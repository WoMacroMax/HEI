const { onRequest } = require("firebase-functions/v2/https");
const { google } = require("googleapis");
const admin = require("firebase-admin");
const express = require("express");
const path = require("path");

admin.initializeApp();
const app = express();

// 🔹 Enable JSON body parsing
app.use(express.json());

// 🔹 CORS headers
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  next();
});

// 🔹 Gmail Auth Setup
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "gmail-api-key.json"), // ✅ Must exist
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
});

// 🔹 POST / — Send Email
app.post("/", async (req, res) => {
  console.log("📩 Received POST:", req.body);

  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    console.error("❌ Missing fields");
    return res.status(400).send("Missing required fields: 'to', 'subject', 'body'");
  }

  try {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset="UTF-8"`,
      ``,
      body,
    ].join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log("✅ Encoded message:", encodedMessage);

    const client = await auth.getClient();
    const gmail = google.gmail({ version: "v1", auth: client });

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("✅ Email sent:", result.data);
    res.status(200).send(`Email to ${to} sent successfully!`);
  } catch (error) {
    console.error("❌ Gmail Send Error:", error);
    res.status(500).send(`Failed to send email: ${error.message}`);
  }
});

// 🔹 Export as Firebase Function
exports.sendEmail = onRequest(app);
