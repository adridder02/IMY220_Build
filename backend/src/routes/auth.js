import express from "express";
import { ObjectId } from "mongodb";

export default function authRoutes(db) {
  const router = express.Router();
  const usersCollection = db.collection("users");

  // REGISTER
  router.post("/register", async (req, res) => {
    const { email, password, confpassword, firstName, lastName } = req.body;
    const missing = [];
    if (!email) missing.push("email");
    if (!password) missing.push("password");
    if (!confpassword) missing.push("confpassword");
    if (!firstName) missing.push("firstName");
    if (!lastName) missing.push("lastName");
    if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });

    if (password !== confpassword) return res.status(400).json({ error: "Passwords do not match" });
    if (await usersCollection.findOne({ email: email.toLowerCase() })) return res.status(400).json({ error: "Email already registered" });

    const result = await usersCollection.insertOne({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      friends: [],
    });

    res.status(201).json({ message: "Registration successful", userId: result.insertedId });
  });

  // LOGIN
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await usersCollection.findOne({ email: email.toLowerCase(), password });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  });

  return router;
}
