import styles from "../css/HomePage.module.css";
import Feed from "../sections/Feed.js";

const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentContainer}>
        <div></div>
        <Feed />
        <div></div>
      </div>
    </div>
  );
};

export default HomePage;
