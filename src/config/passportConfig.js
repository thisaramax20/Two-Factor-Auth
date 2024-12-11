import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        done(null, false, { message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        done(null, false, { message: "Incorrect password" });
      } else {
        return done(null, user, { message: "Logged in successfully" });
      }
    } catch (error) {
      done(error);
    }
  })
);

//when you loin you have to serialize the user into the session
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

//when you logout you have to deserialize the user into the session
passport.deserializeUser(async function (_id, done) {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
