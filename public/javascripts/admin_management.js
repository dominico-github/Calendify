

//global variables which will be used to modify the DOM
var registerSection = document.getElementById("register");
var button = document.getElementById("btn");
var backgroundbox = document.getElementsByClassName("form-box")[0];
var signupButton = document.getElementsByClassName("toggle-btn-signup")[0];
var submitbutton = document.getElementsByClassName("submit-btn")[0];

//loading the user details.

function back() {
  window.location.href = "/admin.html";
}

function getUsers() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200 || this.status == 304) {
      let users = JSON.parse(this.response);
      let options = document.getElementById("admin_drop_down");
      for (let key of users) {
        options.innerHTML += "<option value=" + key.username + ">" + key.username + "</option>";
      }
      LoadInfo();
    }
  };
  xhttp.open("GET", "/Users", true);
  xhttp.send();

}

function adminSignUp() {
  window.location.replace("/signupAdmin.html");
}


function LoadInfo() {
  let user = document.getElementById("admin_drop_down").value;

  if (user == undefined) {
    return;
  }
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        var obj = JSON.parse(this.response);

        document.getElementById("email").value = obj.email;
        document.getElementById("username").value = obj.username;
        document.getElementById("password").value = obj.password;
        document.getElementById("phonenumber").value = obj.phone_number;
        if (obj.fullname) {
          document.getElementById("givennname").value = obj.fullname;
        }
      }
      catch (err) {
        alert("cannot update google accounts");
      }
    } else if (this.readyState == 4 && this.status == 403) {
      alert("Please log in or sign up first!");
      window.location.replace("/login.html");
    }
  };

  let currentuser = {
    username: user,
  };

  /* 2. Open connection */
  xhttp.open("POST", "/SpecificUserInfo", true);
  xhttp.setRequestHeader("content-type", "application/JSON");
  /* 3. Send request */
  xhttp.send(JSON.stringify(currentuser));
}

//Updating the user Details

function UpdateSpecificDetails() {
  let user = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    phone_number: document.getElementById("phonenumber").value,
    SpecificUsername: document.getElementById("admin_drop_down").value,
  };

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      alert("Details updated!");
      LoadInfo();
    } else if (this.readyState == 4 && this.status == 403) {
      alert("Please log in or sign up first!");
      window.location.replace("/login.html");
    } else if (this.readyState == 4 && this.status == 400) {
      alert("Please fill in all fields first!");
    }
  };

  xhttp.open("POST", "/UpdateSpecificInfo", true);
  xhttp.setRequestHeader("content-type", "application/JSON");

  xhttp.send(JSON.stringify(user)); //when sending data, convert to json string, when reading from json, use parse
}


//delete an user

function deleteUser() {
  let user = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value
  };
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let information = {
        id: JSON.parse(this.response)[0].id
      };
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if (JSON.parse(this.response)[0]) {
            let eventIds = JSON.parse(this.response);
            for (events in eventIds) {
              let info = {
                eventId: eventIds[events].id
              };
              var xhttp = new XMLHttpRequest();
              xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                  var xhttp = new XMLHttpRequest();
                  xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                      var xhttp = new XMLHttpRequest();
                      xhttp.onreadystatechange = function () {

                      };
                      xhttp.open("POST", "/admin/deleteUser5", true);
                      xhttp.setRequestHeader("content-type", "application/JSON");
                      xhttp.send(JSON.stringify(information));
                    }
                  };
                  xhttp.open("POST", "/admin/deleteUser4", true);
                  xhttp.setRequestHeader("content-type", "application/JSON");
                  xhttp.send(JSON.stringify(info));
                }
              };
              xhttp.open("POST", "/admin/deleteUser3", true);
              xhttp.setRequestHeader("content-type", "application/JSON");
              xhttp.send(JSON.stringify(info));
            }
            swal.fire({
              type: 'success',
              title: "User deleted",
              confirmButtonText: 'Ok',
            }).then(function () {
              window.location = "admin_user_settings.html";
            });
          }
          else {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 200) {
                swal.fire({
                  type: 'success',
                  title: "User deleted",
                  confirmButtonText: 'Ok',
                }).then(function () {
                  window.location = "admin_user_settings.html";
                });
              }
            };
            xhttp.open("POST", "/admin/deleteUser5", true);
            xhttp.setRequestHeader("content-type", "application/JSON");
            xhttp.send(JSON.stringify(information));
          }
        }
      };

      xhttp.open("POST", "/admin/deleteUser2", true);
      xhttp.setRequestHeader("content-type", "application/JSON");
      xhttp.send(JSON.stringify(information));
    }
  };

  xhttp.open("POST", "/admin/deleteUser", true);
  xhttp.setRequestHeader("content-type", "application/JSON");
  xhttp.send(JSON.stringify(user));
}

//these two functions will change the frontend code depending on wheter user wants to sign up or login

function signup() {
  registerSection.style.display = "block";
  registerSection.style.left = "110px";
  button.style.left = "90px";
  backgroundbox.style.height = "700px";
  signupButton.style.color = "white";
}

//server side code:
//////////////////



/////////////////////////////////////////////////////////////////////////////////
//sign up - allow the user to sign up
/////////////////////////////////////////////////////////////////////////////////

//check if the email is valid.
//Regex obtained from: https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript

