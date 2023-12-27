import styles from "../css/AboutMe.module.css";
import LoadingRippleBubbles from "./LoadingRippleBubbles";

const AboutMe = ({ text }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>About Me</div>
      {text == null ? (
        <LoadingRippleBubbles />
      ) : (
        <div>
          <p className={styles.text}>{text}</p>
          <span>Member since 1980</span>
        </div>
      )}
    </div>
  );
};

export default AboutMe;
