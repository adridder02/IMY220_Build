import express from "express";

export default function activityRoutes(db) {
  const router = express.Router();
  const activitiesCollection = db.collection("activities");
  const projectsCollection = db.collection("projects");

  router.get("/", async (req, res) => {
    try {
      const { scope, email, project, search, sort } = req.query;
      let query = {};

      if (scope === "local" && email) query.email = email;
      if (project) query.projectName = { $regex: project, $options: "i" };
      if (search) {
        const regex = new RegExp(search, "i");
        query.$or = [
          { projectName: regex },
          { user: regex },
          { action: regex },
          { description: regex }
        ];
      }

      let activities = await activitiesCollection.find(query).toArray();

      // sort
      if (sort) {
        if (sort === "date-desc") activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (sort === "date-asc") activities.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        if (sort === "name-asc") activities.sort((a, b) => (a.projectName || '').localeCompare(b.projectName || ''));
        if (sort === "name-desc") activities.sort((a, b) => (b.projectName || '').localeCompare(a.projectName || ''));
      }

      res.json(activities);
    } catch (err) {
      console.error("GET /activities failed:", err);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  return router;
}
