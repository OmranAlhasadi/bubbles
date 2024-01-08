import styles from "../css/Comment.module.css";

const Comment = ({ comment }) => {
  return (
    <div className={styles.container}>
      <img src={comment.author.profileImg}></img>
      <div className={styles.content}>
        <span className={styles.username}>{comment.username}</span>
        <p className={styles.commentText}>{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
