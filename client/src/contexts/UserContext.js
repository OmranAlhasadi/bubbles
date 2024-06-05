import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle user login
  const loginUser = async (username, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      setUser(data.user); // Set user in context
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
      return false;
    }
  };

  // login as example user

  const loginExampleUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login-example`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Login Example User failed");

      setUser(data.user); // Set user in context
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
      return false;
    }
  };

  // Function to handle user signup
  const signupUser = async (userData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      setUser(data.user); // Set user in context
      return true;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Function to handle user logout
  const logoutUser = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      setUser(null); // Clear user in context
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  // Function to handle user logout
  const forgotPassword = async (email) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Request failed");
      }

      return true;
    } catch (error) {
      console.error("Error sending request", error);
      throw error;
      return false;
    }
  };

  // Function to update user data
  const updateUser = (updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  };

  // Check user authentication status
  /* useEffect(() => {
    const checkAuthStatus = async () => {
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
          setUser(null); // Ensure user is set to null if not authenticated
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null); // Handle any error by cleaning the user state
      }
    };

    checkAuthStatus();
  }, []); */
  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        loginExampleUser,
        signupUser,
        logoutUser,
        forgotPassword,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
