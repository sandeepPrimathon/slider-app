"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./ImageSelection.module.css";
import Card from "../card/Card";

const ImageSelection = () => {
  const [Images, setImages] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  const router = useRouter();

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/s3-upload", {
        method: "GET",
      });

      let data = await response.json();

      data = data.filenames.map((item) => ({
        url:
          "https://primathon-slider-image.s3.us-west-2.amazonaws.com/" +
          item.name,
        alt: "img",
        isShow: item.isShow,
      }));
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [isToggled]);

  const goUploadPage = () => {
    router.push("/upload");
  };

  return (
    <div className={styles.cardContainer}>
      <button onClick={goUploadPage} className={styles.button}>
        upload More Image
      </button>
      {Images.map((item) => (
        <Card
          key={item.url}
          imageUrl={item.url}
          isToggled={item.isShow}
          setIsToggled={setIsToggled}
        />
      ))}
    </div>
  );
};

export default ImageSelection;
