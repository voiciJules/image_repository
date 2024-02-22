import UploadForm from "./components/UploadForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageList from "./components/ImageList";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("/images")
      .then((result) => setImages(result.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <ToastContainer />
      <div>Image Repository</div>
      <UploadForm images={images} setImages={setImages} />
      <ImageList images={images} />
    </div>
  );
}

export default App;
