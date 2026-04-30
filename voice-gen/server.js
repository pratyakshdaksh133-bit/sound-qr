const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.static("public"));

// 👉 audio folder check
if (!fs.existsSync("audio")) {
  fs.mkdirSync("audio");
}

// 👉 static audio access
app.use("/audio", express.static("audio"));

// 👉 storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "audio/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".webm");
  }
});

const upload = multer({ storage });

// 👉 upload route
app.post("/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const url = `${req.protocol}://${req.get("host")}/audio/${req.file.filename}`;
  res.json({ url });
});

// 👉 server start
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log("🚀 Server Running on port " + PORT);
});