import express from "express";

export default function activityRoutes(db) {
  const router = express.Router();
  const activitiesCollection = db.collection("activities");

  // GET all activities
  router.get("/", async (req, res) => {
    try {
      const { scope, email, project, search, sort } = req.query;
      const query = {};

      if (scope === "local" && email) query.email = email;
      if (project) query.projectName = { $regex: project, $options: "i" };
      if (search) {
        const regex = new RegExp(search, "i");
        query.$or = [
          { projectName: regex },
          { user: regex },
          { action: regex },
          { description: regex },
        ];
      }

      // Fetch activities
      let activities = await activitiesCollection.find(query).toArray();

      // Fetch corresponding projects
      const projectNames = [...new Set(activities.map(a => a.projectName).filter(Boolean))];
      const projects = await db.collection("projects")
        .find({ name: { $in: projectNames } })
        .toArray();

      const projectMap = {};
      projects.forEach(p => {
        projectMap[p.name] = p;
      });

      // Add project description to activities
      activities = activities.map(a => ({
        ...a,
        id: a._id.toString(),
        projectDescription: projectMap[a.projectName]?.description || a.description
      }));

      // Sorting
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
