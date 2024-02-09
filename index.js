const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const dbConnect = require("./src/config/dbConnect");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const server = express();
require("dotenv").config();

const User = require("./src/models/user.model");
const productRouter = require("./src/routes/products.route");
const brandRouter = require("./src/routes/brands.route");
const categoryRouter = require("./src/routes/categories.route");
const userRouter = require("./src/routes/user.route");
const cartRouter = require("./src/routes/cart.route");
const orderRouter = require("./src/routes/order.route");
const authRouter = require("./src/routes/auth.route");
const {
  isAuth,
  sanitizeUser,
  cookieExtractor,
} = require("./src/services/common");

// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY; // TODO: should not be in code;

//middlewares
server.use(express.static("build"));
server.use(cookieParser());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.json()); // to parse req.body
server.use("/products", isAuth(), productRouter);
server.use("/brands", isAuth(), brandRouter);
server.use("/categories", isAuth(), categoryRouter);
server.use("/users", isAuth(), userRouter);
server.use("/cart", isAuth(), cartRouter);
server.use("/orders", isAuth(), orderRouter);
server.use("/auth", authRouter);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      // by default passport uses username
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "invalid credentials" }); // for safety
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            }
            const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
            done(null, { id: user.id, role: user.role }); // this lines sends to serializer
          }
        );
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, user);
  });
});

server.listen(8080, async () => {
  try {
    await dbConnect();
    console.log("Connected to Database");
  } catch (error) {
    console.log({ Error: error.message });
  }
});
