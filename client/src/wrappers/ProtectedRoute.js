import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

import LoadingPage from "../pages/LoadingPage";

const ProtectedRoute = ({ children }) => {
  const { user, updateUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const checkAuthStatus = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/auth/status`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("Auth check failed");

          const data = await response.json();
          if (data.isAuthenticated) {
            updateUser(data.user);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
          console.error("Error checking auth status:", error);
        }
      };

      checkAuthStatus();
    } else {
      setIsLoading(false); // User is already defined, skip fetching
    }
  }, [user, updateUser]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
