import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import archiver from "archiver";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (req.path === '/upload-avatar' || req.body.type === 'avatar') {
            const dir = path.join(__dirname, "../../../frontend/public/assets/uploads/avatars");
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        }
        else if (req.path === '/projects/upload-image') {
            const dir = path.join(__dirname, "../../../frontend/public/assets/uploads/images");
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        }
        else if (req.path === '/projects/upload-files') {
            const dir = path.join(__dirname, "../../../frontend/public/assets/uploads/files");
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        }
        else {
            cb(new Error("Unknown upload type"));
        }
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const prefix = req.path === '/upload-avatar' ? 'avatar' : 'file';
        const name = `${prefix}_${Date.now()}${ext}`;
        cb(null, name);
    }
});

const upload = multer({ storage });

// avatar upload
router.post("/upload-avatar", upload.single("avatar"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const url = `/assets/uploads/avatars/${req.file.filename}`;
    res.json({ url });
});

// project image upload
router.post("/projects/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const url = `/assets/uploads/images/${req.file.filename}`;
    res.json({ path: url });
});

// project files upload
router.post("/projects/upload-files", upload.array("files", 10), (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files" });
    const filesInfo = req.files.map(f => ({
        name: f.originalname,
        path: `/assets/uploads/files/${f.filename}`
    }));
    res.json({ files: filesInfo });
});

// create blank file
router.post("/projects/create-blank-file", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    const dir = path.join(__dirname, "../../../frontend/public/assets/uploads/files");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const ext = path.extname(name) || '.txt';
    const filename = `blank_${Date.now()}${ext}`;
    const filePath = path.join(dir, filename);

    fs.writeFile(filePath, '', err => {
        if (err) return res.status(500).json({ error: "Failed to create file" });
        res.json({ name, path: `/assets/uploads/files/${filename}` });
    });
});

// get project file
router.get("/files/content/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../../frontend/public/assets/uploads/files", filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read file" });
        res.json({ content: data });
    });
});

// download multiple project files as zip
router.get("/projects/download-multiple/:projectId", (req, res) => {
    const { projectId } = req.params;
    const projectDir = path.join(__dirname, "../../../frontend/public/assets/uploads/files");

    if (!fs.existsSync(projectDir)) {
        return res.status(404).send("Project files not found");
    }

    res.setHeader("Content-Disposition", `attachment; filename=project_${projectId}.zip`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", err => res.status(500).send({ error: err.message }));

    archive.pipe(res);

    // add all files in the project folder to zip
    fs.readdirSync(projectDir).forEach(file => {
        const filePath = path.join(projectDir, file);
        archive.file(filePath, { name: file });
    });

    archive.finalize();
});

export default router;