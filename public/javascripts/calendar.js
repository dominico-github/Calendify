function back() {
    window.location.href = "/attendance_info.html";
}
var calendar = new Vue({
    components: { vueCal: vuecal },
    el: "#app",
    data: {
        events: [],
    },
});

function populate() {
    var xhttp = new XMLHttpRequest();
    let info = {
        eventId: sessionStorage.getItem("eventId"),
    };
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var ids = JSON.parse(this.response);
            for (id in ids) {
                let information = {
                    userId: ids[id].user,
                };
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var rsvpEvents = JSON.parse(this.response);
                        // rsvp event handling here
                        for (event in rsvpEvents) {
                            calendar.events.push({
                                start:
                                    rsvpEvents[event].date.split("T")[0] +
                                    " " +
                                    rsvpEvents[event].time,
                                end: rsvpEvents[event].date.split("T")[0] + " 23:59",
                                title: rsvpEvents[event].name,
                            });
                        }
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                var hostEvents = JSON.parse(this.response);
                                // host event handling here
                                for (event in hostEvents) {
                                    calendar.events.push({
                                        start:
                                            hostEvents[event].date.split("T")[0] +
                                            " " +
                                            hostEvents[event].time,
                                        end: hostEvents[event].date.split("T")[0] + " 23:59",
                                        title: hostEvents[event].name,
                                    });
                                }
                            }
                        };
                        xhttp.open("POST", "/event/getHostEvents-calender", true);
                        xhttp.setRequestHeader("Content-type", "application/json");
                        xhttp.send(JSON.stringify(information));
                    }
                };
                xhttp.open("POST", "/event/getEvents-calender", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(information));
            }
        }
    };
    xhttp.open("POST", "/event/calender", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(info));
}