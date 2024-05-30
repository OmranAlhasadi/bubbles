import styles from "../css/AboutMe.module.css";
import LoadingRippleBubbles from "./LoadingRippleBubbles";

const AboutMe = ({ text }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>About Me</div>
      {text == null ? (
        <LoadingRippleBubbles />
      ) : (
        <div className={styles.contentContainer}>
          <p className={styles.text}>{text}</p>
          <span></span>
        </div>
      )}
    </div>
  );
};

export default AboutMe;
