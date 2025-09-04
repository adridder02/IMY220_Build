import express from "express";
import { projects, users, activities } from "../data/db.js";

const router = express.Router();

// get projects endpoint
router.get("/projects", (req, res) => {
  const { email, scope = "all" } = req.query;
  if (scope === "my" && email) {
    const userProjects = projects.filter((p) =>
      p.members.some((m) => m.email === email)
    );
    return res.json(userProjects);
  }
  res.json(projects);
});

// create project endpoint
router.post("/projects", (req, res) => {
  const { name, type, description, tags, image, files, version, members } = req.body;

  if (!name || !type || !description || !version || !members) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newProject = {
    id: projects.length + 1,
    name,
    type,
    description,
    tags: tags || [],
    image: image || "assets/img/placeholder.png",
    files: files || [],
    version,
    members: members.map((email) => {
      const user = users.find((u) => u.email === email);
      return { email, name: user ? user.name : email.split("@")[0] };
    }),
    versionHistory: [
      { version, date: new Date().toLocaleDateString(), modifiedBy: members[0] },
    ],
  };

  projects.push(newProject);
  activities.push({
    id: activities.length + 1,
    type: "ActivityType2",
    user: newProject.members[0].name,
    email: newProject.members[0].email,
    action: "created a project",
    projectName: name,
    timestamp: new Date().toLocaleString(),
    description: description,
    cardTitle: name,
    cardDescription: description.slice(0, 100),
  });

  res.status(201).json({ message: "Project created", project: newProject });
});

export default router;