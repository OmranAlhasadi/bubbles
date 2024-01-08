import { useState, useEffect } from "react";
import styles from "../css/CommentBox.module.css";

const CommentBox = ({ borderRadius = "25px", isVisible, handleSubmit }) => {
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const errorDisplayTime = 3000; // 3 seconds

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
      }, errorDisplayTime);
    }
    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [errorMessage, errorDisplayTime]);

  const onSubmit = () => {
    if (comment.trim() === "") {
      setErrorMessage("Comment cannot be empty");
      return;
    }
    handleSubmit(comment);
    setComment("");
  };

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.visible : ""}`}
      style={{ borderRadius }}
    >
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      <textarea
        className={styles.textbox}
        style={{ borderRadius }}
        placeholder="Write a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button className={styles.submit} onClick={onSubmit}>
        Go
      </button>
    </div>
  );
};

export default CommentBox;
