const apiKey = 'AIzaSyAfamBWQ9-3134QIJjjwcm3T7LcrfC2GXs';
const calendarId = 'ayoblab@gmail.com';

function loadClient() {
    gapi.client.setApiKey(apiKey);
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
        .then(fetchEvents, err => console.error("Error loading GAPI client", err));
}

function fetchEvents() {
    gapi.client.calendar.events.list({
        calendarId,
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
    }).then(response => {
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
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('eventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const event = {
            'summary': document.getElementById('title').value,
            'start': {'dateTime': new Date(document.getElementById('start').value).toISOString()},
            'end': {'dateTime': new Date(document.getElementById('end').value).toISOString()}
        };

        gapi.client.calendar.events.insert({
            calendarId,
            resource: event
        }).then(response => {
            alert('Event created: ' + response.result.summary);
            fetchEvents();
        }, err => {
            alert('Error: ' + err.result.error.message);
        });
    });

    gapi.load("client", loadClient);
});
