// src/modules/calendar.js

// Client ID and API key from the Developer Console
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your actual client ID
const API_KEY = 'YOUR_API_KEY';     // Replace with your actual API key

// Discovery docs for API
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

function handleClientLoad() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  });
  gapiInited = true;
  maybeEnableButtons();
}

function initializeGisClient() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // Awaiting user action to set to handleAuthClick
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
    document.getElementById('signout_button').style.visibility = 'visible';
  }
}

export async function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').style.visibility = 'hidden';
    await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    // Prompts the user to select a Google account and ask for consent to share their data.
    // By default, the client will ask for consent when it is initiated for the first time.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for subsequent calls.
    tokenClient.requestAccessToken({prompt: ''});
  }
}

export function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('signout_button').style.visibility = 'hidden';
    document.getElementById('authorize_button').style.visibility = 'visible';
    document.getElementById('calendar').innerHTML = '<h2>Calendar</h2><p>Signed out.</p>';
  }
}

async function listUpcomingEvents() {
  let response;
  try {
    const request = {
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime',
    };
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    document.getElementById('calendar').innerHTML = `<h2>Calendar</h2><p>Error: ${err.message}</p>`;
    return;
  }

  const events = response.result.items;
  if (!events || events.length === 0) {
    document.getElementById('calendar').innerHTML = '<h2>Calendar</h2><p>No upcoming events found.</p>';
    return;
  }

  // Flatten to string to display
  const output = events.reduce(
    (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
    '<h2>Calendar</h2><p>Upcoming events:</p><ul>');
  document.getElementById('calendar').innerHTML = output + '</ul>';
}

// Load Google API Client Library
const scriptGapi = document.createElement('script');
scriptGapi.src = 'https://apis.google.com/js/api.js';
scriptGapi.onload = handleClientLoad;
document.head.appendChild(scriptGapi);

// Load Google Identity Services Library
const scriptGis = document.createElement('script');
scriptGis.src = 'https://accounts.google.com/gsi/client';
scriptGis.onload = initializeGisClient;
document.head.appendChild(scriptGis);
