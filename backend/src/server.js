import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, ServerApiVersion } from "mongodb";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import activityRoutes from "./routes/activities.js";
import fileRoutes from "./routes/files.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// database connection
const uri = "mongodb+srv://test-user:test-password@imy220.hywxd3y.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
  
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("IMY220_Project"); 

    app.use("/api/auth", authRoutes(db));
    app.use("/api/users", userRoutes(db));
    app.use("/api/projects", projectRoutes(db));
    app.use("/api/activities", activityRoutes(db));
    app.use("/api/files", fileRoutes(db)); 

    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "../../frontend/public", "index.html"));
    });

    app.listen(8080, () => {
      console.log("Server running at http://localhost:8080");
    });

  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

startServer();
