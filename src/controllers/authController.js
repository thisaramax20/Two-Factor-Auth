import bcrypt from "bcrypt";
import User from "../models/user.js";

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
export const setup2FA = async () => {};
export const verify2FA = async () => {};
export const reset2FA = async () => {};
