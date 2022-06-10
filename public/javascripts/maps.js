function back() {
    window.location.href = "attendance_info.html";
}
//version();

function mapData() {
    var xhttp = new XMLHttpRequest();
    let info = {
        eventId: sessionStorage.getItem("eventId")
    };
    xhttp.onreadystatechange = function () {
        //initilize url
        var url = "https://maps.google.com/maps/api/staticmap?&size=5012x5012&maptype=roadmap";
        document.getElementById("map").src = url;
        if (this.readyState == 4 && this.status == 200) {
            var ids = JSON.parse(this.response);
            var id;
            for (id in ids) {
                let information = {
                    userId: ids[id].user
                };
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var data = JSON.parse(this.response);
                        // add marker data for each address
                        for (let i in data) {
                            url = document.getElementById("map").src;
                            url += "&markers=color:blue|label:" + data[i].fullname + "|" + data[i].address;
                            document.getElementById("map").src = url;
                        }
                    }
                };
                xhttp.open("POST", "/event/getMapData", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(information));
            }
            //add key
            url = document.getElementById("map").src;
            url += "&sensor=false&key=AIzaSyDnYtTyeFZyG6FFKom5UlfRA2ox2JjwrX0";
            //change image url
            document.getElementById("map").src = url;
            next();

        }
    };
    xhttp.open("POST", "/event/calender", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(info));

}


let url = "https://maps.googleapis.com/maps/api/geocode/json?address=Northgate+SA&bounds=36.47,-84.72%7C43.39,-65.90&key=AIzaSyDnYtTyeFZyG6FFKom5UlfRA2ox2JjwrX0";

//version();
function next() {
    var xhttp = new XMLHttpRequest();
    let info = {
        eventId: sessionStorage.getItem("eventId")
    };
    let xcoords;
    let ycoords;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var ids = JSON.parse(this.response);
            for (let id in ids) {
                let information = {
                    userId: ids[id].user
                };
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var data = JSON.parse(this.response);
                        // add marker data for each address
                        for (let i in data) {
                            let xavg = 0;
                            let yavg = 0;
                            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
                            url += data[i].address;
                            url += "&bounds=36.47,-84.72%7C43.39,-65.90&key=AIzaSyDnYtTyeFZyG6FFKom5UlfRA2ox2JjwrX0";
                            fetch(url)
                                .then(res => res.json())
                                .then((out) => {
                                    let coorx = out.results[0].geometry.location.lat;
                                    document.getElementById("x").innerText += coorx + "T";
                                    let coory = out.results[0].geometry.location.lng;
                                    document.getElementById("y").innerText += coory + "T";

                                    xcoords = document.getElementById("x").innerText.split('T');
                                    ycoords = document.getElementById("y").innerText.split('T');
                                    for (let i = 0; i < xcoords.length - 1; i++) {
                                        xavg += parseFloat(xcoords[i]);
                                        yavg += parseFloat(ycoords[i]);
                                    }
                                    xavg = xavg / (xcoords.length - 1);
                                    yavg = yavg / (xcoords.length - 1);
                                    get_list(xavg, yavg);
                                })
                                .catch(err => { throw err; });
                        }
                    }
                };
                xhttp.open("POST", "/event/getMapData", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(information));
            }


        }
    };
    xhttp.open("POST", "/event/calender", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(info));


}

function get_list(x, y) {
    document.getElementById("x").innerText = "";
    document.getElementById("y").innerText = "";
    const request = {
        location: new google.maps.LatLng(x, y),
        radius: 1200
    };

    const results = [];
    const places = document.getElementById('places');
    const service = new google.maps.places.PlacesService(places);

    const callback = (response, status, pagination) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            results.push(...response);
        }

        if (pagination.hasNextPage) {
            setTimeout(() => pagination.nextPage(), 2000);
        } else {
            displayResults();
        }
    };
    places.innerHTML = '';
    const displayResults = () => {
        results.filter(result => result.rating)
            .sort((a, b) => a.rating > b.rating ? -1 : 1)
            .forEach(result => {
                places.innerHTML += `<li>${result.name} - ${result.rating}</li>`;
            });
    };

    service.nearbySearch(request, callback);

}