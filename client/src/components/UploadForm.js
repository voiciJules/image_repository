import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const defaultFileName = "pls upload your image file";
  const [fileName, setFileName] = useState(defaultFileName);
  const [files, setFiles] = useState(null);
  const [percent, setPercent] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = (e) => {
    const imageFiles = e.target.files;
    setFiles(imageFiles);
    const imageFile = imageFiles[0];
    setFileName(imageFile.name);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => {
      // setImgSrc(fileReader.result);
      setImgSrc(e.target.result);
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let file of files) {
      formData.append("image", file);
    }
    formData.append("public", isPublic);

    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((e.loaded / e.total) * 100));
        },
      });
      if (isPublic) setImages([...images, ...res.data]);
      else setMyImages([...myImages, ...res.data]);

      toast.success("UploadForm onSubmit success");
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      toast.error(err.response.data.message, "UploadForm onSubmit fail");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <img
        src={imgSrc}
        className={`image-preview ${imgSrc && "image-preview-show"}`}
        alt=""
      />
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input
          type="file"
          id="image"
          accept="image/*"
          multiple
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">비공개</label>
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
