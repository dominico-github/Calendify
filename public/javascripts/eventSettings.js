// Settings functions
function autofill() {
  let eventId = sessionStorage.getItem("eventId");
  if (eventId != -1) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.readyState == 4 && this.status == 200) {
        var eventDetails = JSON.parse(this.response);
        let name = document.getElementById('event_title_text');
        name.value = eventDetails.name;
        let description = document.getElementById('event_description_input');
        description.value = eventDetails.description;
        let dateTime = document.getElementById('participant_text');
        dateTime.value = eventDetails.date.substring(0, 10) + "T" + eventDetails.time;
        let fee = document.getElementById('alert_text');
        fee.value = eventDetails.fee;
        let location = document.getElementById('autocomplete');
        location.value = eventDetails.location;
      }
    }
    xhttp.open("GET", "/event/autofill?id=" + encodeURIComponent(eventId), true);
    xhttp.send();
  }
}

var placeSearch, autocomplete;
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

function checkComplete() {
  let name = document.getElementById('event_title_text').value
  let description = document.getElementById('event_description_input').value
  let date = document.getElementById('participant_text').value.split('T')[0]
  let time = document.getElementById('participant_text').value.split('T')[1]
  let fee = document.getElementById('alert_text').value
  let location = document.getElementById('autocomplete').value

  let info = {
    name: name,
    description: description,
    date: date,
    time: time,
    fee: fee,
    location: location
  };

  let returnValue = true;

  if (info.name == "") {
    returnValue = false;
  }
  if (info.description == "") {
    returnValue = false;
  }

  if (info.fee == "") {
    returnValue = false;
  }

  if (info.location == "") {
    returnValue = false;
  }

  if (!date && !time) {
    returnValue = false;
  }

  return returnValue;
}


function send() {
  if (checkComplete() == false) {
    swal.fire({
      type: 'success',
      title: "Error: All fields must be filled out!" ,
      confirmButtonText: 'Ok',
    });
    return;
  }

  let eventId = sessionStorage.getItem("eventId");
  let name = document.getElementById('event_title_text').value
  let description = document.getElementById('event_description_input').value

  let date = document.getElementById('participant_text').value.split('T')[0]
  let time = document.getElementById('participant_text').value.split('T')[1]
  let fee = document.getElementById('alert_text').value
  let location = document.getElementById('autocomplete').value
  var link = Math.random().toString(20).slice(4, 16);

  let info = {
    eventId: eventId,
    name: name,
    description: description,
    date: date,
    time: time,
    fee: fee,
    location: location,
    custom_link: link
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 201) {
      swal.fire({
        type: 'success',
        title: "Your event has been created!",
        confirmButtonText: 'Go to events',
      }).then(function () {
        window.location = "event.html";
      });
    } else if (this.readyState == 4 && this.status == 200) {
      swal.fire({
        type: 'success',
        title: "Your event has been updated!",
        confirmButtonText: 'Go to events',
      }).then(function () {
        window.location = "event.html";
      });
    } else if (this.readyState == 4 && this.status == 403) {
      swal.fire({
        type: 'Fail',
        title: "Please login or sign up first!",
        confirmButtonText: 'Go to login',
      }).then(function () {
        window.location = "/login.html";
      });
    } else if (this.readyState == 4 && this.status == 400) {
      swal.fire({
        type: 'fail',
        title: "Please fill in all fields first!",
        confirmButtonText: 'Go back',
      });
    }
  };

  xhttp.open("POST", "/add", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(info));
};

function initialize() {
  var input = document.getElementById('searchTextField');
  new google.maps.places.Autocomplete(input);
}

function deleteEvent() {
  let eventId = sessionStorage.getItem("eventId");
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      swal.fire({
        type: 'success',
        title: "Event successfully deleted!",
        confirmButtonText: 'Go to back to events',
      }).then(function () {
        window.location = "event.html";
      });
    }
  };

  xhttp.open("POST", "/event/delete", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ id: eventId }));
};

function gotoEvents() {
  window.location.href = "/event.html";
}