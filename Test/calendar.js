// Replace this with your OAuth2 Client ID
const CLIENT_ID = '<webClient>';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let tokenClient;
let accessToken = null;

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
        scope: SCOPES,
        callback: (response) => {
            if (response.error) {
                console.error(response);
                return;
            }
            accessToken = response.access_token;
            document.getElementById('authorize_button').classList.add('d-none');
            document.getElementById('signout_button').classList.remove('d-none');
            fetchEvents();
        },
    });

    document.getElementById('authorize_button').onclick = () => {
        tokenClient.requestAccessToken();
    };
    document.getElementById('signout_button').onclick = revokeToken;
}

function revokeToken() {
    google.accounts.oauth2.revoke(accessToken, () => {
        document.getElementById('authorize_button').classList.remove('d-none');
        document.getElementById('signout_button').classList.add('d-none');
        document.getElementById('eventsList').innerHTML = '';
    });
}

async function fetchEvents() {
    let response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });

    const events = response.result.items;
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';

    if (events.length === 0) {
        eventsList.innerHTML = '<li class="list-group-item">No upcoming events.</li>';
        return;
    }

    events.forEach((event) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${event.summary} (${new Date(event.start.dateTime).toLocaleString()})`;
        eventsList.appendChild(li);
    });
}

document.getElementById('eventForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!accessToken) {
        alert("Please sign in first.");
        return;
    }

    const event = {
        summary: document.getElementById('title').value,
        start: { dateTime: new Date(document.getElementById('start').value).toISOString() },
        end: { dateTime: new Date(document.getElementById('end').value).toISOString() },
    };

    try {
        const response = await gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        alert(`Event created: ${response.result.summary}`);
        fetchEvents();
    } catch (err) {
        alert(`Error creating event: ${err.result.error.message}`);
    }
});

// Load APIs on window load
window.onload = function() {
    gapiLoaded();
    gisLoaded();
};
