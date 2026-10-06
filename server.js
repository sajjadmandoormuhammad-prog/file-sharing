const express = require("express");
const multer = require("multer");

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Password
const USERNAME = "Malik";
const PASSWORD = "81508887";

function passwordCheck(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    res.set("WWW-Authenticate", 'Basic realm="File Share"');
    return res.status(401).send("Password required");
  }

  const encoded = auth.split(" ")[1];
  const decoded = Buffer.from(encoded, "base64").toString();
  const [username, password] = decoded.split(":");

  if (username === USERNAME && password === PASSWORD) {
    next();
  } else {
    res.set("WWW-Authenticate", 'Basic realm="File Share"');
    return res.status(401).send("Wrong username or password");
  }
}

app.use(passwordCheck);

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.send("فائل منتخب کریں");
  }

  const link = `/uploads/${req.file.filename}`;

  res.send(`
    <h2>فائل کامیابی سے Upload ہوگئی ✅</h2>
    <p>Share Link:</p>
    <a href="${link}" target="_blank">${link}</a>
    <br><br>
    <a href="/">واپس جائیں</a>
  `);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Website running on port " + PORT);
});