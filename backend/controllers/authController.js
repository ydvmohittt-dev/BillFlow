import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isEmail, requireFields } from "../utils/validation.js";

function createAccessToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function createRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function setRefreshCookie(res, token) {
  res.cookie("refreshtoken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

export async function register(req, res) {
  try {
    const missing = requireFields(req.body, ["name", "email", "password"]);
    if (missing.length) return res.status(400).json({ message: `Missing: ${missing.join(", ")}` });
    if (!isEmail(req.body.email)) return res.status(400).json({ message: "Enter a valid email address" });
    if (req.body.password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const email = req.body.email.toLowerCase();
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email is already registered" });

    const password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ name: req.body.name, email, password });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({ message: "User created successfully", token: accessToken, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const email = String(req.body.email || "").toLowerCase();
    const password = req.body.password || "";
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    setRefreshCookie(res, refreshToken);
    return res.json({ message: "Login successful", token: accessToken, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function refreshToken(req, res) {
  try {
    const token = req.cookies.refreshtoken;
    if (!token) return res.status(401).json({ message: "Refresh token not found" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    setRefreshCookie(res, newRefreshToken);
    return res.json({ token: accessToken });
  } catch {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export function logout(req, res) {
  res.clearCookie("refreshtoken");
  return res.json({ message: "Logged out successfully" });
}
