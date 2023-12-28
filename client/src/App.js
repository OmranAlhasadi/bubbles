import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import PersonProfile from "./pages/PersonProfile";
import { UserProvider } from "./contexts/UserContext.js";
import UserProfileWrapper from "./components/UserProfileWrapper";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:username" element={<UserProfileWrapper />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