function ValidateEmail(input) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.match(validRegex)) {
    return true;
  }
  return false;
}

//this function will check if all the fields are completed by the user
function checkComplete() {
  let password1 = document.getElementsByName("password-1")[0].value;
  let password2 = document.getElementsByName("password")[0].value;
  let Useremail = document.getElementsByName("email")[0].value;
  let phone = document.getElementsByName("phone_number")[0].value;
  let User_name = document.getElementsByName("name")[0].value;
  let username = document.getElementsByName("username")[0].value;
  let returnValue = true;

  if (username == "") {
    document.getElementById("usernameError").innerText =
      "Please enter a username!";
    document.getElementById("usernameError").style.display = "block";
    document.getElementById("usernameError").style.color = "red";
    returnValue = false;
  } else {
    document.getElementById("usernameError").style.display = "none";
  }

  if (User_name == "") {
    document.getElementById("nameError").innerText = "Please enter a name!";
    document.getElementById("nameError").style.display = "block";
    document.getElementById("nameError").style.color = "red";
    returnValue = false;
  } else {
    document.getElementById("nameError").style.display = "none";
  }

  if (Useremail == "") {
    document.getElementById("emailError").innerText =
      "Please enter a email address!";
    document.getElementById("emailError").style.display = "block";
    document.getElementById("emailError").style.color = "red";
    returnValue = false;
  } else {
    document.getElementById("emailError").style.display = "none";
  }

  if (password1 == "") {
    document.getElementById("PasswordError").innerText =
      "Please enter a password!";
    document.getElementById("PasswordError").style.display = "block";
    document.getElementById("PasswordError").style.color = "red";
    returnValue = false;
  } else {
    document.getElementById("PasswordError").style.display = "none";
  }

  if (password2 == "") {
    document.getElementById("PasswordError2").innerText =
      "Please enter a password!";
    document.getElementById("PasswordError2").style.display = "block";
    document.getElementById("PasswordError2").style.color = "red";
    returnValue = false;
  } else {
    document.getElementById("PasswordError2").style.display = "none";
  }

  if (!document.getElementsByClassName("check-box")[0].checked) {
    document.getElementById("checkError").innerText = "Please confirm!";
    document.getElementById("checkError").style.display = "block";
    document.getElementById("checkError").style.color = "red";
    returnValue = false;
  } else {
    document.getElementById("checkError").style.display = "none";
  }

  return returnValue;
}

//this function will check if all the requirements are met for creating a new account
function checkCorrect() {
  //managing data
  let password1 = document.getElementsByName("password-1")[0].value;
  let password2 = document.getElementsByName("password")[0].value;
  let Useremail = document.getElementsByName("email")[0].value;
  let phone = document.getElementsByName("phone_number")[0].value;
  let User_name = document.getElementsByName("name")[0].value;
  let username = document.getElementsByName("username")[0].value;

  let returnValue = true;

  if (ValidateEmail(Useremail) == false) {
    document.getElementById("emailError").innerText = "Invalid email address!";
    document.getElementById("emailError").style.display = "block";
    document.getElementById("emailError").style.color = "red";
    returnValue = false;
  }

  if (password1.length < 8) {
    document.getElementById("PasswordError").innerText =
      "Make sure password is atleast 8 characters long!";
    document.getElementById("PasswordError").style.display = "block";
    document.getElementById("PasswordError").style.color = "red";
    returnValue = false;
  }

  if (password1 != password2) {
    document.getElementById("PasswordError2").innerText =
      "Passwords do not match!";
    document.getElementById("PasswordError2").style.display = "block";
    document.getElementById("PasswordError2").style.color = "red";
    returnValue = false;
  } else {
    document.getElementById("PasswordError2").style.display = "none";
  }

  if (phone.length < 10 || phone.length > 10) {
    document.getElementById("phoneError").innerText =
      "Ensure phone number is only 10 numbers long!";
    document.getElementById("phoneError").style.display = "block";
    document.getElementById("phoneError").style.color = "red";
    returnValue = false;
  } else {
    document.getElementById("phoneError").style.display = "none";
  }

  return returnValue;
}

//main function to sign up a user on the web app.
function Signup() {
  if (checkComplete() == false || checkCorrect() == false) {
    return;
  }

  let user = {
    email: document.getElementsByName("email")[0].value,
    username: document.getElementsByName("username")[0].value,
    name: document.getElementsByName("name")[0].value,
    phone_number: document.getElementsByName("phone_number")[0].value,
    password: document.getElementsByName("password")[0].value,
  };

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      swal.fire({
        type: 'success',
        title: "SUCESSFUL!",
        text: "Admin has been created!",
      }).then(function () {
        window.location = "/admin.html";
      });
    } else if (this.readyState == 4 && this.status == 403) {
      document.getElementById("signupError").innerText =
        "User already exists. Please use login.";
      document.getElementById("signupError").style.display = "block";
      document.getElementById("signupError").style.color = "red";
    }
  };
  /* 2. Open connection */
  xhttp.open("POST", "/admin/Adminsignup", true);
  xhttp.setRequestHeader("content-type", "application/JSON");

  /* 3. Send request */
  xhttp.send(JSON.stringify(user)); //when sending data, convert to json string, when reading from json, use parse
}

