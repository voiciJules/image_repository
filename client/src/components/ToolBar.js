import React from "react";
import { Link } from "react-router-dom";

const ToolBar = () => {
  return (
    <div>
      <Link to="/">
        <span>Home</span>
      </Link>
      <Link to="/auth/login">
        <span style={{ float: "right" }}>Login</span>
      </Link>
      <Link to="/auth/register">
        <span style={{ float: "right", marginRight: 15 }}>Signup</span>
      </Link>
    </div>
  );
};

export default ToolBar;
