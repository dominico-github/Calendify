var express = require("express");
const argon2 = require("argon2");
const Swal = require('sweetalert2');
var router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "1056683511837-roifnl5jkqh57j4kk0cpnh3c1ipt59sv.apps.googleusercontent.com"
);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//checks

//////////////////////////////////////////////////////////////////////////////
//login in request
//////////////////////////////////////////////////////////////////////////////

router.post("/login", function (req, res, next) {
  //check if the required fields are in the body
  if (
    ("username" in req.body || "email" in req.body) &&
    "password" in req.body
  ) {
    //if true, connect to database and proceed with login.
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query =
        "SELECT id, username, email, phone_number, isAdmin, password FROM users WHERE (username = ? OR email = ?);";
      connection.query(
        query,
        [req.body.username, req.body.email],
        async function (err, rows, fields) {
          connection.release(); // release connection
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          if (rows.length > 0 && rows[0].isAdmin == 0) {
            //some of this code is obtained from https://www.npmjs.com/package/argon2
            try {
              if (await argon2.verify(rows[0].password, req.body.password)) {
                req.session.user = rows[0];
                //console.log(req.session.user);
                res.sendStatus(200);
                return;
              } else {
                //console.log("bad login - No user in database");
                res.sendStatus(401);
                return;
              }
            } catch (err) {
              //console.log("Internal error");
              res.sendStatus(401);
              return;
            }
          } else if (rows.length > 0 && rows[0].isAdmin == 1) {
            try {
              if (await argon2.verify(rows[0].password, req.body.password)) {
                req.session.user = rows[0];
                //console.log(req.session.user);
                res.sendStatus(202);
                return;
              } else {
                //console.log("bad login - No user in database");
                res.sendStatus(401);
                return;
              }
            } catch (err) {
              //console.log("Internal error");
              res.sendStatus(401);
              return;
            }
          } else {
            //console.log("bad login - No user in database");
            res.sendStatus(401);
            return;
          }
        }
      );
    });
  }
  //code for google auth for users who wish to login via their google accounts
  //some of the code below is obtained from:
  //https://developers.google.com/identity/sign-in/web/sign-in
  else if ("token" in req.body) {
    let email = null;

    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience:
          "1056683511837-roifnl5jkqh57j4kk0cpnh3c1ipt59sv.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();
      const userid = payload["sub"];
      email = payload["email"];
      //console.log(userid);
      //console.log(email);
      return payload["email"];
    }
    email = verify()
      .then(function () {
        req.pool.getConnection(function (err, connection) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }

          let query =
            "SELECT id, username, email, phone_number, isAdmin, password FROM users WHERE email=?;";
          connection.query(query, [email], async function (err, rows, fields) {
            // connection.release(); // release connection
            if (err) {
              console.log(err);
              res.sendStatus(500);
              return;
            }
            if (rows.length > 0 && rows[0].isAdmin == 0) {
              req.session.user = rows[0];
              //console.log(req.session.user);
              res.sendStatus(200);
            }
            //no user exists, add them to the database
            else {
              req.pool.getConnection(function (err, connection) {
                if (err) {
                  res.sendStatus(500);
                  return;
                }
                var query =
                  "INSERT INTO users (username, email, isAdmin) VALUES (?,?,false);";
                connection.query(
                  query,
                  [req.body.name, email],
                  function (err, rows, fields) {
                    //connection.release(); // release connection
                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                  }
                );

                //get that data for token, and store it into req.sessions

                req.pool.getConnection(function (err, connection) {
                  if (err) {
                    res.sendStatus(500);
                    return;
                  }
                  var query =
                    "SELECT id, username, email FROM users WHERE email=?;";
                  connection.query(
                    query,
                    [email],
                    function (err, rows, fields) {
                      connection.release(); // release connection
                      if (err) {
                        res.sendStatus(500);
                        return;
                      }
                      req.session.user = rows[0];
                      //console.log(req.session.user);
                      res.sendStatus(200);
                    }
                  );
                });
              });
            }
          }); //where connection query ends
        }); //where connectionpool closes
      })
      .catch(function () {
        res.sendStatus(403);
      });
  }
  //--google auth end--

  //incorrect request, ie, required fields not in body, then end code.
  else {
    //console.log("bad login - incorrect request");
    res.sendStatus(400);
    return;
  }
});
//////////////////////////////////////////////////////////////////////////////
//sign up request
//////////////////////////////////////////////////////////////////////////////
router.post("/signup", function (req, res, next) {
  if (
    "username" in req.body &&
    "name" in req.body &&
    "password" in req.body &&
    "phone_number" in req.body &&
    "email" in req.body
  ) {
    //check if user already exists:
    ////////////////////////////////

    req.pool.getConnection(async function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let hash = null;
      try {
        hash = await argon2.hash(req.body.password);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      let query =
        "SELECT username, email, phone_number FROM users WHERE username = ? OR email = ? OR phone_number = ?";
      connection.query(
        query,
        [req.body.username, req.body.email, req.body.phone_number],
        function (err, rows, fields) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          if (rows.length > 0) {
            res.sendStatus(403);
            return;
          }
          //user does not already exists:
          /////////////////////////////////
          else {
            let query =
              "INSERT INTO users (username, email, password, phone_number, last_login, isAdmin, fullname) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP(), false, ?);";
            connection.query(
              query,
              [req.body.username, req.body.email, hash, req.body.phone_number, req.body.name],
              function (err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                  console.log(err);
                  res.sendStatus(500);
                  return;
                }
                res.sendStatus(200);
              }
            );
          }
        }
      );
    });
  } else {
    console.log("Bad login - Incorrect request");
    res.sendStatus(400);
  }
});


