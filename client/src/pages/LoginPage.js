import styles from "../css/LoginPage.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import logo from "../images/logo-white.png";

import { toast } from "react-toastify";

const LoginPage = () => {
  const { loginUser, loginExampleUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  const validateFields = () => {
    let isValid = true;

    //empty fields validation

    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("Password cannot be empty.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      const success = await loginUser(username, password);
      if (success) {
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        toast.error("Error logging in");
      }
    }
  };

  const handleExampleLogin = async (e) => {
    e.preventDefault();

    const success = await loginExampleUser();
    if (success) {
      toast.success("Logged in successfully!");
      navigate("/");
    } else {
      toast.error("Error logging in");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} className={styles.logo} />
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel} htmlFor="username">
              Username
            </label>
            <input
              className={styles.inputField}
              name="username"
              placeholder="Enter username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <div className={styles.errorMsg}>{usernameError}</div>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel} htmlFor="password">
              Password
            </label>
            <input
              className={styles.inputField}
              name="password"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <div className={styles.errorMsg}>{passwordError}</div>
            )}
          </div>
          <button className={styles.formButton} type="submit">
            Log in
          </button>
          <button
            type="button"
            className={styles.forgotButton}
            onClick={navigateToForgotPassword}
          >
            forgot your password?
          </button>
          <button
            type="button"
            className={styles.formButton}
            onClick={handleExampleLogin}
          >
            Log in as Example User
          </button>
          <button
            type="button"
            className={styles.formButton}
            onClick={navigateToSignUp}
          >
            Sign Up with Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
