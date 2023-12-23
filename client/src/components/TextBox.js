import { useState } from "react";
import styles from "../css/TextBox.module.css";

const TextBox = ({ borderRadius = "25px", onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
    setText("");
  };

  const borderRadiusStyle = { borderRadius };

  return (
    <div className={styles.container} style={borderRadiusStyle}>
      <textarea
        className={styles.textbox}
        style={borderRadiusStyle}
        placeholder="Write a comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button className={styles.submit} onClick={handleSubmit}>
        Go
      </button>
    </div>
  );
};

export default TextBox;
