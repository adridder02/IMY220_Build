import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import activityRoutes from "./routes/activities.js";
import userRoutes from "./routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend/public")));


// routes
app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", activityRoutes);
app.use("/api", userRoutes);


// for all routes
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public", "index.html"));
});

app.listen(8080, () => {
  console.log("Listening on localhost");
});