import styles from "../css/SpinningCircleLoader.module.css";

const SpinningCircleLoader = ({ size = "50px" }) => {
  return (
    <div className={styles.loader} style={{ width: size, height: size }}></div>
  );
};

export default SpinningCircleLoader;
