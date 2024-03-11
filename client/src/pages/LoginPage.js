import React, { useState, useContext } from "react";
import CustomInput from "../components/CustomInput";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3 || password.length < 6)
        throw new Error(
          "입력하신 정보가 올바르지 않습니다. LoginPage.js, loginHandler"
        );
      const result = await axios.patch("/users/login", { username, password });
      setMe({
        name: result.data.name,
        sessionId: result.data.sessionId,
        userId: result.data.userId,
      });
      toast.success("login success!! LoginPage.js");
      navigate("/");
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
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
      <h3>Login</h3>
      <form onSubmit={loginHandler}>
        <CustomInput label="username" value={username} setValue={setUsername} />
        <CustomInput
          label="password"
          type="password"
          value={password}
          setValue={setPassword}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
