const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/media", express.static(path.join(__dirname, "media")));

const mediaDir = path.join(__dirname, "media");
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

// List files
app.get("/media", (req, res) => {
  const files = fs.readdirSync(mediaDir);
  res.json(files);
});

// Download file from URL
app.post("/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, error: "No URL provided" });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch file");
    const filename = path.basename(new URL(url).pathname) || `file-${Date.now()}.mp3`;
    const dest = path.join(mediaDir, filename);

    const fileStream = fs.createWriteStream(dest);
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on("error", reject);
      fileStream.on("finish", resolve);
    });

    res.json({ success: true, filename });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Simulated upload route
app.post("/upload", (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ success: false, message: "No filename given" });
  res.json({ success: true, message: `File '${filename}' uploaded successfully (simulated).` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
