import styles from "../css/NewUsers.module.css";
import { useState, useEffect } from "react";
import SpinningCircleLoader from "./SpinningCircleLoader";

const NewUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/user/new-users", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        alert("Error fetching new Users");
        setLoading(false);
      }
    };

    fetchNewUsers();
  }, []);

  return loading ? (
    <SpinningCircleLoader />
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>New Users</div>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li className={styles.userItem} key={user.username}>
            <img
              className={styles.profileImg}
              src={user.profileImg}
              alt={user.username}
            />
            <a className={styles.userName} href={user.profileLink}>
              {user.username}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewUsers;
