import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
