import express from "express";
import { ObjectId } from "mongodb";

export default function projectRoutes(db) {
  const router = express.Router();
  const projectsCollection = db.collection("projects");
  const usersCollection = db.collection("users");
  const activitiesCollection = db.collection("activities");

  // GET projects
  router.get("/", async (req, res) => {
    const { email, scope = "all", search } = req.query;
    let query = {};
    if (scope === "my" && email) query["members.email"] = email;
    if (search) query["name"] = { $regex: search, $options: "i" };
    const projects = await projectsCollection.find(query).toArray();
    res.json(projects);
  });

  // GET single project
  router.get("/:id", async (req, res) => {
    try {
      const project = await projectsCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch {
      res.status(400).json({ error: "Invalid project ID" });
    }
  });

  // POST create project
  router.post("/", async (req, res) => {
    const { name, type, description, tags, image, files, version, members } = req.body;
    if (!name || !type || !description || !version || !members?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const membersDetails = await usersCollection.find({ email: { $in: members } }).toArray();
    const ownerUser = membersDetails[0];
    const projectDoc = {
      name,
      type,
      description,
      tags: tags || [],
      image: image || "/assets/img/placeholder.png",
      files: files || [],
      version,
      owner: { email: ownerUser.email, name: `${ownerUser.firstName} ${ownerUser.lastName}` },
      members: membersDetails.map(u => ({ email: u.email, name: `${u.firstName} ${u.lastName}` })),
      checkedOutBy: null,
      versionHistory: [{ version, description, date: new Date().toISOString() }]
    };

    const result = await projectsCollection.insertOne(projectDoc);

    await activitiesCollection.insertOne({
      actionType: "create",
      user: projectDoc.owner.name,
      email: projectDoc.owner.email,
      action: "created a project",
      projectName: name,
      timestamp: new Date().toISOString(),
      description
    });

    res.status(201).json({ message: "Project created", project: { ...projectDoc, _id: result.insertedId } });
  });

  // POST checkout project
  router.post("/:id/checkout", async (req, res) => {
    const { email } = req.body;
    const project = await projectsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.checkedOutBy) return res.status(400).json({ error: "Project already checked out" });

    const user = await usersCollection.findOne({ email });
    const checkoutUser = { email, name: user ? `${user.firstName} ${user.lastName}` : email };

    await projectsCollection.updateOne({ _id: project._id }, { $set: { checkedOutBy: checkoutUser } });
    await activitiesCollection.insertOne({
      actionType: "checkout",
      user: checkoutUser.name,
      email: checkoutUser.email,
      action: "checked out a project",
      projectName: project.name,
      timestamp: new Date().toISOString(),
      description: `${checkoutUser.name} checked out ${project.name}`
    });

    res.json({ message: "Project checked out", project: { ...project, checkedOutBy: checkoutUser } });
  });

  // POST add member
  router.post("/:id/members", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const project = await projectsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const userToAdd = await usersCollection.findOne({ email });
    if (!userToAdd) return res.status(404).json({ error: "User not found" });

    if (project.members.some(m => m.email === email)) return res.status(400).json({ error: "User already a member" });

    const memberObj = { email, name: `${userToAdd.firstName} ${userToAdd.lastName}` };
    await projectsCollection.updateOne({ _id: project._id }, { $push: { members: memberObj } });

    await activitiesCollection.insertOne({
      actionType: "add-member",
      user: memberObj.name,
      email,
      action: "added to project",
      projectName: project.name,
      timestamp: new Date().toISOString(),
      description: `${memberObj.name} added to ${project.name}`
    });

    res.json({ message: "Member added", project: { ...project, members: [...project.members, memberObj] } });
  });

  // DELETE project
  router.delete("/:id", async (req, res) => {
    const project = await projectsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!project) return res.status(404).json({ error: "Project not found" });

    await projectsCollection.deleteOne({ _id: project._id });
    await activitiesCollection.insertOne({
      actionType: "delete",
      user: project.owner.name,
      email: project.owner.email,
      action: "deleted a project",
      projectName: project.name,
      timestamp: new Date().toISOString(),
      description: `${project.owner.name} deleted ${project.name}`
    });

    res.json({ message: "Project deleted" });
  });

  return router;
}
