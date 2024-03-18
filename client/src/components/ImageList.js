import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import "./ImageList.css";

const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const imgList = (isPublic ? images : myImages).map((image) => (
    <Link key={image.key} to={`/images/${image._id}`}>
      <img
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          display: "block",
        }}
        src={`http://localhost:5000/uploads/${image.key}`}
        alt="imagelist"
        key={image.key}
      />
    </Link>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: "10px" }}>
        Image List({isPublic ? "공개" : "개인"} 사진)
      </h3>
      {me && (
        <button onClick={() => setIsPublic(!isPublic)}>
          {isPublic ? "개인" : "공개"} 사진 보기
        </button>
      )}
      <div className="image-list-container">{imgList}</div>
    </div>
  );
};

export default ImageList;
