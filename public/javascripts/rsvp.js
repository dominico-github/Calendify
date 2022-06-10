function checkComplete() {
    var rsvpInfo = {
        attendance: vueinst.attendance,
        email: vueinst.email,
        fullName: vueinst.fullName,
        address: document.getElementById("autocomplete").value,
        phoneNumber: vueinst.phoneNumber,
        message: vueinst.message
    };
    let returnValue = true;

    if (rsvpInfo.fullName == "") {
        returnValue = false;
    }
    if (rsvpInfo.email == "") {
        returnValue = false;
    }

    if (document.getElementById("autocomplete").value == "") {
        returnValue = false;
    }

    if (rsvpInfo.phoneNumber == "") {
        returnValue = false;
    }

    if (rsvpInfo.attendance == false && vueinst.suggestedDateTime == "2022-01-01T00:00") {
        returnValue = false;
    }

    if ((!document.getElementById("yes").checked) && (!document.getElementById("no").checked)) {
        returnValue = false;
    }

    if (rsvpInfo.phoneNumber.length != 10) {
        returnValue = false;
    }

    return returnValue;
}

var vueinst = new Vue({
    el: '#rsvp',
    data: {
        attendance: true,
        email: "",
        fullName: "",
        phoneNumber: "",
        message: "",
        suggestedDateTime: "2022-01-01T00:00"
    },
    methods: {
        submit: function () {
            if (checkComplete() == false) {
                swal.fire({
                    type: 'success',
                    title: "Some fields are empty, or have been inputted incorrectly!" + "\n" + "Ensure the phone number is 10 numbers long :)",
                    confirmButtonText: 'Ok',
                });
                return;
            }
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onload = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var xhttp = new XMLHttpRequest();
                            xhttp.onload = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    if (JSON.parse(this.response)[0]) {
                                        var xhttp = new XMLHttpRequest();
                                        xhttp.onload = function () {
                                            if (this.readyState == 4 && this.status == 200) {
                                                swal.fire({
                                                    type: 'success',
                                                    title: "Successfully edited your RSVP",
                                                    confirmButtonText: 'Ok',
                                                  }).then(function () {
                                                    window.location = "event.html";
                                                  });
                                            }
                                        };
                                        xhttp.open("POST", '/event/rsvp4.5', true);
                                        xhttp.send();
                                    }
                                    else {
                                        var xhttp = new XMLHttpRequest();
                                        xhttp.onload = function () {
                                            if (this.readyState == 4 && this.status == 201) {
                                                swal.fire({
                                                    type: 'success',
                                                    title: "Successfully RSVP'd",
                                                    confirmButtonText: 'Ok',
                                                  }).then(function () {
                                                    window.location = "event.html";
                                                  });
                                            }
                                        };
                                        xhttp.open("POST", '/event/rsvp4', true);
                                        xhttp.send();
                                    }
                                }
                                else {
                                    var xhttp = new XMLHttpRequest();
                                    xhttp.onload = function () {
                                        if (this.readyState == 4 && this.status == 200) {
                                            swal.fire({
                                                type: 'success',
                                                title: "Successfully RSVP'd",
                                                confirmButtonText: 'Ok',
                                            }).then(function () {
                                                window.location = "index.html";
                                            });

                                        }
                                    };
                                    xhttp.open("POST", '/event/rsvp4', true);
                                    xhttp.send();
                                }
                            };
                            xhttp.open("POST", '/event/rsvp3', true);
                            xhttp.send();
                        }
                    };
                    xhttp.open("POST", '/event/rsvp2', true);
                    xhttp.send();
                }

            };
            // Grab the custom URL from the serach bar
            var customLink = window.location.search;
            customLink = customLink.substr(6);

            var rsvpInfo = {
                attendance: vueinst.attendance,
                email: vueinst.email,
                fullName: vueinst.fullName,
                address: document.getElementById("autocomplete").value,
                phoneNumber: vueinst.phoneNumber,
                message: vueinst.message,
                customLink: customLink,
                suggestedTime: vueinst.suggestedDateTime.split('T')[1],
                suggestedDate: vueinst.suggestedDateTime.split('T')[0]
            };
            xhttp.open("POST", '/event/rsvp', true);
            xhttp.setRequestHeader("content-type", "application/JSON");
            xhttp.send(JSON.stringify(rsvpInfo));
        }
    }
});

function host_check() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.response);
            if (response.length > 0) {
                var body = document.getElementsByTagName('body')[0];
                body.innerHTML = `
                <header class="settings_header"></header>
                <div class="event_title_positioning"></div>
                <span class="title">Events list</span>

                <div id="rsvp" class="events_center">
                    <a href="userSettings.html">
                        <button class="log_out_button">
                            <span class="log_out_text">Profile</span>
                        </button>
                    </a>
                    <div class="email_rsvp">
                        You are the host of this event!. Send the custom URL link to your attendees to get their RSVP.
                        </br></br>
                        ${window.location.href}
                    </div>
                </div>`;

                // <div>You are the host of this event!. Send the custom URL link to your attendees to get their RSVP</div>
                // <div>${window.location.href}</div>`;

            }
        }
    };
    // Grab the custom URL from the serach bar
    var customLink = window.location.search;
    customLink = customLink.substr(6);

    var rsvpInfo = {
        customLink: customLink
    };
    xhttp.open("POST", '/event/host_check', true);
    xhttp.setRequestHeader("content-type", "application/JSON");
    xhttp.send(JSON.stringify(rsvpInfo));
}

function autofill() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.response);
            vueinst.email = response.email;
            vueinst.fullName = response.fullname;
            vueinst.phoneNumber = response.phone_number;
            document.getElementById("autocomplete").value = response.address;
            var xhttp = new XMLHttpRequest();
            let information = {
                eventId: sessionStorage.getItem("eventId")
            };
            xhttp.onload = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(this.response)[0];
                    if (result) {
                        if (result.attendance == 1) {
                            vueinst.attendance = 0;
                            document.getElementById("no").checked = true;
                        }
                        else {
                            vueinst.attendance = 1;
                            document.getElementById("yes").checked = true;
                        }
                        vueinst.message = result.message;
                        vueinst.suggestedDateTime = result.suggestedDate.substring(0, 10) + "T" + result.suggestedTime;
                    }
                }
            };

            xhttp.open("POST", '/event/rsvp/autofill/previousRSVP', true);
            xhttp.setRequestHeader("content-type", "application/JSON");
            xhttp.send(JSON.stringify(information));
        }
    };

    xhttp.open("GET", '/event/rsvp/autofill', true);
    xhttp.send();
}


function settings() {
    window.location.href = "/userSettings.html";
}

//From https://developers.google.com/maps/documentation/javascript/places-autocomplete
var placeSearch;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')),
        { types: ['geocode'] });
}

google.maps.event.addDomListener(window, 'load', initialize);