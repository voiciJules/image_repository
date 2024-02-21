const express = require("express");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("It's not an image file"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const app = express();
const port = 5000;

app.use("/upload", express.static("uploads"));
app.get("/", (req, res) => {
  res.json("Hi this is image repo!!");
});

app.post("/upload", upload.single("image"), (req, res) => {
  res.json(req.file);
  console.log(req.file);
});

app.listen(port, () => console.log(`app listening on port ${port}`));
