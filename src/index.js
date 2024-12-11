import express, { urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoute from "./routes/authRouter.js";

dotenv.config();
dbConnect();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

//middleware
app.use(cors(corsOptions));
//get requests as json
app.use(express.json({ limit: "100mb" }));

//get requests as urlencoded
app.use(urlencoded({ limit: "100mb", extended: true }));

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000 * 60 },
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 3001;

//server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
