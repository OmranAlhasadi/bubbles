import Header from "../components/Header";
import styles from "../css/Profile.module.css";

import { useContext } from "react";

import { UserContext } from "../contexts/UserContext";
import FriendsList from "../components/FriendsList";
import AboutMe from "../components/AboutMe";
import Feed from "../sections/Feed";
import theif from "../images/thief.jpeg";
import LoadingBubbles from "../components/LoadingBubbles";

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);

  if (user === null) {
    return <LoadingBubbles size="200px" />;
  }

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <div className={styles.profile}>
            <img className={styles.userPicture} src={user.profileImg} />
            <div className={styles.usernameContainer}>
              <span className={styles.username}>{user.username}</span>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.sidBar}>
            {user && user.aboutMe && <AboutMe text={user.aboutMe} />}

            <FriendsList />
          </div>
          <div className={styles.userPosts}>
            <Feed specificUser={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
