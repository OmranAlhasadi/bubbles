import styles from "../css/LoadingBubbles.module.css";

const LoadingBubbles = ({ size = "50px" }) => {
  return (
    <div
      className={styles.loadingBubbles}
      style={{ width: size, height: size }}
    >
      <div
        className={styles.bubble}
        style={{ backgroundColor: "#C084FC" }}
      ></div>
      <div
        className={styles.bubble}
        style={{ backgroundColor: "#9D4EDD" }}
      ></div>
      <div
        className={styles.bubble}
        style={{ backgroundColor: "#6B21A8" }}
      ></div>
    </div>
  );
};

export default LoadingBubbles;
