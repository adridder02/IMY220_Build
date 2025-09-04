import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import activityRoutes from "./routes/activities.js";


// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE APP
const app = express();

// SERVE STATIC FILES FROM frontend/public
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Routes
app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", activityRoutes);

// SERVE INDEX.HTML FOR ALL OTHER ROUTES TO SUPPORT CLIENT-SIDE ROUTING
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public", "index.html"));
});

// PORT TO LISTEN TO
app.listen(8080, () => {
  console.log("Listening on localhost:1337");
});