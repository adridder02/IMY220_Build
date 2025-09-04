import express from "express";
import { activities } from "../data/db.js";

const router = express.Router();

// get activities endpoint
router.get("/activities", (req, res) => {
  const { scope, email, project, search, sort } = req.query;
  let filteredActivities = [...activities];

  if (scope === "local" && email) {
    filteredActivities = filteredActivities.filter((activity) =>
      activity.email === email
    );
  }

  if (project) {
    filteredActivities = filteredActivities.filter((activity) =>
      activity.projectName.toLowerCase().includes(project.toLowerCase())
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredActivities = filteredActivities.filter((activity) =>
      (activity.projectName && activity.projectName.toLowerCase().includes(searchLower)) ||
      (activity.user && activity.user.toLowerCase().includes(searchLower)) ||
      (activity.action && activity.action.toLowerCase().includes(searchLower)) ||
      (activity.description && activity.description.toLowerCase().includes(searchLower))
    );
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
});

export default router;