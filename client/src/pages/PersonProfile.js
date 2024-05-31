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

import { toast } from "react-toastify";

const getRelationshipStatus = (user, personUsername) => {
  if (user.friends.some((friend) => friend.username === personUsername)) {
    return "alreadyFriends";
  }
  if (
    user.friendRequests.some((request) => request.username === personUsername)
  ) {
    return "requestReceived";
  }
  if (
    user.sentRequests.some((request) => request.username === personUsername)
  ) {
    return "requestSent";
  }
  return "notFriends";
};

const PersonProfile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  const { username } = useParams();

  useEffect(() => {
    const fetchPerson = async (username) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/${username}`,
          { credentials: "include" }
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

  const renderAddFriendButton = () => {
    const relation = getRelationshipStatus(user, username);

    switch (relation) {
      case "alreadyFriends":
        return (
          <div className={styles.friendButton}>
            <svg className={styles.friendSVG} viewBox="0 0 16 16">
              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022" />
            </svg>
            <span className={styles.friendText}>Friends</span>
          </div>
        );
      case "requestReceived":
        return (
          <div className={styles.friendButton}>
            <svg className={styles.friendSVG} viewBox="0 0 16 16">
              <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
            </svg>
            <span className={styles.friendText}>Request Recieved</span>
          </div>
        );
      case "requestSent":
        return (
          <div className={styles.friendButton}>
            <svg className={styles.friendSVG} viewBox="0 0 16 16">
              <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
            </svg>
            <span className={styles.friendText}>Request Sent</span>
          </div>
        );
      default:
        return (
          <button
            className={styles.addFriendButton}
            onClick={() => handleSendRequest(person.username)}
          >
            <svg className={styles.addFriendSVG} viewBox="0 0 16 16">
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
              <path
                fill-rule="evenodd"
                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
              />
            </svg>
            <span className={styles.addFriendText}>Add Friend</span>
          </button>
        );
    }
  };

  // Function to handle sending a friend request
  const handleSendRequest = async (recieverUsername) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/send-request/${recieverUsername}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Error sending request");
      }
      const newRequest = await response.json();

      toast.success("Request sent successfully!");

      updateUser({
        sentRequests: [...user.sentRequests, newRequest],
      });
    } catch (error) {
      toast.error("Error sending friend request");
    }
  };

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
          {renderAddFriendButton()}
        </div>
        <div className={styles.content}>
          <div className={styles.sidBar}>
            {user && user.aboutMe && <AboutMe text={person.aboutMe} />}

            <FriendsList otherUser={true} />
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
