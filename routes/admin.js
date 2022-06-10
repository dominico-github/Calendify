var express = require("express");
const argon2 = require("argon2");
var router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "1056683511837-roifnl5jkqh57j4kk0cpnh3c1ipt59sv.apps.googleusercontent.com"
);


//sign up admin route
//////////////////////////////////////////////////////////////////////////////
//sign up request
//////////////////////////////////////////////////////////////////////////////

router.post("/Adminsignup", function (req, res, next) {

  console.log("admin sign up");

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
                "INSERT INTO users (username, email, password, phone_number, last_login, isAdmin, fullname) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP(), true, ?);";
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


  //delete a user

  router.post('/deleteUser', function (req, res) {
    let info = {
      username: req.body.username,
      email: req.body.email
    }
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query = `SELECT id FROM users
      WHERE username = ? OR email = ?;`;
      connection.query(
        query, [info.username, info.email], function (err, rows, fields) {
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


  router.post('/deleteUser2', function (req, res) {
    let info = {
      hostId: req.body.id
    }
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query = `SELECT id FROM Events
      WHERE host = ?;`;
      connection.query(
        query, [info.hostId], function (err, rows, fields) {
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

  router.post('/deleteUser3', function (req, res) {
    let info = {
      eventId: req.body.eventId
    }
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query = `DELETE FROM EventList WHERE event = ?;`;
      connection.query(
        query, [info.eventId], function (err, rows, fields) {
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

  router.post('/deleteUser4', function (req, res) {
    let info = {
      eventId: req.body.eventId
    }
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query = `DELETE FROM Events WHERE id = ?;`;
      connection.query(
        query, [info.eventId], function (err, rows, fields) {
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

  router.post('/deleteUser5', function (req, res) {
    let info = {
    id: req.body.id
    }
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      let query = `DELETE FROM users WHERE id = ?;`;
      connection.query(
        query, [info.id], function (err, rows, fields) {
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
module.exports = router;