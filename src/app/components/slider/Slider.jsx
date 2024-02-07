"use client";
import { useState, useEffect } from "react";
import styles from "./Slider.module.css";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/s3-upload", {
          method: "GET",
        });

        let data = await response.json();

        data = data.filenames
          .filter((item) => item.isShow)
          .map((item) => ({
            url:
              "https://primathon-slider-image.s3.us-west-2.amazonaws.com/" +
              item.name,
            alt: "img",
          }));
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, images]);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTogglePause = () => {
    setIsPaused((prevPaused) => !prevPaused);
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.imageContainer}>
        {images.length > 0 && (
          <img
            src={images[currentImageIndex].url}
            alt={images[currentImageIndex].alt}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.controls}>
        <button onClick={handlePrevClick} className={styles.controlButton}>
          Previous
        </button>
        <button onClick={handleTogglePause} className={styles.controlButton}>
          {isPaused ? "Play" : "Pause"}
        </button>
        <button onClick={handleNextClick} className={styles.controlButton}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Slider;
