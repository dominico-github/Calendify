//global variables which will be used to modify the DOM
var loginSection = document.getElementById("login");
var registerSection = document.getElementById("register");
var button = document.getElementById("btn");
var backgroundbox = document.getElementsByClassName("form-box")[0];
var loginButton = document.getElementsByClassName("toggle-btn-login")[0];
var signupButton = document.getElementsByClassName("toggle-btn-signup")[0];
var googleButton = document.getElementById("googleButton");
var submitbutton = document.getElementsByClassName("submit-btn")[0];

//these two functions will change the frontend code depending on wheter user wants to sign up or login
function login() {
  loginSection.style.display = "block";
  registerSection.style.display = "none";
  button.style.left = "0";
  backgroundbox.style.height = "480px";
  loginButton.style.color = "white";
  signupButton.style.color = "black";
  googleButton.style.display = "block";
  submitbutton.style.margin = "30px 15px 0px";
}
function signup() {
  registerSection.style.display = "block";
  loginSection.style.display = "none";
  registerSection.style.left = "110px";
  button.style.left = "90px";
  backgroundbox.style.height = "700px";
  signupButton.style.color = "white";
  loginButton.style.color = "black";
  googleButton.style.display = "none";
}

//server side code:
//////////////////

/////////////////////////////////////////////////////////////////////////////////
//login - function to allow the user to log in to an existing account
/////////////////////////////////////////////////////////////////////////////////

function Login() {
  let user = {
    username: document.getElementsByName("username")[0].value,
    email: document.getElementsByName("email")[0].value,
    password: document.getElementsByName("password")[0].value,
  };

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location.href = "/event.html";
    } else if (this.readyState == 4 && this.status == 401) {
      backgroundbox.style.height = "550px";
      document.getElementById("noUserError").innerText =
        "No User exists with this details. Please use sign up.";
      document.getElementById("noUserError").style.display = "block";
      document.getElementById("noUserError").style.color = "red";
    } else if (this.readyState == 4 && this.status == 202) {
      swal.fire({
        type: 'success',
        title: "Hi There!",
        confirmButtonText: 'Lets Go!',
        text: "Welcome Admin!",
    }).then(function() {
        window.location = "/admin.html";
    });
    }
  };

  /* 2. Open connection */
  xhttp.open("POST", "/login", true);
  xhttp.setRequestHeader("content-type", "application/JSON");

  /* 3. Send request */
  xhttp.send(JSON.stringify(user)); //when sending data, convert to json string, when reading from json, use parse
}

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
  let password2 = document.getElementsByName("password")[1].value;
  let Useremail = document.getElementsByName("email")[1].value;
  let phone = document.getElementsByName("phone_number")[0].value;
  let User_name = document.getElementsByName("name")[0].value;
  let username = document.getElementsByName("username")[1].value;
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
  let password2 = document.getElementsByName("password")[1].value;
  let Useremail = document.getElementsByName("email")[1].value;
  let phone = document.getElementsByName("phone_number")[0].value;
  let User_name = document.getElementsByName("name")[0].value;
  let username = document.getElementsByName("username")[1].value;

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
    email: document.getElementsByName("email")[1].value,
    username: document.getElementsByName("username")[1].value,
    name: document.getElementsByName("name")[0].value,
    phone_number: document.getElementsByName("phone_number")[0].value,
    password: document.getElementsByName("password")[1].value,
  };

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      swal.fire({
        type: 'success',
        title: "SUCESSFUL!",
        text: "Please login using your details now!",
    }).then(function() {
        window.location = "/login.html";
    });
    } else if (this.readyState == 4 && this.status == 403) {
      document.getElementById("signupError").innerText =
        "User already exists. Please use login.";
      document.getElementById("signupError").style.display = "block";
      document.getElementById("signupError").style.color = "red";
    }
  };
  /* 2. Open connection */
  xhttp.open("POST", "/signup", true);
  xhttp.setRequestHeader("content-type", "application/JSON");

  /* 3. Send request */
  xhttp.send(JSON.stringify(user)); //when sending data, convert to json string, when reading from json, use parse
}

/////////////////////////////////////////////////////////////////////////////////
//google auth id
/////////////////////////////////////////////////////////////////////////////////
//code below is obtained from:
//https://developers.google.com/identity/sign-in/web/sign-in

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();

  var id_token = googleUser.getAuthResponse().id_token;
  sessionStorage.setItem("googleToken", 1);

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
       window.location.href = "/event.html";
    }
  };

  /* 2. Open connection */
  xhttp.open("POST", "/login", true);
  xhttp.setRequestHeader("content-type", "application/JSON");

  /* 3. Send request */
  let token = {
    name: profile.getName(),
    token: googleUser.getAuthResponse().id_token,
  };
  xhttp.send(JSON.stringify(token)); //when sending data, convert to json string, when reading from json, use parse
}