import styles from "../css/TextBox.module.css";

const TextBox = ({ borderRadius = "25px" }) => {
  const borderRadiusStyle = { borderRadius };

  return (
    <div className={styles.container} style={borderRadiusStyle}>
      <textarea
        className={styles.textbox}
        style={borderRadiusStyle}
        placeholder="Write a comment"
      ></textarea>
      <button className={styles.submit}>Go</button>
    </div>
  );
};

export default TextBox;
