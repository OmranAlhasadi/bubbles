import "./App.css";
import HomePage from "./pages/HomePage";
import { UserProvider } from "./contexts/UserContext.js";
import Profile from "./pages/Profile";

function App() {
  return (
    <UserProvider>
      <Profile />
    </UserProvider>
  );
}

export default App;
