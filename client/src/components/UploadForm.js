import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";

const UploadForm = () => {
  const [fileName, setFileName] = useState("pls upload your image file");
  const [file, setFile] = useState(null);

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log({ res });
      toast.success("UploadForm onSubmit success");
    } catch (err) {
      console.error(err);
      toast.error("UploadForm onSubmit fail");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="file-dropper">
        {fileName}
        <input type="file" id="image" onChange={imageSelectHandler} />
      </div>
      <button
        style={{
          width: "100%",
          borderRadius: "8px",
          border: "1px dashed grey",
          height: "30px",
          cursor: "pointer",
        }}
        type="submit"
      >
        submit
      </button>
    </form>
  );
};

export default UploadForm;
