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
const cookieParser = require("cookie-parser");
require("dotenv").config();

const server = express();

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

// Webhook
// Todo: we will capture actual order after deploying out server live on public URL

const endpointSecret = process.env.ENDPOINT_SECRET;

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; // TODO: should not be in code;

//middlewares
server.use(express.static("build"));
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
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
            const token = jwt.sign(
              sanitizeUser(user),
              process.env.JWT_SECRET_KEY
            );
            done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
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

// Payments
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // stripe take is to the decimal
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

server.listen(process.env.PORT, async () => {
  try {
    await dbConnect();
    console.log("Connected to Database");
  } catch (error) {
    console.log({ Error: error.message });
  }
});
