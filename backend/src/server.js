import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE APP
const app = express();

// SERVE STATIC FILES FROM frontend/public
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// SERVE INDEX.HTML FOR ALL OTHER ROUTES TO SUPPORT CLIENT-SIDE ROUTING
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public", "index.html"));
});

// PORT TO LISTEN TO
app.listen(1337, () => {
  console.log("Listening on localhost:1337");
});