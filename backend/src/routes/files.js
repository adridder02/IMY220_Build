import express from "express";

const router = express.Router();

// simulate single image upload
router.post("/projects/upload-image", (req, res) => {
    const fakeFilename = `image_${Date.now()}.png`;
    res.json({ filename: fakeFilename, path: `/uploads/${fakeFilename}` });
});

// simulate multiple files upload
router.post("/projects/upload-files", (req, res) => {
    const files = [];
    const numFiles = 2; 
    for (let i = 0; i < numFiles; i++) {
        const fakeName = `file_${Date.now()}_${i}.txt`;
        files.push({ filename: fakeName, path: `/uploads/${fakeName}` });
    }
    res.json({ files });
});


// simulate downloading 
router.get("/projects/download-multiple/:projectId", (req, res) => {
    const { projectId } = req.params;
    const fakeContent = `Simulated files for project ${projectId}:\n- file1.txt\n- file2.js\n- readme.md`;
    
    res.setHeader("Content-Disposition", `attachment; filename="project_${projectId}_files.txt"`);
    res.setHeader("Content-Type", "text/plain");
    res.send(fakeContent);
});

export default router;
