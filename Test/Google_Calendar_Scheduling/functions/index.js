const functions = require('firebase-functions');
const { google } = require('googleapis');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const calendar = google.calendar('v3');

// 🔐 Default Firebase Admin account (preserved)
const firebaseServiceAccount = {
  client_email: 'firebase-adminsdk-j6k8g@womacromax-automation.iam.gserviceaccount.com',
  private_key: '...'
};

// ✅ Correct calendar service account
const calendarServiceAccount = {
  client_email: 'womacromax-calendar-agent@womacromax-automation-459219.iam.gserviceaccount.com',
  private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDkCKy6ReWQjAuY\nktfn+yec89cp40x+AzAxNPgrFPl5vXwZxKxKEZAt+zSpClmnQuw+JorIxlMQzKJ7\nT9b1n04He8fmkbdYdpW3G8vW3x2MXH9aTe/xjliUV6rmfvEc1zYlKwUiEJVyByOX\n93V+pgnmmjNydZGwRjE2n7YxQrM7Gl3HuSvlv3XikxQ80HczdDoTHj3EGUZrCiwS\nwuzO1DU9vyeN5yMIcN4r4DPIfnM4NFOuUlF3LGNdS0eGp5bD3TeLsWWraQdN6EdC\nEo4HXjz3D/0zv7QDcAAVkKttrZ8yE+U4fAENg1Jv+RpR0cQODrKT7nv9yr6osRQ6\nGZGdVCBDAgMBAAECggEAMnQ0BEuHhPlr+nWxH56BtUm54liTTZpjdfJYJKWRqHxN\nG/Eo3n8pOikfwmyvR8QMNit4KxvMAsBzkK+XgfhF+RDflbnVne4F3BI7N7kPLWWh\nsPqQKhhM8NWkZ7PGAvGTxqq6OfkPpPGCTq4PhTLC0EvJ5N4Uo/3cwxtcwnFzKXoX\nwM4rOK1ZtvLo0nFYXY4MmuL7KiGmWB7JJS9CJdfqUv3JbkhFGZGCQhMiSmwLSMFu\n9mlXqejMZKBYbNCMZ1pXK1r4DzYgAGbmnhJcSpGJJ5sm9YCTIhS1iKytkmEVx1RU\nS/zCHqZ+NnOQbmAf7MCkQX+ymG2KiyTUVaKFuX//sQKBgQD8azhvRjZyBdByAjcA\npiHuZ2w1j3XXW4udF9frXg4twTVzwDfqE1Bpb02cMhd0aAp68I5FIKAE2Y0yYwHt\nO0/xEB+d3nS/p4EvxTwZqJj53lLbs7S7UV1iZK+y2Mvpy2T6b+3mIGyhzKvnQ9UE\naxKT43DLdbkczU1g7tZ10QllLQKBgQDmJ0u19kCTguU61+dn8TQKtiK61C0LUEnO\n96m+lKc9QvYLFyXsR4lfWGsQmwAj25dpJ5dYDK3w6brc7UE46h6Ty0QaTuZxu2Xc\nHYIl8UvbV7rWozzBCh78DNlODe4/vJo0cG+uYjBe06qiwIJkJwwbsQmm9aS2zWmp\n3gDXBD9ShQKBgH7g0BWaG3wq4Ju+czpwzAtZmVfRp2VkA1F8Q1z4NVigJoecEUDX\nmOHvq1ylINkUOIE3tOoyE6EcsFKKnffjKaax70wFa9tt2CVadHn43MBz2Qp3tq/7\nSMjLSbOS4PTmfKOeop4FuwcVYkmGvCq1SErgRsy96x/2w1zNPBlQJHgBAoGBAJ7n\nVGU29ZsWEHCE5zFwz5sh2nX5D3ezP9yEVDY0R6V8nQO7R7A1XmDbAIcZKZpg1UBN\nhYtbsjYRCayCPWyIikMKNjjPH15Yu3kjoAHdDYZq4yBPqzDqNgQxHUCRsUBbGUgq\nv31h7RxWJ9DQIBScfFZT7+aDP1WrTIdaBTFzQqBdAoGAXOLI94t1LaS5whXRWkMl\nhZ2AbIUKVdT2Q7wPdhm7PpTfskqgQHEI3OClksQdpPPjZat0+7OBQYzG6Zz0Pmyf\nL7K5Iu0MZZvTcf0C92tyiR5hI45UymZolY+9KoIC5SmwY3NVADCBU/XpI39Y+aJx\nmdkZJmBaJgZsG1BOfQUhRjc=\n-----END PRIVATE KEY-----\n`
};

const calendarAuth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/calendar'],
  credentials: calendarServiceAccount
});

exports.book = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
      const { date, time, duration, summary, description } = req.body;

      if (!date || !time || !duration) {
        return res.status(400).json({ success: false, error: 'Missing required fields.' });
      }

      const authClient = await calendarAuth.getClient();

      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const event = {
        summary: summary || 'Scheduled Appointment',
        description: description || '',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/New_York',
        },
      };

      const calendarId = 'communications@womacromax-automation.network';

      const response = await calendar.events.insert({
        auth: authClient,
        calendarId,
        resource: event,
      });

      console.log('✅ Event created:', response.data.id);
      return res.status(200).json({ success: true, eventId: response.data.id });
    } catch (error) {
      console.error('❌ Booking failed:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
});
