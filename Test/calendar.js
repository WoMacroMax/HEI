// Replace this with your OAuth2 Client ID
const CLIENT_ID = '<webClient>';
const API_SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    });
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: API_SCOPES,
        callback: (response) => {
            if (response.error) {
                console.error(response);
                return;
            }
            document.getElementById('authorize_button').style.display = 'none';
            document.getElementById('signout_button').style.display = 'block';
            fetchEvents();
        },
    });
    document.getElementById('authorize_button').onclick = () => tokenClient.requestAccessToken();
    document.getElementById('signout_button').onclick = revokeToken;
}

function revokeToken() {
    google.accounts.oauth2.revoke(tokenClient.access_token, () => {
        document.getElementById('authorize_button').style.display = 'block';
        document.getElementById('signout_button').style.display = 'none';
        document.getElementById('eventsList').innerHTML = '';
    });
}

async function fetchEvents() {
    const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
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
}

document.getElementById('eventForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const event = {
        summary: document.getElementById('title').value,
        start: { dateTime: new Date(document.getElementById('start').value).toISOString() },
        end: { dateTime: new Date(document.getElementById('end').value).toISOString() }
    };

    try {
        const response = await gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event
        });

        alert('Event created: ' + response.result.summary);
        fetchEvents();
    } catch (err) {
        alert('Error creating event: ' + err.result.error.message);
    }
});

// Load Google APIs
window.onload = function () {
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = gapiLoaded;
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = gisLoaded;
    document.body.appendChild(gisScript);
};
