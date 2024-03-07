import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3)
        throw new Error("회원ID가 너무 짧아요. 3자 이상으로 해주세요. ");
      if (password.length < 6)
        throw new Error("비밀번호가 너무 짧아요. 6자 이상으로 해주세요. ");
      if (password !== passwordCheck)
        throw new Error("비밀번호가 다릅니다. 확인해주세요.");
      const result = await axios.post("/users/register", {
        name,
        username,
        password,
      });
      console.log(result);
      toast.success("회원가입 성공");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>Sign up</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label="name" value={name} setValue={setName} />
        <CustomInput label="username" value={username} setValue={setUsername} />
        <CustomInput
          label="password"
          type="password"
          value={password}
          setValue={setPassword}
        />
        <CustomInput
          label="password check"
          value={passwordCheck}
          type="password"
          setValue={setPasswordCheck}
        />
        <button type="submit">sign up</button>
      </form>
    </div>
  );
};

export default RegisterPage;
