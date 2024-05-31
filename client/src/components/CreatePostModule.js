import { useState, useContext, useEffect, useMemo } from "react";
import styles from "../css/CreatePostModule.module.css";

import { generateUploadButton } from "@uploadthing/react";

import { toast } from "react-toastify";

const CreatePostModule = ({ passNewPost }) => {
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const handleCreatePost = async () => {
    try {
      const postBody = {
        content: text,
        imageURL: imgUrl,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(postBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let newPost = await response.json();
      cleanUp();
      await passNewPost(newPost);
      toast.success("Post added successfully!");
    } catch {
      toast.error("Error creating post");
    }
  };

  const UploadButton = useMemo(
    () =>
      generateUploadButton({
        url: `${process.env.REACT_APP_API_URL}/api/uploadthing`,
      }),
    []
  );

  const uploadSVG = (
    <svg className={styles.uploadSVG} viewBox="0 0 16 16">
      <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
      <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z" />
    </svg>
  );

  const closeSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.closeSVG}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const handleCloseImg = () => {
    setImgUrl("");
  };

  const handleClientUploadComplete = async (res) => {
    if (res[0].url) {
      setImgUrl(res[0].url);
    } else {
      toast.error("Upload completed, but no image URL returned.");
    }
  };

  const cleanUp = () => {
    setText("");
    setImgUrl("");
  };

  useEffect(() => {
    // Clean up when the component mounts
    cleanUp();
  }, []);

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
      {imgUrl && (
        <div className={styles.postImgContainer}>
          <button className={styles.closeSVG} onClick={handleCloseImg}>
            {closeSVG}
          </button>
          <img className={styles.postImg} src={imgUrl} />
        </div>
      )}
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
        <button className={styles.postButton} onClick={handleCreatePost}>
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePostModule;
