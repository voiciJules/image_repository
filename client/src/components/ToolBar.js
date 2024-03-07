import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  return (
    <div>
      <Link to="/">
        <span>Home</span>
      </Link>
      {me ? (
        <span style={{ float: "right" }}>log out</span>
      ) : (
        <>
          <Link to="/auth/login">
            <span style={{ float: "right" }}>Login</span>
          </Link>
          <Link to="/auth/register">
            <span style={{ float: "right", marginRight: 15 }}>Signup</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
