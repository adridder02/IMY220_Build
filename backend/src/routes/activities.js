import express from "express";
import { activities, projects } from "../data/db.js";

const router = express.Router();

router.get("/activities", (req, res) => {
  try {
    const { scope, email, project, search, sort } = req.query;
    let filteredActivities = [...activities];

    if (scope === "local" && email) {
      filteredActivities = filteredActivities.filter(a => a.email === email);
    }

    if (project) {
      filteredActivities = filteredActivities.filter(a =>
        (a.projectName || "").toLowerCase().includes(project.toLowerCase())
      );
    }

    if (search) {
      const s = search.toLowerCase();
      filteredActivities = filteredActivities.filter(a => {
        try {
          // text matches
          const nameMatch = (a.projectName || "").toLowerCase().includes(s);
          const userMatch = (a.user || "").toLowerCase().includes(s);
          const actionMatch = (a.action || "").toLowerCase().includes(s);
          const descMatch = (a.description || "").toLowerCase().includes(s);

          // find project for type/tags
          const proj = projects.find(p => p.name === a.projectName);
          const typeMatch = proj?.type?.toLowerCase().includes(s) || false;
          const tagMatch = Array.isArray(proj?.tags)
            ? proj.tags.some(t => (t || "").toLowerCase().includes(s))
            : false;

          return nameMatch || userMatch || actionMatch || descMatch || typeMatch || tagMatch;
        } catch (err) {
          console.error("Activity search filter error:", { activity: a, search: s, err: err.message });
          return false;
        }
      });
    }

    if (sort) {
      filteredActivities.sort((a, b) => {
        if (sort === "date-desc") return new Date(b.timestamp) - new Date(a.timestamp);
        if (sort === "date-asc") return new Date(a.timestamp) - new Date(b.timestamp);
        if (sort === "name-asc") return (a.projectName || '').localeCompare(b.projectName || '');
        if (sort === "name-desc") return (b.projectName || '').localeCompare(a.projectName || '');
        return 0;
      });
    }

    res.json(filteredActivities);
  } catch (err) {
    console.error("GET /activities failed:", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

export default router;
