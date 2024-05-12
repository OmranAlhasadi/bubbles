import { useState, useContext } from "react";
import styles from "../css/CreatePostModule.module.css";

const CreatePostModule = () => {
  const [text, setText] = useState(starterText);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Create Post</h3>
      </div>
      <div className={styles.profile}></div>
      <textarea
        className={styles.textBox}
        placeholder={"What's on your mind?"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className={styles.buttonsContainer}></div>
    </div>
  );
};

export default CreatePostModule;
