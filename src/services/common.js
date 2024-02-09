const passport = require("passport");

const isAuth = () => {
  return passport.authenticate("jwt");
};
// isAuth isn't working here as a middleware(because we are not using the next method) here that why we need to call isAuth() when we need to use this.

const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjkzZGUwODE4NTI0ZjU2NjU2ZjA1ZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA3NDgzMjg3fQ.GlNr42SyTEoJvbQjpS87cgPRSQEuwDlcBXltq0Oxa80";
  return token;
};

module.exports = { isAuth, sanitizeUser, cookieExtractor };
