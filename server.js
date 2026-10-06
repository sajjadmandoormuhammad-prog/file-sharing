const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

const uploadDir = "/tmp/uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(uploadDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file");
  res.send(`<h3>Uploaded OK ✅</h3><p><a href="/uploads/${req.file.filename}" target="_blank">${req.file.filename}</a></p><a href="/">Back</a>`);
});

module.exports = app;
