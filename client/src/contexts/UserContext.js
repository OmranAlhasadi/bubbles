import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle user login
  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      setUser(data.user); // Set user in context
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  // login as example user

  const loginExampleUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/login-example",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Login Example User failed");

      const data = await response.json();
      setUser(data.user); // Set user in context
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  // Function to handle user signup
  const signupUser = async (userData) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Signup failed");

      const data = await response.json();
      setUser(data.user); // Set user in context
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  // Function to handle user logout
  const logoutUser = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
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
      await fetch("http://localhost:3001/api/auth/forgot-password", {
        method: "POST",
        body: { email: email },
        credentials: "include",
      });
    } catch (error) {
      console.error("Error sending request", error);
    }
  };

  // Function to update user data
  const updateUser = (updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  };

  // Check user authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/auth/status", {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Auth check failed");

        const data = await response.json();
        if (data.isAuthenticated) {
          setUser(data.user);
        } else {
          setUser(null); // Ensure user is set to null if not authenticated
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null); // Handle any error by cleaning the user state
      }
    };

    checkAuthStatus();
  }, []);
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
