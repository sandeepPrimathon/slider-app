import { useState } from "react";
import styles from "./Card.module.css";
import React from "react";

const Card = ({ imageUrl, isToggled, setIsToggled }) => {

  const filterData = async (payload) => {
    try {
      const response = await fetch("/api/s3-upload", {
        method: "PUT",
        body: JSON.stringify({ data: payload }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    const splitUrl = imageUrl.split("/");
    const imageId = splitUrl[splitUrl.length - 1];
    filterData({ id: imageId, isShow: !isToggled });
    setIsToggled(() => !isToggled);
  };

  return (
    <div className={styles.card}>
      {imageUrl && <img src={imageUrl} alt="Card" className={styles.image} />}
      <label className={styles.switch}>
        <input type="checkbox" checked={isToggled} onChange={handleToggle} />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <p className={styles.text}>
        {isToggled ? "Show on slider" : "Hide on slider"}
      </p>
    </div>
  );
};

export default Card;
