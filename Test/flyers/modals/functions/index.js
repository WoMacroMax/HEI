const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { google } = require("googleapis");
const admin = require("firebase-admin");
const path = require("path");

admin.initializeApp();

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "gmail-api-key.json"),
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
});

exports.sendEmail = onRequest(async (req, res) => {
  // ✅ Set CORS headers for preflight and actual response
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  try {
    const client = await auth.getClient();
    const gmail = google.gmail({ version: "v1", auth: client });

    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).send("Missing required fields: 'to', 'subject', 'body'");
    }

    const message = `To: ${to}\n` +
                    `Subject: ${subject}\n` +
                    `MIME-Version: 1.0\n` +
                    `Content-Type: text/plain; charset="UTF-8"\n\n` +
                    `${body}`;

    const encodedMessage = Buffer.from(message).toString("base64")
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    logger.info(`Email sent to ${to} successfully.`);
    res.status(200).send(`Email to ${to} sent successfully!`);
  } catch (error) {
    logger.error("Error sending email:", error);
    res.status(500).send(`Failed to send email: ${error.message}`);
  }
});
