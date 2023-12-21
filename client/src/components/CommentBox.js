import styles from "../css/CommentBox.module.css";

const CommentBox = ({ borderRadius = "25px", isVisible }) => {
  const borderRadiusStyle = { borderRadius };

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.visible : ""}`}
      style={borderRadiusStyle}
    >
      <textarea
        className={styles.textbox}
        style={borderRadiusStyle}
        placeholder="Write a comment"
      ></textarea>
      <button className={styles.submit}>Go</button>
    </div>
  );
};

export default CommentBox;
