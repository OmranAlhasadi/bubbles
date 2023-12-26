import "./App.css";
import HomePage from "./pages/HomePage";
import { UserProvider } from "./contexts/UserContext.js";

function App() {
  return (
    <UserProvider>
      <HomePage />
    </UserProvider>
  );
}

export default App;
