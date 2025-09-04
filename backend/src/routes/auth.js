import express from "express";
import { users } from "../data/db.js";

const router = express.Router();

// register endpoint
router.post("/register", (req, res) => {
  const { email, password, confpassword, name } = req.body;

  // check for missing fields
  const missingFields = [];
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!confpassword) missingFields.push("confpassword");
  if (!name) missingFields.push("name");
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  if (password !== confpassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  users.push({ email, password, name });
  res.status(201).json({ message: "Registration successful" });
});

// login endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: `Missing required fields: ${!email ? "email" : ""}${!email && !password ? ", " : ""}${!password ? "password" : ""}` });
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ message: "Login successful", user: { email, name: user.name } });
});

export default router;
