// Client ID from Google Cloud Console
const CLIENT_ID = '321777232839-i4dp9qk1m13docho5r3tllb9hauhhi5h.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAfamBWQ9-3134QIJjjwcm3T7LcrfC2GXs';

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

// buttons
const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');

function handleClientLoad() {
  gapi.load('client', initClient);
}

async function initClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: [DISCOVERY_DOC],
    scope: SCOPES
  });

  // Listen for sign-in state changes
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  
  // Handle initial sign-in state
  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  
  authorizeButton.onclick = handleAuthClick;
  signoutButton.onclick = handleSignoutClick;
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.classList.add('d-none');
    signoutButton.classList.remove('d-none');
    listUpcomingEvents();
  } else {
    authorizeButton.classList.remove('d-none');
    signoutButton.classList.add('d-none');
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    const events = response.result.items;
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';

    if (events.length > 0) {
      events.forEach(event => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${event.summary} (${event.start.dateTime || event.start.date})`;
        eventsList.appendChild(li);
      });
    } else {
      eventsList.innerHTML = '<li class="list-group-item">No upcoming events found.</li>';
    }
  });
}

// Load auth2 library
window.onload = handleClientLoad;
