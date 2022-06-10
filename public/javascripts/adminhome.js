// Function to get SQL database queries
// Access info via row.[variable name] where variable names can be
// name, description, time, date, fee, custom_link,
// street_number, suburb, city, state, postcode

/* 2. Open connection */
xhttp.open("POST", "/logout", true);
xhttp.setRequestHeader("content-type", "application/JSON");
xhttp.send(JSON.stringify(info));



function get_event_info() {
    get_rsvp_info();
    get_host_info();
}

const links = {};
const eventIds = {};
const rsvpEventIds = {};
var counter = 0;
var idCounter = 0;
var index = 0;


function logOut() {

    var xhttp = new XMLHttpRequest();
    var info = {
        token: sessionStorage.getItem("googleToken")
    }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 202) {
            gapi.load("auth2", function () {
                gapi.auth2.init();
                window.location.replace("https://accounts.google.com/logout");
            });
            var auth2 = gapi.auth2.getAuthInstance();
            return;
        }
        else {
            window.location.replace("/index.html");
        }
    };

    /* 2. Open connection */
    xhttp.open("POST", "/logout", true);
    xhttp.setRequestHeader("content-type", "application/JSON");
    xhttp.send(JSON.stringify(info));
}

function edit_event() {
    if (index == -1) {
        sessionStorage.setItem("eventId", -1);
    }
    else {
        sessionStorage.setItem("eventId", eventIds[index]);
    }
    window.location.replace("/settings.html");
}

function attendance_info() {
    sessionStorage.setItem("eventId", eventIds[index]);
    window.location.replace("/attendance_info.html");
}

function get_link() {
    sessionStorage.setItem("eventId", rsvpEventIds[index]);
    window.location.replace("rsvp.html?link=" + links[index]);
}


function get_rsvp_info() {
    var xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var eventsList = document.getElementById("events");
            var obj = JSON.parse(this.response);
            for (row of obj) {
                var centre = document.createElement("div");
                centre.className = "centre_div";
                var eventBox = document.createElement("div");
                eventBox.className = "event_box";
                var contentPos = document.createElement("div");
                contentPos.className = "event_content_positioning";
                var content = document.createElement("div");
                content.className = "event_content";
                var contentText = document.createElement("span");
                contentText.innerText = row.name;
                contentText.className = "event_content_text";

                var contentElements = document.createElement("div");
                contentElements.className = "event_content_elments";

                var maxElement = document.createElement("div");
                maxElement.className = "max_element";
                var eventTimeText = document.createElement("span");
                eventTimeText.innerText = "Time";
                eventTimeText.className = "text";
                var eventTimeValue = document.createElement("span");
                var time = row.time.substring(0, 5);
                eventTimeValue.innerText = time;
                eventTimeValue.className = "number";

                var totalElement = document.createElement("div");
                totalElement.className = "total_element";
                var eventDateText = document.createElement("span");
                eventDateText.className = "text";
                eventDateText.innerText = "Date";
                var eventDateValue = document.createElement("span");
                eventDateValue.className = "number";
                var date = row.date.substring(8, 10) + "/" + row.date.substring(5, 7) + "/" + row.date.substring(0, 4);
                eventDateValue.innerText = date;

                var totalElement1 = document.createElement("div");
                totalElement1.className = "total_element1";
                var eventFeeText = document.createElement("span");
                eventFeeText.className = "text";
                eventFeeText.innerText = "Fee";
                var eventFeeValue = document.createElement("span");
                eventFeeValue.className = "number";
                eventFeeValue.innerText = row.fee;

                var totalElement2 = document.createElement("div");
                totalElement2.className = "total_element2";
                var eventLocationText = document.createElement("span");
                eventLocationText.className = "text";
                eventLocationText.innerText = "Location";
                var eventLocationValue = document.createElement("span");
                eventLocationValue.className = "number";
                eventLocationValue.innerText = row.location;

                var customLinkButton = document.createElement("button");
                customLinkButton.className = "more_button1";
                customLinkButton.setAttribute('onclick', `index=${counter}`);
                customLinkButton.addEventListener("click", get_link);
                var customLinkButtonText = document.createElement("span");
                customLinkButtonText.innerText = "EDIT RSVP";
                customLinkButtonText.className = "more_text1";

                var descriptionPos = document.createElement("div");
                descriptionPos.className = "event_content_positioning1";
                var description = document.createElement("div");
                description.className = "event_content1";
                var descriptionText = document.createElement("span");
                descriptionText.innerText = "Description";
                descriptionText.className = "event_content_text2";
                var descriptionTextValue = document.createElement("div");
                descriptionTextValue.className = "event_content_elements2";
                descriptionTextValue.innerText = row.description;

                contentPos.appendChild(content);
                contentPos.appendChild(contentText);

                maxElement.appendChild(eventTimeText);
                maxElement.appendChild(eventTimeValue);

                totalElement.appendChild(eventDateText);
                totalElement.appendChild(eventDateValue);

                totalElement1.appendChild(eventFeeText);
                totalElement1.appendChild(eventFeeValue);

                totalElement2.appendChild(eventLocationText);
                totalElement2.appendChild(eventLocationValue);

                contentElements.appendChild(maxElement);
                contentElements.appendChild(totalElement);
                contentElements.appendChild(totalElement1);
                contentElements.appendChild(totalElement2);
                contentPos.appendChild(contentElements);

                customLinkButton.appendChild(customLinkButtonText);
                contentPos.appendChild(customLinkButton);

                descriptionPos.appendChild(description);
                descriptionPos.appendChild(descriptionText);
                descriptionPos.appendChild(descriptionTextValue);
                contentPos.appendChild(descriptionPos);

                eventBox.appendChild(contentPos);
                centre.appendChild(eventBox);

                eventsList.appendChild(centre);

                links[counter] = row.custom_link;
                rsvpEventIds[counter] = row.id;
                counter++;
            }
        }
    }
    xhttp.open("GET", '/event/getEvents', true);
    xhttp.send();
}

