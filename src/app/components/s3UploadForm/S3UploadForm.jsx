"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./S3UploadForm.module.css";
import uploadIcon from "../../../assets/upload.png";

const S3UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      await response.json();
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const goSelectionPage = () => {
    router.push("/select");
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={goSelectionPage} className={styles.GoBackButton}>
        select Image
      </button>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="file-upload" className={styles.label}>
          <Image src={uploadIcon} alt="upload" width={40} height={40} />
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.uploadFileInput}
          />
        </label>
        <button
          type="submit"
          disabled={!file || uploading}
          className={styles.Button}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default S3UploadForm;