router.use("/signupAdmin",function(req,res,next){
  if (!("user" in req.session)) {
    console.log(req.session.user.isAdmin);
    res.sendStatus(403);
    return;
  }
  next();
});




//////////////////////////////////////////////////////////////////////////////
//log out route
//////////////////////////////////////////////////////////////////////////////


router.post("/logout", function (req, res, next) {
  if (req.body.token != null) {
    // delete req.session.user;

    req.session.destroy();
    return res.sendStatus(202);
  }
  if ("user" in req.session) {
    // delete req.session.user;
    req.session.destroy();
    res.sendStatus(200);
    return;
  }
  res.sendStatus(400);
});

//////////////////////////////////////////////////////////////////////////////

//ADMIN PAGE



router.post("/UpdateSpecificInfo", function (req, res, next) {
  if (!("user" in req.session)) {
    res.sendStatus(403);
    return;
  }

  if (
    "username" in req.body &&
    "password" in req.body &&
    "phone_number" in req.body &&
    "email" in req.body
  ) {
    let newDetails = {
      SpecificUsername: req.body.SpecificUsername,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phone_number: req.body.phone_number,
    };

    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query =
        "UPDATE users SET username = ?, email = ?, password = ?, phone_number = ? WHERE username = ?;";
      connection.query(
        query,
        [
          newDetails.username,
          newDetails.email,
          newDetails.password,
          newDetails.phone_number,
          newDetails.SpecificUsername,
        ],
        function (err, rows, fields) {
          connection.release(); // release connection
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
          return;
        }
      );
    });
  } else {
    res.sendStatus(400);
    return;
  }
});


router.post("/SpecificUserInfo", function (req, res, next) {
  if (!("user" in req.session)) {
    res.sendStatus(403);
    return;
  }
  let user = req.body.username;
  console.log("SERVER SIDE CALL FOR USER " + user);
  if (user != "") {
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query =
        "SELECT username, email, password, fullname, phone_number FROM users WHERE username = ?;";
      connection.query(
        query,
        [user],
        function (err, rows, fields) {
          connection.release(); // release connection
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          res.json(rows[0]);
        }
      );
    });
  }
});

router.get("/Users", function (req, res, next) {
  if (!("user" in req.session)) {
    res.sendStatus(403);
    return;
  }


  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query =
      "SELECT username from users;";
    connection.query(
      query,
      function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        console.log(rows);
        res.json(rows);
      }
    );
  });
});




