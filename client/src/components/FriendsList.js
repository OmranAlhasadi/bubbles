import styles from "../css/FriendsList.module.css";

import igor from "../images/igor.png";
import thief from "../images/thief.jpeg";

const FriendsList = ({ friends }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Friends List</div>
      <ul className={styles.list}>
        {friends.map((friend) => (
          <li className={styles.item}>
            <img src={thief}></img>
            <a>{friend}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
