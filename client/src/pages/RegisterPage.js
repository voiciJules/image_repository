import React, { useState } from "react";
import CustomInput from "../components/CustomInput";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
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
      <form>
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
      </form>
    </div>
  );
};

export default RegisterPage;
