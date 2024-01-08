import styles from "../css/CommentSection.module.css";
import Comment from "./Comment";
const CommentSection = ({ comments, isVisible }) => {
  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
      {comments.map((comment) => (
        <Comment comment={comment} />
      ))}
    </div>
  );
};

export default CommentSection;
