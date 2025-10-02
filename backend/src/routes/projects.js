import express from "express";
import { projects, users, activities } from "../data/db.js";

const router = express.Router();

// get projects endpoint
router.get("/projects", (req, res) => {
  const { email, scope = "all", search } = req.query;

  let filteredProjects = projects;

  if (scope === "my" && email) {
    filteredProjects = filteredProjects.filter(p =>
      p.members.some(m => m.email === email)
    );
  }

  if (search) {
    const s = search.toLowerCase();
    filteredProjects = filteredProjects.filter(p =>
      p.name.toLowerCase().includes(s)
    );
  }

  res.json(filteredProjects);
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
    owner: (() => {
      const user = users.find((u) => u.email === members[0]);
      return { email: members[0], name: user ? `${user.firstName} ${user.lastName}` : members[0].split("@")[0] };
    })(),
    members: members.map((email) => {
      const user = users.find((u) => u.email === email);
      return { email, name: user ? `${user.firstName} ${user.lastName}` : email.split("@")[0] };
    }),
    checkedOutBy: null,
    versionHistory: [
      { version, date: new Date().toLocaleDateString(), modifiedBy: members[0] },
    ],
  };

  projects.push(newProject);
  activities.push({
    id: activities.length + 1,
    actionType: "create",
    user: newProject.owner.name,
    email: newProject.owner.email,
    action: "created a project",
    projectName: name,
    timestamp: new Date().toLocaleString(),
    description: description,
  });

  res.status(201).json({ message: "Project created", project: newProject });
});

// check out a project
router.post("/projects/:id/checkout", (req, res) => {
  const { email } = req.body;
  const project = projects.find((p) => p.id === parseInt(req.params.id));

  if (!project) return res.status(404).json({ error: "Project not found" });
  if (project.checkedOutBy) return res.status(400).json({ error: "Project already checked out" });

  const user = users.find((u) => u.email === email);
  project.checkedOutBy = { email, name: user ? `${user.firstName} ${user.lastName}` : email };

  activities.push({
    id: activities.length + 1,
    actionType: "checkout",
    user: project.checkedOutBy.name,
    email: project.checkedOutBy.email,
    action: "checked out a project",
    projectName: project.name,
    timestamp: new Date().toLocaleString(),
    description: `${project.checkedOutBy.name} checked out ${project.name}`,
  });

  res.json({ message: "Project checked out", project });
});

// delete project
router.delete("/projects/:id", (req, res) => {
  const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (projectIndex === -1) return res.status(404).json({ error: "Project not found" });

  const project = projects[projectIndex];
  const ownerEmail = project.owner.email;

  projects.splice(projectIndex, 1);

  activities.push({
    id: activities.length + 1,
    actionType: "delete",
    user: project.owner.name,
    email: ownerEmail,
    action: "deleted a project",
    projectName: project.name,
    timestamp: new Date().toLocaleString(),
    description: `${project.owner.name} deleted ${project.name}`,
  });

  res.json({ message: "Project deleted" });
});

// get single project by id
router.get("/projects/:id", (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// add member to a project
router.post("/projects/:id/members", (req, res) => {
  const { email } = req.body; 
  const project = projects.find(p => p.id === parseInt(req.params.id));

  if (!project) return res.status(404).json({ error: "Project not found" });
  if (!email) return res.status(400).json({ error: "Email required" });

  const userToAdd = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!userToAdd) return res.status(404).json({ error: "User not found" });

  // anti duplicates
  if (project.members.some(m => m.email === userToAdd.email)) {
    return res.status(400).json({ error: "User already a member" });
  }

  // add to project members
  project.members.push({
    email: userToAdd.email,
    name: `${userToAdd.firstName} ${userToAdd.lastName}`,
  });

  // log activity
  activities.push({
    id: activities.length + 1,
    actionType: "add-member",
    user: userToAdd.firstName + " " + userToAdd.lastName,
    email: userToAdd.email,
    action: "added to project",
    projectName: project.name,
    timestamp: new Date().toLocaleString(),
    description: `${userToAdd.firstName} ${userToAdd.lastName} added to ${project.name}`,
  });

  res.json({ message: "Member added", project });
});


export default router;