import { useContext, useState } from "react";
import styles from "../css/Comment.module.css";
import { UserContext } from "../contexts/UserContext";

import { CircleLoader } from "react-spinners";

import defaultProfile from "../images/default3.png";

const Comment = ({ comment, isNew = false, onDelete }) => {
  const { user, updateUser } = useContext(UserContext);

  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteClick = async () => {
    setIsDeleting(true);

    try {
      await onDelete(comment._id);
    } catch (e) {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`${styles.container} ${isNew ? styles.newComment : ""} ${
        comment.deleting ? styles.deleting : ""
      } ${isDeleting ? "disabled" : ""}`}
    >
      <img
        className={styles.profile}
        src={comment.author.profileImg || defaultProfile}
      ></img>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <span className={styles.username}>{comment.author.username}</span>
          <p className={styles.commentText}>{comment.content}</p>
        </div>
        {comment.author &&
          comment.author.username === user.username &&
          (isDeleting ? (
            <CircleLoader color="#b91c1c" size="20px" />
          ) : (
            <svg
              className={styles.trash}
              onClick={onDeleteClick}
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          ))}
      </div>
    </div>
  );
};

export default Comment;
