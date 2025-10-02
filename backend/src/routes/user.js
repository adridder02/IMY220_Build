import express from "express";
import { users } from "../data/db.js";

const router = express.Router();

// get user profile by email
router.get("/user", (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
});

// update user profile
router.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phone, dob, country, organization, about, email } = req.body;

    const user = users.find(u => u.id === parseInt(id));
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



// get user by ID
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
        about: user.about,
        friends: user.friends || []
    });
});

// get friends of a user
router.get("/users/:id/friends", (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return res.status(404).json({ error: "User not found" });

    const friendsList = (user.friends || []).map(f => {
        if (typeof f === "number") {
            const friendUser = users.find(u => u.id === f);
            return friendUser
                ? {
                    id: friendUser.id,
                    firstName: friendUser.firstName,
                    lastName: friendUser.lastName,
                    email: friendUser.email,
                    avatar: friendUser.avatar || null,
                    online: false,
                }
                : null;
        }
        return f;
    }).filter(Boolean);

    res.json(friendsList);
});


// add a friend
router.post("/users/:id/friends", (req, res) => {
    const { id } = req.params;
    const { email, name, surname } = req.body;

    const user = users.find(u => u.id === parseInt(id));
    if (!user) return res.status(404).json({ error: "User not found" });

    let friend;
    if (email) {
        friend = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else if (name && surname) {
        friend = users.find(
            u =>
                u.firstName.toLowerCase() === name.toLowerCase() &&
                u.lastName.toLowerCase() === surname.toLowerCase()
        );
    }

    if (!friend) return res.status(404).json({ error: "Friend not found" });

    if (!user.friends) user.friends = [];

    if (user.friends.some(f => (typeof f === "object" ? f.id : f) === friend.id)) {
        return res.status(400).json({ error: "Already friends" });
    }

    const friendObj = {
        id: friend.id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        email: friend.email,
        avatar: friend.avatar || null,
        online: false
    };

    user.friends.push(friendObj);

    res.json({ message: "Friend added", friends: user.friends });
});

// search users by name, surname, or email
router.get("/users", (req, res) => {
    const { search } = req.query;
    if (!search) return res.json([]);

    const s = search.toLowerCase();

    const matched = users.filter(
        u =>
            u.firstName.toLowerCase().includes(s) ||
            u.lastName.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s)
    );

    res.json(matched);
});

// remove a friend
router.delete("/users/:id/friends/:friendId", (req, res) => {
    const { id, friendId } = req.params;
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.friends) user.friends = [];

    user.friends = user.friends.filter(f => {
        const fid = typeof f === 'object' ? f.id : f;
        return fid !== parseInt(friendId);
    });

    const friendsList = user.friends.map(f => {
        if (typeof f === 'number') {
            const friendUser = users.find(u => u.id === f);
            return friendUser ? { ...friendUser } : null;
        }
        return f;
    }).filter(Boolean);

    res.json({ message: "Friend removed", friends: friendsList });
});

// delete user by ID
router.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });

    users.forEach(u => {
        if (u.friends) {
            u.friends = u.friends.filter(f => {
                const fid = typeof f === "object" ? f.id : f;
                return fid !== parseInt(id);
            });
        }
    });

    users.splice(userIndex, 1);
    res.json({ message: "Profile deleted successfully" });
});


export default router;
