import LoadingRippleBubbles from "../components/LoadingRippleBubbles";
import styles from "../css/LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={styles.wrapper}>
      <LoadingRippleBubbles size="200px" />
    </div>
  );
};

export default LoadingPage;
