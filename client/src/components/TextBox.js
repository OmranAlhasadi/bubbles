import styles from "../css/TextBox.module.css";

const TextBox = () => {
  return (
    <div className={styles.container}>
      <textarea
        className={styles.textbox}
        placeholder="Write a comment"
      ></textarea>
      <button className={styles.submit}>Go</button>
    </div>
  );
};

export default TextBox;