//////////////////////////////////////////////////////////////////////////////
//stuff for Events
//////////////////////////////////////////////////////////////////////////////


/* GET home page. */

router.post('/add', function (req, res, next) {

  if (!("user" in req.session)) {
    res.sendStatus(403);
    return;
  } else if ("name" in req.body && "description" in req.body && "date" in req.body && "time" in req.body && "fee" in req.body && "location" in req.body && "custom_link" in req.body) {

    let info = {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      fee: req.body.fee,
      location: req.body.location,
      custom_link: req.body.custom_link
    }
    let eventId = req.body.eventId;

    // console.log(info);

    //Connect to the database
    if (eventId != -1) {
      req.pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        let query = "UPDATE Events SET name = ?, description = ?, time = ?, date = ?, fee = ?, location = ? WHERE id = ?;";
        connection.query(query, [info.name, info.description, info.time, info.date, info.fee, info.location, eventId], function (err, rows, fields) {
          connection.release(); // release connection
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
        }
        );
      });
    }
    else {
      req.pool.getConnection(function (err, connection) {
        if (err) {
          res.sendStatus(500);
          return;
        }

        var query = "INSERT INTO Events (name,description,time,date,fee,location, host, custom_link) values (?,?,?,?,?,?,?,?);";

        connection.query(query, [info.name, info.description, info.time, info.date, info.fee, info.location, req.session.user.id, info.custom_link], function (err, rows, fields) {
          connection.release(); // release connection
          if (err) {
            console.log(err);
            res.sendStatus(505);
            return;
          }
          res.sendStatus(201);
        });
      });
    }
  }
  else {
    res.sendStatus(400);
    return;
  }

});


router.get('/event/getEvents', function (req, res) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      res.sendStatus(504);
      return;
    }
    if (!("user" in req.session)) {
      res.sendStatus(501);
      return;
    }
    var user_id = req.session.user.id;
    connection.query(`SELECT DISTINCT Events.id, Events.name, Events.description, Events.time, Events.date, Events.fee, Events.custom_link, Events.location
    FROM ((users INNER JOIN EventList ON users.id = EventList.user)
    INNER JOIN Events ON EventList.event = Events.id) WHERE users.id = ?`, [user_id], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(503);
        return;
      }
      res.json(rows);
    });
  });

});

router.get('/event/getHostEvents', function (req, res) {

  if (req.session.user.isAdmin) {
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }
      if (!("user" in req.session)) {
        res.sendStatus(501);
        return;
      }
      connection.query(`SELECT *, name, description, time, date, fee, custom_link, location
      FROM Events`, function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(503);
          return;
        }
        res.json(rows);
      });
    });

}else {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      res.sendStatus(504);
      return;
    }
    if (!("user" in req.session)) {
      res.sendStatus(501);
      return;
    }
    var user_id = req.session.user.id;

    connection.query(`SELECT id, name, description, time, date, fee, custom_link, location
    FROM Events WHERE host = ?`, [user_id], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(503);
        return;
      }
      res.json(rows);
    });
  });
}
});

var event_id = '';
var unregisteredUserId = '';
var info = {};
router.post('/event/rsvp', function (req, res) {
  info = {
    attendance: req.body.attendance,
    message: req.body.message,
    fullName: req.body.fullName,
    date: req.body.suggestedDate,
    email: req.body.email,
    time: req.body.suggestedTime,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    custom_link: req.body.customLink
  }

  // Database query to get the event ID
  req.pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      res.sendStatus(504);
      return;
    }
    connection.query("SELECT id FROM Events WHERE custom_link = ?;", [info.custom_link], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(503);
        return;
      }
      var rowData = (Object.values(JSON.parse(JSON.stringify(rows))));
      event_id = rowData[0];
      event_id = event_id.id;
      res.sendStatus(200);
    });
  });
});

