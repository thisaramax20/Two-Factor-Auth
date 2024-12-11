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
export const login = async () => {};
export const authState = async () => {};
export const logout = async () => {};
export const setup2FA = async () => {};
export const verify2FA = async () => {};
export const reset2FA = async () => {};
