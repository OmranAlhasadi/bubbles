import styles from "../css/LoadingFloatingBubbles.module.css";

const LoadingFloatingBubbles = ({ size = "60px" }) => {
  return (
    <div
      className={styles.floatingContainer}
      style={{ width: size, height: size }}
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className={styles.floatingBubble}></div>
      ))}
    </div>
  );
};

export default LoadingFloatingBubbles;
