import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import activityRoutes from "./routes/activities.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// routes
app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", activityRoutes);

// for all routes
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public", "index.html"));
});

app.listen(8080, () => {
  console.log("Listening on localhost");
});