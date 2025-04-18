const formData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);

const DOMAIN = process.env.MAILGUN_DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { to, subject, text } = JSON.parse(event.body);

    const mg = mailgun.client({ username: "api", key: API_KEY });

    const result = await mg.messages.create(DOMAIN, {
      from: `Your App <mailgun@${DOMAIN}>`,
      to,
      subject,
      text,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent", id: result.id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message || "Error sending email" }),
    };
  }
};