import express from "express";

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

  // GET user by numeric ID
  router.get("/:id", async (req, res) => {
    const user = await usersCollection.findOne({ id: parseInt(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  // GET friends
  router.get("/:id/friends", async (req, res) => {
    const user = await usersCollection.findOne({ id: parseInt(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    const friendsList = await usersCollection
      .find({ id: { $in: (user.friends || []).map(f => f.id) } })
      .toArray();

    res.json(
      friendsList.map(f => ({
        id: f.id,
        firstName: f.firstName,
        lastName: f.lastName,
        email: f.email,
        avatar: f.avatar || null,
        online: false
      }))
    );
  });

  // Add friend
  router.post("/:id/friends", async (req, res) => {
    const { email, name, surname } = req.body;
    const user = await usersCollection.findOne({ id: parseInt(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    let friend;
    if (email) friend = await usersCollection.findOne({ email: email.toLowerCase() });
    else if (name && surname)
      friend = await usersCollection.findOne({ firstName: name, lastName: surname });

    if (!friend) return res.status(404).json({ error: "Friend not found" });

    const friendObj = {
      id: friend.id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      email: friend.email,
      avatar: friend.avatar || null,
      online: false
    };

    await usersCollection.updateOne({ id: user.id }, { $addToSet: { friends: friendObj } });

    res.json({ message: "Friend added", friends: [...(user.friends || []), friendObj] });
  });

  // Remove friend
  router.delete("/:id/friends/:friendId", async (req, res) => {
    const user = await usersCollection.findOne({ id: parseInt(req.params.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    await usersCollection.updateOne(
      { id: user.id },
      { $pull: { friends: { id: parseInt(req.params.friendId) } } }
    );

    const updatedUser = await usersCollection.findOne({ id: user.id });
    res.json({ message: "Friend removed", friends: updatedUser.friends || [] });
  });

  // Update user
  router.put("/:id", async (req, res) => {
    const update = req.body;
    const result = await usersCollection.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { $set: update },
      { returnDocument: "after" }
    );
    if (!result.value) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile updated", user: result.value });
  });

  // Delete user
  router.delete("/:id", async (req, res) => {
    await usersCollection.updateMany({}, { $pull: { friends: { id: parseInt(req.params.id) } } });
    const result = await usersCollection.deleteOne({ id: parseInt(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile deleted successfully" });
  });

  // Search users
  router.get("/", async (req, res) => {
    const { search } = req.query;
    if (!search) return res.json([]);
    const regex = new RegExp(search, "i");
    const matched = await usersCollection
      .find({ $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] })
      .toArray();
    res.json(matched);
  });

  return router;
}
