const passport = require("passport");

const isAuth = () => {
  return passport.authenticate("jwt");
};

const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

module.exports = { isAuth, sanitizeUser };
