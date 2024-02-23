import UploadForm from "./components/UploadForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageList from "./components/ImageList";
import React from "react";

function App() {
  return (
    <div>
      <ToastContainer />
      <div>Image Repository</div>
      <UploadForm />
      <ImageList />
    </div>
  );
}

export default App;
