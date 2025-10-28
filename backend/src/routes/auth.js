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
    if (missing.length)
      return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });

    if (password !== confpassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const newUser = {
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      friends: [],
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "Registration successful",
      userId: result.insertedId, // ObjectId
    });
  });

  // LOGIN
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
      password,
    });

    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  });

  return router;
}
