import styles from "../css/Header.module.css";

import thief from "../images/thief.jpeg";
import settings from "../images/settings.svg";

import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";

import { toast } from "react-toastify";

import { CircleLoader } from "react-spinners";

import defaultProfile from "../images/default3.png";

const Header = () => {
  const { user, updateUser, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [showRequests, setShowRequests] = useState(false);
  const requestsRef = useRef();
  const svgRef = useRef();

  const [loadingAccept, setLoadingAccept] = useState({});
  const [loadingReject, setLoadingReject] = useState({});
  const [loggingOut, setLoggingOut] = useState(false);

  // toggle friend request list
  const toggleRequests = () => {
    setShowRequests((showRequests) => !showRequests);
  };

  const isAnyRequestLoading = () => {
    return (
      Object.values(loadingAccept).some((isLoading) => isLoading) ||
      Object.values(loadingReject).some((isLoading) => isLoading)
    );
  };

  const handleProfileClick = () => {
    if (user && user.username) {
      navigate(`/profile/${user.username}`); // Navigate to user's profile
    }
  };

  const handleLogoClick = () => {
    navigate("/"); // Navigate to homepage
  };

  const handleSettingsClick = () => {
    navigate("/settings"); //Navigate to settings
  };

  const handleLogoutClick = async () => {
    setLoggingOut(true);

    try {
      await logoutUser();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Error logging out, please check network connection");
    } finally {
      setLoggingOut(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    //check if click is outside the ref element
    function handleClickOutside(event) {
      if (
        requestsRef.current &&
        !requestsRef.current.contains(event.target) &&
        svgRef.current &&
        !svgRef.current.contains(event.target)
      ) {
        setShowRequests(false);
      }
    }

    //bind the event listener
    if (showRequests) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    //unbind the event listener on clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRequests]);

  // Function to handle accepting a friend request
  const handleAcceptRequest = async (requesterUsername) => {
    if (!user) {
      console.error("User ID not available");
      return;
    }

    setLoadingAccept((prev) => ({ ...prev, [requesterUsername]: true }));

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/accept-request/${requesterUsername}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error accepting friend request");
      }

      const newFriend = await response.json();

      toast.success("Friend added!");
      updateUser({
        friendRequests: user.friendRequests.filter(
          (req) => req.username !== requesterUsername
        ),
        friends: [...user.friends, newFriend],
      });
    } catch (error) {
      toast.error(error.message || "Error accepting friend request");
    } finally {
      setLoadingAccept((prev) => ({ ...prev, [requesterUsername]: false }));
    }
  };

  // Function to handle rejecting a friend request
  const handleRejectRequest = async (requesterUsername) => {
    setLoadingReject((prev) => ({ ...prev, [requesterUsername]: true }));

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/reject-request/${requesterUsername}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error rejecting request");
      }
      toast.success("Request rejected");
      updateUser({
        friendRequests: user.friendRequests.filter(
          (req) => req.username !== requesterUsername
        ),
      });
    } catch (error) {
      toast.error(error.message || "Error rejecting friend request");
    } finally {
      setLoadingReject((prev) => ({ ...prev, [requesterUsername]: false }));
    }
  };

  return (
    <div className={`${styles.container} ${loggingOut ? "disabled" : ""}`}>
      <svg
        id={styles.logo}
        viewBox="0 0 363.188 363.188"
        enableBackground="new 0 0 363.188 363.188"
        onClick={handleLogoClick}
      >
        <g>
          <path d="m111.667,132.311c-61.574,0-111.667,50.093-111.667,111.666s50.093,111.667 111.667,111.667 111.667-50.094 111.667-111.667-50.094-111.666-111.667-111.666zm0,208.333c-53.303,0-96.667-43.364-96.667-96.667 0-53.302 43.364-96.666 96.667-96.666s96.667,43.364 96.667,96.666c-0.001,53.303-43.365,96.667-96.667,96.667z" />
          <path d="m111.667,173.977c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5 7.5,7.5c30.327,0 55,24.673 55,55 0,4.143 3.358,7.5 7.5,7.5s7.5-3.357 7.5-7.5c0-38.598-31.402-70-70-70z" />
          <path d="m298.333,69.835c-35.761,0-64.855,29.094-64.855,64.855 0,35.761 29.094,64.854 64.855,64.854s64.855-29.094 64.855-64.854c-5.68434e-14-35.761-29.093-64.855-64.855-64.855zm0,114.71c-27.49,0-49.855-22.364-49.855-49.854s22.365-49.855 49.855-49.855 49.855,22.365 49.855,49.855-22.364,49.854-49.855,49.854z" />
          <path d="m302.012,157.925c-14.84,0-26.913-12.073-26.913-26.913 0-4.143-3.358-7.5-7.5-7.5s-7.5,3.357-7.5,7.5c0,23.111 18.802,41.913 41.913,41.913 4.142,0 7.5-3.357 7.5-7.5s-3.358-7.5-7.5-7.5z" />
          <path d="m123.358,96.568c24.544,0 44.512-19.968 44.512-44.512s-19.968-44.512-44.512-44.512-44.512,19.968-44.512,44.512 19.968,44.512 44.512,44.512zm0-74.024c16.273,3.55271e-15 29.512,13.239 29.512,29.512s-13.239,29.512-29.512,29.512-29.512-13.239-29.512-29.512 13.239-29.512 29.512-29.512z" />
        </g>
      </svg>

      <div className={styles.buttonsContainer}>
        <img
          src={user.profileImg || defaultProfile}
          id={styles.profile}
          onClick={handleProfileClick}
        ></img>
        <svg
          id={styles.requests}
          className={styles.svg}
          onClick={toggleRequests}
          ref={svgRef}
          viewBox="0 0 16 16"
        >
          <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
        </svg>
        {showRequests && (
          <div
            className={`${styles.friendRequestsList} ${
              isAnyRequestLoading() ? "disabled" : ""
            }`}
            ref={requestsRef}
          >
            {user.friendRequests.length === 0 ? (
              <div className={styles.noRequestsMessage}>No friend requests</div>
            ) : (
              user.friendRequests.map((request) => (
                <div key={request.username} className={styles.requestItem}>
                  <img
                    src={request.profileImg || defaultProfile}
                    alt={request.username}
                    onClick={() =>
                      (window.location.href = `/profile/${request.username}`)
                    }
                    style={{ cursor: "pointer" }}
                  />

                  <div className={styles.reqInfo}>
                    <span>{request.username}</span>
                    <div className={styles.reqButtonsContainer}>
                      <button
                        className={styles.accept}
                        onClick={() => handleAcceptRequest(request.username)}
                      >
                        {loadingAccept[request.username] ? (
                          <CircleLoader size="20px" color="white" />
                        ) : (
                          "Accept"
                        )}
                      </button>
                      <button
                        className={styles.reject}
                        onClick={() => handleRejectRequest(request.username)}
                      >
                        {loadingReject[request.username] ? (
                          <CircleLoader size="20px" color="white" />
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <svg
          className={styles.svg}
          viewBox="0 0 16 16"
          onClick={handleSettingsClick}
        >
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
        </svg>
        <div className={styles.logoutButton} onClick={handleLogoutClick}>
          {loggingOut ? (
            <CircleLoader size="30px" color="#c084fc" />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box-arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                />
              </svg>
              <span>Logout</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
