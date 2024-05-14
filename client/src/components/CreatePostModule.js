import { useState, useContext } from "react";
import styles from "../css/CreatePostModule.module.css";

import { generateUploadButton } from "@uploadthing/react";

const CreatePostModule = () => {
  const [text, setText] = useState("");

  const UploadButton = generateUploadButton({
    url: "http://localhost:3001/api/uploadthing",
  });

  const uploadSVG = (
    <svg className={styles.uploadSVG} viewBox="0 0 16 16">
      <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
      <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z" />
    </svg>
  );

  const handleClientUploadComplete = async (res) => {
    console.log("Files: ", res);
    console.log(res[0].url);
    if (res[0].url) {
    } else {
      alert("Upload completed, but no image URL returned.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Create Post</h3>
      </div>
      <div className={styles.profile}></div>
      <textarea
        className={styles.textBox}
        placeholder={"What's on your mind?"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className={styles.buttonsContainer}>
        <UploadButton
          endpoint="imageUploader"
          className={styles.uploadButton}
          onClientUploadComplete={handleClientUploadComplete}
          onUploadError={(error) => {
            console.error("Upload error:", error);
            alert(`ERROR! ${error.message}`);
          }}
          content={{
            button({ ready }) {
              if (ready)
                return (
                  <>
                    {uploadSVG}
                    <p>Add image</p>
                  </>
                );

              return "Getting ready...";
            },
          }}
        />
        <button className={styles.postButton}>Post</button>
      </div>
    </div>
  );
};

export default CreatePostModule;
