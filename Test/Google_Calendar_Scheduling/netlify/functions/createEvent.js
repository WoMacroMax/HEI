exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the incoming event body
    const data = JSON.parse(event.body || '{}');
    const { title, start, end } = data;

    // Basic validation
    if (!title || !start || !end) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: title, start, end' }),
      };
    }

    // Simulate event creation logic
    // Normally you would use Google API here with credentials
    const fakeEventId = encodeURIComponent(title + '-' + start);
    const fakeEventUrl = `https://calendar.google.com/calendar/r/eventedit/${fakeEventId}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Event created successfully.',
        eventLink: fakeEventUrl
      }),
    };
  } catch (err) {
    console.error('Server error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
