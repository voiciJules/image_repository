const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");

userRouter.post("/register", async (req, res) => {
  try {
    if (req.body.password.length < 6)
      throw new Error("password should be greater than 5 / userRouter");
    if (req.body.username.length < 3)
      throw new Error("username should be greater than 2 / userRouter");
    const hashedPassword = await hash(req.body.password, 10);
    console.log({ hashedPassword });
    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();
    const session = user.sessions[0]; // 회원가입 하자마자 이므로 세션이 단 하나뿐.
    res.json({
      message: "user registered / userRouter",
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      throw new Error("입력하신 정보가 옳지 않습니다. userRouter, login1 ");
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid)
      throw new Error("입력하신 정보가 옳지 않습니다. userRouter, login2");
    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions[user.sessions.length - 1];
    await user.save();
    res.json({
      message: "user validated",
      sessionId: session._id,
      name: user.name,
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/logout", async (req, res) => {
  // 로그아웃을 하기 위해서는 일단 유저를 확인해야 함.
  try {
    if (!req.user) throw new Error("invalid sessionid /logout userRouter.js");
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );
    res.json({ message: "user is logged out. /logout" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/me", (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다. userRouter /me");
    res.json({
      message: "success",
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };
