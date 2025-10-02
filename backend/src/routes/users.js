import express from "express";
import { ObjectId } from "mongodb";

export default function userRoutes(db) {
  const router = express.Router();
  const usersCollection = db.collection("users");

  // GET user by email
  router.get("/user", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  // GET user by ID
  router.get("/:id", async (req, res) => {
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  // GET friends
  router.get("/:id/friends", async (req, res) => {
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!user) return res.status(404).json({ error: "User not found" });
      const friendsList = await usersCollection.find({ _id: { $in: (user.friends || []).map(f => typeof f === "object" ? new ObjectId(f.id) : new ObjectId(f)) } }).toArray();
      res.json(friendsList.map(f => ({ id: f._id, firstName: f.firstName, lastName: f.lastName, email: f.email, avatar: f.avatar || null, online: false })));
    } catch {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  // Add friend
  router.post("/:id/friends", async (req, res) => {
    const { email, name, surname } = req.body;
    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    let friend;
    if (email) friend = await usersCollection.findOne({ email: email.toLowerCase() });
    else if (name && surname) friend = await usersCollection.findOne({ firstName: name, lastName: surname });
    if (!friend) return res.status(404).json({ error: "Friend not found" });

    const friendObj = { id: friend._id, firstName: friend.firstName, lastName: friend.lastName, email: friend.email, avatar: friend.avatar || null, online: false };
    await usersCollection.updateOne({ _id: user._id }, { $addToSet: { friends: friendObj } });

    res.json({ message: "Friend added", friends: [...(user.friends || []), friendObj] });
  });

  // Remove friend
  router.delete("/:id/friends/:friendId", async (req, res) => {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    await usersCollection.updateOne({ _id: user._id }, { $pull: { friends: { id: new ObjectId(req.params.friendId) } } });
    const updatedUser = await usersCollection.findOne({ _id: user._id });
    res.json({ message: "Friend removed", friends: updatedUser.friends || [] });
  });

  // Update user
  router.put("/:id", async (req, res) => {
    const update = req.body;
    const result = await usersCollection.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: update }, { returnDocument: "after" });
    if (!result.value) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile updated", user: result.value });
  });

  // Delete user
  router.delete("/:id", async (req, res) => {
    await usersCollection.updateMany({}, { $pull: { friends: { id: new ObjectId(req.params.id) } } });
    const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile deleted successfully" });
  });

  // Search users
  router.get("/", async (req, res) => {
    const { search } = req.query;
    if (!search) return res.json([]);
    const regex = new RegExp(search, "i");
    const matched = await usersCollection.find({ $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }).toArray();
    res.json(matched);
  });

  return router;
}
