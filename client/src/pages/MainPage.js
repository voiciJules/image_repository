import React from "react";
import ImageList from "../components/ImageList";
import UploadForm from "../components/UploadForm";

const MainPage = () => {
  return (
    <>
      <div>Image Repository</div>
      <UploadForm />
      <ImageList />
    </>
  );
};

export default MainPage;
