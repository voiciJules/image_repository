import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ImagePage = () => {
  const { imageId } = useParams();
  const { images, myImages, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const image =
    images.find((image) => image._id === imageId) ||
    myImages.find((image) => image._id === imageId);
  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);
  //   console.log({ image });
  if (!image) return <h2>Loading...</h2>;

  const updateImage = (images, image) =>
    [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public) setImages(updateImage(images, result.data));
    else setMyImages(updateImage(myImages, result.data));
    // 좋아요 클릭할 때마다 사진첩에 사진의 개수가 늘어난다. 하지만 새로고침하면 다시 없어짐.
    // 그래서 위와 같이 ...images.filter 를 사용하여 그전에 이미지를 지우고, like or unlike 정보가 들어간 result.data 를 넣어줌.
    // 하지만 이렇게 할 경우, 좋아요 버튼이 클릭된 이미지가 제일 뒤로 감.
    setHasLiked(!hasLiked);
  };
  return (
    <div>
      <h3>Image Page - {imageId}</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:5000/uploads/${image.key}`}
      />
      <span>좋아요 {image.likes.length}</span>
      <button style={{ float: "right" }} onClick={onSubmit}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
    </div>
  );
};

export default ImagePage;
