import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle user login
  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      setUser(data.user); // Set user in context
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // Function to handle user signup
  const signupUser = async (userData) => {
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
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
      await fetch("http://localhost:3001/api/logout", { method: "GET" });
      setUser(null); // Clear user in context
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  // Function to update user data
  const updateUser = (updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/example-user");
        if (!response.ok) {
          throw new Error("Failed to fetch example user");
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching example user", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loginUser, signupUser, logoutUser, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
