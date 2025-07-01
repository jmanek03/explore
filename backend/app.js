require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self';",
      "font-src 'self' https://fonts.gstatic.com data:;",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://cdn.jsdelivr.net;",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://cdn.jsdelivr.net;",
      "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://cdn.jsdelivr.net;",
      "connect-src 'self' https://explore-7o2c.onrender.com;",
    ].join(" ")
  );
  next();
});




app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  });
}

// --- Google OAuth setup ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + "/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // Create a hashed random password for Google users
          const randomPassword = Math.random().toString(36).slice(-8);
          const bcrypt = require("bcryptjs");
          const hashedPassword = await bcrypt.hash(randomPassword, 12);
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            image:
              profile.photos && profile.photos[0] && profile.photos[0].value
                ? profile.photos[0].value
                : "",
            password: hashedPassword,
            places: [],
          });
          await user.save();
        } else {
          // Always update image if changed (Google user may update profile pic)
          if (
            profile.photos &&
            profile.photos[0] &&
            profile.photos[0].value &&
            user.image !== profile.photos[0].value
          ) {
            user.image = profile.photos[0].value;
            await user.save();
          }
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

app.use(passport.initialize());

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  // Ensure status code is a number
  const status = typeof error.code === "number" ? error.code : 500;
  res.status(status);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1nda4fw.mongodb.net/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true } // Add these options to remove deprecation warnings
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