function get_host_info() {
    var xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var eventsList = document.getElementById("events");
            var obj = JSON.parse(this.response);
            for (row of obj) {
                var centre = document.createElement("div");
                centre.className = "centre_div";
                var eventBox = document.createElement("div");
                eventBox.className = "event_box";
                var contentPos = document.createElement("div");
                contentPos.className = "event_content_positioning";
                var content = document.createElement("div");
                content.className = "event_content";
                var contentText = document.createElement("span");
                contentText.innerText = row.name;
                contentText.className = "event_content_text";

                var contentElements = document.createElement("div");
                contentElements.className = "event_content_elments";

                var maxElement = document.createElement("div");
                maxElement.className = "max_element";
                var eventTimeText = document.createElement("span");
                eventTimeText.innerText = "Time";
                eventTimeText.className = "text";
                var eventTimeValue = document.createElement("span");
                var time = row.time.substring(0, 5);
                eventTimeValue.innerText = time;
                eventTimeValue.className = "number";

                var totalElement = document.createElement("div");
                totalElement.className = "total_element";
                var eventDateText = document.createElement("span");
                eventDateText.className = "text";
                eventDateText.innerText = "Date";
                var eventDateValue = document.createElement("span");
                eventDateValue.className = "number";
                var date = row.date.substring(8, 10) + "/" + row.date.substring(5, 7) + "/" + row.date.substring(0, 4);
                eventDateValue.innerText = date;

                var totalElement1 = document.createElement("div");
                totalElement1.className = "total_element1";
                var eventFeeText = document.createElement("span");
                eventFeeText.className = "text";
                eventFeeText.innerText = "Fee";
                var eventFeeValue = document.createElement("span");
                eventFeeValue.className = "number";
                eventFeeValue.innerText = row.fee;

                var totalElement2 = document.createElement("div");
                totalElement2.className = "total_element2";
                var eventLocationText = document.createElement("span");
                eventLocationText.className = "text";
                eventLocationText.innerText = "Location";
                var eventLocationValue = document.createElement("span");
                eventLocationValue.className = "number";
                eventLocationValue.innerText = row.location;

                var seeMoreButton = document.createElement("button");
                seeMoreButton.setAttribute('onclick', `index=${idCounter}`);
                seeMoreButton.addEventListener("click", edit_event);
                seeMoreButton.className = "more_button";
                var seeMoreButtonText = document.createElement("span");
                seeMoreButtonText.innerText = "EDIT EVENT";
                seeMoreButtonText.className = "more_text";

                var customLinkButton = document.createElement("button");
                customLinkButton.setAttribute('onclick', `index=${counter}`);
                customLinkButton.addEventListener("click", get_link);
                customLinkButton.className = "more_button1";
                var customLinkButtonText = document.createElement("span");
                customLinkButtonText.innerText = "CUSTOM LINK";
                customLinkButtonText.className = "more_text1";

                var userInfoButton = document.createElement("button");
                userInfoButton.setAttribute('onclick', `index=${idCounter}`);
                userInfoButton.addEventListener("click", attendance_info);
                userInfoButton.className = "more_button2";
                var userInfoButtonText = document.createElement("span");
                userInfoButtonText.innerText = "ATTENDANCE INFO";
                userInfoButtonText.className = "more_text2";

                var descriptionPos = document.createElement("div");
                descriptionPos.className = "event_content_positioning1";
                var description = document.createElement("div");
                description.className = "event_content1";
                var descriptionText = document.createElement("span");
                descriptionText.innerText = "Description";
                descriptionText.className = "event_content_text2";
                var descriptionTextValue = document.createElement("div");
                descriptionTextValue.className = "event_content_elements2";
                descriptionTextValue.innerText = row.description;

                contentPos.appendChild(content);
                contentPos.appendChild(contentText);

                maxElement.appendChild(eventTimeText);
                maxElement.appendChild(eventTimeValue);

                totalElement.appendChild(eventDateText);
                totalElement.appendChild(eventDateValue);

                totalElement1.appendChild(eventFeeText);
                totalElement1.appendChild(eventFeeValue);

                totalElement2.appendChild(eventLocationText);
                totalElement2.appendChild(eventLocationValue);

                contentElements.appendChild(maxElement);
                contentElements.appendChild(totalElement);
                contentElements.appendChild(totalElement1);
                contentElements.appendChild(totalElement2);
                contentPos.appendChild(contentElements);

                seeMoreButton.appendChild(seeMoreButtonText);
                contentPos.appendChild(seeMoreButton);

                customLinkButton.appendChild(customLinkButtonText);
                contentPos.appendChild(customLinkButton);

                userInfoButton.appendChild(userInfoButtonText);
                contentPos.appendChild(userInfoButton);

                descriptionPos.appendChild(description);
                descriptionPos.appendChild(descriptionText);
                descriptionPos.appendChild(descriptionTextValue);
                contentPos.appendChild(descriptionPos);

                eventBox.appendChild(contentPos);
                centre.appendChild(eventBox);

                eventsList.appendChild(centre);
                links[counter] = row.custom_link;
                eventIds[idCounter] = row.id;
                counter++;
                idCounter++;
            }
        }
    }
    xhttp.open("GET", '/event/getHostEvents', true);
    xhttp.send();
}

