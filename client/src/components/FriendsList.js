import { useEffect, useState, useContext } from "react";
import styles from "../css/FriendsList.module.css";

import igor from "../images/igor.png";
import thief from "../images/thief.jpeg";
import LoadingRippleBubbles from "./LoadingRippleBubbles";
import { UserContext } from "../contexts/UserContext";
import { useParams } from "react-router-dom";

import defaultProfile from "../images/default3.png";

const FriendsList = ({ otherUser = false }) => {
  const { username } = useParams();
  let [friends, setFriends] = useState(null);

  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    const getOtherUser = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/user/other-user/${username}`,
            { credentials: "include" }
          );
          if (!response.ok) {
            throw new Error("Could not fetch friends");
          }
          const fetchedUser = await response.json();
          setFriends(fetchedUser.friends);
        } catch (error) {
          console.error("Error fetching friends", error);
        }
      }
    };
    if (user === null) {
    } else if (!otherUser && user !== null) {
      setFriends(user.friends);
    } else {
      getOtherUser();
    }
  }, [user]);

  if (user === null || friends === null || friends === undefined) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>Friends List</div>
        <div className={styles.isLoading}>
          <LoadingRippleBubbles size={"140px"} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Friends List</div>
      <ul className={styles.list}>
        {friends.map((friend) => (
          <li key={friend.username} className={styles.item}>
            <img src={friend.profileImg || defaultProfile}></img>
            <a href={friend.profileLink}>{friend.username}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
