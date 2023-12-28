import Header from "../components/Header";
import styles from "../css/PersonProfile.module.css";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useParams } from "react-router-dom";
import FriendsList from "../components/FriendsList";
import AboutMe from "../components/AboutMe";
import Feed from "../sections/Feed";
import theif from "../images/thief.jpeg";
import LoadingPage from "./LoadingPage";

const PersonProfile = () => {
  const user = useContext(UserContext);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  const { username } = useParams();

  useEffect(() => {
    const fetchPerson = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/${username}`
        );

        if (!response.ok) {
          throw new Error("Could not fetch user");
        }
        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson(username);
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <div className={styles.profile}>
            <img className={styles.userPicture} src={person.profileImg} />
            <div className={styles.usernameContainer}>
              <span className={styles.username}>{person.username}</span>
            </div>
          </div>
          <button className={styles.addFriendButton}>
            <svg className={styles.addFriendSVG} viewBox="0 0 16 16">
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
              <path
                fill-rule="evenodd"
                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
              />
            </svg>
            <span className={styles.addFriendText}>Add Friend</span>
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.sidBar}>
            {user && user.aboutMe && <AboutMe text={person.aboutMe} />}

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

export default PersonProfile;
