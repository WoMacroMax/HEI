const apiKey = 'AIzaSyAfamBWQ9-3134QIJjjwcm3T7LcrfC2GXs';
const calendarId = 'ayoblab@gmail.com';

async function loadClient() {
    await gapi.client.setApiKey(apiKey);
    await gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest");
    fetchEvents();
}

async function fetchEvents() {
    try {
        const response = await gapi.client.calendar.events.list({
            calendarId,
            timeMin: (new Date()).toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime'
        });

        const events = response.result.items;
        const list = document.getElementById("eventsList");
        list.innerHTML = '';

        if (events.length > 0) {
            events.forEach(event => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${event.summary} (${new Date(event.start.dateTime).toLocaleString()})`;
                list.appendChild(li);
            });
        } else {
            list.innerHTML = '<li class="list-group-item">No upcoming events.</li>';
        }
    } catch (err) {
        console.error('Failed to fetch events:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    gapi.load("client", loadClient);

    document.getElementById('eventForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const event = {
            summary: document.getElementById('title').value,
            start: { dateTime: new Date(document.getElementById('start').value).toISOString() },
            end: { dateTime: new Date(document.getElementById('end').value).toISOString() }
        };

        try {
            const response = await gapi.client.calendar.events.insert({
                calendarId,
                resource: event
            });

            alert('Event created: ' + response.result.summary);
            fetchEvents();
        } catch (err) {
            alert('Error creating event: ' + err.result.error.message);
        }
    });
});
