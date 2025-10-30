import express from "express";
import { ObjectId } from "mongodb";

export default function authRoutes(db) {
  const router = express.Router();
  const usersCollection = db.collection("users");

  // register
  router.post("/register", async (req, res) => {
    const {
      email,
      password,
      confpassword,
      firstName,
      lastName,
      organization = "",
      about = "",
      phone = "",
      dob = "",
      country = "",
    } = req.body;

    const missing = [];
    if (!email) missing.push("email");
    if (!password) missing.push("password");
    if (!confpassword) missing.push("confpassword");
    if (!firstName) missing.push("firstName");
    if (!lastName) missing.push("lastName");
    if (missing.length)
      return res
        .status(400)
        .json({ error: `Missing fields: ${missing.join(", ")}` });

    if (password !== confpassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const avatars = [
      "/assets/img/avatarPlaceholder1.png",
      "/assets/img/avatarPlaceholder2.png",
      "/assets/img/avatarPlaceholder3.png",
    ];

    //  random avatar
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newUser = {
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      organization,
      about,
      phone,
      dob,
      country,
      avatar, 
      status: true,
      friends: [],
      friendRequests: [],

      userInfo: [
        { field: "name", value: firstName, visible: true },
        { field: "surname", value: lastName, visible: true },
        { field: "email", value: email.toLowerCase(), visible: false },
        { field: "phone", value: phone, visible: false },
        { field: "dob", value: dob, visible: false },
        { field: "country", value: country, visible: false },
        { field: "organization", value: organization, visible: false },
        { field: "about", value: about, visible: false },
      ],
    };


    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "Registration successful",
      userId: result.insertedId,
    });
  });

  // login
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