function manageUsers() {
    window.replace.href = "/admin_user_settings.html";
}
function logOut() {
    var xhttp = new XMLHttpRequest();
    var info = {
        token: sessionStorage.getItem("googleToken")
    }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 202) {
            sessionStorage.clear();
            gapi.load("auth2", function () {
                gapi.auth2.init();
                window.location.href = "https://accounts.google.com/logout";
            });
            var auth2 = gapi.auth2.getAuthInstance();
            return;
        }
        else {
            sessionStorage.clear();
            window.location.href = "/login.html";
        }
    };

    /* 2. Open connection */
    xhttp.open("POST", "/logout", true);
    xhttp.setRequestHeader("content-type", "application/JSON");
    xhttp.send(JSON.stringify(info));
}
//calander

/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '1056683511837-roifnl5jkqh57j4kk0cpnh3c1ipt59sv.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDnYtTyeFZyG6FFKom5UlfRA2ox2JjwrX0';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';

/**
* Callback after api.js is loaded.
*/
function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
}

/**
* Callback after the API client is loaded. Loads the
* discovery doc to initialize the API.
*/
async function intializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
* Callback after Google Identity Services are loaded.
*/
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
* Enables user interaction after all libraries are loaded.
*/
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
* Sign in the user upon button click.
*/
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('authorize_button').innerText = 'Refresh';
        await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
* Sign out the user upon button click.
*/
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('authorize_button').innerText = 'Authorize';
    }
}

/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
async function listUpcomingEvents() {
    let response;
    try {
        const request = {
            'calendarId': 'primary',
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
        };
        response = await gapi.client.calendar.events.list(request);
    } catch (err) {
        return;
    }

    const events = response.result.items;
    if (!events || events.length == 0) {
        return;
    }
    // Flatten to string to display
    const output = events.reduce(
        (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
        'Events:\n');
    console.log(events[0].start.dateTime.split('T')[1]);

    for (event in events) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
        };
        let date = events[event].start.dateTime.split('T')[0];
        let time = events[event].start.dateTime.split('T')[1];
        time = time.split('+')[0];
        xhttp.open("POST", "/addCalendarEvent", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({ name: events[event].summary, date: date, time: time }));
    }
};
