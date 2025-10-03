import express from "express";

export default function projectRoutes(db) {
  const router = express.Router();
  const projectsCollection = db.collection("projects");
  const usersCollection = db.collection("users");
  const activitiesCollection = db.collection("activities");

  // GET all projects
  router.get("/", async (req, res) => {
    try {
      const { email, scope = "all", search } = req.query;
      let query = {};

      if (scope === "my" && email) query["members.email"] = email;
      if (search) query["name"] = { $regex: search, $options: "i" };

      const projects = await projectsCollection.find(query).toArray();
      res.json(projects);
    } catch (err) {
      console.error("GET /projects failed:", err);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // GET single project by numeric ID
  router.get("/:id", async (req, res) => {
    const project = await projectsCollection.findOne({ id: parseInt(req.params.id) });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  });

  // POST create project
  router.post("/", async (req, res) => {
    try {
      const { name, type, description, tags, image, files, version, members } = req.body;
      if (!name || !type || !description || !version || !members?.length)
        return res.status(400).json({ error: "Missing required fields" });

      const membersDetails = await usersCollection.find({ id: { $in: members.map(Number) } }).toArray();
      const ownerUser = membersDetails[0];

      const newProject = {
        id: Date.now(), // numeric ID
        name,
        type,
        description,
        tags: tags || [],
        image: image || "/assets/img/placeholder.png",
        files: files || [],
        version,
        owner: { id: ownerUser.id, name: `${ownerUser.firstName} ${ownerUser.lastName}` },
        members: membersDetails.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email })),
        checkedOutBy: null,
        versionHistory: [{ version, description, date: new Date().toISOString() }]
      };

      await projectsCollection.insertOne(newProject);
      await activitiesCollection.insertOne({
        actionType: "create",
        user: newProject.owner.name,
        email: ownerUser.email,
        action: "created a project",
        projectName: newProject.name,
        timestamp: new Date().toISOString(),
        description
      });

      res.status(201).json({ message: "Project created", project: newProject });
    } catch (err) {
      console.error("POST /projects failed:", err);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // POST checkout project
  router.post("/:id/checkout", async (req, res) => {
    try {
      const { email } = req.body;
      const project = await projectsCollection.findOne({ id: parseInt(req.params.id) });
      if (!project) return res.status(404).json({ error: "Project not found" });
      if (project.checkedOutBy) return res.status(400).json({ error: "Project already checked out" });

      const user = await usersCollection.findOne({ email });
      const checkoutUser = { id: user?.id || null, email, name: user ? `${user.firstName} ${user.lastName}` : email };

      await projectsCollection.updateOne({ id: project.id }, { $set: { checkedOutBy: checkoutUser } });

      await activitiesCollection.insertOne({
        actionType: "checkout",
        user: checkoutUser.name,
        email,
        action: "checked out a project",
        projectName: project.name,
        timestamp: new Date().toISOString(),
        description: `${checkoutUser.name} checked out ${project.name}`
      });

      res.json({ message: "Project checked out", project: { ...project, checkedOutBy: checkoutUser } });
    } catch (err) {
      console.error("POST /projects/:id/checkout failed:", err);
      res.status(500).json({ error: "Failed to checkout project" });
    }
  });

  // POST add member
  router.post("/:id/members", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email required" });

      const project = await projectsCollection.findOne({ id: parseInt(req.params.id) });
      if (!project) return res.status(404).json({ error: "Project not found" });

      const userToAdd = await usersCollection.findOne({ email });
      if (!userToAdd) return res.status(404).json({ error: "User not found" });

      if (project.members.some(m => m.email === email))
        return res.status(400).json({ error: "User already a member" });

      const memberObj = { id: userToAdd.id, email, name: `${userToAdd.firstName} ${userToAdd.lastName}` };
      await projectsCollection.updateOne({ id: project.id }, { $push: { members: memberObj } });

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
    } catch (err) {
      console.error("POST /projects/:id/members failed:", err);
      res.status(500).json({ error: "Failed to add member" });
    }
  });

  // DELETE project
  router.delete("/:id", async (req, res) => {
    try {
      const project = await projectsCollection.findOne({ id: parseInt(req.params.id) });
      if (!project) return res.status(404).json({ error: "Project not found" });

      await projectsCollection.deleteOne({ id: project.id });
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
    } catch (err) {
      console.error("DELETE /projects/:id failed:", err);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  return router;
}
