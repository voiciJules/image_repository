import React, { useContext } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";

const ImagePage = () => {
  const { imageId } = useParams();
  const { images, myImages } = useContext(ImageContext);
  const image =
    images.find((image) => image._id === imageId) ||
    myImages.find((image) => image._id === imageId);
  //   console.log({ image });
  if (!image) return <h2>Loading...</h2>;
  return (
    <div>
      <h3>Image Page - {imageId}</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:5000/uploads/${image.key}`}
      />
    </div>
  );
};

export default ImagePage;
