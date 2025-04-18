// server.js
require('dotenv').config(); // Loads .env file (not needed on Netlify but good for local dev)

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const DOMAIN = process.env.MAILGUN_DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY;

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: API_KEY });

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const result = await mg.messages.create(DOMAIN, {
      from: `Your App <mailgun@${DOMAIN}>`,
      to,
      subject,
      text,
    });

    res.status(200).json({ message: "Email sent", id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to send email" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
