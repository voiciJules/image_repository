import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { Routes, Route } from "react-router-dom";
import ToolBar from "./components/ToolBar";

function App() {
  return (
    <div>
      <ToastContainer />
      <ToolBar />
      <Routes>
        <Route path="/auth/register" exact element={<RegisterPage />} />
        <Route path="/auth/login" exact element={<LoginPage />} />
        <Route path="/" exact element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
