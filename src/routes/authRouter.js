import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  authState,
  setup2FA,
  reset2FA,
  verify2FA,
} from "../controllers/authController.js";

const router = Router();

//registration routes
router.post("/registration", register);

//login routes
router.post("/login", passport.authenticate("local"), login);

//auth state routes
router.get("/state", authState);

//logout routes
router.post("/logout", logout);

//2FA setup
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  },
  setup2FA
);

//verify route
router.post(
  "2fa/verify",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  },
  verify2FA
);

//reset route
router.post(
  "2fs/reset",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  },
  reset2FA
);

export default router;
