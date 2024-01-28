const User = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sanitizeUser } = require("../services/common");

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // by default when user signup with passport.js it doesn't create any session so for creating session on signup we should use req.login method it will create session when user signup. It will take data that you want to store in the session in the first parameter and in the second parameter it will handle error/response with a call back.
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), process.env.SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000 * 6),
                httpOnly: true,
              })
              .status(201)
              .json({ user, token });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json(req.user); // this user property is set by passport.js after authentication is done.
};

exports.checkUser = async (req, res) => {
  res.json({ status: "success", user: req.user });
};
