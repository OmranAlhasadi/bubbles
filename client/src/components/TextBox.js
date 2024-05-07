import { useState } from "react";
import styles from "../css/TextBox.module.css";

const TextBox = ({
  borderRadius = "25px",
  onSubmit,
  buttonText = "Go",
  starterText = "",
  placeholderText = "Write a comment",
}) => {
  const [text, setText] = useState(starterText);

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
        placeholder={placeholderText}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button className={styles.submit} onClick={handleSubmit}>
        {buttonText}
      </button>
    </div>
  );
};

export default TextBox;
