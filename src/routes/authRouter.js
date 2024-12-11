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
router.post("/login", login);

//auth state routes
router.get("/state", authState);

//logout routes
router.post("/logout", logout);

//2FA setup
router.post("/2fa/setup", setup2FA);

//verify route
router.post("2fa/verify", verify2FA);

//reset route
router.post("2fs/reset", reset2FA);

export default router;
