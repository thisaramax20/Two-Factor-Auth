import bcrypt from "bcrypt";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });

    await newUser.save();
    res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    console.log("Error creating user", error);
  }
};
export const login = async (req, res) => {
  console.log("Authenticated user", req?.user);
  res.status(200).json({
    message: "User logged in successfully",
    username: req?.user.username,
    isMfaActive: req?.user.isMfaActive,
  });
};
export const authState = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in successfully",
      username: req?.user.username,
      isMfaActive: req?.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
};
export const logout = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user" });
  }
  req.logout((err) => {
    if (err) {
      return res.status(400).json({ message: "User not logged in" });
    }
    res.status(200).json({ message: "User logged out successfully" });
  });
};
export const setup2FA = async (req, res) => {
  try {
    const user = req.user;
    var secret = speakeasy.generateSecret();
    console.log("The secret object has been created", secret);
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "MMM",
      encoding: "base32",
    });

    const qr = await qrCode.toDataURL(url);
    res.status(200).json({
      message: "Two-factor authentication set up successfully",
      qrCode: qr,
      secret: secret.base32,
    });
  } catch (error) {
    res.status(500).json({ message: "Error setting up 2FA" });
  }
};
export const verify2FA = async (req, res) => {
  const verified = speakeasy.totp.verify({
    secret: req.user.twoFactorSecret,
    encoding: "base32",
    token: req.body.token,
  });

  if (verified) {
    const jwtToken = jwt.sign(
      { username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
    res
      .status(200)
      .json({ message: "Two-factor authentication verified", token: jwtToken });
  } else {
    res.status(400).json({ message: "Invalid two-factor authentication code" });
  }
};
export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting 2FA" });
  }
};
