import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
  const defaultFileName = "pls upload your image file";
  const [fileName, setFileName] = useState(defaultFileName);
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);
    console.log({ file });
    // console.log({ imageFile });
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile); // 여기에 imageFile 대신 file을 넣으면 아래 오류가 뜰때 있음.
    // Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'.
    // 정말로 이미지 파일이 있는 것인지 진행하기 전에 확인하는 것도 좋은 방법.
    // imageFile 과 file 을 넣어가면서 리액트 개발자 도구 components 란에 hooks 부분을 비교해보면 알수 있음.
    fileReader.onload = (e) => {
      // setImgSrc(fileReader.result);
      setImgSrc(e.target.result);
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((e.loaded / e.total) * 100));
        },
      });
      console.log({ res });
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
      toast.error("UploadForm onSubmit fail");
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
          onChange={imageSelectHandler}
        />
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
