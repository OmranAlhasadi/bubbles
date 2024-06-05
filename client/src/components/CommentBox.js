import { useState, useEffect } from "react";
import styles from "../css/CommentBox.module.css";

import { CircleLoader } from "react-spinners";
import { toast } from "react-toastify";

const CommentBox = ({ borderRadius = "25px", isVisible, handleSubmit }) => {
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const errorDisplayTime = 3000; // 3 seconds

  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
      }, errorDisplayTime);
    }
    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [errorMessage, errorDisplayTime]);

  const onSubmit = async () => {
    if (comment.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }
    setIsPosting(true);

    try {
      handleSubmit(comment);
      setComment("");
    } catch (e) {
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.visible : ""} ${
        isPosting ? "disabled" : ""
      }`}
      style={{ borderRadius }}
    >
      {/* {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )} */}
      <textarea
        className={styles.textbox}
        style={{ borderRadius }}
        placeholder="Write a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button className={styles.submit} onClick={onSubmit}>
        {isPosting ? <CircleLoader size="25px" color="white" /> : "Go"}
      </button>
    </div>
  );
};

export default CommentBox;
