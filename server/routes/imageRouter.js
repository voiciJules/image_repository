const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

imageRouter.post("/", upload.single("image"), async (req, res) => {
  // 유저 정보, public 유무 확인, 이미지 모델 업데이트(user:{_id, username, name}, public)
  try {
    if (!req.user) throw new Error("권한이 없습니다. imageRouter.js '/' ");
    const image = await new Image({
      user: {
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.public,
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/", async (req, res) => {
  // public 이미지들만 제공
  const images = await Image.find({ public: true });
  // Image.find({탐색},{수정},{옵션})
  res.json(images);
});

imageRouter.delete("/:imageId", (req, res) => {
  // 유저 권한 확인
  // 사진 삭제
});

imageRouter.patch("/:imageId/like", (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인(한 사람이 한번만)
});

imageRouter.patch("/:imageId/unlike", (req, res) => {
  // 유저 권한 확인
  // like 중복 취소 안되도록 확인(한 사람이 한번만)
});

module.exports = { imageRouter };
