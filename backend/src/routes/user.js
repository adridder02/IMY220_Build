import express from "express";
import { users } from "../data/db.js";

const router = express.Router();

// get user profile
router.get("/user", (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
});

// update user profile
router.put("/user", (req, res) => {
    const { email, firstName, lastName, phone, dob, country, organization, about } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: "User not found" });

    // update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (dob !== undefined) user.dob = dob;
    if (country !== undefined) user.country = country;
    if (organization !== undefined) user.organization = organization;
    if (about !== undefined) user.about = about;

    res.json({ message: "Profile updated", user });
});

router.get("/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
        id: user.id,
        name: user.firstName,
        surname: user.lastName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        country: user.country,
        organization: user.organization,
        about: user.about
    });
});

export default router;
