require('dotenv').config();

const apiKey = process.env.API_KEY;
console.log("API Key:", apiKey); // use it safely, e.g., in requests

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// API endpoint to send email
app.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        const response = await axios.post(
            `https://api.mailgun.net/v3/womacromax.github.io/messages`,
            new URLSearchParams({
                from: 'EmailTestApp <mailgun@womacromax.github.io>',
                to: email,
                subject: subject,
                text: message
            }),
            {
                auth: {
                    username: 'api',
                    password: apiKey // Replace with your Mailgun API Key
                }
            }
        );
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).send('Error sending email');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});