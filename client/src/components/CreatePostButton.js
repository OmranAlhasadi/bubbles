import styles from "../css/CreatePostButton.module.css";

const plusSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={styles.plusSVG}
    viewBox="0 0 16 16"
  >
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
  </svg>
);

const CreatePostButton = ({ handleClick }) => {
  return (
    <div className={styles.container} onClick={handleClick}>
      {plusSVG}
      <div className={styles.textContainer}>
        <span className={styles.header}>Create a Post</span>
        <p className={styles.text}>Share a photo or write something</p>
      </div>
    </div>
  );
};

export default CreatePostButton;
