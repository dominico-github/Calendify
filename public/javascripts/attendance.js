function settings() {
    window.location.href = "/userSettings.html";
}

function events() {
    window.location.href = "/event.html";
}

function gotoEvents() {
    window.location.href = "/event.html";
}

function get_attendance_information() {
    let info = { eventId: sessionStorage.getItem("eventId") };
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var ids = JSON.parse(this.response);
            for (id in ids) {
                let information = {
                    userId: ids[id].user
                };
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var object = JSON.parse(this.response)[0];
                        var list = document.getElementsByClassName("scroll")[0];
                        var information = document.createElement("ul");
                        var test = '';
                        if (object.availability == 1) {
                            test = "Can come on the desired date";
                            information.innerHTML = `<li>Name: ${object.fullname}</li>
                            <li>Address: ${object.address}</li>
                            <li>Availability: ${test}</li>
                            <li>Message: ${object.message}</li>
                            <li></li>`;
                        }
                        else {
                            test = "Cannot make it on the appointed day";
                            information.innerHTML = `<li>Name: ${object.fullname}</li>
                            <li>Address: ${object.address}</li>
                            <li>Availability: ${test}</li>
                            <li>Message: ${object.message}</li>
                            <li>Preferred time/date: ${object.suggestedTime + " " + object.suggestedDate.substring(0, 10)}</li>
                            <li></li>`;
                        }
                        list.appendChild(information);
                    }
                };
                xhttp.open("POST", "/getAttendanceData", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(information));
            }
        }
    };
    xhttp.open("POST", "/event/calender", true);
    xhttp.setRequestHeader("content-type", "application/JSON");
    xhttp.send(JSON.stringify(info));
}

function viewMap() {
    window.location.href = "/maps.html";
}

function viewCalendar() {
    window.location.href ="/calendar.html";
}