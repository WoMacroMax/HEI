const { google } = require("googleapis");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const auth = new google.auth.GoogleAuth({
  keyFile: "./gmail-api-key.json",
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
});

exports.sendEmail = functions.https.onRequest(async (req, res) => {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const rawMessage = Buffer.from(
      `From: "Your Name" <you@example.com>\r\nTo: recipient@example.com\r\nSubject: Test Email\r\n\r\nHello from Firebase Functions!`
    ).toString("base64");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: rawMessage },
    });

    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});
