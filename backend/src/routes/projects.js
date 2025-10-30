import express from "express";
import { ObjectId } from "mongodb";

export default function projectRoutes(db) {
  const router = express.Router();
  const projectsCollection = db.collection("projects");
  const usersCollection = db.collection("users");
  const activitiesCollection = db.collection("activities");

  // Helper function to create activity
  const createActivity = async (actionType, userName, email, projectName, description) => {
    let verb;
    switch (actionType) {
      case "create": verb = "created"; break;
      case "delete": verb = "deleted"; break;
      case "checkin": verb = "checked in"; break;
      case "checkout": verb = "checked out"; break;
      case "join": verb = "joined"; break;
      case "comment": verb = "commented on"; break;
      case "update": verb = "edited"; break;
      case "promote": verb = "promoted to owner of"; break;
      default: verb = "performed an action on";
    }

    await activitiesCollection.insertOne({
      actionType,
      user: userName,
      email,
      action: `${verb} a project`,
      projectName,
      timestamp: new Date().toISOString(),
      description,
    });
  };

  // GET all projects
  router.get("/", async (req, res) => {
    try {
      const { email, scope = "all", search } = req.query;
      const query = {};

      if (scope === "my" && email) query["members.email"] = email;
      if (search) query["name"] = { $regex: search, $options: "i" };

      const projects = await projectsCollection.find(query).toArray();
      res.json(projects);
    } catch (err) {
      console.error("GET /projects failed:", err);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // GET single project by MongoDB ObjectId
  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (err) {
      console.error("GET /projects/:id failed:", err);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // POST create project
  router.post("/", async (req, res) => {
    try {
      const { name, type, description, tags, image, files, version, members } = req.body;
      if (!name || !type || !description || !version || !members?.length)
        return res.status(400).json({ error: "Missing required fields" });

      const membersDetails = await usersCollection.find({ email: { $in: members } }).toArray();
      if (!membersDetails.length) return res.status(400).json({ error: "Members not found" });

      const ownerUser = membersDetails[0];
      const userName = `${ownerUser.firstName} ${ownerUser.lastName}`;

      const newProject = {
        name,
        type,
        description,
        tags: tags || [],
        image: image || "/assets/img/placeholder.png",
        files: files || [],
        version,
        owner: { _id: ownerUser._id, name: userName, email: ownerUser.email },
        members: membersDetails.map(u => ({
          _id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
        })),
        checkedOutBy: null,
        versionHistory: [{ version, description, date: new Date().toISOString() }],
      };

      const result = await projectsCollection.insertOne(newProject);

      await createActivity(
        "create",
        userName,
        ownerUser.email,
        newProject.name,
        `${userName} created ${newProject.name}`
      );

      res.status(201).json({ message: "Project created", project: { ...newProject, _id: result.insertedId } });
    } catch (err) {
      console.error("POST /projects failed:", err);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // POST checkout project
  router.post("/:id/checkout", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid project ID" });
      const { email } = req.body;
      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
      if (!project) return res.status(404).json({ error: "Project not found" });
      if (project.checkedOutBy) return res.status(400).json({ error: "Project already checked out" });

      const user = await usersCollection.findOne({ email });
      const userName = user ? `${user.firstName} ${user.lastName}` : email;
      const checkoutUser = { _id: user?._id || null, email, name: userName };

      await projectsCollection.updateOne(
        { _id: project._id },
        { $set: { checkedOutBy: checkoutUser } }
      );

      await createActivity(
        "checkout",
        userName,
        email,
        project.name,
        `${userName} checked out ${project.name}`
      );

      res.json({ message: "Project checked out", project: { ...project, checkedOutBy: checkoutUser } });
    } catch (err) {
      console.error("POST /projects/:id/checkout failed:", err);
      res.status(500).json({ error: "Failed to checkout project" });
    }
  });

  // POST check-in project
  router.post("/:id/checkin", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id))
        return res.status(400).json({ error: "Invalid project ID" });

      const { userEmail, description, version, files } = req.body;
      if (!userEmail || !description)
        return res
          .status(400)
          .json({ error: "User email and description are required" });

      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
      if (!project) return res.status(404).json({ error: "Project not found" });

      if (!project.checkedOutBy || project.checkedOutBy.email !== userEmail) {
        return res
          .status(403)
          .json({ error: "Project not checked out by this user" });
      }

      const user = await usersCollection.findOne({ email: userEmail });
      const userName = user ? `${user.firstName} ${user.lastName}` : userEmail;

      // Determine new version
      let newVersion = version || project.version;
      if (newVersion === project.version) {
        const versionParts = newVersion.split('.').map(Number);
        versionParts[2] += 1; // increment patch
        newVersion = versionParts.join('.');
      }

      // Filter out duplicate files
      const existingFiles = project.files || [];
      const newFiles = (files || []).filter(
        (f) => !existingFiles.some((existing) => existing.path === f.path)
      );
      const updatedFiles = [...existingFiles, ...newFiles];

      const updatedProject = {
        ...project,
        files: updatedFiles,
        version: newVersion,
        checkedOutBy: null,
        versionHistory: [
          {
            version: newVersion,
            description: description || "Checked in project",
            date: new Date().toISOString(),
            modifiedBy: userName,
          },
          ...(project.versionHistory || []),
        ],
      };

      await projectsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedProject }
      );

      await createActivity(
        "checkin",
        userName,
        userEmail,
        project.name,
        description
      );

      res.json({ message: "Project checked in", project: updatedProject });
    } catch (err) {
      console.error("POST /projects/:id/checkin failed:", err);
      res.status(500).json({ error: "Failed to check in project" });
    }
  });


  // POST add member (join)
  router.post("/:id/members", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid project ID" });
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email required" });

      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
      if (!project) return res.status(404).json({ error: "Project not found" });

      const userToAdd = await usersCollection.findOne({ email });
      if (!userToAdd) return res.status(404).json({ error: "User not found" });

      if (project.members.some(m => m.email === email))
        return res.status(400).json({ error: "User already a member" });

      const userName = `${userToAdd.firstName} ${userToAdd.lastName}`;
      const memberObj = { _id: userToAdd._id, email, name: userName };

      await projectsCollection.updateOne(
        { _id: project._id },
        { $push: { members: memberObj } }
      );

      await createActivity(
        "join",
        userName,
        email,
        project.name,
        `${userName} joined ${project.name} as a project member`
      );

      res.json({ message: "Member added", project: { ...project, members: [...project.members, memberObj] } });
    } catch (err) {
      console.error("POST /projects/:id/members failed:", err);
      res.status(500).json({ error: "Failed to add member" });
    }
  });

  // PUT update project
  router.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id))
        return res.status(400).json({ error: "Invalid project ID" });

      const { name, type, description, tags, image, files, version, members } = req.body;

      // Validate required fields
      if (!name || !type || !description || !version || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Fetch all users in the exact order of the incoming emails
      const membersDetails = await usersCollection
        .find({ email: { $in: members } })
        .toArray();

      if (membersDetails.length !== members.length) {
        return res.status(400).json({ error: "One or more members not found" });
      }

      // Re-order user docs to match the incoming email order
      const orderedMembers = members.map(email =>
        membersDetails.find(u => u.email === email)
      );

      const ownerUser = orderedMembers[0];
      const ownerName = `${ownerUser.firstName} ${ownerUser.lastName}`;

      // Build updated project
      const updatedProject = {
        name,
        type,
        description,
        tags: tags || [],
        image: image || "/assets/img/placeholder.png",
        files: files || [],
        version,
        owner: {
          _id: ownerUser._id,
          name: ownerName,
          email: ownerUser.email,
        },
        members: orderedMembers.map(u => ({
          _id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
        })),
        checkedOutBy: null,
        versionHistory: [
          {
            version,
            description: `Updated project (version ${version})`,
            date: new Date().toISOString(),
            modifiedBy: ownerName,
          },
          // Prepend to existing history
          ...(await projectsCollection
            .findOne({ _id: new ObjectId(id) })
            .then(p => p?.versionHistory || [])),
        ],
      };

      const result = await projectsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedProject }
      );

      if (result.matchedCount === 0)
        return res.status(404).json({ error: "Project not found" });

      // Activity: detect if owner changed
      const oldProject = await projectsCollection.findOne({ _id: new ObjectId(id) });
      const ownerChanged = oldProject.owner.email !== ownerUser.email;

      await createActivity(
        "update",
        ownerName,
        ownerUser.email,
        updatedProject.name,
        ownerChanged
          ? `${ownerName} updated ${updatedProject.name} and was promoted to owner`
          : `${ownerName} updated ${updatedProject.name}`
      );

      res.json({
        message: "Project updated",
        project: { ...updatedProject, _id: id },
      });
    } catch (err) {
      console.error("PUT /projects/:id failed:", err);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // DELETE project
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid project ID" });

      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
      if (!project) return res.status(404).json({ error: "Project not found" });

      const user = await usersCollection.findOne({ email: project.owner.email });
      const userName = user ? `${user.firstName} ${user.lastName}` : project.owner.email;

      await projectsCollection.deleteOne({ _id: project._id });

      await createActivity(
        "delete",
        userName,
        project.owner.email,
        project.name,
        `${userName} deleted ${project.name}`
      );

      res.json({ message: "Project deleted" });
    } catch (err) {
      console.error("DELETE /projects/:id failed:", err);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // POST comment on project
  router.post("/:id/comments", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid project ID" });
      const { email, comment } = req.body;
      if (!email || !comment) return res.status(400).json({ error: "Email and comment required" });

      const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
      if (!project) return res.status(404).json({ error: "Project not found" });

      const user = await usersCollection.findOne({ email });
      const userName = user ? `${user.firstName} ${user.lastName}` : email;

      await createActivity(
        "comment",
        userName,
        email,
        project.name,
        `${userName} commented on ${project.name}: ${comment}`
      );

      res.json({ message: "Comment added" });
    } catch (err) {
      console.error("POST /projects/:id/comments failed:", err);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  return router;
}