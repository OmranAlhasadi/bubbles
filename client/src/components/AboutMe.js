import styles from "../css/AboutMe.module.css";

const AboutMe = ({ text }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>About Me</div>
      <p className={styles.text}>{text}</p>
      <span>Member since 1980</span>
    </div>
  );
};

export default AboutMe;
