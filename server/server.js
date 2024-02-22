require("dotenv").config();
const express = require("express");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");
const mongoose = require("mongoose");
const Image = require("./models/Image");
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

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDB Connected!");
    app.use("/upload", express.static("uploads"));
    app.get("/images", async (req, res) => {
      const images = await Image.find();
      res.json(images);
    });
    app.post("/images", upload.single("image"), async (req, res) => {
      const image = await new Image({
        key: req.file.filename,
        originalFileName: req.file.originalname,
      }).save();
      res.json(image);
    });
    app.listen(port, () => console.log(`app listening on port ${port}`));
  })
  .catch((err) => console.log(err));
