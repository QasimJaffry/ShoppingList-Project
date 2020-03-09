const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// User model
const config = require("config");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../api/middleware/auth.js");
// @route POST api/auth
// @desc Auth User
// @access Public

router.post("/", (req, res) => {
  const { email, password } = req.body;

  //simple validation

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //check for existing user
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exists" });
    }

    // validate password

    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        { id: user.id },
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    });
  });
});

// @route GET api/auth/user
// @desc Get User data
// @access Private

router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
});

module.exports = router;
