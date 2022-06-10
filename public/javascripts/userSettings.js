//loading the user details.

function LoadInfo() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.response);
      document.getElementById("email").value = obj.email;
      document.getElementById("username").value = obj.username;
      document.getElementById("password").value = "";
      document.getElementById("password2").value = "";
      document.getElementById("phonenumber").value = obj.phone_number;
      document.getElementById("fullname").value = obj.fullname;
    } else if (this.readyState == 4 && this.status == 403) {
      swal.fire({
        type: 'success',
        title: "Please log in or sign up first!",
        confirmButtonText: 'Ok',
      }).then(function () {
        window.location = "login.html";
      });
    }
  };

  xhttp.open("GET", "/users/UserInfo", true);
  xhttp.send();
}

//Updating the user Details

function UpdateDetails() {
  if (checkPasswords() == false) {
    swal.fire({
      type: 'success',
      title: "Error: Ensure passwords match and are at least 8 characters long!",
      confirmButtonText: 'Ok',
    });
    return;
  }
  if (inputChecks() == false) {
    swal.fire({
      type: 'success',
      title: "Error: Empty input fields (password may be empty)" + "\n" + "Also ensure the phone number is 10 numbers long",
      confirmButtonText: 'Ok',
    });
    return;
  }

  let user = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    phone_number: document.getElementById("phonenumber").value,
    full_name: document.getElementById("fullname").value
  };

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      swal.fire({
        type: 'success',
        title: "Details updated!",
        confirmButtonText: 'Ok',
      }).then(function () {
        window.location = "event.html";
      });
    } else if (this.readyState == 4 && this.status == 403) {
      swal.fire({
        type: 'success',
        title: "Please log in or sign up first!",
        confirmButtonText: 'Ok',
      }).then(function () {
        window.location = "login.html";
      });
    } else if (this.readyState == 4 && this.status == 400) {
      swal.fire({
        type: 'success',
        title: "Please fill in all fields first!",
        confirmButtonText: 'Ok',
      });
    }
  };

  xhttp.open("POST", "/users/UpdateInfo", true);
  xhttp.setRequestHeader("content-type", "application/JSON");

  xhttp.send(JSON.stringify(user));
}

function gotoEvents() {
  window.location.href = "/event.html";
}

function checkPasswords() {
  let returnValue = true;
  let password1 = document.getElementsByName("password")[0].value;
  let password2 = document.getElementsByName("password2")[0].value;

  if (password1 != password2) {
    returnValue = false;
  }

  if (!(password1 == "")) {
    if (password1.length < 8) {
      returnValue = false;
    }
  }


  return returnValue;
}

function inputChecks() {
  let returnValue = true;
  let email = document.getElementById("email").value;
  let username = document.getElementById("username").value;
  let phonenumber = document.getElementById("phonenumber").value;
  let fullname = document.getElementById("fullname").value;

  if (email == "" || username == "" || phonenumber == "" || fullname == "") {
    returnValue = false;
  }

  if (phonenumber.length != 10) {
    returnValue = false;
  }

  return returnValue;
}