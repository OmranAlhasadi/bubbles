import styles from "../css/LoginPage.module.css";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";

const LoginPage = () => {
  const { loginUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    loginUser(username, password);
    // Redirect user to homepage or show error
  };

  return (
    <div>
      <div></div>
    </div>
  );
};

export default LoginPage;
