import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const [images] = useContext(ImageContext);
  const imgList = images.map((image) => (
    <img
      style={{
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        display: "block",
      }}
      src={`http://localhost:5000/uploads/${image.key}`}
      alt="list in ImageList"
      key={image.key}
    />
  ));

  return (
    <div>
      <h3>Image List</h3>
      {imgList}
    </div>
  );
};

export default ImageList;