router.post('/event/rsvp2', function (req, res) {
  // If unregistered user, add to user table and create attendance info
  if (!("user" in req.session)) {
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }
      connection.query("INSERT INTO users (fullname, email, address, phone_number) VALUES (?, ?, ?, ?);", [info.fullName, info.email, info.address, info.phoneNumber], function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(503);
          return;
        }
        res.sendStatus(200);
      });
    });
  }
  else {
    var user_id = req.session.user.id;
    // Update user's address
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }

      connection.query("UPDATE users SET ADDRESS = ? WHERE id = ?;", [info.address, user_id], function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(503);
          return;
        }
        res.sendStatus(200);
      });
    });

  }
});
router.post('/event/rsvp2', function (req, res) {
  // If unregistered user, add to user table and create attendance info
  if (!("user" in req.session)) {
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }
      connection.query("INSERT INTO users (fullname, email, address, phone_number) VALUES (?, ?, ?, ?);", [info.fullName, info.email, info.address, info.phoneNumber], function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(503);
          return;
        }
        res.sendStatus(200);
      });
    });
  }
  else {
    var user_id = req.session.user.id;
    // Update user's address
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }

      connection.query("UPDATE users SET ADDRESS = ? WHERE id = ?;", [info.address, user_id], function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(503);
          return;
        }
        res.sendStatus(200);
      });
    });

  }
});

router.post('/event/rsvp3', function (req, res) {
  if (!("user" in req.session)) {
    // Database query to get the id of the newly made user
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }
      connection.query(`SELECT id FROM users WHERE fullname = ? AND email = ? AND address = ? AND phone_number = ?;`,
        [info.fullName, info.email, info.address, info.phoneNumber], function (error, rows, fields) {
          connection.release();
          if (error) {
            console.log(error);
            res.sendStatus(503);
            return;
          }
          var idInfo = (Object.values(JSON.parse(JSON.stringify(rows))));
          unregisteredUserId = idInfo[0];
          unregisteredUserId = unregisteredUserId.id;
          res.sendStatus(201);
        });
    });
  }
  else {
    // Check if a current rsvp entry for the user exists
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }
      var user_id = req.session.user.id;
      connection.query("SELECT availability FROM EventList WHERE event = ? AND user = ?;", [event_id, user_id], function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(503);
          return;
        }
        res.json(rows);
      });
    });
  }
});

router.post('/event/rsvp4', function (req, res) {
  if (!("user" in req.session)) {
    // Create attendance infomation for the newly registered user
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }
      connection.query(`INSERT INTO EventList (availability, message, suggestedDate, suggestedTime, event, user)
      VALUES (?, ?, ?, ?, ?, ?);`, [info.attendance, info.message, info.date, info.time, event_id, unregisteredUserId], function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(503);
          return;
        }
        res.sendStatus(200);
      });
    });
  }

  else {
    // Create attendance info for the user
    req.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        res.sendStatus(504);
        return;
      }
      var user_id = req.session.user.id;
      connection.query(`INSERT INTO EventList (availability, message, suggestedDate, suggestedTime, event, user)
      VALUES (?, ?, ?, ?, ?, ?)`, [info.attendance, info.message, info.date, info.time, event_id, user_id], function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(503);
          return;
        }
        res.sendStatus(201);
      });
    });
  }
});

router.post('/event/rsvp4.5', function (req, res) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      res.sendStatus(504);
      return;
    }
    var user_id = req.session.user.id;
    connection.query(`UPDATE EventList
    SET availability = ?, message = ?, suggestedDate = ?, suggestedTime = ?
    WHERE event = ? AND user = ?`, [info.attendance, info.message, info.date, info.time, event_id, user_id], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(503);
        return;
      }
      res.sendStatus(200);
    });
  });
});

router.get('/event/autofill', function (req, res) {
  let eventId = req.query.id;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query =
      "SELECT name, description, time, date, fee, location FROM Events WHERE id = ?;";
    connection.query(
      query, [eventId], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.json(rows[0]);
      }
    );
  });
});

router.post('/event/delete', function (req, res) {
  let id = req.body.id;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "DELETE FROM EventList WHERE event = ?;";
    connection.query(query, [id], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
    }
    );
  });
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "DELETE FROM Events WHERE id = ?;";
    connection.query(query, [id], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    }
    );
  });
});

