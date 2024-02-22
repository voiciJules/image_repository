import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageList = ({ images }) => {
  console.log(images);

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
