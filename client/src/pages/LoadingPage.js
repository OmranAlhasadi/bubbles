import { DotLoader } from "react-spinners";
import styles from "../css/LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={styles.wrapper}>
      <DotLoader size="100px" color="#c084fc" />
    </div>
  );
};

export default LoadingPage;
