import AboutMe from "../components/AboutMe";
import FriendsList from "../components/FriendsList";
import styles from "../css/HomePage.module.css";
import Feed from "../sections/Feed.js";
import Header from "../components/Header.js";
import TextBox from "../components/TextBox";
import LoadingBubbles from "../components/LoadingBubbles";
import LoadingRippleBubbles from "../components/LoadingRippleBubbles";
import LoadingFloatingBubbles from "../components/LoadingFloatingBubbles";
import SpinningCircleLoader from "../components/SpinningCircleLoader";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import LoadingPage from "./LoadingPage";
import NewUsers from "../components/NewUsers";
import useWindowSize from "../hooks/useWindowSize";
import CombinedModule from "../components/CombinedModule";

const HomePage = () => {
  const { user, updateUser } = useContext(UserContext);
  const { width } = useWindowSize();
  const isMobile = width <= 826;

  if (user == null) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentContainer}>
        {isMobile ? (
          <>
            <Feed />
          </>
        ) : (
          <>
            <Feed />
            <NewUsers />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
