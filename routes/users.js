var express = require("express");
const argon2 = require("argon2");
var router = express.Router();

router.use(function (req, res, next) {
  if (!("user" in req.session)) {
    res.sendStatus(403);
    return;
  }
  next();
});


//getting the user info
//only get info if user is logged in.
router.get("/UserInfo", function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    let query = "SELECT username, email, phone_number, fullname from users WHERE id = ?;";
    connection.query(
      query,
      [req.session.user.id],
      function (err, rows, fields) {
        connection.release(); // release connection
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        return res.json(rows[0]);
      }
    );
  });


});

//only update info if user is logged in.
router.post("/UpdateInfo", function (req, res, next) {

  if (
    "username" in req.body &&
    "password" in req.body &&
    "phone_number" in req.body &&
    "email" in req.body &&
    "full_name" in req.body
  ) {
    let newDetails = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phone_number: req.body.phone_number,
      full_name: req.body.full_name
    };

    if (newDetails.password == "") {
      req.pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        let query =
          "UPDATE users SET username = ?, email = ?, phone_number = ?, fullname = ? WHERE id = ?;";
        connection.query(
          query,
          [
            newDetails.username,
            newDetails.email,
            newDetails.phone_number,
            newDetails.full_name,
            req.session.user.id,
          ],
          function (err, rows, fields) {
            connection.release(); // release connection
            if (err) {
              console.log(err);
              res.sendStatus(500);
              return;
            }
          }
        );
        res.sendStatus(200);
      });
    }
    else {
      req.pool.getConnection(async function (err, connection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        let hash = null;
        try {
          hash = await argon2.hash(newDetails.password);
        } catch (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }
        let query =
          "UPDATE users SET username = ?, email = ?, password = ?, phone_number = ?, fullname = ? WHERE id = ?;";
        connection.query(
          query,
          [
            newDetails.username,
            newDetails.email,
            hash,
            newDetails.phone_number,
            newDetails.full_name,
            req.session.user.id,
          ],
          function (err, rows, fields) {
            connection.release(); // release connection
            if (err) {
              console.log(err);
              res.sendStatus(500);
              return;
            }
          }
        );
        res.sendStatus(200);
      });
    }
  }

  else {
    res.sendStatus(400);
    return;
  }

});

//////////////////////////////////////////////////////////////////////////////

module.exports = router;
