import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Profile from "../pages/Profile.js";
import PersonProfile from "../pages/PersonProfile";
import LoadingBubbles from "./LoadingBubbles";

const UserProfileWrapper = () => {
  const { username } = useParams();
  const { user, updateUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <LoadingBubbles size="200px" />;
  }

  if (user && user.username === username) {
    return <Profile />;
  } else {
    return <PersonProfile />;
  }
};

export default UserProfileWrapper;
