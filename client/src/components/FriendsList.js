import { useEffect, useState, useContext } from "react";
import styles from "../css/FriendsList.module.css";

import igor from "../images/igor.png";
import thief from "../images/thief.jpeg";
import LoadingRippleBubbles from "./LoadingRippleBubbles";
import { UserContext } from "../contexts/UserContext";

const FriendsList = () => {
  let [friends, setFriends] = useState(null);

  const user = useContext(UserContext);

  useEffect(() => {
    const fetchFriends = async () => {
      // Ensure user and user.uid are available
      if (user && user.uid) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/${user.uid}/friends`
          );
          if (!response.ok) {
            throw new Error("Could not fetch friends");
          }
          const fetchedFriends = await response.json();
          setFriends(fetchedFriends);
        } catch (error) {
          console.error("Error fetching friends", error);
        }
      }
    };

    fetchFriends();
  }, [user]);

  if (friends === null || friends === undefined) {
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
          <li className={styles.item}>
            <img src={thief}></img>
            <a href={friend.profileLink}>{friend.username}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
