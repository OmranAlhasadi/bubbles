import styles from "../css/LoadingRippleBubbles.module.css";

const LoadingRippleBubbles = ({ size = "80px" }) => {
  return (
    <div
      className={styles.rippleContainer}
      style={{ width: size, height: size }}
    >
      <div className={styles.rippleBubble}></div>
      <div className={styles.rippleBubble}></div>
    </div>
  );
};

export default LoadingRippleBubbles;