router.post("/event/host_check", function (req, res, next) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      res.sendStatus(504);
      return;
    }
    if (!("user" in req.session)) {
      res.sendStatus(201);
      return;
    }
    var user_id = req.session.user.id;
    var event_link = req.body.customLink;

    connection.query(`SELECT name FROM Events WHERE host = ? AND custom_link = ?`, [user_id, event_link], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(503);
        return;
      }
      res.json(rows);
    });
  });
});

router.get('/event/rsvp/autofill', function (req, res) {
  if (!("user" in req.session)) {
    res.sendStatus(201);
    return;
  }
  let userId = req.session.user.id;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "SELECT email, fullname, phone_number, address FROM users WHERE id = ?;";
    connection.query(
      query, [userId], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.json(rows[0]);
      }
    );
  });
});

router.post('/event/rsvp/autofill/previousRSVP', function (req, res) {
  if (!("user" in req.session)) {
    res.sendStatus(200);
    return;
  }
  let eventId = req.body.eventId;
  let userId = req.session.user.id;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = `SELECT availability, message, suggestedDate, suggestedTime
    FROM EventList
    WHERE event = ? AND user = ?;`;
    connection.query(
      query, [eventId, userId], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.json(rows);
      }
    );
  });
});

router.post('/addCalendarEvent', function (req, res, next) {
  let userId = null;
  if (("user" in req.session)) {
    userId = req.session.user.id;
  }

  let info = {
    name: req.body.name,
    date: req.body.date,
    time: req.body.time,
    userId: userId,
    custom_link: Math.random().toString(20).slice(4, 16)
  }
  //Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "INSERT INTO Events (name, time, date, host, custom_link) VALUES (?, ?, ?, ?, ?);";
    connection.query(query, [info.name, info.time, info.date, info.userId, info.custom_link], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    }
    );
  });

});

router.post('/checkCalendarEvent', function (req, res, next) {
  let userId = null;
  if (("user" in req.session)) {
    userId = req.session.user.id;
  }

  let info = {
    name: req.body.name,
    date: req.body.date,
    time: req.body.time,
    userId: userId
  }
  //Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "SELECT * FROM Events WHERE name = ? AND time = ? AND date = ? AND host = ?;";
    connection.query(query, [info.name, info.time, info.date, info.userId], function (err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        res.sendStatus(201);
      }
      else {
        res.sendStatus(200);
      }
    }
    );
  });

});

router.post('/event/getEvents-calender', function (req, res) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      res.sendStatus(504);
      return;
    }
    var user_id = req.body.userId;
    connection.query(`SELECT DISTINCT Events.name, Events.time, Events.date
    FROM ((users INNER JOIN EventList ON users.id = EventList.user)
    INNER JOIN Events ON EventList.event = Events.id) WHERE users.id = ?`, [user_id], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(503);
        return;
      }
      res.json(rows);
    });
  });

});

router.post('/event/getHostEvents-calender', function (req, res) {
  req.pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      res.sendStatus(504);
      return;
    }
    var user_id = req.body.userId;

    connection.query(`SELECT name, time, date
    FROM Events WHERE host = ?`, [user_id], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(503);
        return;
      }
      res.json(rows);
    });
  });

});


router.post('/event/calender', function (req, res) {
  let info = {
    eventId: req.body.eventId
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "SELECT user FROM EventList WHERE event = ?;";
    connection.query(
      query, [info.eventId], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.json(rows);
      }
    );
  });
});

router.post('/event/getMapData', function (req, res) {
  let info = {
    eventId: req.body.userId
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "SELECT fullname, address FROM users WHERE id = ?;";
    connection.query(
      query, [info.eventId], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.json(rows);
      }
    );
  });
});

router.post('/getAttendanceData', function (req, res) {
  let info = {
    userId: req.body.userId
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = `SELECT users.fullname, users.address,
    EventList.availability, EventList.message, EventList.suggestedDate, EventList.suggestedTime FROM users
    INNER JOIN EventList
    ON users.id = EventList.user
    WHERE users.id = ?;`;
    connection.query(
      query, [info.userId], function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.json(rows);
      }
    );
  });
});

module.exports = router;