import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = async (e) => {
    const imageFiles = e.target.files;
    setFiles(imageFiles);

    const imagePreviews = await Promise.all(
      [...imageFiles].map((imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = (e) => {
              resolve({ imgSrc: e.target.result, fileName: imageFile.name });
            };
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
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
        setPreviews([]);
      }, 3000);
    } catch (err) {
      console.error(err);
      setPercent(0);
      setPreviews([]);
      toast.error(err.response.data.message, "UploadForm onSubmit fail");
    }
  };

  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      src={preview.imgSrc}
      alt=""
      style={{ width: 200, height: 200, objectFit: "cover" }}
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
  ));

  const fileName =
    previews.length === 0
      ? "이미지 파일을 업로드 해주세요."
      : previews.reduce(
          (previous, current) => previous + `${current.fileName}, `,
          ""
        );
  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{previewImages}</div>

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
