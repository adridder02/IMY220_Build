import express from "express";
import { ObjectId } from "mongodb";

export default function userRoutes(db) {
  const router = express.Router();
  const usersCollection = db.collection("users");

  // get user by email
  router.get("/user", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ ...user, id: user._id.toString() });
  });

  // get user by _id
  router.get("/:id", async (req, res) => {
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await usersCollection.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ ...user, id: user._id.toString() });
  });

  // get friends
  router.get("/:id/friends", async (req, res) => {
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await usersCollection.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const friendIds = (user.friends || [])
      .filter(f => f)            
      .map(f => {
        try { return new ObjectId(f._id || f); } catch { return null; } 
      })
      .filter(f => f !== null);  

    if (friendIds.length === 0) return res.json([]);

    const friendsList = await usersCollection
      .find({ _id: { $in: friendIds } })
      .toArray();

    const normalized = friendsList.map(f => ({
      id: f._id.toString(),
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      avatar: f.avatar || "/assets/img/placeholder.png",
      online: f.status ?? false
    }));

    res.json(normalized);
  });

  // remove friend
  router.delete("/:id/friends/:friendId", async (req, res) => {
    let userId, friendId;
    try {
      userId = new ObjectId(req.params.id);
      friendId = new ObjectId(req.params.friendId);
    } catch {
      return res.status(400).json({ error: "Invalid user ID or friend ID" });
    }

    const userUpdate = await usersCollection.updateOne(
      { _id: userId },
      { $pull: { friends: friendId } }
    );

    await usersCollection.updateOne(
      { _id: friendId },
      { $pull: { friends: userId } }
    );

    if (userUpdate.modifiedCount === 0) {
      return res.status(404).json({ error: "Friend not found in your list" });
    }

    const updatedUser = await usersCollection.findOne({ _id: userId });
    res.json({ message: "Friend removed", friends: updatedUser.friends || [] });
  });

  // update user profile with userInfo
  router.patch("/:id", async (req, res) => {
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { userInfo, avatar } = req.body;
    if (!Array.isArray(userInfo)) return res.status(400).json({ error: "userInfo array required" });

    const mainFields = {};
    userInfo.forEach(({ field, value }) => {
      if (field === "name") mainFields.firstName = value || "";
      else if (field === "surname") mainFields.lastName = value || "";
      else mainFields[field] = value || "";
    });

    const updateObj = { ...mainFields, userInfo };
    if (avatar) updateObj.avatar = avatar;

    try {
      const result = await usersCollection.updateOne(
        { _id: userId },
        { $set: updateObj }
      );

      if (result.matchedCount === 0) return res.status(404).json({ error: "User not found" });

      const updatedUser = await usersCollection.findOne({ _id: userId });
      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // delete user
  router.delete("/:id", async (req, res) => {
    let userId;
    try { userId = new ObjectId(req.params.id); }
    catch { return res.status(400).json({ error: "Invalid user ID" }); }

    await usersCollection.updateMany({}, { $pull: { friends: userId } });
    const result = await usersCollection.deleteOne({ _id: userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile deleted successfully" });
  });

  // search users
  router.get("/", async (req, res) => {
    const { search } = req.query;
    if (!search) return res.json([]);
    const regex = new RegExp(search, "i");
    const matched = await usersCollection
      .find({ $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] })
      .toArray();
    res.json(matched.map(u => ({ ...u, id: u._id.toString() })));
  });

  // friend requests
  router.post("/:id/friend-request", async (req, res) => {
    const { senderEmail } = req.body;
    if (!senderEmail) return res.status(400).json({ error: "senderEmail required" });

    let userId;
    try { userId = new ObjectId(req.params.id); }
    catch { return res.status(400).json({ error: "Invalid user ID" }); }

    const user = await usersCollection.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const sender = await usersCollection.findOne({ email: senderEmail.toLowerCase() });
    if (!sender) return res.status(404).json({ error: "Sender not found" });

    if (user._id.equals(sender._id)) return res.status(400).json({ error: "Cannot send request to yourself" });

    if (!Array.isArray(user.friendRequests)) user.friendRequests = [];

    const alreadyRequested = user.friendRequests.some(r => r.equals(sender._id));
    if (alreadyRequested) return res.status(400).json({ error: "Friend request already sent" });

    await usersCollection.updateOne(
      { _id: user._id },
      { $addToSet: { friendRequests: sender._id } }
    );

    res.json({ message: "Friend request sent" });
  });

  // accept friend request
  router.post("/:id/friend-request/:senderId/accept", async (req, res) => {
    let userId, senderId;
    try {
      userId = new ObjectId(req.params.id);
      senderId = new ObjectId(req.params.senderId);
    } catch { return res.status(400).json({ error: "Invalid user ID or sender ID" }); }

    const user = await usersCollection.findOne({ _id: userId });
    const sender = await usersCollection.findOne({ _id: senderId });
    if (!user || !sender) return res.status(404).json({ error: "User or sender not found" });

    await usersCollection.updateOne({ _id: user._id }, { $pull: { friendRequests: sender._id } });

    await usersCollection.updateOne({ _id: user._id }, { $addToSet: { friends: sender._id } });
    await usersCollection.updateOne({ _id: sender._id }, { $addToSet: { friends: user._id } });

    const updatedUser = await usersCollection.findOne({ _id: user._id });
    res.json({ message: "Friend request accepted", friends: updatedUser.friends || [] });
  });

  // reject friend request
  router.post("/:id/friend-request/:senderId/reject", async (req, res) => {
    let userId, senderId;
    try {
      userId = new ObjectId(req.params.id);
      senderId = new ObjectId(req.params.senderId);
    } catch { return res.status(400).json({ error: "Invalid user ID or sender ID" }); }

    await usersCollection.updateOne({ _id: userId }, { $pull: { friendRequests: senderId } });

    res.json({ message: "Friend request rejected" });
  });

  return router;
}
