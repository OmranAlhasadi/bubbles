import AboutMe from "../components/AboutMe";
import FriendsList from "../components/FriendsList";
import styles from "../css/HomePage.module.css";
import Feed from "../sections/Feed.js";
import Header from "../components/Header.js";
import TextBox from "../components/TextBox";

let friends = ["jhonson", "james", "johan", "jamian jones", "janina"];
let about = "hi i am doododo and dadada how can I dededee you?";

const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <FriendsList friends={friends} />
        <Feed />
        {/*<AboutMe text={about} />  */}
        <TextBox />
      </div>
    </div>
  );
};

export default HomePage;
