import styles from "../css/NewUsers.module.css";
import { useState, useEffect } from "react";
import LoadingComponent from "./LoadingComponent";

import { toast } from "react-toastify";

import defaultProfile from "../images/default3.png";

const NewUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchNewUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/new-users`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch new Users");
        }

        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message || "Error fetching new Users");
        setLoading(false);
      }
    };

    fetchNewUsers();
  }, []);

  return loading ? (
    <div className={styles.loaderContainer}>
      <LoadingComponent loaderSize="50px" text="Loading new Users..." />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>New Users</div>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li className={styles.userItem} key={user.username}>
            <img
              className={styles.profileImg}
              src={user.profileImg || defaultProfile}
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
